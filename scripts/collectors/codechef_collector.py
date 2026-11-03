"""
CodeChef Telemetry Collector (HTML Scraping with Resilient Fallback)
Extracts current rating, highest rating, star division, and problems solved count.
"""

import os
import re
from datetime import datetime, timezone
from typing import Dict, Any, Tuple, Optional
import requests
from bs4 import BeautifulSoup


CODECHEF_USER_URL = "https://www.codechef.com/users/{username}"


def collect_codechef_stats(username: str) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, int]]]:
    """
    Collects CodeChef metrics via profile scraping.
    
    Returns:
        (stats_slice, daily_solves_dict)
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
    }

    try:
        resp = requests.get(CODECHEF_USER_URL.format(username=username), headers=headers, timeout=14)
        if resp.status_code != 200:
            print(f"[CodeChef Warning] Profile returned HTTP {resp.status_code}")
            return None, None

        soup = BeautifulSoup(resp.text, "html.parser")

        # 1. Rating (e.g. "1204?...")
        rating_num = None
        rating_div = soup.find("div", class_="rating-number")
        if rating_div:
            m = re.search(r'(\d+)', rating_div.get_text())
            if m:
                rating_num = int(m.group(1))

        # 2. Highest Rating
        highest_rating = None
        small_tag = soup.find(lambda t: t.name == "small" and "Highest Rating" in t.get_text())
        if small_tag:
            m = re.search(r'Highest Rating\s*(\d+)', small_tag.get_text())
            if m:
                highest_rating = int(m.group(1))

        # 3. Stars / Division
        stars = None
        star_span = soup.find("span", class_="rating")
        if star_span:
            stars = star_span.get_text(strip=True)
        elif rating_num:
            if rating_num >= 2500:
                stars = "7★"
            elif rating_num >= 2200:
                stars = "6★"
            elif rating_num >= 2000:
                stars = "5★"
            elif rating_num >= 1800:
                stars = "4★"
            elif rating_num >= 1600:
                stars = "3★"
            elif rating_num >= 1400:
                stars = "2★"
            else:
                stars = "1★"

        # 4. Solved Problems Count
        solved_count = None
        solved_header = soup.find(lambda tag: tag.name in ["h3", "h4", "h5"] and "Problems Solved" in tag.get_text())
        if solved_header:
            m = re.search(r'(\d+)', solved_header.get_text())
            if m:
                solved_count = int(m.group(1))
        else:
            problems_section = soup.find("section", class_="problems-solved")
            if problems_section:
                m = re.search(r'(\d+)', problems_section.get_text())
                if m:
                    solved_count = int(m.group(1))

        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        if rating_num is None and solved_count is None:
            print(f"[CodeChef Warning] Could not parse rating or solved count for {username}")
            return None, None

        stats_slice = {
            "username": username,
            "status": "active",
            "lastSynced": now_iso,
            "rating": rating_num,
            "highestRating": highest_rating or rating_num,
            "stars": stars,
            "solvedCount": solved_count or 0,
        }

        return stats_slice, None

    except Exception as e:
        print(f"[CodeChef Collector Error] {e}")
        return None, None
