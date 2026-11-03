"""
Atomic Storage & Schema Validation Manager for stats.json
Ensures data integrity, preserves last-known-good records, and validates types.
"""

import os
import json
from datetime import datetime, timezone
from typing import Dict, Any, Tuple, Optional, List


REQUIRED_TOP_LEVEL_KEYS = {"version", "generatedAt", "github", "competitive"}
REQUIRED_COMPETITIVE_KEYS = {"combinedHeatmap", "platforms"}
REQUIRED_PLATFORMS = {"leetcode", "codeforces", "atcoder", "codechef"}


def validate_github_slice(data: Any) -> bool:
    """Validates GitHub telemetry structure. Accepts legitimate zeroes."""
    if not isinstance(data, dict):
        return False
    required = ["username", "status", "totalContributions", "publicRepos", "contributionCalendar"]
    for k in required:
        if k not in data:
            return False
    if not isinstance(data["username"], str):
        return False
    if data["status"] not in ("active", "stale", "offline"):
        return False
    if not isinstance(data["totalContributions"], int) or data["totalContributions"] < 0:
        return False
    if not isinstance(data["publicRepos"], int) or data["publicRepos"] < 0:
        return False
    if not isinstance(data["contributionCalendar"], list):
        return False
    return True


def validate_leetcode_slice(data: Any) -> bool:
    """Validates LeetCode telemetry structure. Accepts legitimate zeroes and empty lists."""
    if not isinstance(data, dict):
        return False
    required = ["username", "status", "totalSolved", "easy", "medium", "hard", "ratingHistory", "badges"]
    for k in required:
        if k not in data:
            return False
    if not isinstance(data["username"], str):
        return False
    if data["status"] not in ("active", "stale", "offline"):
        return False
    for num_key in ["totalSolved", "easy", "medium", "hard"]:
        val = data[num_key]
        if not isinstance(val, int) or val < 0:
            return False
    if not isinstance(data["ratingHistory"], list) or not isinstance(data["badges"], list):
        return False
    return True


def validate_codeforces_slice(data: Any) -> bool:
    """Validates Codeforces telemetry structure. Accepts legitimate zeroes and empty lists."""
    if not isinstance(data, dict):
        return False
    required = ["handle", "status", "rating", "maxRating", "rank", "contestsCount", "ratingHistory"]
    for k in required:
        if k not in data:
            return False
    if not isinstance(data["handle"], str) or not isinstance(data["rank"], str):
        return False
    if data["status"] not in ("active", "stale", "offline"):
        return False
    for num_key in ["rating", "maxRating", "contestsCount"]:
        val = data[num_key]
        if not isinstance(val, int) or val < 0:
            return False
    if not isinstance(data["ratingHistory"], list):
        return False
    return True


def validate_atcoder_slice(data: Any) -> bool:
    """Validates AtCoder telemetry structure. Allows optional rating if unrated."""
    if not isinstance(data, dict):
        return False
    required = ["username", "status", "contestsCount", "ratingHistory"]
    for k in required:
        if k not in data:
            return False
    if not isinstance(data["username"], str):
        return False
    if data["status"] not in ("active", "stale", "offline"):
        return False
    if not isinstance(data["contestsCount"], int) or data["contestsCount"] < 0:
        return False
    if not isinstance(data["ratingHistory"], list):
        return False
    return True


def validate_codechef_slice(data: Any) -> bool:
    """Validates CodeChef telemetry structure."""
    if not isinstance(data, dict):
        return False
    required = ["username", "status"]
    for k in required:
        if k not in data:
            return False
    if not isinstance(data["username"], str):
        return False
    if data["status"] not in ("active", "stale", "offline"):
        return False
    return True


def load_existing_stats(file_path: str) -> Optional[Dict[str, Any]]:
    """Loads existing stats.json if present and valid; returns None otherwise."""
    if not os.path.exists(file_path):
        return None
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        if isinstance(data, dict) and REQUIRED_TOP_LEVEL_KEYS.issubset(data.keys()):
            return data
    except Exception as e:
        print(f"[Storage Warning] Could not parse existing {file_path}: {e}")
    return None


def merge_and_save_atomic(
    target_path: str,
    github_data: Optional[Dict[str, Any]],
    leetcode_data: Optional[Dict[str, Any]],
    codeforces_data: Optional[Dict[str, Any]],
    atcoder_data: Optional[Dict[str, Any]],
    codechef_data: Optional[Dict[str, Any]],
    combined_heatmap: List[Dict[str, Any]],
) -> Tuple[bool, Dict[str, Any]]:
    """
    Atomically validates, merges with last-known-good data, and writes to disk.
    
    Returns:
        (changed: bool, merged_stats: dict)
    """
    existing = load_existing_stats(target_path) or {}
    existing_github = existing.get("github", {})
    existing_comp = existing.get("competitive", {})
    existing_platforms = existing_comp.get("platforms", {})
    
    # 1. GitHub slice resolution
    if github_data and validate_github_slice(github_data):
        resolved_github = github_data
    else:
        # Retain last-known-good or mark stale/offline
        if existing_github and validate_github_slice(existing_github):
            new_status = "stale" if existing_github.get("status") == "active" else existing_github.get("status", "stale")
            resolved_github = {**existing_github, "status": new_status}
        else:
            resolved_github = {
                "username": "rithulraveendran",
                "status": "offline",
                "lastSynced": "",
                "totalContributions": 0,
                "publicRepos": 0,
                "totalStars": 0,
                "totalForks": 0,
                "contributionCalendar": [],
            }

    # 2. LeetCode slice resolution
    if leetcode_data and validate_leetcode_slice(leetcode_data):
        resolved_lc = leetcode_data
    else:
        ex_lc = existing_platforms.get("leetcode", {})
        if ex_lc and validate_leetcode_slice(ex_lc):
            new_status = "stale" if ex_lc.get("status") == "active" else ex_lc.get("status", "stale")
            resolved_lc = {**ex_lc, "status": new_status}
        else:
            resolved_lc = {
                "username": "rithulraveendran",
                "status": "offline",
                "lastSynced": "",
                "totalSolved": 0,
                "easy": 0,
                "easyTotal": 0,
                "medium": 0,
                "mediumTotal": 0,
                "hard": 0,
                "hardTotal": 0,
                "streak": 0,
                "activeDays": 0,
                "ratingHistory": [],
                "badges": [],
            }

    # 3. Codeforces slice resolution
    if codeforces_data and validate_codeforces_slice(codeforces_data):
        resolved_cf = codeforces_data
    else:
        ex_cf = existing_platforms.get("codeforces", {})
        if ex_cf and validate_codeforces_slice(ex_cf):
            new_status = "stale" if ex_cf.get("status") == "active" else ex_cf.get("status", "stale")
            resolved_cf = {**ex_cf, "status": new_status}
        else:
            resolved_cf = {
                "handle": "rithulraveendran",
                "status": "offline",
                "lastSynced": "",
                "rating": 0,
                "maxRating": 0,
                "rank": "unrated",
                "maxRank": "unrated",
                "contestsCount": 0,
                "ratingHistory": [],
            }

    # 4. AtCoder slice resolution
    if atcoder_data and validate_atcoder_slice(atcoder_data):
        resolved_ac = atcoder_data
    else:
        ex_ac = existing_platforms.get("atcoder", {})
        if ex_ac and validate_atcoder_slice(ex_ac):
            new_status = "stale" if ex_ac.get("status") == "active" else ex_ac.get("status", "stale")
            resolved_ac = {**ex_ac, "status": new_status}
        else:
            resolved_ac = {
                "username": "rithulraveendran",
                "status": "offline",
                "lastSynced": "",
                "contestsCount": 0,
                "ratingHistory": [],
            }

    # 5. CodeChef slice resolution
    if codechef_data and validate_codechef_slice(codechef_data):
        resolved_cc = codechef_data
    else:
        ex_cc = existing_platforms.get("codechef", {})
        if ex_cc and validate_codechef_slice(ex_cc):
            new_status = "stale" if ex_cc.get("status") == "active" else ex_cc.get("status", "stale")
            resolved_cc = {**ex_cc, "status": new_status}
        else:
            resolved_cc = {
                "username": "rithulr86",
                "status": "offline",
                "lastSynced": "",
            }

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    merged: Dict[str, Any] = {
        "version": "1.0",
        "generatedAt": now_iso,
        "github": resolved_github,
        "competitive": {
            "combinedHeatmap": combined_heatmap,
            "platforms": {
                "leetcode": resolved_lc,
                "codeforces": resolved_cf,
                "atcoder": resolved_ac,
                "codechef": resolved_cc,
            },
        },
    }

    # Check whether substantive data changed (ignoring generatedAt timestamp)
    has_changed = True
    if existing:
        ex_copy = {k: v for k, v in existing.items() if k != "generatedAt"}
        new_copy = {k: v for k, v in merged.items() if k != "generatedAt"}
        if json.dumps(ex_copy, sort_keys=True) == json.dumps(new_copy, sort_keys=True):
            has_changed = False

    # Atomic write to temporary file, then replace
    dir_name = os.path.dirname(target_path) or "."
    os.makedirs(dir_name, exist_ok=True)
    tmp_path = f"{target_path}.tmp"

    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)
        f.flush()
        os.fsync(f.fileno())

    os.replace(tmp_path, target_path)

    return has_changed, merged
