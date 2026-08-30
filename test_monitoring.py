import sys
import types
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

# monitoring.py imports firestore_service, which needs real Firebase
# credentials we don't have in this sandbox. Inject a fake module
# before importing monitoring so we can test its pure logic in isolation.
fake_firestore_service = types.ModuleType("firestore_service")
fake_firestore_service.save_monitoring_result = lambda *a, **k: None
fake_firestore_service.save_safety_event = lambda *a, **k: None
fake_firestore_service.update_journey = lambda *a, **k: None
sys.modules["firestore_service"] = fake_firestore_service

import monitoring  # noqa: E402
from models import Journey, JourneyState  # noqa: E402


def make_journey(current_location="Katpadi", current_eta=20, planned_arrival_minutes=25):
    now = datetime.now(timezone.utc)
    return Journey(
        journey_id="J001",
        user_id="U001",
        start_location="VIT",
        destination="Home",
        vehicle="Cab",
        driver="Demo Driver",
        planned_route="VIT -> Katpadi -> Home",
        expected_eta=25,
        current_location=current_location,
        current_eta=current_eta,
        planned_arrival_at=(now + timedelta(minutes=planned_arrival_minutes)).isoformat(),
    )


def test_determine_state_normal_when_no_signals():
    state, needs_check = monitoring.determine_state(
        route_deviation=False, eta_overrun=False,
        anomaly_detected=False, response_confirmed=None,
    )
    assert state == JourneyState.NORMAL.value
    assert needs_check is False


def test_determine_state_attention_on_single_signal():
    state, needs_check = monitoring.determine_state(
        route_deviation=False, eta_overrun=True,
        anomaly_detected=False, response_confirmed=None,
    )
    assert state == JourneyState.ATTENTION.value
    assert needs_check is False


def test_determine_state_concern_on_two_signals():
    state, needs_check = monitoring.determine_state(
        route_deviation=True, eta_overrun=True,
        anomaly_detected=False, response_confirmed=None,
    )
    assert state == JourneyState.CONCERN.value
    assert needs_check is True


def test_determine_state_concern_when_response_unconfirmed_regardless_of_signals():
    state, needs_check = monitoring.determine_state(
        route_deviation=False, eta_overrun=False,
        anomaly_detected=False, response_confirmed=False,
    )
    assert state == JourneyState.CONCERN.value
    assert needs_check is True


def test_never_reaches_emergency_automatically():
    # Worst-case signal combination should still cap at CONCERN,
    # per the stated safety principle: emergency is never AI/auto-decided.
    state, _ = monitoring.determine_state(
        route_deviation=True, eta_overrun=True,
        anomaly_detected=True, response_confirmed=False,
    )
    assert state == JourneyState.CONCERN.value
    assert state != JourneyState.EMERGENCY.value


@patch("monitoring.check_route_deviation", return_value=False)
def test_evaluate_journey_scenario1_normal(mock_dev):
    journey = make_journey(current_location="Katpadi", current_eta=20, planned_arrival_minutes=25)
    result = monitoring.evaluate_journey(
        journey=journey,
        planned_locations=["VIT", "Katpadi", "Home"],
        response_confirmed=None,
        anomaly_detected=False,
    )
    assert result["state"] == JourneyState.NORMAL.value
    assert result["needs_safety_check"] is False


@patch("monitoring.check_route_deviation", return_value=False)
def test_evaluate_journey_scenario2_attention_on_delay(mock_dev):
    # Regression test for the demo_runner bug: planned_arrival_at must be
    # derived from the real base ETA, not a fixed 25-min constant, or a
    # short real-world route (like VIT->Katpadi) never crosses the
    # overrun threshold and ATTENTION silently fails to trigger.
    base_eta = 8  # short real-world route
    journey = make_journey(
        current_location="Katpadi",
        current_eta=base_eta + 10,       # simulated 10-min delay
        planned_arrival_minutes=base_eta,  # correctly tied to base ETA
    )
    result = monitoring.evaluate_journey(
        journey=journey,
        planned_locations=["VIT", "Katpadi", "Home"],
        response_confirmed=None,
        anomaly_detected=False,
    )
    assert result["signals"]["eta_overrun"] is True
    assert result["state"] == JourneyState.ATTENTION.value


@patch("monitoring.check_route_deviation", return_value=False)
def test_old_buggy_behavior_would_have_missed_scenario2(mock_dev):
    # Demonstrates the bug that existed before the demo_runner fix:
    # a fixed 25-min planned_arrival_at on a short real route absorbs
    # the +10min delay and never crosses threshold.
    base_eta = 8
    journey = make_journey(
        current_location="Katpadi",
        current_eta=base_eta + 10,   # 18 min
        planned_arrival_minutes=25,  # old hardcoded constant
    )
    result = monitoring.evaluate_journey(
        journey=journey,
        planned_locations=["VIT", "Katpadi", "Home"],
        response_confirmed=None,
        anomaly_detected=False,
    )
    assert result["signals"]["eta_overrun"] is False
    assert result["state"] == JourneyState.NORMAL.value  # bug: should be ATTENTION


@patch("monitoring.check_route_deviation", return_value=True)
def test_evaluate_journey_scenario3_concern_on_deviation_plus_anomaly(mock_dev):
    journey = make_journey(current_location="Unknown Road", current_eta=20, planned_arrival_minutes=25)
    result = monitoring.evaluate_journey(
        journey=journey,
        planned_locations=["VIT", "Katpadi", "Home"],
        response_confirmed=None,
        anomaly_detected=True,
    )
    assert result["state"] == JourneyState.CONCERN.value
    assert result["needs_safety_check"] is True


@patch("monitoring.check_route_deviation", return_value=True)
def test_evaluate_journey_scenario4_concern_on_unanswered_check(mock_dev):
    journey = make_journey(current_location="Unknown Road", current_eta=20, planned_arrival_minutes=25)
    result = monitoring.evaluate_journey(
        journey=journey,
        planned_locations=["VIT", "Katpadi", "Home"],
        response_confirmed=False,
        anomaly_detected=True,
    )
    assert result["state"] == JourneyState.CONCERN.value
    assert result["needs_safety_check"] is True


@patch("monitoring.check_route_deviation", return_value=False)
def test_monitor_and_save_calls_firestore_hooks(mock_dev):
    calls = {"monitoring_result": 0, "safety_event": 0}

    def fake_save_monitoring_result(**kwargs):
        calls["monitoring_result"] += 1

    def fake_save_safety_event(**kwargs):
        calls["safety_event"] += 1

    with patch("monitoring.save_monitoring_result", fake_save_monitoring_result), \
         patch("monitoring.save_safety_event", fake_save_safety_event):
        journey = make_journey()
        monitoring.monitor_and_save(
            journey=journey,
            planned_locations=["VIT", "Katpadi", "Home"],
            response_confirmed=None,
            anomaly_detected=False,
        )

    assert calls["monitoring_result"] == 1
    assert calls["safety_event"] == 1


@patch("monitoring.check_route_deviation", return_value=False)
def test_evaluate_journey_uses_platform_rating_when_present(mock_dev):
    journey = make_journey(current_location="Katpadi", current_eta=20, planned_arrival_minutes=25)
    journey.platform_rating = 4.7  # Strong, reliable record -> 97-98

    result = monitoring.evaluate_journey(
        journey=journey,
        planned_locations=["VIT", "Katpadi", "Home"],
    )

    assert result["needs_manual_review"] is False
    assert any("Strong, reliable record" in r for r in result["reasons"])


@patch("monitoring.check_route_deviation", return_value=False)
def test_evaluate_journey_flags_manual_review_for_low_rating(mock_dev):
    journey = make_journey(current_location="Katpadi", current_eta=20, planned_arrival_minutes=25)
    journey.platform_rating = 1.2  # below 2.0 -> manual review

    result = monitoring.evaluate_journey(
        journey=journey,
        planned_locations=["VIT", "Katpadi", "Home"],
    )

    assert result["needs_manual_review"] is True
    assert any("Internal history required" in r for r in result["reasons"])


@patch("monitoring.check_route_deviation", return_value=False)
def test_evaluate_journey_falls_back_to_flat_trust_score_without_rating(mock_dev):
    # No platform_rating set -> old behavior (flat driver_trust_score field)
    # must still work unchanged, no manual-review flag, no band note.
    journey = make_journey(current_location="Katpadi", current_eta=20, planned_arrival_minutes=25)
    assert journey.platform_rating is None

    result = monitoring.evaluate_journey(
        journey=journey,
        planned_locations=["VIT", "Katpadi", "Home"],
    )

    assert result["needs_manual_review"] is False
    assert not any("Driver trust band" in r for r in result["reasons"])


@patch("monitoring.check_route_deviation", return_value=False)
def test_explicit_driver_trust_score_param_overrides_platform_rating(mock_dev):
    # Explicit override (e.g. from a test or a future caller) should
    # still win over platform_rating, preserving backward compatibility.
    journey = make_journey(current_location="Katpadi", current_eta=20, planned_arrival_minutes=25)
    journey.platform_rating = 1.0  # would normally force manual review

    result = monitoring.evaluate_journey(
        journey=journey,
        planned_locations=["VIT", "Katpadi", "Home"],
        driver_trust_score=95.0,
    )

    assert result["needs_manual_review"] is False


def test_get_event_details_maps_states_to_severity():
    concern_result = {"state": JourneyState.CONCERN.value}
    attention_result = {"state": JourneyState.ATTENTION.value}
    normal_result = {"state": JourneyState.NORMAL.value}

    assert monitoring.get_event_details(concern_result)[1] == "high"
    assert monitoring.get_event_details(attention_result)[1] == "medium"
    assert monitoring.get_event_details(normal_result)[1] == "low"