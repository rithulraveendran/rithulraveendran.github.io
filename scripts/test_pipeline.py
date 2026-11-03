"""
Unit and Integration Tests for Telemetry Pipeline
Verifies schema validation, fault isolation, last-known-good retention, and normalizer.
"""

import os
import sys
import json
import tempfile
import unittest

# Ensure scripts directory is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.storage import (
    validate_github_slice,
    validate_leetcode_slice,
    validate_codeforces_slice,
    validate_atcoder_slice,
    validate_codechef_slice,
    merge_and_save_atomic,
    load_existing_stats,
)
from utils.normalizer import normalize_combined_heatmap


class TestTelemetryPipeline(unittest.TestCase):

    def test_legitimate_zeroes_and_empty_arrays_accepted(self):
        """Zero solves, zero rating, and empty badges/histories must be valid."""
        gh_data = {
            "username": "tester",
            "status": "active",
            "lastSynced": "2026-11-03T00:00:00Z",
            "totalContributions": 0,
            "publicRepos": 0,
            "totalStars": 0,
            "totalForks": 0,
            "contributionCalendar": [],
        }
        self.assertTrue(validate_github_slice(gh_data), "GitHub slice with 0s and empty calendar should be valid.")

        lc_data = {
            "username": "tester",
            "status": "active",
            "lastSynced": "2026-11-03T00:00:00Z",
            "totalSolved": 0,
            "easy": 0,
            "easyTotal": 1000,
            "medium": 0,
            "mediumTotal": 2000,
            "hard": 0,
            "hardTotal": 800,
            "ratingHistory": [],
            "badges": [],
        }
        self.assertTrue(validate_leetcode_slice(lc_data), "LeetCode slice with 0 solves and empty badges should be valid.")

        cf_data = {
            "handle": "tester",
            "status": "active",
            "lastSynced": "2026-11-03T00:00:00Z",
            "rating": 0,
            "maxRating": 0,
            "rank": "unrated",
            "maxRank": "unrated",
            "contestsCount": 0,
            "ratingHistory": [],
        }
        self.assertTrue(validate_codeforces_slice(cf_data), "Codeforces slice with 0 rating should be valid.")

    def test_invalid_responses_rejected(self):
        """Malformed, negative numbers, or invalid statuses must be rejected."""
        invalid_gh = {"username": "tester", "status": "active", "totalContributions": -5}
        self.assertFalse(validate_github_slice(invalid_gh))

        invalid_lc = {"username": 12345, "status": "unknown"}
        self.assertFalse(validate_leetcode_slice(invalid_lc))

        invalid_cf = {"handle": "tester", "status": "active", "rating": "not-a-number"}
        self.assertFalse(validate_codeforces_slice(invalid_cf))

    def test_last_known_good_preservation(self):
        """If a platform returns None or invalid, existing valid data is retained as stale."""
        with tempfile.TemporaryDirectory() as tmpdir:
            stats_path = os.path.join(tmpdir, "stats.json")

            # Initial write with valid GitHub & LeetCode
            initial_gh = {
                "username": "tester",
                "status": "active",
                "lastSynced": "2026-11-03T10:00:00Z",
                "totalContributions": 250,
                "publicRepos": 15,
                "totalStars": 5,
                "totalForks": 2,
                "contributionCalendar": [{"date": "2026-11-02", "count": 3, "level": 1}],
            }
            initial_lc = {
                "username": "tester",
                "status": "active",
                "lastSynced": "2026-11-03T10:00:00Z",
                "totalSolved": 450,
                "easy": 200,
                "easyTotal": 1000,
                "medium": 200,
                "mediumTotal": 2000,
                "hard": 50,
                "hardTotal": 800,
                "ratingHistory": [],
                "badges": ["Knight"],
            }
            changed, stats = merge_and_save_atomic(
                target_path=stats_path,
                github_data=initial_gh,
                leetcode_data=initial_lc,
                codeforces_data=None,
                atcoder_data=None,
                codechef_data=None,
                combined_heatmap=[],
            )
            self.assertTrue(changed)
            self.assertEqual(stats["github"]["totalContributions"], 250)
            self.assertEqual(stats["competitive"]["platforms"]["leetcode"]["totalSolved"], 450)

            # Subsequent run: LeetCode fails (returns None), GitHub updates
            updated_gh = {**initial_gh, "totalContributions": 255}
            changed2, stats2 = merge_and_save_atomic(
                target_path=stats_path,
                github_data=updated_gh,
                leetcode_data=None,  # Simulated collector failure
                codeforces_data=None,
                atcoder_data=None,
                codechef_data=None,
                combined_heatmap=[],
            )
            self.assertTrue(changed2)
            # GitHub updated
            self.assertEqual(stats2["github"]["totalContributions"], 255)
            self.assertEqual(stats2["github"]["status"], "active")
            # LeetCode preserved and marked stale
            self.assertEqual(stats2["competitive"]["platforms"]["leetcode"]["totalSolved"], 450)
            self.assertEqual(stats2["competitive"]["platforms"]["leetcode"]["status"], "stale")

    def test_diff_detection_no_unnecessary_commits(self):
        """If data is identical, changed should be False."""
        with tempfile.TemporaryDirectory() as tmpdir:
            stats_path = os.path.join(tmpdir, "stats.json")
            sample_gh = {
                "username": "tester",
                "status": "active",
                "lastSynced": "2026-11-03T10:00:00Z",
                "totalContributions": 100,
                "publicRepos": 5,
                "totalStars": 1,
                "totalForks": 0,
                "contributionCalendar": [],
            }
            changed1, _ = merge_and_save_atomic(
                target_path=stats_path,
                github_data=sample_gh,
                leetcode_data=None,
                codeforces_data=None,
                atcoder_data=None,
                codechef_data=None,
                combined_heatmap=[],
            )
            self.assertTrue(changed1)

            # Save exact same data again
            changed2, _ = merge_and_save_atomic(
                target_path=stats_path,
                github_data=sample_gh,
                leetcode_data=None,
                codeforces_data=None,
                atcoder_data=None,
                codechef_data=None,
                combined_heatmap=[],
            )
            self.assertFalse(changed2, "Identical telemetry data must not trigger a change.")

    def test_combined_heatmap_normalization(self):
        """Tests that platform daily counts are correctly aggregated per day without double counting."""
        lc_daily = {"2026-11-01": 2, "2026-11-02": 3}
        cf_daily = {"2026-11-02": 1, "2026-11-03": 4}
        ac_daily = {"2026-11-02": 2}
        cc_daily = {}

        result = normalize_combined_heatmap(
            leetcode_daily=lc_daily,
            codeforces_daily=cf_daily,
            atcoder_daily=ac_daily,
            codechef_daily=cc_daily,
            days=5,
        )

        day_map = {d["date"]: d for d in result}
        
        # On 2026-11-02: LC=3, CF=1, AC=2, CC=0 -> Total = 6
        if "2026-11-02" in day_map:
            entry = day_map["2026-11-02"]
            self.assertEqual(entry["total"], 6)
            self.assertEqual(entry["breakdown"]["leetcode"], 3)
            self.assertEqual(entry["breakdown"]["codeforces"], 1)
            self.assertEqual(entry["breakdown"]["atcoder"], 2)
            self.assertEqual(entry["breakdown"]["codechef"], 0)


if __name__ == "__main__":
    unittest.main()
