/* =========================================================
   NetramAI — Prototype App Logic
   Vanilla JS. No frameworks, no build step.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     ICONS — small inline SVG library (stroke style, 24x24)
  --------------------------------------------------------- */
  const ICONS = {
    phoneCall: '<svg viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.8 21 3 12.2 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1.1L6.6 10.8z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    battery: '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="17" height="10" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M22 10v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><rect x="4.5" y="9.5" width="9" height="5" rx="1" fill="currentColor"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none"><path d="M7 18a4.5 4.5 0 01-.6-8.96A5.5 5.5 0 0117 8.5a4 4 0 01-1 7.5H7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l9 5-9 5-9-5 9-5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M3 12l9 5 9-5M3 17l9 5 9-5" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
    shieldCheck: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l8 3v6c0 5.2-3.4 9.9-8 11-4.6-1.1-8-5.8-8-11V5l8-3z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.5 12l2.3 2.3L15.5 9.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    phoneRing: '<svg viewBox="0 0 24 24" fill="none"><path d="M2 8.5a20 20 0 0020 0M12 21v-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="18" r="1.2" fill="currentColor"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none"><path d="M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M10 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 15l6-6M8 12l-2 2a3.5 3.5 0 004.9 4.9l2.6-2.6M16 12l2-2a3.5 3.5 0 00-4.9-4.9L10.5 7.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------------------------------------------------------
     STATIC DATA (sourced from the NetramAI pitch deck)
  --------------------------------------------------------- */
  const FEATURES = [
    { id: 'safecall', title: 'SafeCall', desc: 'AI voice companion for uneasy moments — no emergency has to be declared.', icon: ICONS.phoneCall, color: 'violet' },
    { id: 'battery', title: 'Battery Protect', desc: 'Prioritizes location, alerts & Guardian connection as battery runs low.', icon: ICONS.battery, color: 'amber' },
    { id: 'cloud', title: 'Cloud Evidence Backup', desc: 'Emergency evidence preserved beyond the device whenever possible.', icon: ICONS.cloud, color: 'violet' },
    { id: 'saferoute', title: 'Safe Route AI', desc: 'Recommends routes and flags advisories before trouble starts.', icon: ICONS.compass, color: 'green' },
    { id: 'guardian', title: 'Guardian Watch', desc: 'Trusted contacts stay informed automatically, mid-journey.', icon: ICONS.eye, color: 'violet' },
    { id: 'graduated', title: 'Graduated Response', desc: 'Normal → Attention → Concern → Are You Safe? → Help → Emergency.', icon: ICONS.layers, color: 'red' }
  ];

  const AUDIENCE = [
    { title: 'Women & solo commuters', desc: 'The largest, most safety-conscious segment across Indian cities.' },
    { title: 'Students & professionals', desc: 'Late labs, night shifts, daily cab/auto rides to and from campus.' },
    { title: 'Gig & delivery workers', desc: 'Long hours in unfamiliar vehicles and routes, often alone.' },
    { title: 'Night-shift & lone workers', desc: 'Predictable risk windows employers are expected to cover.' },
    { title: 'Parents & elder care', desc: 'Visibility into a loved one\u2019s journey — not constant calling.' },
    { title: 'Campuses & enterprise', desc: 'Institutions with a duty of care for students, staff & lone workers.' }
  ];

  const PRIVACY_ITEMS = [
    'User-controlled sharing', 'Minimum necessary data', 'Clear emergency permissions', 'Transparent AI behavior',
    'Secure storage', 'Data retention controls', 'Guardian permissions', 'No unnecessary tracking'
  ];

  const ROADMAP_DONE = ['SafeCall', 'Smart Ride Protection', 'Safe Route AI', 'Guardian Watch', 'Manual / Shake / Voice SOS', '\u201cAre You Safe?\u201d flow', 'Battery Protect', 'Cloud Evidence Backup', 'Vehicle Context'];
  const ROADMAP_NEXT = ['Wearable Sync (Smart Ring)', 'Campus Shield', 'Enterprise Dashboard', 'Public Safety API', 'Advanced offline support', 'Cross-device Guardian network'];

  const HELPLINES = [
    { name: 'Women Helpline', num: '181', tel: '181' },
    { name: 'Police / ERSS', num: '112', tel: '112' },
    { name: 'Cyber Crime Helpline', num: '1930', tel: '1930' },
    { name: 'NCW 24\u00d77 Helpline', num: '14490', tel: '14490' }
  ];

  const PORTALS = [
    { name: 'National Cyber Crime Reporting Portal', url: 'https://cybercrime.gov.in' },
    { name: 'National Commission for Women (NCW)', url: 'https://ncw.nic.in' }
  ];

  const SAFETY_STEPS_BASE = [
    'If you can, move toward a well-lit, populated area — a shop, kiosk, or bus stop.',
    'Prioritize distance and visibility over confronting the person directly.',
    'Note the vehicle number, landmarks, and a short description while it\u2019s fresh.',
    'Save screenshots, photos, or voice notes now — Cloud Evidence Backup can preserve these automatically.',
    'When you\u2019re ready, use a helpline below or file a report through the official portals.'
  ];

  const SAFECALL_REPLIES = [
    'I\u2019m right here with you. You\u2019re doing great — keep going.',
    'Take a slow breath if you can. You\u2019ve got this.',
    'I\u2019m staying on with you until you feel settled.',
    'You don\u2019t have to explain anything. I\u2019m just here.',
    'Noted. I\u2019m keeping an eye on your route in the background.'
  ];

  let guardianColorIndex = 0;
  const GUARDIAN_COLORS = ['#8b5cf6', '#34d399', '#f59e0b', '#38bdf8', '#f472b6'];

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  const state = {
    journeyActive: false,
    stage: 'idle', // idle -> monitoring(0) -> attention(1) -> concern(2) -> areyousafe(3) -> help(4) -> emergency(5)
    battery: 82,
    vehicle: 'cab',
    destination: 'Home',
    guardians: [
      { name: 'Amma', role: 'Mother' },
      { name: 'Rahul Mehta', role: 'Friend' },
      { name: 'Priya S.', role: 'Roommate' }
    ],
    selectedGuardians: new Set([0, 1]),
    switches: {
      preferSafeRoute: true, liveLocation: true, autoNotify: true,
      batteryProtect: true, cloudBackup: true, shakeSOS: false, voiceSOS: false
    },
    lastEvent: 'All clear — no alerts yet.',
    reprompt: null
  };

  const GAUGE_CIRC = 2 * Math.PI * 60; // 376.99

  /* ---------------------------------------------------------
     DOM SHORTCUTS
  --------------------------------------------------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $all = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const el = {
    splash: $('#splash'), splashBar: $('#splashBar'),
    statusTime: $('#statusTime'),
    screens: $all('.screen'),
    navBtns: $all('.nav-btn'),
    journeyIdle: $('#journeyIdle'), journeyActive: $('#journeyActive'),
    destinationInput: $('#destinationInput'),
    vehicleRow: $('#vehicleRow'),
    guardianChipRow: $('#guardianChipRow'),
    startJourneyBtn: $('#startJourneyBtn'),
    endJourneyBtn: $('#endJourneyBtn'),
    featureGrid: $('#featureGrid'),
    audienceScroller: $('#audienceScroller'),
    statusPill: $('#statusPill'), statusDot: $('#statusDot'), statusPillText: $('#statusPillText'),
    gaugeFill: $('#gaugeFill'), gaugeNumber: $('#gaugeNumber'),
    rowRoute: $('#rowRoute'), rowEta: $('#rowEta'), rowBattery: $('#rowBattery'), rowCloud: $('#rowCloud'),
    routeDestLabel: $('#routeDestLabel'),
    driverCard: $('#driverCard'),
    stepper: $('#stepper'),
    btnSimulateDeviation: $('#btnSimulateDeviation'),
    btnTriggerEmergency: $('#btnTriggerEmergency'),
    btnDrainBattery: $('#btnDrainBattery'),
    guardianList: $('#guardianList'),
    addGuardianBtn: $('#addGuardianBtn'),
    callAvatar: $('#callAvatar'), callState: $('#callState'), callTimer: $('#callTimer'),
    waveform: $('#waveform'), callToggleBtn: $('#callToggleBtn'),
    chatWindow: $('#chatWindow'), chatForm: $('#chatForm'), chatInput: $('#chatInput'),
    reportInput: $('#reportInput'), reportSubmitBtn: $('#reportSubmitBtn'), reportResults: $('#reportResults'),
    stepsList: $('#stepsList'), helplineList: $('#helplineList'), portalList: $('#portalList'),
    privacyGrid: $('#privacyGrid'), roadmapDone: $('#roadmapDone'), roadmapNext: $('#roadmapNext'),
    sheetBackdrop: $('#sheetBackdrop'), sheet: $('#areYouSafeSheet'),
    btnImSafe: $('#btnImSafe'), btnMoreTime: $('#btnMoreTime'), btnNeedHelp: $('#btnNeedHelp'),
    emergencyOverlay: $('#emergencyOverlay'),
    camCard: $('#camCard'), camVideo: $('#camVideo'),
    camFallbackTitle: $('#camFallbackTitle'), camFallbackSub: $('#camFallbackSub'), camTimestamp: $('#camTimestamp'),
    geoCoords: $('#geoCoords'), geoAccuracy: $('#geoAccuracy'), geoUpdated: $('#geoUpdated'), geoPulseDot: $('#geoPulseDot'),
    rowGuardianNotified: $('#rowGuardianNotified'), rowEmergencyCloud: $('#rowEmergencyCloud'),
    holdCancelBtn: $('#holdCancelBtn'), holdCancelFill: $('#holdCancelFill'),
    sosFab: $('#sosFab'), sosFabProgress: $('#sosFabProgress'),
    toastContainer: $('#toastContainer'),
    notifBtn: $('#notifBtn'), notifDot: $('#notifDot'),
    shakeToggle: $('#shakeToggle'), voiceToggle: $('#voiceToggle')
  };

  /* ---------------------------------------------------------
     UTILITIES
  --------------------------------------------------------- */
  function toastTop() {
    const activeScreen = document.querySelector('.screen.active');
    const ref = activeScreen && (activeScreen.querySelector('.status-pill-wrap') || activeScreen.querySelector('.screen-header'));
    if (!ref) return 122;
    return Math.round(ref.getBoundingClientRect().bottom + 14);
  }

  function showToast(msg) {
    state.lastEvent = msg;
    if (el.notifDot) el.notifDot.hidden = false;
    el.toastContainer.style.top = toastTop() + 'px';
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    el.toastContainer.appendChild(t);
    setTimeout(() => t.remove(), 2900);
  }

  function countUp(elNode, from, to, duration) {
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.round(from + (to - from) * p);
      elNode.textContent = val;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function setGauge(percent, colorClass) {
    const offset = GAUGE_CIRC * (1 - percent / 100);
    el.gaugeFill.style.strokeDashoffset = offset;
    const colors = { green: '#34d399', amber: '#f59e0b', red: '#ef4444' };
    el.gaugeFill.style.stroke = colors[colorClass] || colors.green;
    el.gaugeFill.style.filter = 'drop-shadow(0 0 8px ' + (colors[colorClass] || colors.green) + '99)';
    const current = parseInt(el.gaugeNumber.textContent, 10) || 0;
    countUp(el.gaugeNumber, current, percent, 700);
  }

  function initials(name) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  function updateClock() {
    const d = new Date();
    let h = d.getHours(); const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    el.statusTime.textContent = h + ':' + String(m).padStart(2, '0');
  }

  /* ---------------------------------------------------------
     SPLASH
  --------------------------------------------------------- */
  function runSplash() {
    requestAnimationFrame(() => { el.splashBar.style.width = '100%'; });
    setTimeout(() => el.splash.classList.add('hide'), 1900);
  }
  el.splash.addEventListener('click', () => el.splash.classList.add('hide'));

  /* ---------------------------------------------------------
     TAB NAVIGATION
  --------------------------------------------------------- */
  function switchTab(tab) {
    el.screens.forEach(s => s.classList.toggle('active', s.dataset.screen === tab));
    el.navBtns.forEach(b => b.classList.toggle('nav-btn--active', b.dataset.tab === tab));
    $('#screens').scrollTop = 0;
  }
  el.navBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

  /* ---------------------------------------------------------
     RENDER: FEATURE GRID (six differentiators)
  --------------------------------------------------------- */
  const FEATURE_ACTIONS = {
    safecall: () => switchTab('safecall'),
    guardian: () => switchTab('guardian'),
    battery: () => switchTab('profile'),
    cloud: () => switchTab('profile'),
    saferoute: () => showToast('Safe Route AI is already suggesting a safer path on your Home screen.'),
    graduated: () => {
      if (state.journeyActive) { switchTab('home'); setTimeout(() => el.stepper.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150); }
      else showToast('Start a journey to see the Graduated Response Engine live.');
    }
  };

  function renderFeatureGrid() {
    el.featureGrid.innerHTML = FEATURES.map(f => `
      <div class="feature-card" data-feature="${f.id}">
        <span class="feature-card-ico" style="background:${colorBg(f.color)};color:${colorFg(f.color)}">${f.icon}</span>
        <p class="feature-card-title">${f.title}</p>
        <p class="feature-card-desc">${f.desc}</p>
      </div>`).join('');
    $all('.feature-card', el.featureGrid).forEach(card => {
      card.addEventListener('click', () => {
        const action = FEATURE_ACTIONS[card.dataset.feature];
        if (action) action();
      });
    });
  }
  function colorBg(c) { return { violet: 'rgba(139,92,246,.16)', amber: 'rgba(245,158,11,.16)', green: 'rgba(52,211,153,.16)', red: 'rgba(239,68,68,.16)' }[c]; }
  function colorFg(c) { return { violet: '#c4b5fd', amber: '#f59e0b', green: '#34d399', red: '#fca5a5' }[c]; }

  function renderAudience() {
    el.audienceScroller.innerHTML = AUDIENCE.map(a => `
      <div class="audience-card"><p>${a.title}</p><p>${a.desc}</p></div>
    `).join('');
  }

  /* ---------------------------------------------------------
     START JOURNEY (idle panel)
  --------------------------------------------------------- */
  el.vehicleRow.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    $all('.chip', el.vehicleRow).forEach(c => c.classList.remove('chip--active'));
    chip.classList.add('chip--active');
    state.vehicle = chip.dataset.vehicle;
  });

  function renderGuardianChips() {
    el.guardianChipRow.innerHTML = state.guardians.map((g, i) => `
      <button class="chip ${state.selectedGuardians.has(i) ? 'chip--active' : ''}" data-idx="${i}">${g.name}</button>
    `).join('');
    $all('.chip', el.guardianChipRow).forEach(chip => {
      chip.addEventListener('click', () => {
        const i = parseInt(chip.dataset.idx, 10);
        if (state.selectedGuardians.has(i)) state.selectedGuardians.delete(i);
        else state.selectedGuardians.add(i);
        chip.classList.toggle('chip--active');
      });
    });
  }

  el.destinationInput.addEventListener('input', e => { state.destination = e.target.value || 'destination'; });

  el.startJourneyBtn.addEventListener('click', startJourney);
  el.endJourneyBtn.addEventListener('click', endJourney);

  function startJourney() {
    state.journeyActive = true;
    state.stage = 'monitoring';
    el.journeyIdle.classList.add('hidden');
    el.journeyActive.classList.remove('hidden');
    el.routeDestLabel.textContent = state.destination || 'Destination';
    el.driverCard.classList.toggle('hidden', !(state.vehicle === 'cab' || state.vehicle === 'auto'));
    setMonitoringUI();
    setStep(0);
    showToast('Journey started \u2014 NetramAI is monitoring.');
  }

  function endJourney() {
    state.journeyActive = false;
    state.stage = 'idle';
    closeSheet(); closeEmergency();
    el.journeyActive.classList.add('hidden');
    el.journeyIdle.classList.remove('hidden');
    if (state.reprompt) { clearTimeout(state.reprompt); state.reprompt = null; }
  }

  function setMonitoringUI() {
    el.statusPill.className = 'status-pill';
    el.statusDot.className = 'status-dot';
    el.statusPillText.textContent = 'Monitoring Active';
    setGauge(96, 'green');
    el.rowRoute.textContent = 'ON TRACK'; el.rowRoute.className = 'ok';
    el.rowEta.textContent = '24 min'; el.rowEta.className = '';
    el.rowBattery.textContent = state.battery + '%';
  }

  /* ---------------------------------------------------------
     GRADUATED RESPONSE STEPPER
  --------------------------------------------------------- */
  function setStep(index, danger) {
    $all('.step', el.stepper).forEach((step, i) => {
      step.classList.remove('done', 'active', 'danger');
      if (i < index) step.classList.add('done');
      else if (i === index) { step.classList.add('active'); if (danger) step.classList.add('danger'); }
    });
  }

  /* ---------------------------------------------------------
     DEVIATION / ARE-YOU-SAFE FLOW
  --------------------------------------------------------- */
  function simulateDeviation() {
    if (!state.journeyActive) startJourney();
    state.stage = 'attention';
    el.statusPill.className = 'status-pill status-pill--amber';
    el.statusDot.className = 'status-dot status-dot--amber';
    el.statusPillText.textContent = 'Attention \u2014 Monitoring Closely';
    setGauge(82, 'amber');
    el.rowRoute.textContent = 'CHECKING'; el.rowRoute.className = 'warn';
    setStep(1);

    setTimeout(() => {
      state.stage = 'concern';
      el.statusPillText.textContent = 'Unusual Journey Detected';
      setGauge(68, 'amber');
      el.rowRoute.textContent = 'DEVIATION'; el.rowRoute.className = 'warn';
      el.rowEta.textContent = '24 \u2192 37 min'; el.rowEta.className = 'warn';
      setStep(2);
      showToast('Unusual journey detected.');
      setTimeout(openSheet, 1100);
    }, 1300);
  }

  function openSheet() {
    setStep(3);
    el.sheetBackdrop.classList.add('open');
    el.sheet.classList.add('open');
  }
  function closeSheet() {
    el.sheetBackdrop.classList.remove('open');
    el.sheet.classList.remove('open');
  }
  el.sheetBackdrop.addEventListener('click', closeSheet);

  el.btnImSafe.addEventListener('click', () => {
    closeSheet();
    if (state.reprompt) { clearTimeout(state.reprompt); state.reprompt = null; }
    state.stage = 'monitoring';
    setMonitoringUI(); setStep(0);
    showToast('Great \u2014 glad you\u2019re safe.');
  });

  el.btnMoreTime.addEventListener('click', () => {
    closeSheet();
    showToast('Okay \u2014 we\u2019ll check in again shortly.');
    state.reprompt = setTimeout(() => { if (state.journeyActive) openSheet(); }, 4500);
  });

  el.btnNeedHelp.addEventListener('click', () => {
    closeSheet();
    escalateToEmergency();
  });

  el.btnSimulateDeviation.addEventListener('click', simulateDeviation);
  el.btnTriggerEmergency.addEventListener('click', () => escalateToEmergency());
  el.btnDrainBattery.addEventListener('click', drainBattery);

  /* ---------------------------------------------------------
     EMERGENCY MODE
  --------------------------------------------------------- */
  function escalateToEmergency(immediate) {
    if (!state.journeyActive) startJourney();
    setStep(4);
    const openEmergency = () => {
      setStep(5, true);
      el.emergencyOverlay.classList.add('open');
      el.rowGuardianNotified.textContent = 'SENT'; el.rowGuardianNotified.className = 'danger';
      el.rowEmergencyCloud.textContent = 'SYNCING'; el.rowEmergencyCloud.className = 'danger';
      showToast('Guardian notified \u2014 evidence backup started.');
      startCameraFeed();
      startGeoTracking();
      setTimeout(() => {
        el.rowEmergencyCloud.textContent = 'BACKED UP';
        el.rowEmergencyCloud.className = 'ok';
      }, 2400);
    };
    if (immediate) openEmergency();
    else setTimeout(openEmergency, 550);
  }

  function closeEmergency() {
    el.emergencyOverlay.classList.remove('open');
    resetHoldFill();
    stopCameraFeed();
    stopGeoTracking();
  }

  /* ---------------------------------------------------------
     LIVE EVIDENCE — camera feed + geo coordinates
     (real getUserMedia / Geolocation; needs HTTPS or localhost,
      and the user granting permission when the browser prompts)
  --------------------------------------------------------- */
  let camStream = null, camTimerInterval = null, camStartedAt = 0;

  function startCameraFeed() {
    camStartedAt = Date.now();
    el.camTimestamp.textContent = '00:00';
    if (camTimerInterval) clearInterval(camTimerInterval);
    camTimerInterval = setInterval(() => {
      const s = Math.floor((Date.now() - camStartedAt) / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2, '0');
      const ss = String(s % 60).padStart(2, '0');
      el.camTimestamp.textContent = `${mm}:${ss}`;
    }, 1000);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      el.camFallbackTitle.textContent = 'Camera Preview';
      el.camFallbackSub.textContent = 'Live camera isn\u2019t supported in this browser.';
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then(stream => {
        camStream = stream;
        el.camVideo.srcObject = stream;
        el.camCard.classList.add('has-stream');
      })
      .catch(err => {
        el.camCard.classList.remove('has-stream');
        if (err && err.name === 'NotAllowedError') {
          el.camFallbackTitle.textContent = 'Camera access blocked';
          el.camFallbackSub.textContent = 'Allow camera permission in your browser to show a live feed here.';
        } else if (err && err.name === 'NotFoundError') {
          el.camFallbackTitle.textContent = 'No camera found';
          el.camFallbackSub.textContent = 'Connect a camera to enable the live feed.';
        } else {
          el.camFallbackTitle.textContent = 'Camera unavailable';
          el.camFallbackSub.textContent = 'Live camera requires HTTPS (or localhost) and a granted permission.';
        }
      });
  }

  function stopCameraFeed() {
    if (camTimerInterval) { clearInterval(camTimerInterval); camTimerInterval = null; }
    if (camStream) {
      camStream.getTracks().forEach(t => t.stop());
      camStream = null;
    }
    el.camVideo.srcObject = null;
    el.camCard.classList.remove('has-stream');
  }

  let geoWatchId = null, geoClockInterval = null, geoLastFixAt = 0;

  function startGeoTracking() {
    el.geoPulseDot.style.background = '';
    if (!('geolocation' in navigator)) {
      el.geoCoords.textContent = 'Geolocation not supported on this device';
      el.geoAccuracy.textContent = '\u2014';
      el.geoUpdated.textContent = '\u2014';
      return;
    }

    geoWatchId = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude, accuracy } = pos.coords;
        el.geoCoords.textContent = `${latitude.toFixed(5)}\u00b0, ${longitude.toFixed(5)}\u00b0`;
        el.geoAccuracy.textContent = `\u00b1 ${Math.round(accuracy)} m accuracy`;
        geoLastFixAt = Date.now();
        el.geoUpdated.textContent = 'Updated just now';
      },
      err => {
        el.geoCoords.textContent = err.code === 1
          ? 'Location permission denied'
          : 'Unable to acquire GPS signal';
        el.geoAccuracy.textContent = '\u2014';
        el.geoUpdated.textContent = '\u2014';
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 8000 }
    );

    if (geoClockInterval) clearInterval(geoClockInterval);
    geoClockInterval = setInterval(() => {
      if (!geoLastFixAt) return;
      const secs = Math.floor((Date.now() - geoLastFixAt) / 1000);
      el.geoUpdated.textContent = secs < 2 ? 'Updated just now' : `Updated ${secs}s ago`;
    }, 1000);
  }

  function stopGeoTracking() {
    if (geoWatchId !== null) { navigator.geolocation.clearWatch(geoWatchId); geoWatchId = null; }
    if (geoClockInterval) { clearInterval(geoClockInterval); geoClockInterval = null; }
    geoLastFixAt = 0;
  }

  // Hold-to-cancel (3s press)
  let holdTimer = null, holdStart = 0;
  function resetHoldFill() { el.holdCancelFill.style.width = '0%'; }
  function startHold() {
    holdStart = performance.now();
    holdTimer = setInterval(() => {
      const pct = Math.min(100, ((performance.now() - holdStart) / 3000) * 100);
      el.holdCancelFill.style.width = pct + '%';
      if (pct >= 100) {
        clearInterval(holdTimer); holdTimer = null;
        closeEmergency();
        state.stage = 'monitoring';
        setMonitoringUI(); setStep(0);
        showToast('Marked safe \u2014 Guardian notified you\u2019re okay.');
      }
    }, 30);
  }
  function stopHold() { if (holdTimer) { clearInterval(holdTimer); holdTimer = null; resetHoldFill(); } }
  ['mousedown', 'touchstart'].forEach(ev => el.holdCancelBtn.addEventListener(ev, startHold, { passive: true }));
  ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(ev => el.holdCancelBtn.addEventListener(ev, stopHold));

  /* ---------------------------------------------------------
     BATTERY PROTECT DEMO
  --------------------------------------------------------- */
  function drainBattery() {
    state.battery = Math.max(5, state.battery - 15);
    el.rowBattery.textContent = state.battery + '%';
    if (state.battery <= 20) {
      el.rowBattery.className = 'danger';
      showToast('Battery Protect engaged \u2014 prioritizing location & Guardian connection.');
    } else if (state.battery <= 50) {
      el.rowBattery.className = 'warn';
    } else {
      el.rowBattery.className = 'ok';
    }
  }

  /* ---------------------------------------------------------
     SOS FLOATING ACTION BUTTON (manual SOS, hold 1.1s)
  --------------------------------------------------------- */
  let sosTimer = null, sosStart = 0;
  function sosStart_() {
    el.sosFab.classList.add('holding');
    sosStart = performance.now();
    sosTimer = setInterval(() => {
      const pct = Math.min(100, ((performance.now() - sosStart) / 1100) * 100);
      el.sosFabProgress.style.setProperty('--p', pct);
      if (pct >= 100) {
        clearInterval(sosTimer); sosTimer = null;
        el.sosFab.classList.remove('holding');
        el.sosFabProgress.style.setProperty('--p', 0);
        switchTab('home');
        escalateToEmergency();
      }
    }, 20);
  }
  function sosCancel_() {
    if (sosTimer) { clearInterval(sosTimer); sosTimer = null; }
    el.sosFab.classList.remove('holding');
    el.sosFabProgress.style.setProperty('--p', 0);
  }
  ['mousedown', 'touchstart'].forEach(ev => el.sosFab.addEventListener(ev, sosStart_, { passive: true }));
  ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(ev => el.sosFab.addEventListener(ev, sosCancel_));

  // Fade the FAB out while actively scrolling so it never sits on top of
  // content the user is trying to read or tap; fade it back in once
  // scrolling settles. Never hide it mid hold-to-trigger.
  let scrollHideTimer = null;
  $('#screens').addEventListener('scroll', () => {
    if (sosTimer) return; // don't hide while a hold is in progress
    el.sosFab.classList.add('fab-hidden');
    clearTimeout(scrollHideTimer);
    scrollHideTimer = setTimeout(() => el.sosFab.classList.remove('fab-hidden'), 450);
  }, { passive: true });

  /* ---------------------------------------------------------
     GUARDIAN WATCH TAB
  --------------------------------------------------------- */
  function renderGuardianList() {
    el.guardianList.innerHTML = state.guardians.map((g, i) => {
      const color = GUARDIAN_COLORS[i % GUARDIAN_COLORS.length];
      return `
      <div class="guardian-item">
        <span class="guardian-avatar" style="background:${color}">${initials(g.name)}</span>
        <div><p class="guardian-name">${g.name}</p><p class="guardian-role">${g.role}</p></div>
        <span class="guardian-status"><i></i>Connected</span>
      </div>`;
    }).join('');
    renderGuardianChips();
  }

  el.addGuardianBtn.addEventListener('click', () => {
    if ($('#inlineGuardianForm')) return;
    const form = document.createElement('div');
    form.className = 'card';
    form.id = 'inlineGuardianForm';
    form.innerHTML = `
      <p class="field-label">New Guardian</p>
      <div class="field"><span class="field-icon">${ICONS.users}</span><input type="text" id="ngName" placeholder="Name"></div>
      <div class="field"><span class="field-icon">${ICONS.phoneRing}</span><input type="text" id="ngRole" placeholder="Relation (e.g. Sister, Friend)"></div>
      <div class="chip-row" style="margin-bottom:0">
        <button class="btn btn--primary" id="ngSave" style="flex:1">Save Guardian</button>
        <button class="btn btn--outline" id="ngCancel" style="flex:1">Cancel</button>
      </div>`;
    el.addGuardianBtn.insertAdjacentElement('afterend', form);
    $('#ngCancel').addEventListener('click', () => form.remove());
    $('#ngSave').addEventListener('click', () => {
      const name = $('#ngName').value.trim();
      const role = $('#ngRole').value.trim() || 'Guardian';
      if (!name) { $('#ngName').focus(); return; }
      state.guardians.push({ name, role });
      state.selectedGuardians.add(state.guardians.length - 1);
      renderGuardianList();
      form.remove();
      showToast(name + ' added as a Guardian.');
    });
  });

  /* ---------------------------------------------------------
     SAFECALL
  --------------------------------------------------------- */
  let callActive = false, callSeconds = 0, callTimerInt = null;

  function addChatMsg(text, who) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg chat-msg--' + who;
    wrap.innerHTML = '<div class="chat-bubble">' + text + '</div>';
    el.chatWindow.appendChild(wrap);
    el.chatWindow.scrollIntoView({ behavior: 'smooth', block: 'end' });
    $('#screens').scrollTop = $('#screens').scrollHeight;
  }

  function botReplyTo(msg) {
    const typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg--bot';
    typing.innerHTML = '<div class="chat-bubble typing-bubble"><span></span><span></span><span></span></div>';
    el.chatWindow.appendChild(typing);
    const lower = msg.toLowerCase();
    let reply;
    if (/scared|afraid|unsafe|nervous/.test(lower)) reply = 'That\u2019s completely understandable. I\u2019m right here with you \u2014 want me to loop in your Guardian just in case?';
    else if (/thank/.test(lower)) reply = 'Anytime, that\u2019s what I\u2019m here for.';
    else if (/help/.test(lower)) reply = 'If you need more than to talk, tap the red SOS button any time \u2014 I\u2019ll alert your Guardian and start evidence backup instantly.';
    else if (/driver|cab|auto|taxi/.test(lower)) reply = 'Got it \u2014 I\u2019m keeping the driver and route in view on the dashboard while we talk.';
    else reply = SAFECALL_REPLIES[Math.floor(Math.random() * SAFECALL_REPLIES.length)];

    setTimeout(() => {
      typing.remove();
      addChatMsg(reply, 'bot');
    }, 900 + Math.random() * 500);
  }

  el.chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const val = el.chatInput.value.trim();
    if (!val) return;
    addChatMsg(val, 'user');
    el.chatInput.value = '';
    botReplyTo(val);
  });

  function formatTimer(s) {
    const m = Math.floor(s / 60), sec = s % 60;
    return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  }

  el.callToggleBtn.addEventListener('click', () => {
    callActive = !callActive;
    el.callAvatar.classList.toggle('active', callActive);
    el.waveform.classList.toggle('active', callActive);
    el.callTimer.hidden = !callActive;
    el.callState.textContent = callActive ? 'SafeCall active \u2014 I\u2019m listening' : 'Tap to start a SafeCall';
    el.callToggleBtn.classList.toggle('btn--danger', callActive);
    el.callToggleBtn.classList.toggle('btn--primary', !callActive);
    el.callToggleBtn.innerHTML = callActive
      ? '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> End SafeCall'
      : '<svg viewBox="0 0 24 24" fill="none"><path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.8 21 3 12.2 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1.1L6.6 10.8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg> Start SafeCall';

    if (callActive) {
      callSeconds = 0;
      el.callTimer.textContent = '00:00';
      callTimerInt = setInterval(() => { callSeconds++; el.callTimer.textContent = formatTimer(callSeconds); }, 1000);
      if (el.chatWindow.children.length < 2) {
        setTimeout(() => addChatMsg('Voice link is simulated in this prototype \u2014 keep typing below and I\u2019ll respond as if we\u2019re talking.', 'bot'), 500);
      }
    } else {
      clearInterval(callTimerInt);
    }
  });

  /* ---------------------------------------------------------
     REPORT / SAFETY GUIDANCE
  --------------------------------------------------------- */
  function renderHelplines() {
    el.helplineList.innerHTML = HELPLINES.map(h => `
      <a class="helpline-item" href="tel:${h.tel}">
        <span class="helpline-ico">${ICONS.phoneCall}</span>
        <div><p class="helpline-name">${h.name}</p><p class="helpline-num">${h.num}</p></div>
        <span class="helpline-call">Call</span>
      </a>`).join('');
  }
  function renderPortals() {
    el.portalList.innerHTML = PORTALS.map(p => `
      <a class="portal-item" href="${p.url}" target="_blank" rel="noopener">
        <span class="portal-ico">${ICONS.link}</span>
        <div><p class="portal-name">${p.name}</p><p class="portal-url">${p.url.replace('https://', '')}</p></div>
      </a>`).join('');
  }

  el.reportSubmitBtn.addEventListener('click', () => {
    const text = el.reportInput.value.trim().toLowerCase();
    const steps = SAFETY_STEPS_BASE.slice();
    if (/driver|cab|auto|taxi/.test(text)) steps.splice(3, 0, 'Ask NetramAI to pull the driver\u2019s Trust Score and trip history from the Home dashboard.');
    if (/follow|stalk/.test(text)) steps.splice(1, 0, 'Head somewhere public and visible rather than home directly, if it\u2019s safe to change route.');
    el.stepsList.innerHTML = steps.map(s => `<li>${s}</li>`).join('');
    el.reportResults.classList.remove('hidden');
    setTimeout(() => el.reportResults.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    showToast('Guidance ready \u2014 you\u2019re not alone in this.');
  });

  /* ---------------------------------------------------------
     PROFILE: SWITCHES, PRIVACY GRID, ROADMAP
  --------------------------------------------------------- */
  document.addEventListener('click', e => {
    const sw = e.target.closest('.switch[data-toggle]');
    if (!sw) return;
    const key = sw.dataset.toggle;
    if (key === 'shakeSOS') { toggleShake(sw); return; }
    if (key === 'voiceSOS') { toggleVoice(sw); return; }
    state.switches[key] = !state.switches[key];
    sw.classList.toggle('switch--on', state.switches[key]);
  });

  function renderPrivacyGrid() {
    el.privacyGrid.innerHTML = PRIVACY_ITEMS.map(label => `
      <div class="privacy-item" data-tip="${label}">${ICONS.shieldCheck}<p>${label}</p></div>
    `).join('');
    $all('.privacy-item', el.privacyGrid).forEach(item => {
      item.addEventListener('click', () => showToast(item.dataset.tip + ' \u2014 on by default, always explainable.'));
    });
  }

  function renderRoadmap() {
    el.roadmapDone.className = 'roadmap-list done';
    el.roadmapDone.innerHTML = ROADMAP_DONE.map(x => `<li>${x}</li>`).join('');
    el.roadmapNext.className = 'roadmap-list next';
    el.roadmapNext.innerHTML = ROADMAP_NEXT.map(x => `<li>${x}</li>`).join('');
  }

  /* ---------------------------------------------------------
     SHAKE TO SOS (DeviceMotion)
  --------------------------------------------------------- */
  let shakeHandler = null, lastShakeTime = 0, lastAccel = null;
  function toggleShake(sw) {
    const turningOn = !state.switches.shakeSOS;
    if (turningOn && typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission().then(res => {
        if (res === 'granted') enableShake(sw); else showToast('Motion permission denied.');
      }).catch(() => showToast('Motion permission unavailable in this browser.'));
    } else if (turningOn && window.DeviceMotionEvent) {
      enableShake(sw);
    } else if (turningOn) {
      showToast('Shake detection isn\u2019t supported in this browser.');
    } else {
      disableShake(sw);
    }
  }
  function enableShake(sw) {
    state.switches.shakeSOS = true;
    sw.classList.add('switch--on');
    showToast('Shake to SOS enabled \u2014 shake firmly to trigger an emergency.');
    shakeHandler = function (e) {
      const a = e.accelerationIncludingGravity || e.acceleration;
      if (!a) return;
      const mag = Math.sqrt((a.x || 0) ** 2 + (a.y || 0) ** 2 + (a.z || 0) ** 2);
      const now = Date.now();
      if (mag > 28 && now - lastShakeTime > 2500) {
        lastShakeTime = now;
        switchTab('home');
        escalateToEmergency();
      }
    };
    window.addEventListener('devicemotion', shakeHandler);
  }
  function disableShake(sw) {
    state.switches.shakeSOS = false;
    sw.classList.remove('switch--on');
    if (shakeHandler) window.removeEventListener('devicemotion', shakeHandler);
    showToast('Shake to SOS turned off.');
  }

  /* ---------------------------------------------------------
     VOICE SOS (Web Speech API, best-effort)
  --------------------------------------------------------- */
  let recognizer = null;
  function toggleVoice(sw) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) { showToast('Voice recognition isn\u2019t supported in this browser.'); return; }
    const turningOn = !state.switches.voiceSOS;
    state.switches.voiceSOS = turningOn;
    sw.classList.toggle('switch--on', turningOn);
    if (turningOn) {
      try {
        recognizer = new SpeechRec();
        recognizer.continuous = true;
        recognizer.interimResults = false;
        recognizer.lang = 'en-IN';
        recognizer.onresult = (e) => {
          const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ').toLowerCase();
          if (transcript.includes('netram help') || transcript.includes('help me netram')) {
            switchTab('home'); escalateToEmergency();
          }
        };
        recognizer.onerror = () => {};
        recognizer.onend = () => { if (state.switches.voiceSOS) { try { recognizer.start(); } catch (err) {} } };
        recognizer.start();
        showToast('Voice SOS listening for \u201cnetram help\u201d.');
      } catch (err) {
        showToast('Couldn\u2019t start voice recognition.');
      }
    } else {
      if (recognizer) { try { recognizer.stop(); } catch (err) {} }
      showToast('Voice SOS turned off.');
    }
  }

  /* ---------------------------------------------------------
     NOTIFICATIONS BELL
  --------------------------------------------------------- */
  el.notifBtn.addEventListener('click', () => {
    el.notifDot.hidden = true;
    showToast(state.lastEvent);
  });

  /* ---------------------------------------------------------
     DEEP LINKS — for design capture / QA
     Open with ?screen=<value> to land straight on that state,
     e.g. index.html?screen=emergency
     Valid values: home, monitoring, attention, concern,
     areyousafe, emergency, guardian, safecall, report, profile
  --------------------------------------------------------- */
  function applyDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const screen = params.get('screen');
    if (!screen) return false;

    switch (screen) {
      case 'guardian':
      case 'safecall':
      case 'report':
      case 'profile':
        switchTab(screen);
        break;

      case 'monitoring':
        switchTab('home');
        startJourney();
        break;

      case 'attention':
        switchTab('home');
        startJourney();
        state.stage = 'attention';
        el.statusPill.className = 'status-pill status-pill--amber';
        el.statusDot.className = 'status-dot status-dot--amber';
        el.statusPillText.textContent = 'Attention \u2014 Monitoring Closely';
        setGauge(82, 'amber');
        el.rowRoute.textContent = 'CHECKING'; el.rowRoute.className = 'warn';
        setStep(1);
        break;

      case 'concern':
        switchTab('home');
        startJourney();
        state.stage = 'concern';
        el.statusPillText.textContent = 'Unusual Journey Detected';
        setGauge(68, 'amber');
        el.rowRoute.textContent = 'DEVIATION'; el.rowRoute.className = 'warn';
        el.rowEta.textContent = '24 \u2192 37 min'; el.rowEta.className = 'warn';
        setStep(2);
        break;

      case 'areyousafe':
        switchTab('home');
        startJourney();
        openSheet();
        break;

      case 'emergency':
      case 'help':
        switchTab('home');
        escalateToEmergency(true);
        break;

      case 'home':
      default:
        switchTab('home');
        break;
    }
    return true;
  }

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  function init() {
    renderFeatureGrid();
    renderAudience();
    renderGuardianList();
    renderHelplines();
    renderPortals();
    renderPrivacyGrid();
    renderRoadmap();
    updateClock();
    setInterval(updateClock, 30000);

    if (applyDeepLink()) {
      el.splash.classList.add('hide'); // skip splash so the target state is visible immediately
    } else {
      runSplash();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
