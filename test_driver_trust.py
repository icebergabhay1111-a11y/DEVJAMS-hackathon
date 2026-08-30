from driver_trust import calculate_driver_trust_score


def test_five_star_top_of_band():
    score, note, needs_review = calculate_driver_trust_score(5.0)
    assert score == 100
    assert note == "Consistently excellent"
    assert needs_review is False


def test_four_point_seven_interpolates_within_band():
    # 4.5-4.9 -> 97-98; 4.7 is roughly midway
    score, note, needs_review = calculate_driver_trust_score(4.7)
    assert 97 <= score <= 98
    assert note == "Strong, reliable record"
    assert needs_review is False


def test_four_point_two_solid_track_record():
    score, note, needs_review = calculate_driver_trust_score(4.2)
    assert 95 <= score <= 96
    assert note == "Solid track record"
    assert needs_review is False


def test_three_point_five_baseline_trust():
    score, note, needs_review = calculate_driver_trust_score(3.5)
    assert 93 <= score <= 95
    assert note == "Baseline trust (as specified)"
    assert needs_review is False


def test_two_point_five_flagged_for_monitoring():
    score, note, needs_review = calculate_driver_trust_score(2.5)
    assert 80 <= score <= 90
    assert note == "Flagged for extra monitoring"
    assert needs_review is False


def test_below_two_stars_triggers_manual_review():
    score, note, needs_review = calculate_driver_trust_score(1.5)
    assert score < 80
    assert needs_review is True


def test_none_rating_triggers_manual_review():
    score, note, needs_review = calculate_driver_trust_score(None)
    assert score < 80
    assert needs_review is True
    assert note == "Internal history required before ride"


def test_boundary_exactly_two_stars_is_flagged_not_manual_review():
    # 2.0 is the inclusive lower bound of "Flagged for extra monitoring",
    # not "below 2.0" manual review.
    score, note, needs_review = calculate_driver_trust_score(2.0)
    assert needs_review is False
    assert note == "Flagged for extra monitoring"


def test_rating_above_five_clamps_to_top_band():
    score, note, needs_review = calculate_driver_trust_score(5.5)
    assert score == 100
    assert needs_review is False


def test_scores_increase_monotonically_with_rating():
    ratings = [1.0, 2.0, 2.5, 3.0, 3.9, 4.0, 4.4, 4.5, 4.9, 5.0]
    scores = [calculate_driver_trust_score(r)[0] for r in ratings]
    assert scores == sorted(scores)