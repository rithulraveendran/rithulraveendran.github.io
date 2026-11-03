"""
Master Telemetry Orchestrator
Executes platform collectors independently, merges daily activity, and atomically updates stats.json.
A failure in one collector never interrupts others.
"""

import os
import sys
from typing import Dict, Any, Optional

from collectors.github_collector import collect_github_stats
from collectors.leetcode_collector import collect_leetcode_stats
from collectors.codeforces_collector import collect_codeforces_stats
from collectors.atcoder_collector import collect_atcoder_stats
from collectors.codechef_collector import collect_codechef_stats
from utils.normalizer import normalize_combined_heatmap
from utils.storage import merge_and_save_atomic, load_existing_stats


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    print("=" * 60)
    print("Starting Portfolio Telemetry Pipeline")
    print("=" * 60)

    # Configurable platform handles
    gh_handle = os.environ.get("GITHUB_USER", "rithulraveendran")
    lc_handle = os.environ.get("LEETCODE_USER", "rithulraveendran")
    cf_handle = os.environ.get("CODEFORCES_USER", "rithulraveendran")
    ac_handle = os.environ.get("ATCODER_USER", "rithulraveendran")
    cc_handle = os.environ.get("CODECHEF_USER", "rithulr86")

    target_file = os.path.join(os.path.dirname(__file__), "..", "src", "data", "stats.json")
    target_file = os.path.abspath(target_file)

    existing_stats = load_existing_stats(target_file) or {}
    existing_heatmap = existing_stats.get("competitive", {}).get("combinedHeatmap", [])

    # 1. Collect GitHub stats
    print(f"\n[1/5] Collecting GitHub stats for: {gh_handle}...")
    github_data: Optional[Dict[str, Any]] = None
    try:
        github_data = collect_github_stats(gh_handle)
        if github_data:
            print(f"  [OK] GitHub: {github_data['totalContributions']} contributions, {github_data['publicRepos']} repos.")
        else:
            print("  [WARN] GitHub collector returned None; retaining previous valid data.")
    except Exception as e:
        print(f"  [ERROR] GitHub collector failed: {e}")

    # 2. Collect LeetCode stats
    print(f"\n[2/5] Collecting LeetCode stats for: {lc_handle}...")
    leetcode_data: Optional[Dict[str, Any]] = None
    lc_daily = None
    try:
        leetcode_data, lc_daily = collect_leetcode_stats(lc_handle)
        if leetcode_data:
            print(f"  [OK] LeetCode: {leetcode_data['totalSolved']} solved, streak: {leetcode_data['streak']}.")
        else:
            print("  [WARN] LeetCode collector returned None; retaining previous valid data.")
    except Exception as e:
        print(f"  [ERROR] LeetCode collector failed: {e}")

    # 3. Collect Codeforces stats
    print(f"\n[3/5] Collecting Codeforces stats for: {cf_handle}...")
    codeforces_data: Optional[Dict[str, Any]] = None
    cf_daily = None
    try:
        codeforces_data, cf_daily = collect_codeforces_stats(cf_handle)
        if codeforces_data:
            print(f"  [OK] Codeforces: rating {codeforces_data['rating']} ({codeforces_data['rank']}), {codeforces_data['contestsCount']} contests.")
        else:
            print("  [WARN] Codeforces collector returned None; retaining previous valid data.")
    except Exception as e:
        print(f"  [ERROR] Codeforces collector failed: {e}")

    # 4. Collect AtCoder stats
    print(f"\n[4/5] Collecting AtCoder stats for: {ac_handle}...")
    atcoder_data: Optional[Dict[str, Any]] = None
    ac_daily = None
    try:
        atcoder_data, ac_daily = collect_atcoder_stats(ac_handle)
        if atcoder_data:
            print(f"  [OK] AtCoder: rating {atcoder_data.get('rating')}, {atcoder_data['contestsCount']} contests.")
        else:
            print("  [WARN] AtCoder collector returned None; retaining previous valid data.")
    except Exception as e:
        print(f"  [ERROR] AtCoder collector failed: {e}")

    # 5. Collect CodeChef stats
    print(f"\n[5/5] Collecting CodeChef stats for: {cc_handle}...")
    codechef_data: Optional[Dict[str, Any]] = None
    cc_daily = None
    try:
        codechef_data, cc_daily = collect_codechef_stats(cc_handle)
        if codechef_data:
            print(f"  [OK] CodeChef: rating {codechef_data.get('rating')}, {codechef_data.get('solvedCount')} solved.")
        else:
            print("  [WARN] CodeChef collector returned None; retaining previous valid data.")
    except Exception as e:
        print(f"  [ERROR] CodeChef collector failed: {e}")

    # 6. Normalize combined daily activity heatmap
    print("\n[6/6] Normalizing combined competitive programming heatmap...")
    combined_heatmap = normalize_combined_heatmap(
        leetcode_daily=lc_daily,
        codeforces_daily=cf_daily,
        atcoder_daily=ac_daily,
        codechef_daily=cc_daily,
        existing_heatmap=existing_heatmap,
    )
    print(f"  [OK] Heatmap generated across {len(combined_heatmap)} daily records.")

    # 7. Merge atomically with last-known-good values
    changed, final_stats = merge_and_save_atomic(
        target_path=target_file,
        github_data=github_data,
        leetcode_data=leetcode_data,
        codeforces_data=codeforces_data,
        atcoder_data=atcoder_data,
        codechef_data=codechef_data,
        combined_heatmap=combined_heatmap,
    )

    print("\n" + "=" * 60)
    print(f"Pipeline Complete. Target: {target_file}")
    print(f"Data Substantively Changed: {changed}")
    print("Platform Status Summary:")
    print(f"  - GitHub:     {final_stats['github']['status']}")
    print(f"  - LeetCode:   {final_stats['competitive']['platforms']['leetcode']['status']}")
    print(f"  - Codeforces: {final_stats['competitive']['platforms']['codeforces']['status']}")
    print(f"  - AtCoder:    {final_stats['competitive']['platforms']['atcoder']['status']}")
    print(f"  - CodeChef:   {final_stats['competitive']['platforms']['codechef']['status']}")
    print("=" * 60)


if __name__ == "__main__":
    main()
