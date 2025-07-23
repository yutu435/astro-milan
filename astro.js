const swe = require('swisseph');
// Ephemeris data ka path set karo
swe.swe_set_ephe_path(__dirname + '/ephe');  // ✅ सही function नाम
// Example: sun position calculate karna
const date = {
  year: 2023,
  month: 7,
  day: 22,
  hour: 12.0
};

swe.swe_julday(date.year, date.month, date.day, date.hour, swe.SE_GREG_CAL, (jd_ut) => {
  swe.swe_calc_ut(jd_ut, swe.SE_SUN, swe.SEFLG_SWIEPH, (result) => {
    console.log("☀️ Sun position:", result);
  });
});

const PLANETS = [
  { name: 'सूर्य', id: swe.SE_SUN },
  { name: 'चंद्र', id: swe.SE_MOON },
  { name: 'मंगल', id: swe.SE_MARS },
  { name: 'बुध', id: swe.SE_MERCURY },
  { name: 'गुरु', id: swe.SE_JUPITER },
  { name: 'शुक्र', id: swe.SE_VENUS },
  { name: 'शनि', id: swe.SE_SATURN },
  { name: 'राहु', id: swe.SE_MEAN_NODE },
  { name: 'केतु', id: swe.SE_TRUE_NODE }
];

const HINDI_SIGNS = [
  'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
  'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

function getSign(degree) {
  return HINDI_SIGNS[Math.floor(degree / 30) % 12];
}

function getRashifal(sign) {
  const rashis = {
    'मेष': 'ऊर्जावान, साहसी, नेतृत्वकर्ता',
    'वृषभ': 'धैर्यवान, स्थिर, भौतिकवादी',
    'मिथुन': 'बुद्धिमान, संवादप्रिय, चंचल',
    'कर्क': 'संवेदनशील, भावुक, परिवारप्रिय',
    'सिंह': 'गौरवशाली, आत्मविश्वासी, रचनात्मक',
    'कन्या': 'विश्लेषणात्मक, व्यवस्थित, व्यावहारिक',
    'तुला': 'संतुलित, आकर्षक, न्यायप्रिय',
    'वृश्चिक': 'गूढ़, तीव्र, रहस्यमयी',
    'धनु': 'आशावादी, स्वतंत्र, दार्शनिक',
    'मकर': 'महत्वाकांक्षी, अनुशासित, व्यावसायिक',
    'कुंभ': 'नवोन्मेषी, मानवीय, स्वतंत्र विचारक',
    'मीन': 'कल्पनाशील, दयालु, आध्यात्मिक'
  };
  return rashis[sign] || '';
}

// Vimshottari Dasha logic
function calculateVimshottariDasha(jd, moonLongitude, birthYear, birthMonth, birthDay) {
  // Nakshatra data
  const NAKSHATRAS = [
    { name: 'Krittika', lord: 'सूर्य', span: 13 + 20/60 },
    { name: 'Rohini', lord: 'चंद्र', span: 13 + 20/60 },
    { name: 'Mrigashira', lord: 'मंगल', span: 13 + 20/60 },
    { name: 'Ardra', lord: 'राहु', span: 13 + 20/60 },
    { name: 'Punarvasu', lord: 'गुरु', span: 13 + 20/60 },
    { name: 'Pushya', lord: 'शनि', span: 13 + 20/60 },
    { name: 'Ashlesha', lord: 'बुध', span: 13 + 20/60 },
    { name: 'Magha', lord: 'केतु', span: 13 + 20/60 },
    { name: 'Purva Phalguni', lord: 'शुक्र', span: 13 + 20/60 },
    { name: 'Uttara Phalguni', lord: 'सूर्य', span: 13 + 20/60 },
    { name: 'Hasta', lord: 'चंद्र', span: 13 + 20/60 },
    { name: 'Chitra', lord: 'मंगल', span: 13 + 20/60 },
    { name: 'Swati', lord: 'राहु', span: 13 + 20/60 },
    { name: 'Vishakha', lord: 'गुरु', span: 13 + 20/60 },
    { name: 'Anuradha', lord: 'शनि', span: 13 + 20/60 },
    { name: 'Jyeshtha', lord: 'बुध', span: 13 + 20/60 },
    { name: 'Mula', lord: 'केतु', span: 13 + 20/60 },
    { name: 'Purva Ashadha', lord: 'शुक्र', span: 13 + 20/60 },
    { name: 'Uttara Ashadha', lord: 'सूर्य', span: 13 + 20/60 },
    { name: 'Shravana', lord: 'चंद्र', span: 13 + 20/60 },
    { name: 'Dhanishta', lord: 'मंगल', span: 13 + 20/60 },
    { name: 'Shatabhisha', lord: 'राहु', span: 13 + 20/60 },
    { name: 'Purva Bhadrapada', lord: 'गुरु', span: 13 + 20/60 },
    { name: 'Uttara Bhadrapada', lord: 'शनि', span: 13 + 20/60 },
    { name: 'Revati', lord: 'बुध', span: 13 + 20/60 }
  ];
  // Vimshottari order and years
  const D_ORD = ['केतु','शुक्र','सूर्य','चंद्र','मंगल','राहु','गुरु','शनि','बुध'];
  const D_YEARS = { 'केतु':7, 'शुक्र':20, 'सूर्य':6, 'चंद्र':10, 'मंगल':7, 'राहु':18, 'गुरु':16, 'शनि':19, 'बुध':17 };

  // Find nakshatra index and pada
  const nakLen = 13 + 20/60; // 13°20'
  let nakNum = Math.floor(moonLongitude / nakLen);
  let nakDeg = moonLongitude % nakLen;
  let pada = Math.floor((moonLongitude % nakLen) / (nakLen/4)) + 1;
  let nak = NAKSHATRAS[nakNum];
  let lord = nak.lord;

  // Find dasha order starting from lord
  let startIdx = D_ORD.indexOf(lord);
  let dashaSeq = [];
  for(let i=0; i<9; i++) {
    dashaSeq.push(D_ORD[(startIdx + i)%9]);
  }

  // Calculate balance of first dasha
  let part = (moonLongitude % nakLen) / nakLen;
  let balance = 1 - part; // fraction left in nakshatra
  let firstYears = D_YEARS[lord] * balance;

  // Start date
  let startDate = new Date(birthYear, birthMonth-1, birthDay);
  let dashaList = [];
  let currDate = new Date(startDate);
  // First dasha
  let endDate = new Date(currDate);
  endDate.setFullYear(endDate.getFullYear() + Math.floor(firstYears));
  endDate.setMonth(endDate.getMonth() + Math.round((firstYears % 1) * 12));
  dashaList.push({
    planet: lord,
    from: currDate.toISOString().slice(0,10),
    to: endDate.toISOString().slice(0,10)
  });
  currDate = new Date(endDate);
  // Next dashas
  for(let i=1; i<9; i++) {
    let pl = dashaSeq[i];
    let years = D_YEARS[pl];
    let nextEnd = new Date(currDate);
    nextEnd.setFullYear(nextEnd.getFullYear() + years);
    dashaList.push({
      planet: pl,
      from: currDate.toISOString().slice(0,10),
      to: nextEnd.toISOString().slice(0,10)
    });
    currDate = new Date(nextEnd);
  }
  return dashaList;
}

// Identify yogas like Gajakesari, Budhaditya, etc.
function checkYogas(planets) {
  const yogas = [];
  // Gajakesari Yoga: Jupiter in Kendra from Moon (1, 4, 7, 10)
  if (planets['गुरु'] && planets['चंद्र']) {
    const diff = Math.abs(planets['गुरु'].signNum - planets['चंद्र'].signNum) % 12;
    if ([0, 3, 6, 9].includes(diff)) {
      yogas.push({
        name: 'गजकेसरी योग',
        description: 'गुरु (बृहस्पति) चंद्रमा से केंद्र (1, 4, 7, 10) में है'
      });
    }
  }
  // Budhaditya Yoga: Sun and Mercury in same sign
  if (planets['सूर्य'] && planets['बुध']) {
    if (planets['सूर्य'].signNum === planets['बुध'].signNum) {
      yogas.push({
        name: 'बुधादित्य योग',
        description: 'सूर्य और बुध एक ही राशि में हैं'
      });
    }
  }
  // Add more yogas as needed...
  return yogas;
}

async function generateKundli({ name, birthDate, birthTime, lat, lon, timezone, gender }) {
  try {
    // 1. Julian Day
    const [y, m, d] = birthDate.split('-').map(Number);
    const [hh, mm] = birthTime.split(':').map(Number);
    const ut = hh + mm / 60 - timezone;
    const jd = swe.swe_julday(y, m, d, ut, swe.SE_GREG_CAL);

    // 2. Planetary positions (real, array of 9 planets)
    const chartArr = [];
    const chartObj = {};
    const planetSigns = {};
    for (const planet of PLANETS) {
      const degree = await new Promise((resolve, reject) => {
        swe.swe_calc_ut(jd, planet.id, 0, (res) => {
          if (res.error) reject(new Error('Ephemeris data missing or corrupt for ' + planet.name));
          else resolve(res.longitude);
        });
      });
      chartArr.push({ name: planet.name, degree });
      chartObj[planet.name] = degree;
      planetSigns[planet.name] = {
        degree,
        signNum: Math.floor(degree / 30)
      };
    }

    // 3. Lagna (ascendant)
    const lagnaDegree = await new Promise((resolve, reject) => {
      swe.swe_houses(jd, lat, lon, 'P', (res) => {
        if (res.error) reject(new Error('Ephemeris data missing or corrupt for Lagna'));
        else resolve(res.ascendant);
      });
    });
    const lagnaSign = getSign(lagnaDegree);

    // 4. Moon sign
    const moonSign = getSign(chartObj['चंद्र']);

    // 5. Rashifal (based on moon sign)
    const rashifal = getRashifal(moonSign);

    // 6. Yogas (use checkYogas)
    const yogas = checkYogas(planetSigns);

    // 7. Dasha (real Vimshottari)
    const [by, bm, bd] = birthDate.split('-').map(Number);
    const dasha = calculateVimshottariDasha(jd, chartObj['चंद्र'], by, bm, bd);

    // 8. Transit (current planetary positions, all major planets)
    const now = new Date();
    const ty = now.getUTCFullYear();
    const tm = now.getUTCMonth() + 1;
    const td = now.getUTCDate();
    const tut = now.getUTCHours() + now.getUTCMinutes() / 60;
    const t_jd = swe.swe_julday(ty, tm, td, tut, swe.SE_GREG_CAL);
    const transitArr = [];
    for (const planet of PLANETS) {
      const tDegree = await new Promise((resolve, reject) => {
        swe.swe_calc_ut(t_jd, planet.id, 0, (res) => {
          if (res.error) reject(new Error('Ephemeris data missing or corrupt for transit ' + planet.name));
          else resolve(res.longitude);
        });
      });
      transitArr.push({
        planet: planet.name,
        degree: tDegree,
        sign: getSign(tDegree)
      });
    }

    // 9. Divisional charts (D1, D9, D10, D7)
    function getD9(degree) {
      const sign = Math.floor(degree / 30);
      const amsha = Math.floor((degree % 30) / (30 / 9));
      return (sign * 9 + amsha) % 12;
    }
    function getD10(degree) {
      const sign = Math.floor(degree / 30);
      const amsha = Math.floor((degree % 30) / 3);
      return (sign < 6 ? (sign * 10 + amsha) : ((sign - 6) * 10 + amsha)) % 12;
    }
    function getD7(degree) {
      const sign = Math.floor(degree / 30);
      const amsha = Math.floor((degree % 30) / (30 / 7));
      return ((sign % 2 === 0)
        ? (sign * 7 + amsha)
        : (sign * 7 + (6 - amsha))) % 12;
    }
    const divisional = { D1: {}, D9: {}, D10: {}, D7: {} };
    for (const planet of PLANETS) {
      const deg = chartObj[planet.name];
      divisional.D1[planet.name] = { degree: deg, sign: getSign(deg) };
      divisional.D9[planet.name] = { sign: HINDI_SIGNS[getD9(deg)] };
      divisional.D10[planet.name] = { sign: HINDI_SIGNS[getD10(deg)] };
      divisional.D7[planet.name] = { sign: HINDI_SIGNS[getD7(deg)] };
    }

    return {
      name,
      gender,
      birthDate,
      birthTime,
      birthPlace: { lat, lon, timezone },
      chart: chartArr,
      lagna: { sign: lagnaSign, degree: lagnaDegree },
      moonSign,
      rashifal,
      yogas,
      dasha,
      transit: transitArr,
      divisional
    };
  } catch (err) {
    return { error: err.message || 'Ephemeris data missing or calculation error.' };
  }
}

// Calculate transit positions of major planets for today's date
async function getCurrentTransits() {
  const today = new Date();
  const jd = swe.swe_julday(today.getFullYear(), today.getMonth() + 1, today.getDate(), 0, swe.SE_GREG_CAL);
  // Use correct swisseph IDs for Rahu/Ketu
  const planetDefs = [
    { name: 'सूर्य', id: swe.SE_SUN },
    { name: 'चंद्र', id: swe.SE_MOON },
    { name: 'मंगल', id: swe.SE_MARS },
    { name: 'गुरु', id: swe.SE_JUPITER },
    { name: 'शनि', id: swe.SE_SATURN },
    { name: 'राहु', id: swe.SE_MEAN_NODE },
    { name: 'केतु', id: swe.SE_TRUE_NODE }
  ];

  let results = [];
  for (let i = 0; i < planetDefs.length; i++) {
    const planet = planetDefs[i];
    const pos = await new Promise((resolve, reject) => {
      swe.swe_calc_ut(jd, planet.id, 0, (res) => {
        if (res.error) reject(res.error);
        else resolve(res);
      });
    });
    results.push({
      planet: planet.name,
      degree: pos.longitude,
      sign: getSign(pos.longitude)
    });
  }
  return results;
}

module.exports = { generateKundli };
