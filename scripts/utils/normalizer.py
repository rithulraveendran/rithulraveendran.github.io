"""
Daily Activity Normalizer for Cross-Platform Competitive Programming
Merges solve activity from LeetCode, Codeforces, AtCoder, and CodeChef.
Preserves platform breakdowns, avoids double counting, and respects history.
"""

from datetime import datetime, timezone, timedelta
from typing import Dict, List, Any, Optional


def normalize_combined_heatmap(
    leetcode_daily: Optional[Dict[str, int]],
    codeforces_daily: Optional[Dict[str, int]],
    atcoder_daily: Optional[Dict[str, int]],
    codechef_daily: Optional[Dict[str, int]],
    existing_heatmap: Optional[List[Dict[str, Any]]] = None,
    days: int = 365,
) -> List[Dict[str, Any]]:
    """
    Merges platform daily solves into a unified, chronologically sorted heatmap.
    
    Rules:
    - Preserves individual platform counts per day.
    - If a platform is None (collector failed/offline), retains existing history for that platform.
    - Legitimate 0 solves are preserved as 0, not omitted.
    - Total is the sum of known platform solves for that day.
    """
    now = datetime.now(timezone.utc)
    start_date = now - timedelta(days=days)
    
    # Map existing history by date: { 'YYYY-MM-DD': { 'leetcode': X, ... } }
    history_map: Dict[str, Dict[str, int]] = {}
    if existing_heatmap and isinstance(existing_heatmap, list):
        for entry in existing_heatmap:
            if isinstance(entry, dict) and "date" in entry and "breakdown" in entry:
                b = entry.get("breakdown", {})
                history_map[entry["date"]] = {
                    "leetcode": int(b.get("leetcode", 0)),
                    "codeforces": int(b.get("codeforces", 0)),
                    "atcoder": int(b.get("atcoder", 0)),
                    "codechef": int(b.get("codechef", 0)),
                }

    # Generate all ISO date keys for the specified window
    combined: List[Dict[str, Any]] = []
    
    for d in range(days + 1):
        cur_date = (start_date + timedelta(days=d)).strftime("%Y-%m-%d")
        existing_day = history_map.get(cur_date, {"leetcode": 0, "codeforces": 0, "atcoder": 0, "codechef": 0})
        
        # LeetCode daily count
        if leetcode_daily is not None:
            lc_count = int(leetcode_daily.get(cur_date, 0))
        else:
            lc_count = existing_day["leetcode"]
            
        # Codeforces daily count
        if codeforces_daily is not None:
            cf_count = int(codeforces_daily.get(cur_date, 0))
        else:
            cf_count = existing_day["codeforces"]
            
        # AtCoder daily count
        if atcoder_daily is not None:
            ac_count = int(atcoder_daily.get(cur_date, 0))
        else:
            ac_count = existing_day["atcoder"]
            
        # CodeChef daily count
        if codechef_daily is not None:
            cc_count = int(codechef_daily.get(cur_date, 0))
        else:
            cc_count = existing_day["codechef"]
            
        day_total = lc_count + cf_count + ac_count + cc_count
        
        combined.append({
            "date": cur_date,
            "total": day_total,
            "breakdown": {
                "leetcode": lc_count,
                "codeforces": cf_count,
                "atcoder": ac_count,
                "codechef": cc_count,
            }
        })
        
    return combined
