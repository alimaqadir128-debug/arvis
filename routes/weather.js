const express = require("express");
const router = express.Router();
const axios = require("axios");

const DISTRICTS = {
  Srinagar:  { q: "Srinagar,IN" },
  Sopore:    { q: "Sopore,IN" },
  Baramulla: { q: "Baramulla,IN" },
  Pampore:   { q: "Pampore,IN" },
  Anantnag:  { q: "Anantnag,IN" },
  Pulwama:   { q: "Pulwama,IN" },
  Shopian:   { q: "Shopian,IN" },
  Kupwara:   { q: "Kupwara,IN" },
  Budgam:    { q: "Budgam,IN" },
  Ganderbal: { q: "Ganderbal,IN" },
};

router.get("/", async (req, res) => {
  const districtName = req.query.district || req.query.city || "Srinagar";
  const district = DISTRICTS[districtName] || DISTRICTS["Srinagar"];

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: district.q,
          appid: process.env.OPENWEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    const d = response.data;
    res.json({
      city: districtName,
      temp: Math.round(d.main.temp),
      feelsLike: Math.round(d.main.feels_like),
      humidity: d.main.humidity,
      description: d.weather[0].description,
      windSpeed: d.wind.speed,
      visibility: Math.round((d.visibility || 10000) / 1000),
    });
  } catch (error) {
    console.error("Weather API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch weather data." });
  }
});

module.exports = router;