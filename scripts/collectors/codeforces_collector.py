"""
Codeforces Telemetry Collector (Official REST API)
Collects rating, peak rating, rank, contest history, and accepted problem counts.
"""

from datetime import datetime, timezone
from typing import Dict, Any, Tuple, Optional, Set
import requests


CF_INFO_URL = "https://codeforces.com/api/user.info?handles={handle}"
CF_RATING_URL = "https://codeforces.com/api/user.rating?handle={handle}"
CF_STATUS_URL = "https://codeforces.com/api/user.status?handle={handle}&from=1&count=2000"


def collect_codeforces_stats(handle: str) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, int]]]:
    """
    Collects genuine Codeforces metrics via official public API endpoints.
    
    Returns:
        (stats_slice, daily_solves_dict)
    """
    headers = {"User-Agent": "Portfolio-Telemetry-Pipeline/1.0"}
    try:
        # 1. Fetch user info
        info_resp = requests.get(CF_INFO_URL.format(handle=handle), headers=headers, timeout=12)
        if info_resp.status_code != 200:
            print(f"[Codeforces Warning] user.info returned HTTP {info_resp.status_code}")
            return None, None
            
        info_data = info_resp.json()
        if info_data.get("status") != "OK" or not info_data.get("result"):
            print(f"[Codeforces Warning] user.info failed with comment: {info_data.get('comment')}")
            return None, None
            
        user_info = info_data["result"][0]

        # 2. Fetch rating history
        rating_history = []
        try:
            rating_resp = requests.get(CF_RATING_URL.format(handle=handle), headers=headers, timeout=12)
            if rating_resp.status_code == 200:
                r_data = rating_resp.json()
                if r_data.get("status") == "OK":
                    for item in r_data.get("result", []):
                        date_str = ""
                        time_sec = item.get("ratingUpdateTimeSeconds")
                        if time_sec:
                            date_str = datetime.fromtimestamp(time_sec, tz=timezone.utc).strftime("%Y-%m-%d")
                        rating_history.append({
                            "contestName": item.get("contestName", ""),
                            "rating": int(item.get("newRating", 0)),
                            "rank": int(item.get("rank", 0)),
                            "date": date_str,
                        })
        except Exception as re:
            print(f"[Codeforces Rating History Warning] {re}")

        # 3. Fetch accepted submissions for problem solving history
        daily_solves: Dict[str, int] = {}
        solved_problems: Set[str] = set()
        try:
            status_resp = requests.get(CF_STATUS_URL.format(handle=handle), headers=headers, timeout=14)
            if status_resp.status_code == 200:
                s_data = status_resp.json()
                if s_data.get("status") == "OK":
                    for sub in s_data.get("result", []):
                        if sub.get("verdict") == "OK":
                            p = sub.get("problem", {})
                            prob_id = f"{p.get('contestId', '')}_{p.get('index', '')}_{p.get('name', '')}"
                            # Deduplicate solves for the same problem on the same day
                            if prob_id not in solved_problems:
                                solved_problems.add(prob_id)
                                time_sec = sub.get("creationTimeSeconds")
                                if time_sec:
                                    day_key = datetime.fromtimestamp(time_sec, tz=timezone.utc).strftime("%Y-%m-%d")
                                    daily_solves[day_key] = daily_solves.get(day_key, 0) + 1
        except Exception as se:
            print(f"[Codeforces Status Warning] {se}")

        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        stats_slice = {
            "handle": handle,
            "status": "active",
            "lastSynced": now_iso,
            "rating": int(user_info.get("rating", 0)),
            "maxRating": int(user_info.get("maxRating", 0)),
            "rank": str(user_info.get("rank", "unrated")),
            "maxRank": str(user_info.get("maxRank", "unrated")),
            "contestsCount": len(rating_history),
            "ratingHistory": rating_history,
        }

        return stats_slice, daily_solves

    except Exception as e:
        print(f"[Codeforces Collector Error] {e}")
        return None, None
