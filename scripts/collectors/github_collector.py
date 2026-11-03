"""
GitHub Telemetry Collector (Official GraphQL & REST / Public Web Scraper)
Collects contribution calendar, total contributions, public repositories, and stars.
"""

import os
import re
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import requests


GRAPHQL_URL = "https://api.github.com/graphql"
REST_USER_URL = "https://api.github.com/users/{username}"
REST_REPOS_URL = "https://api.github.com/users/{username}/repos?per_page=100"
PUBLIC_CONTRIBUTIONS_URL = "https://github.com/users/{username}/contributions"


GITHUB_GRAPHQL_QUERY = """
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
    repositories(first: 100, privacy: PUBLIC, isFork: false) {
      totalCount
      nodes {
        stargazerCount
        forkCount
      }
    }
  }
}
"""

LEVEL_MAP = {
  "NONE": 0,
  "FIRST_QUARTILE": 1,
  "SECOND_QUARTILE": 2,
  "THIRD_QUARTILE": 3,
  "FOURTH_QUARTILE": 4,
}


def _collect_public_fallback(username: str, headers: Dict[str, str]) -> Optional[Dict[str, Any]]:
    """
    Fallback collector when no GITHUB_TOKEN is available.
    Scrapes the public contributions page and queries public repositories API.
    """
    try:
        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        # 1. Fetch public user info
        user_resp = requests.get(REST_USER_URL.format(username=username), headers=headers, timeout=10)
        public_repos = 0
        if user_resp.status_code == 200:
            public_repos = int(user_resp.json().get("public_repos", 0))

        # 2. Fetch public repos for stars and forks
        total_stars = 0
        total_forks = 0
        repos_resp = requests.get(REST_REPOS_URL.format(username=username), headers=headers, timeout=10)
        if repos_resp.status_code == 200:
            repos_data = repos_resp.json()
            if isinstance(repos_data, list):
                total_stars = sum(int(r.get("stargazers_count", 0)) for r in repos_data if not r.get("fork", False))
                total_forks = sum(int(r.get("forks_count", 0)) for r in repos_data if not r.get("fork", False))

        # 3. Scrape public contribution calendar
        cal_resp = requests.get(PUBLIC_CONTRIBUTIONS_URL.format(username=username), headers=headers, timeout=10)
        days = []
        total_contributions = 0

        if cal_resp.status_code == 200:
            html = cal_resp.text
            
            # Map tooltips: id -> tooltip text
            tooltips = {}
            for t_match in re.finditer(r'<tool-tip[^>]+for="([^"]+)"[^>]*>(.*?)</tool-tip>', html, re.DOTALL):
                tooltips[t_match.group(1)] = t_match.group(2)

            # Match calendar cells
            td_pattern = re.compile(r'<td[^>]+data-date="(\d{4}-\d{2}-\d{2})"[^>]+id="([^"]+)"[^>]+data-level="(\d+)"[^>]*>')
            for td_match in td_pattern.finditer(html):
                date_str = td_match.group(1)
                cell_id = td_match.group(2)
                level = int(td_match.group(3))
                tooltip_text = tooltips.get(cell_id, "")

                count = 0
                count_match = re.search(r'(\d+)\s+contribution', tooltip_text, re.IGNORECASE)
                if count_match:
                    count = int(count_match.group(1))

                days.append({
                    "date": date_str,
                    "count": count,
                    "level": min(max(level, 0), 4),
                })

            days.sort(key=lambda d: d["date"])
            total_contributions = sum(d["count"] for d in days)

        return {
            "username": username,
            "status": "active",
            "lastSynced": now_iso,
            "totalContributions": total_contributions,
            "publicRepos": public_repos,
            "totalStars": total_stars,
            "totalForks": total_forks,
            "contributionCalendar": days,
        }
    except Exception as e:
        print(f"[GitHub Public Fallback Error] {e}")
        return None


def collect_github_stats(username: str, token: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """
    Collects genuine GitHub metrics using official GraphQL API v4.
    Authenticates via GITHUB_TOKEN if present.
    Falls back gracefully to public scraping and REST API when token is absent.
    """
    auth_token = token or os.environ.get("GITHUB_TOKEN")
    headers = {"User-Agent": "Portfolio-Telemetry-Pipeline/1.0"}
    
    if auth_token:
        headers["Authorization"] = f"Bearer {auth_token}"
        try:
            resp = requests.post(
                GRAPHQL_URL,
                json={"query": GITHUB_GRAPHQL_QUERY, "variables": {"username": username}},
                headers=headers,
                timeout=12,
            )
            if resp.status_code == 200:
                payload = resp.json()
                user_data = payload.get("data", {}).get("user")
                if user_data:
                    cal = user_data["contributionsCollection"]["contributionCalendar"]
                    days = []
                    for week in cal.get("weeks", []):
                        for day in week.get("contributionDays", []):
                            days.append({
                                "date": day["date"],
                                "count": int(day["contributionCount"]),
                                "level": LEVEL_MAP.get(day.get("contributionLevel", "NONE"), 0),
                            })
                    
                    repos = user_data.get("repositories", {})
                    total_stars = sum(n.get("stargazerCount", 0) for n in repos.get("nodes", []))
                    total_forks = sum(n.get("forkCount", 0) for n in repos.get("nodes", []))

                    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

                    return {
                        "username": username,
                        "status": "active",
                        "lastSynced": now_iso,
                        "totalContributions": int(cal["totalContributions"]),
                        "publicRepos": int(repos.get("totalCount", 0)),
                        "totalStars": total_stars,
                        "totalForks": total_forks,
                        "contributionCalendar": days,
                    }
        except Exception as e:
            print(f"[GitHub GraphQL Error] {e}")

    # Fallback to public endpoints if no token or GraphQL failed
    return _collect_public_fallback(username, headers)
