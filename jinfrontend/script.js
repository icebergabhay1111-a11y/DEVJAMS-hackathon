let countdownInterval;
let cameraStream = null;

// ==========================================
// 1. TIMERS & NAVIGATION
// ==========================================
setInterval(() => {
  const timeString = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  document.querySelectorAll('.clock').forEach(c => c.innerText = timeString);
}, 1000);

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
  
  clearInterval(countdownInterval);
  document.getElementById('app-frame').classList.remove('emergency-bg');
  stopEmergencyFeatures(); 

  if (screenId === 'warning-screen') {
    let timeLeft = 59;
    const timerDisplay = document.getElementById('timer');
    timerDisplay.innerText = "00:59"; 
    
    countdownInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.innerText = `00:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
      if (timeLeft <= 0) { 
        clearInterval(countdownInterval); 
        switchScreen('emergency-screen'); 
      }
    }, 1000); 
  }
  
  if (screenId === 'emergency-screen') {
    document.getElementById('app-frame').classList.add('emergency-bg');
    startEmergencyFeatures();
  }
}

// ==========================================
// 2. EMERGENCY FEATURES (GPS & CAMERA)
// ==========================================
function startEmergencyFeatures() {
  const coordsDisplay = document.getElementById('real-coords');
  const showFallbackGPS = () => { coordsDisplay.innerText = "12.9716° N, 77.5946° E"; };
  const gpsTimeout = setTimeout(showFallbackGPS, 3000);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(gpsTimeout);
        const lat = position.coords.latitude.toFixed(4);
        const lon = position.coords.longitude.toFixed(4);
        coordsDisplay.innerText = `${lat}° N, ${lon}° E`;
      },
      (error) => { clearTimeout(gpsTimeout); showFallbackGPS(); },
      { timeout: 3000 } 
    );
  } else { showFallbackGPS(); }

  const video = document.getElementById('camera-stream');
  const placeholder = document.getElementById('cam-placeholder');
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        cameraStream = stream;
        video.srcObject = stream;
        video.style.display = 'block';
        placeholder.style.display = 'none';
      })
      .catch((error) => { placeholder.innerText = "Camera Access Denied"; });
  }
}

function stopEmergencyFeatures() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    document.getElementById('camera-stream').style.display = 'none';
    document.getElementById('cam-placeholder').style.display = 'block';
  }
}

// ==========================================
// 3. AI CHATBOT LOGIC
// ==========================================
function sendFakeMessage() {
  const input = document.getElementById('chat-text');
  const chatHistory = document.getElementById('chat-history');
  
  if(input.value.trim() !== "") {
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-bubble chat-user';
    userDiv.innerText = input.value;
    chatHistory.appendChild(userDiv);
    input.value = "";
    chatHistory.scrollTop = chatHistory.scrollHeight;

    setTimeout(() => {
      const aiDiv = document.createElement('div');
      aiDiv.className = 'chat-bubble chat-ai';
      aiDiv.innerText = "Understood. I have logged this to your Cloud Backup. Stay calm, help is a tap away below.";
      chatHistory.appendChild(aiDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 1000);
  }
}

// ==========================================
// 4. NEW: BATTERY PROTECT
// ==========================================
if ('getBattery' in navigator) {
  navigator.getBattery().then(function(battery) {
    function updateBatteryUI() {
      // Get battery as a whole number (e.g., 85)
      let level = Math.round(battery.level * 100);
      
      // Update all battery icons on the screen
      document.querySelectorAll('.icons').forEach(icon => {
        icon.innerText = `📶 4G 🔋 ${level}%`;
        
        // If battery is less than 20%, trigger Low Power Protection
        if(level <= 20) {
          icon.innerText += " (Low Power)";
          icon.style.color = "#ef4444"; // Turn text red
          
          // Stop heavy animations to save battery
          let radar = document.querySelector('.radar-sweep');
          if(radar) radar.style.display = 'none'; 
        }
      });
    }
    // Run once on load, and listen for changes
    updateBatteryUI();
    battery.addEventListener('levelchange', updateBatteryUI);
  });
}

// ==========================================
// 5. NEW: SHAKE TO SOS
// ==========================================
// Listens for physical movement of the device
window.addEventListener('devicemotion', function(event) {
  // Get acceleration on X, Y, and Z axes
  let acc = event.acceleration;
  if (!acc) return; // Ignore if device doesn't have a sensor

  // Calculate total force
  let totalForce = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
  
  // If force is very high (shaking violently), trigger emergency
  if (totalForce > 25) { 
    // Only trigger if we aren't already on the emergency screen
    if(!document.getElementById('emergency-screen').classList.contains('active')){
       switchScreen('emergency-screen');
    }
  }
});

// ==========================================
// 6. NEW: VOICE SOS
// ==========================================
// Uses Chrome's built-in speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.continuous = true; // Keep listening continuously
  recognition.interimResults = false;

  recognition.onresult = function(event) {
    // Grab the latest word spoken
    const lastResultIndex = event.results.length - 1;
    const spokenText = event.results[lastResultIndex][0].transcript.toLowerCase().trim();

    // If the word "help" is heard, trigger the SOS
    if (spokenText.includes('help')) {
      if(!document.getElementById('emergency-screen').classList.contains('active')){
         switchScreen('emergency-screen');
      }
    }
  };

  // Restart listening automatically if it pauses
  recognition.onend = function() {
    recognition.start();
  };

  // Start the microphone
  recognition.start();
}