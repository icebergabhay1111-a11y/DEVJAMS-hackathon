# Platform-rating -> trust-band mapping, per pitch deck Slide 10
# ("Score Weighting: Driver Trust = 10% of the Composite Safety Score").
# Each band is (min_rating, max_rating, score_low, score_high, note).
TRUST_BANDS = [
    (5.0, 5.0, 99, 100, "Consistently excellent"),
    (4.5, 4.9, 97, 98, "Strong, reliable record"),
    (4.0, 4.4, 95, 96, "Solid track record"),
    (3.0, 3.9, 93, 95, "Baseline trust (as specified)"),
    (2.0, 2.9, 80, 90, "Flagged for extra monitoring"),
]

MANUAL_REVIEW_SCORE = 70
MANUAL_REVIEW_NOTE = "Internal history required before ride"


def calculate_driver_trust_score(
    platform_rating: float | None,
) -> tuple[int, str, bool]:
    """
    Maps a platform star rating (Uber/Ola/Rapido, etc.) onto the
    Driver Trust component of the Composite Safety Score.

    Returns (score_0_to_100, note, needs_manual_review).

    Below 2.0 stars or no platform history at all triggers a manual
    driver-history check before the ride is confirmed safe, per the
    pitch deck's stated data principle.
    """
    if platform_rating is None or platform_rating < 2.0:
        return MANUAL_REVIEW_SCORE, MANUAL_REVIEW_NOTE, True

    if platform_rating > 5.0:
        platform_rating = 5.0

    for low, high, score_low, score_high, note in TRUST_BANDS:
        if low <= platform_rating <= high:
            if high == low:
                score = score_high
            else:
                fraction = (platform_rating - low) / (high - low)
                score = round(score_low + fraction * (score_high - score_low))
            return score, note, False

    # Should be unreachable given the bands above cover [2.0, 5.0],
    # but fail safe into manual review rather than raising.
    return MANUAL_REVIEW_SCORE, MANUAL_REVIEW_NOTE, True