// In-memory kundli storage
const kundliStore = [];
const express = require('express');
const cors = require('cors');
const path = require('path');
const { generateKundli } = require('./astro');


const app = express();
const PORT = 5500;


// Save Kundli endpoint
app.post('/api/save-kundli', (req, res) => {
  const kundliData = req.body;
  // Basic validation for required fields
  if (!kundliData || !kundliData.name || !kundliData.birthDate || !kundliData.birthTime || !kundliData.gender || typeof kundliData.lat !== 'number' || typeof kundliData.lon !== 'number' || typeof kundliData.timezone !== 'number') {
    return res.status(400).json({ error: 'Invalid kundli data.' });
  }
  kundliStore.push({ ...kundliData, savedAt: new Date().toISOString() });
  console.log(`Kundli saved for: ${kundliData.name} (Success)`);
  return res.status(200).json({ message: 'Kundli saved successfully' });
});

app.use(cors({
  origin: [
    "https://astrotalk-46cd1.web.app",
    "http://localhost:5500"
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve kundli.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kundli.html'));
});

app.post('/api/kundli', async (req, res) => {
  const { name, birthDate, birthTime, lat, lon, timezone, gender } = req.body;
  if (!name || !birthDate || !birthTime || typeof lat !== 'number' || typeof lon !== 'number' || typeof timezone !== 'number' || !gender) {
    return res.status(400).json({ error: 'Missing or invalid required fields.' });
  }
  try {
    const kundli = await generateKundli({ name, birthDate, birthTime, lat, lon, timezone, gender });
    res.json(kundli);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Astro Milan server running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please stop the other process or use a different port.`);
    process.exit(1);
  } else {
    throw err;
  }
});
