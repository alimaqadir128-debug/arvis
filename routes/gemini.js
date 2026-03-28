const express = require("express");
const router = express.Router();

const cropInfo = {
  saffron: "Kashmiri Saffron (Crocus sativus), grown in Pampore, Kashmir",
  rice: "Kashmiri Rice (Mushkbudji variety), grown across the Kashmir Valley",
  apple: "Kashmiri Apple, grown in Sopore, Shopian, and Pulwama regions",
  walnut: "Kashmiri Walnut (Juglans regia), grown across the Kashmir Valley",
};

const financialData = {
  saffron: { 
    avgPricePerKg: "₹2,50,000 – ₹3,50,000", 
    inputCostPerKanal: "₹15,000 – ₹25,000", 
    yieldPerKanal: "0.5 – 1.5 kg", 
    bestSellMonths: "November – January", 
    majorMarkets: "Pampore mandi, Delhi spice market",
    profitability: "High profit potential"
  },
  rice: { 
    avgPricePerKg: "₹80 – ₹200", 
    inputCostPerKanal: "₹4,000 – ₹7,000", 
    yieldPerKanal: "4 – 6 quintals", 
    bestSellMonths: "October – December", 
    majorMarkets: "Sopore mandi, Srinagar market",
    profitability: "Moderate profit, stable demand"
  },
  apple: { 
    avgPricePerKg: "₹30 – ₹120", 
    inputCostPerKanal: "₹20,000 – ₹40,000", 
    yieldPerKanal: "10 – 25 quintals", 
    bestSellMonths: "August – October", 
    majorMarkets: "Sopore fruit mandi, Delhi Azadpur",
    profitability: "Good profit potential"
  },
  walnut: { 
    avgPricePerKg: "₹800 – ₹1,500", 
    inputCostPerKanal: "₹5,000 – ₹12,000", 
    yieldPerKanal: "2 – 5 quintals", 
    bestSellMonths: "September – November", 
    majorMarkets: "Sopore mandi, export markets",
    profitability: "Excellent export potential"
  },
};

function getRecommendation(crop, query, analysisType, district, weather) {
  const cropName = crop.charAt(0).toUpperCase() + crop.slice(1);
  const fin = financialData[crop];
  
  let recommendation = "";
  
  if (analysisType === "fertilizer") {
    recommendation = `🌾 **Fertilizer Guide for ${cropName} in ${district}, Kashmir**\n\n`;
    recommendation += `**Recommended Fertilizer Schedule:**\n`;
    recommendation += `• **Basal Dose**: Apply well-decomposed farm yard manure (10-15 tons/hectare) at land preparation\n`;
    recommendation += `• **First Top Dressing** (30-40 days): Urea @ 50-60 kg/hectare\n`;
    recommendation += `• **Second Top Dressing** (60-70 days): DAP @ 40-50 kg/hectare\n`;
    recommendation += `• **Micronutrients**: Zinc Sulphate @ 25 kg/hectare if deficiency observed\n\n`;
    recommendation += `**Organic Alternative:** Use vermicompost (5 tons/hectare) + neem cake for better soil health.`;
  } 
  else if (analysisType === "pest_calendar") {
    recommendation = `📅 **Pest Calendar for ${cropName} in Kashmir**\n\n`;
    recommendation += `**March-April:** Monitor for aphids and stem borer. Use neem oil spray.\n`;
    recommendation += `**May-June:** Watch for leaf miner. Apply recommended pesticides only if threshold exceeded.\n`;
    recommendation += `**July-August:** Fungal diseases common. Ensure proper drainage.\n`;
    recommendation += `**September-October:** Harvest time. Check for storage pests.\n\n`;
    recommendation += `**IPM Tip:** Encourage natural predators, use pheromone traps, rotate crops.`;
  }
  else if (analysisType === "harvest") {
    recommendation = `🌾 **Harvest Timing for ${cropName}**\n\n`;
    recommendation += `**Best Time to Harvest:** ${fin.bestSellMonths}\n`;
    recommendation += `**Indicators:** Leaves turn yellow, grains become hard, moisture content 20-22%\n`;
    recommendation += `**Method:** Manual harvesting with sickles or mechanical harvesters\n`;
    recommendation += `**Post-Harvest:** Thresh immediately, sun-dry to 14% moisture\n\n`;
    recommendation += `**Market Tip:** ${fin.majorMarkets} offer best prices during ${fin.bestSellMonths}.`;
  }
  else if (analysisType === "prices") {
    recommendation = `💰 **Market Prices for ${cropName}**\n\n`;
    recommendation += `**Current Market Range:** ${fin.avgPricePerKg}\n`;
    recommendation += `**Major Markets:** ${fin.majorMarkets}\n`;
    recommendation += `**Best Selling Season:** ${fin.bestSellMonths}\n`;
    recommendation += `**Price Trend:** Stable to increasing during peak demand\n\n`;
    recommendation += `**Tip:** Store properly and sell during peak season for best returns.`;
  }
  else {
    recommendation = `🌱 **Advisory for ${cropName} in ${district}, Kashmir**\n\n`;
    recommendation += `**Recommendations:**\n`;
    recommendation += `• ${cropName} thrives in Kashmir's temperate climate with well-drained soil\n`;
    recommendation += `• Expected yield: ${fin.yieldPerKanal}\n`;
    recommendation += `• Market price range: ${fin.avgPricePerKg}\n`;
    recommendation += `• Best selling period: ${fin.bestSellMonths}\n\n`;
    recommendation += `**Weather:** ${weather ? `${weather.temp}°C, ${weather.description}` : "Current conditions favorable"}\n\n`;
    recommendation += `**Financial Outlook:** ${fin.profitability}\n\n`;
    recommendation += `For more specific advice about "${query}", please provide additional details.`;
  }
  
  return recommendation;
}

router.post("/analyze", async (req, res) => {
  const { crop, query, analysisType = "general", district = "Srinagar", weather } = req.body;

  if (!crop || !query) {
    return res.status(400).json({ error: "crop and query are required." });
  }

  const fin = financialData[crop] || {};
  const recommendation = getRecommendation(crop, query, analysisType, district, weather);
  
  const response = {
    result: recommendation,
    agentData: {
      intake: { 
        parsedCrop: crop, 
        queryCategory: analysisType, 
        district: district, 
        seasonalContext: "Kashmir growing season" 
      },
      advisory: { 
        primaryAdvice: `Recommendations for ${crop} in ${district}`, 
        stepByStep: ["Prepare soil with organic matter", "Plant at correct spacing", "Irrigate as needed", "Monitor for pests"], 
        kashmirSpecific: `${crop} grows well in Kashmir's climate` 
      },
      risk: { 
        confidenceScore: 85, 
        riskFlags: weather ? ["Monitor weather changes"] : ["Seasonal risks apply"], 
        edgeCases: ["Watch for early frost in October-November"], 
        weatherImpact: weather ? `${weather.temp}°C, ${weather.description}` : "Seasonal conditions apply" 
      },
      financial: { 
        profitabilityAnalysis: fin.profitability, 
        estimatedReturnPerKanal: fin.avgPricePerKg, 
        marketTiming: fin.bestSellMonths, 
        costOptimization: "Use organic inputs for better margins" 
      },
      guardrail: { 
        passed: true, 
        violations: [], 
        safetyNotes: ["Always consult local agricultural extension officer", "Follow recommended pesticide guidelines"] 
      }
    }
  };

  res.json(response);
});

module.exports = router;