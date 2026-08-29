let countdownInterval;
let cameraStream = null;

// ==========================================
// 1. BACKEND CONNECTION
// ==========================================

const API_URL = "http://127.0.0.1:8000";

// ==========================================
// 2. TIMER & NAVIGATION
// ==========================================

setInterval(() => {
  const timeString = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  document.querySelectorAll('.clock').forEach(c => {
    c.innerText = timeString;
  });
}, 1000);


function switchScreen(screenId) {

  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });

  const screen = document.getElementById(screenId);

  if (!screen) {
    console.error("Screen not found:", screenId);
    return;
  }

  screen.classList.add('active');

  clearInterval(countdownInterval);

  const appFrame = document.getElementById('app-frame');

  if (appFrame) {
    appFrame.classList.remove('emergency-bg');
  }

  stopEmergencyFeatures();


  // WARNING SCREEN
  if (screenId === 'warning-screen') {

    let timeLeft = 59;

    const timerDisplay =
      document.getElementById('timer');

    if (timerDisplay) {
      timerDisplay.innerText = "00:59";
    }

    countdownInterval = setInterval(() => {

      timeLeft--;

      if (timerDisplay) {
        timerDisplay.innerText =
          `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
      }

      if (timeLeft <= 0) {

        clearInterval(countdownInterval);

        switchScreen('emergency-screen');
      }

    }, 1000);
  }


  // EMERGENCY SCREEN
  if (screenId === 'emergency-screen') {

    if (appFrame) {
      appFrame.classList.add('emergency-bg');
    }

    startEmergencyFeatures();
  }
}


// ==========================================
// 3. EMERGENCY FEATURES
// GPS + CAMERA
// ==========================================

function startEmergencyFeatures() {

  const coordsDisplay =
    document.getElementById('real-coords');


  function showFallbackGPS() {

    if (coordsDisplay) {
      coordsDisplay.innerText =
        "12.9716° N, 77.5946° E";
    }
  }


  const gpsTimeout =
    setTimeout(showFallbackGPS, 3000);


  // GPS
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        clearTimeout(gpsTimeout);

        if (!coordsDisplay) return;

        const lat =
          position.coords.latitude.toFixed(4);

        const lon =
          position.coords.longitude.toFixed(4);

        coordsDisplay.innerText =
          `${lat}° N, ${lon}° E`;
      },

      () => {

        clearTimeout(gpsTimeout);

        showFallbackGPS();
      },

      {
        timeout: 3000
      }
    );

  } else {

    showFallbackGPS();
  }


  // CAMERA
  const video =
    document.getElementById('camera-stream');

  const placeholder =
    document.getElementById('cam-placeholder');


  if (
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    video &&
    placeholder
  ) {

    navigator.mediaDevices
      .getUserMedia({
        video: true
      })

      .then((stream) => {

        cameraStream = stream;

        video.srcObject = stream;

        video.style.display = 'block';

        placeholder.style.display = 'none';
      })

      .catch(() => {

        placeholder.innerText =
          "Camera Access Denied";
      });
  }
}


function stopEmergencyFeatures() {

  if (cameraStream) {

    cameraStream
      .getTracks()
      .forEach(track => track.stop());

    cameraStream = null;


    const video =
      document.getElementById('camera-stream');

    const placeholder =
      document.getElementById('cam-placeholder');


    if (video) {
      video.style.display = 'none';
    }

    if (placeholder) {
      placeholder.style.display = 'block';
    }
  }
}


// ==========================================
// 4. GEMINI SAFE CALL
// ==========================================

async function sendFakeMessage() {

  const input =
    document.getElementById('chat-text');

  const chatHistory =
    document.getElementById('chat-history');


  if (!input || !chatHistory) {
    console.error("SafeCall elements not found.");
    return;
  }


  const userMessage =
    input.value.trim();


  if (userMessage === "") {
    return;
  }


  // Show user's message
  const userDiv =
    document.createElement('div');

  userDiv.className =
    'chat-bubble chat-user';

  userDiv.innerText =
    userMessage;

  chatHistory.appendChild(userDiv);

  input.value = "";

  chatHistory.scrollTop =
    chatHistory.scrollHeight;


  // Temporary AI message
  const aiDiv =
    document.createElement('div');

  aiDiv.className =
    'chat-bubble chat-ai';

  aiDiv.innerText =
    "NetramAI is thinking...";

  chatHistory.appendChild(aiDiv);

  chatHistory.scrollTop =
    chatHistory.scrollHeight;


  try {

    const response =
      await fetch(
        `${API_URL}/safecall`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: userMessage
          })
        }
      );


    if (!response.ok) {

      throw new Error(
        `Backend returned ${response.status}`
      );
    }


    const data =
      await response.json();


    console.log(
      "Gemini SafeCall:",
      data
    );


    // Backend returns:
    // { reply: "...", safety_state: "..." }

    aiDiv.innerText =
      data.reply ||
      "I'm here with you. How are you feeling right now?";


  } catch (error) {

    console.error(
      "SafeCall connection failed:",
      error
    );


    aiDiv.innerText =
      "I'm having trouble connecting right now. Please stay calm and use the available safety controls if you need help.";
  }


  chatHistory.scrollTop =
    chatHistory.scrollHeight;
}


// ==========================================
// 5. BATTERY PROTECT
// ==========================================

if ('getBattery' in navigator) {

  navigator.getBattery()

    .then(function(battery) {

      function updateBatteryUI() {

        const level =
          Math.round(battery.level * 100);


        document
          .querySelectorAll('.icons')
          .forEach(icon => {

            icon.innerText =
              `📶 4G 🔋 ${level}%`;


            if (level <= 20) {

              icon.innerText +=
                " (Low Power)";

              icon.style.color =
                "#ef4444";


              const radar =
                document.querySelector(
                  '.radar-sweep'
                );


              if (radar) {
                radar.style.display =
                  'none';
              }
            }
          });
      }


      updateBatteryUI();


      battery.addEventListener(
        'levelchange',
        updateBatteryUI
      );

    })

    .catch(error => {

      console.log(
        "Battery API unavailable:",
        error
      );
    });
}


// ==========================================
// 6. SHAKE TO SOS
// ==========================================

let shakeCooldown = false;

window.addEventListener(
  'devicemotion',
  function(event) {

    const acc =
      event.acceleration;


    if (!acc) {
      return;
    }


    const totalForce =
      Math.abs(acc.x || 0) +
      Math.abs(acc.y || 0) +
      Math.abs(acc.z || 0);


    if (
      totalForce > 25 &&
      !shakeCooldown
    ) {

      const emergencyScreen =
        document.getElementById(
          'emergency-screen'
        );


      if (
        emergencyScreen &&
        !emergencyScreen.classList.contains(
          'active'
        )
      ) {

        shakeCooldown = true;

        console.log(
          "SHAKE SOS DETECTED"
        );


        switchScreen(
          'emergency-screen'
        );


        setTimeout(() => {

          shakeCooldown = false;

        }, 5000);
      }
    }
  }
);


// ==========================================
// 7. VOICE SOS
// ==========================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;


if (SpeechRecognition) {

  const recognition =
    new SpeechRecognition();


  recognition.continuous =
    true;

  recognition.interimResults =
    false;

  recognition.lang =
    "en-US";


  recognition.onresult =
    function(event) {

      const lastResultIndex =
        event.results.length - 1;


      const spokenText =
        event.results[lastResultIndex][0]
          .transcript
          .toLowerCase()
          .trim();


      console.log(
        "Voice detected:",
        spokenText
      );


      if (
        spokenText.includes("help")
      ) {

        const emergencyScreen =
          document.getElementById(
            'emergency-screen'
          );


        if (
          emergencyScreen &&
          !emergencyScreen.classList.contains(
            'active'
          )
        ) {

          console.log(
            "VOICE SOS DETECTED"
          );


          switchScreen(
            'emergency-screen'
          );
        }
      }
    };


  recognition.onend =
    function() {

      try {

        recognition.start();

      } catch (error) {

        console.log(
          "Voice recognition restart failed."
        );
      }
    };


  recognition.onerror =
    function(event) {

      console.log(
        "Voice recognition error:",
        event.error
      );
    };


  try {

    recognition.start();

    console.log(
      "NetramAI Voice SOS activated."
    );

  } catch (error) {

    console.log(
      "Voice recognition could not start:",
      error
    );
  }


} else {

  console.log(
    "Speech Recognition is not supported by this browser."
  );
}