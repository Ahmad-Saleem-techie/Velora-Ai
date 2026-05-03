// ===== BACKEND BASE URL =====
const API_BASE = "https://velora-ai-production.up.railway.app";

// ===== UPDATE EMOTION UI =====
function updateUI(emotion, confidence) {
  const badge = document.getElementById('emotionBadge');
  const bar   = document.getElementById('bar');
  const text  = document.getElementById('confidenceText');

  if (badge) badge.innerText = emotion;
  if (bar)   bar.style.width = confidence + "%";
  if (text)  text.innerText  = "Confidence: " + Math.round(confidence) + "%";
}

// ===== SHOW RECOMMENDATIONS =====
function showRecommendations(data) {
  if (!data) return;

  // Backend may return { recommendations: { quick, medium, deep } }
  // OR directly { quick, medium, deep }
  const rec = (data.recommendations) ? data.recommendations : data;

  const quick  = rec.quick  || [];
  const medium = rec.medium || [];
  const deep   = rec.deep   || [];

  const el = (id) => document.getElementById(id);

  if (el("quick"))  el("quick").innerHTML  = quick.map(i  => `<li>${i}</li>`).join("");
  if (el("medium")) el("medium").innerHTML = medium.map(i => `<li>${i}</li>`).join("");
  if (el("deep"))   el("deep").innerHTML   = deep.map(i   => `<li>${i}</li>`).join("");

  const recSection = el("recommendationsSection");
  if (recSection) recSection.style.display = "block";
}

// ===== AUDIO FILE UPLOAD =====
async function uploadAudio() {
  const inputEl = document.getElementById('audioInput') || document.getElementById('homeAudioInput');
  if (!inputEl || !inputEl.files[0]) {
    alert("Please select an audio file first.");
    return;
  }

  const file = inputEl.files[0];
  const fd   = new FormData();
  fd.append('file', file); // backend expects key 'file'

  updateUI("Analyzing...", 20);
  hideRecommendations();

  try {
    const res  = await fetch(`${API_BASE}/analyze-audio`, { method: "POST", body: fd });
    const data = await res.json();

    const emotion    = data.emotion    || "Unknown";
    const confidence = data.confidence ? data.confidence * 100 : 85;

    updateUI(emotion, confidence);

    if (data.recommendations) {
      showRecommendations(data);
    }

  } catch (err) {
    console.error("Audio upload error:", err);
    updateUI("Server Error", 0);
  }
}

// ===== LIVE MIC RECORDING =====
let mediaRecorder = null;
let audioChunks   = [];
let isRecording   = false;

function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      isRecording = true;

      const btn = document.getElementById('recordBtn');
      if (btn) {
        btn.innerText  = "⏹ Stop Recording";
        btn.classList.add('recording');
      }

      updateUI("Recording...", 50);
      hideRecommendations();

      mediaRecorder.addEventListener("dataavailable", e => {
        audioChunks.push(e.data);
      });

      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await sendAudioBlob(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(t => t.stop());
      });
    })
    .catch(() => alert("Microphone access denied or unavailable."));
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;

    const btn = document.getElementById('recordBtn');
    if (btn) {
      btn.innerText = "🎤 Start Recording";
      btn.classList.remove('recording');
    }

    updateUI("Processing...", 70);
  }
}

async function sendAudioBlob(blob) {
  const fd = new FormData();
  fd.append('file', blob, 'recording.webm');

  updateUI("Analyzing...", 80);

  try {
    const res  = await fetch(`${API_BASE}/analyze-audio`, { method: "POST", body: fd });
    const data = await res.json();

    const emotion    = data.emotion    || "Unknown";
    const confidence = data.confidence ? data.confidence * 100 : 85;

    updateUI(emotion, confidence);

    if (data.recommendations) {
      showRecommendations(data);
    }

  } catch (err) {
    console.error("Live mic error:", err);
    updateUI("Server Error", 0);
  }
}

// ===== HELPERS =====
function hideRecommendations() {
  const recSection = document.getElementById('recommendationsSection');
  if (recSection) recSection.style.display = "none";
}
