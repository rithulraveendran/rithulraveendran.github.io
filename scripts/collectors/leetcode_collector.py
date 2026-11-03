"""
LeetCode Telemetry Collector (Unofficial Public GraphQL)
Collects solved counts, difficulty breakdown, contest ratings, streak, and daily submission calendar.
Handles Cloudflare challenges and schema updates gracefully with fallback.
"""

import json
from datetime import datetime, timezone
from typing import Dict, Any, Tuple, Optional
import requests


LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql"

LEETCODE_QUERY = """
query getUserProfile($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
    userCalendar {
      streak
      totalActiveDays
      submissionCalendar
    }
    badges {
      name
    }
  }
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    topPercentage
  }
  userContestRankingHistory(username: $username) {
    attended
    rating
    ranking
    contest {
      title
      startTime
    }
  }
}
"""


def collect_leetcode_stats(username: str) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, int]]]:
    """
    Collects LeetCode metrics and daily submission calendar.
    
    Returns:
        (stats_slice, daily_solves_dict)
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Referer": f"https://leetcode.com/{username}/",
        "Content-Type": "application/json",
    }
    
    try:
        resp = requests.post(
            LEETCODE_GRAPHQL_URL,
            json={"query": LEETCODE_QUERY, "variables": {"username": username}},
            headers=headers,
            timeout=14,
        )
        if resp.status_code != 200:
            print(f"[LeetCode Warning] Received HTTP {resp.status_code}")
            return None, None
            
        payload = resp.json()
        if "errors" in payload or not payload.get("data", {}).get("matchedUser"):
            print(f"[LeetCode Warning] GraphQL response contained errors or missing user: {payload.get('errors')}")
            return None, None

        data = payload["data"]
        matched_user = data["matchedUser"]
        all_counts = {item["difficulty"]: item["count"] for item in data.get("allQuestionsCount", [])}
        ac_counts = {item["difficulty"]: item["count"] for item in matched_user["submitStatsGlobal"]["acSubmissionNum"]}
        user_cal = matched_user.get("userCalendar") or {}
        
        # Parse contest history
        contest_ranking = data.get("userContestRanking") or {}
        contest_history = []
        for ch in data.get("userContestRankingHistory") or []:
            if ch.get("attended") and ch.get("contest"):
                start_ts = ch["contest"].get("startTime")
                date_str = ""
                if start_ts:
                    date_str = datetime.fromtimestamp(start_ts, tz=timezone.utc).strftime("%Y-%m-%d")
                contest_history.append({
                    "contestName": ch["contest"].get("title", ""),
                    "rating": round(ch.get("rating", 0), 1),
                    "rank": ch.get("ranking"),
                    "date": date_str,
                })

        badges = [b["name"] for b in matched_user.get("badges", []) if "name" in b]

        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        # Parse submission calendar: { "unix_timestamp_sec": count }
        daily_solves: Dict[str, int] = {}
        raw_calendar_str = user_cal.get("submissionCalendar")
        if raw_calendar_str:
            try:
                raw_cal = json.loads(raw_calendar_str)
                for ts_str, count in raw_cal.items():
                    ts = int(ts_str)
                    day_key = datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")
                    daily_solves[day_key] = int(count)
            except Exception as pe:
                print(f"[LeetCode Calendar Parse Warning] {pe}")

        stats_slice = {
            "username": username,
            "status": "active",
            "lastSynced": now_iso,
            "totalSolved": int(ac_counts.get("All", 0)),
            "easy": int(ac_counts.get("Easy", 0)),
            "easyTotal": int(all_counts.get("Easy", 0)),
            "medium": int(ac_counts.get("Medium", 0)),
            "mediumTotal": int(all_counts.get("Medium", 0)),
            "hard": int(ac_counts.get("Hard", 0)),
            "hardTotal": int(all_counts.get("Hard", 0)),
            "contestRating": round(contest_ranking.get("rating", 0), 1) if contest_ranking.get("rating") else None,
            "globalRanking": contest_ranking.get("globalRanking"),
            "topPercentage": round(contest_ranking.get("topPercentage", 0), 2) if contest_ranking.get("topPercentage") else None,
            "streak": int(user_cal.get("streak", 0)),
            "activeDays": int(user_cal.get("totalActiveDays", 0)),
            "ratingHistory": contest_history,
            "badges": badges,
        }

        return stats_slice, daily_solves

    except Exception as e:
        print(f"[LeetCode Collector Error] {e}")
        return None, None
