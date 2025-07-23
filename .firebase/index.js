const maitreya = require('maitreya');

const birthDetails = {
  date: '2000-01-15',      // YYYY-MM-DD format
  time: '14:30',           // 24-hour format: HH:mm
  timezone: 5.5,           // India = 5.5 (IST)
  latitude: 25.3176,       // Varanasi
  longitude: 82.9739       // Varanasi
};

maitreya.getHoroscope(birthDetails)
  .then(horoscope => {
    console.log("🌟 Janam Kundali Details:");
    console.log(JSON.stringify(horoscope, null, 2));
  })
  .catch(err => {
    console.error("❌ Error generating Kundali:", err);
  });
  const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors()); // <-- yeh line add karo

app.use(express.json());

// Baaki routes
app.post("/generate-kundli", (req, res) => {
  // Tumhara logic
});