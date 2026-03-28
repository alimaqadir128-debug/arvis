// =========================================
// ARVIS — app.js
// =========================================

let selectedCrop = "saffron";
let selectedAnalysis = "general";
let selectedLanguage = "english";
let currentWeather = null;

// ---- WEATHER ----
async function loadWeather() {
  try {
    const res = await fetch("/api/weather?city=Srinagar");
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    currentWeather = data;

    document.getElementById("weatherWidget").innerHTML = `
      <div class="weather-data">
        <span class="weather-city">📍 ${data.city}, Kashmir</span>
        <span class="weather-temp">${data.temp}°C</span>
        <span class="weather-desc">${data.description}</span>
        <span class="weather-details">💧 ${data.humidity}% · 💨 ${data.windSpeed} m/s</span>
      </div>
    `;
  } catch (err) {
    document.getElementById("weatherWidget").innerHTML = `
      <div class="weather-loading">weather unavailable</div>
    `;
  }
}

// ---- CROP BUTTONS ----
document.querySelectorAll(".crop-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".crop-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCrop = btn.dataset.crop;
  });
});

// ---- ANALYSIS BUTTONS ----
document.querySelectorAll(".analysis-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".analysis-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedAnalysis = btn.dataset.type;

    const autoFill = {
      pest_calendar: `Generate a full pest and disease calendar for ${selectedCrop}`,
      harvest: `When and how should I harvest my ${selectedCrop} in Kashmir?`,
      prices: `What are the current mandi prices for ${selectedCrop} in Kashmir?`,
      recommendation: `Which crop should I grow on my farm in Kashmir?`,
    };

    if (autoFill[selectedAnalysis]) {
      document.getElementById("queryInput").value = autoFill[selectedAnalysis];
    } else {
      document.getElementById("queryInput").value = "";
    }
  });
});

// ---- ASK BUTTON ----
document.getElementById("askBtn").addEventListener("click", async () => {
  const query = document.getElementById("queryInput").value.trim();

  if (!query) {
    alert("Please enter a question or describe your problem.");
    return;
  }

  // Show loading state
  const btn = document.getElementById("askBtn");
  document.getElementById("askBtnText").classList.add("hidden");
  document.getElementById("askBtnLoader").classList.remove("hidden");
  btn.disabled = true;

  // Hide previous result
  document.getElementById("resultSection").style.display = "none";

  try {
    const res = await fetch("/api/gemini/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop: selectedCrop,
        query,
        language: selectedLanguage,
        weather: currentWeather,
        analysisType: selectedAnalysis,
      }),
    });

    const data = await res.json();

    if (data.error) throw new Error(data.error);

    // Show result
    const cropNames = {
      saffron: "🌸 Saffron",
      rice: "🌾 Rice",
      apple: "🍎 Apple",
      walnut: "🥜 Walnut",
    };

    document.getElementById("resultCropLabel").textContent =
      cropNames[selectedCrop] || selectedCrop;
    document.getElementById("resultBody").textContent = data.result;
    document.getElementById("resultSection").style.display = "block";

    // Scroll to result
    document.getElementById("resultSection").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } catch (err) {
    alert("Something went wrong: " + err.message);
  } finally {
    document.getElementById("askBtnText").classList.remove("hidden");
    document.getElementById("askBtnLoader").classList.add("hidden");
    btn.disabled = false;
  }
});

// ---- INIT ----
loadWeather();