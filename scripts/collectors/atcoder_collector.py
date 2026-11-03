"""
AtCoder Telemetry Collector (Kenkoooo API & Profile Scraping)
Collects rating, highest rating, rated contest count, and daily accepted submissions.
"""

from datetime import datetime, timezone
from typing import Dict, Any, Tuple, Optional, Set
import requests
from bs4 import BeautifulSoup


ATCODER_USER_URL = "https://atcoder.jp/users/{username}"
KENKOOOO_SUBMISSIONS_URL = "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user={username}&from_second=0"


def collect_atcoder_stats(username: str) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, int]]]:
    """
    Collects genuine AtCoder metrics via Kenkoooo API and static profile parsing.
    
    Returns:
        (stats_slice, daily_solves_dict)
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    }

    rating: Optional[int] = None
    highest_rating: Optional[int] = None
    contests_count = 0

    # 1. Scrape official user page for rating and contest count
    try:
        user_resp = requests.get(ATCODER_USER_URL.format(username=username), headers=headers, timeout=12)
        if user_resp.status_code == 200:
            soup = BeautifulSoup(user_resp.text, "html.parser")
            table = soup.find("table", class_="dl-table")
            if table:
                for row in table.find_all("tr"):
                    th = row.find("th")
                    td = row.find("td")
                    if th and td:
                        header_text = th.get_text(strip=True).lower()
                        if "rating" in header_text and "highest" not in header_text:
                            # Extract first numeric sequence
                            span = td.find("span")
                            val_text = span.get_text(strip=True) if span else td.get_text(strip=True)
                            nums = "".join(filter(str.isdigit, val_text))
                            if nums:
                                rating = int(nums)
                        elif "highest" in header_text:
                            span = td.find("span")
                            val_text = span.get_text(strip=True) if span else td.get_text(strip=True)
                            nums = "".join(filter(str.isdigit, val_text))
                            if nums:
                                highest_rating = int(nums)
                        elif "rated matches" in header_text or "rated contests" in header_text:
                            val_text = td.get_text(strip=True)
                            nums = "".join(filter(str.isdigit, val_text))
                            if nums:
                                contests_count = int(nums)
    except Exception as e:
        print(f"[AtCoder Profile Scraping Warning] {e}")

    # 2. Fetch submissions via Kenkoooo API for daily solve aggregation
    daily_solves: Dict[str, int] = {}
    solved_problems: Set[str] = set()
    try:
        sub_resp = requests.get(KENKOOOO_SUBMISSIONS_URL.format(username=username), headers=headers, timeout=14)
        if sub_resp.status_code == 200:
            submissions = sub_resp.json()
            if isinstance(submissions, list):
                for sub in submissions:
                    if sub.get("result") == "AC":
                        prob_id = sub.get("problem_id", "")
                        if prob_id and prob_id not in solved_problems:
                            solved_problems.add(prob_id)
                            epoch_sec = sub.get("epoch_second")
                            if epoch_sec:
                                day_key = datetime.fromtimestamp(epoch_sec, tz=timezone.utc).strftime("%Y-%m-%d")
                                daily_solves[day_key] = daily_solves.get(day_key, 0) + 1
    except Exception as ke:
        print(f"[AtCoder Kenkoooo API Warning] {ke}")

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    # If we couldn't fetch either profile or submissions, return failure
    if rating is None and not daily_solves and contests_count == 0:
        return None, None

    stats_slice = {
        "username": username,
        "status": "active",
        "lastSynced": now_iso,
        "rating": rating,
        "highestRating": highest_rating or rating,
        "contestsCount": contests_count,
        "ratingHistory": [], # Kenkoooo history or contest table
    }

    return stats_slice, daily_solves
