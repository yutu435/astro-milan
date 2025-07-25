document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('kundliForm');
  const resultDiv = document.getElementById('kundliResult');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('fullName').value;
      const birthDate = document.getElementById('dob').value;
      const birthTime = document.getElementById('tob').value;
      const lat = parseFloat(document.getElementById('lat').value);
      const lon = parseFloat(document.getElementById('lon').value);
      const timezone = parseFloat(document.getElementById('timezone').value);
      const gender = document.getElementById('gender') ? document.getElementById('gender').value : 'male';
      const payload = { name, birthDate, birthTime, lat, lon, timezone, gender };
      resultDiv.style.display = 'none';
      try {
        const res = await fetch('https://astro-milan-1.onrender.com/api/kundli', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          let errorMsg = `Server error: ${res.status}`;
          try {
            const errJson = await res.json();
            if (errJson && errJson.error) errorMsg = errJson.error;
          } catch {}
          throw new Error(errorMsg);
        }
        const data = await res.json();
        resultDiv.style.display = '';

        // chartTable as 4x3 matrix kundli
        const chartTable = document.getElementById('chartTable');
        if (Array.isArray(data.chart) && chartTable) {
          // Prepare 12 houses (signs)
          const signs = [
            'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
            'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
          ];
          // Map planets to their sign (house)
          const housePlanets = Array.from({length:12}, () => []);
          data.chart.forEach(({ name, degree }) => {
            const signIdx = Math.floor(degree / 30) % 12;
            housePlanets[signIdx].push(name);
          });
          // 4x3 matrix indices for North Indian style (diamond) kundli
          // [0][1][2][3]
          // [11][ -1][ -1][4]
          // [10][ -1][ -1][5]
          // [9][8][7][6]
          const matrix = [
            [0, 1, 2, 3],
            [11, -1, -1, 4],
            [10, -1, -1, 5],
            [9, 8, 7, 6]
          ];
          let html = '<table style="width:100%;table-layout:fixed;text-align:center;font-size:1em;">';
          for (let r = 0; r < 4; r++) {
            html += '<tr>';
            for (let c = 0; c < 4; c++) {
              const idx = matrix[r][c];
              if (idx === -1) {
                html += '<td style="background:#fffde7;border:none;"></td>';
              } else {
                html += `<td style="border:2px solid #ffd600;vertical-align:top;height:60px;min-width:60px;">
                  <div style="font-weight:bold;color:#b71c1c;">${signs[idx]}</div>
                  <div style="font-size:0.95em;color:#2d2d2d;">${housePlanets[idx].join('<br>')}</div>
                </td>`;
              }
            }
            html += '</tr>';
          }
          html += '</table>';
          chartTable.innerHTML = html;
        } else if (chartTable) {
          chartTable.innerHTML = '<p>Not available</p>';
        }

        // lagna
        document.getElementById('lagna').textContent =
          data.lagna && data.lagna.sign
            ? `${data.lagna.sign} (${data.lagna.degree !== undefined ? data.lagna.degree.toFixed(2) : ''}°)`
            : 'Not available';

        // moonSign
        document.getElementById('moonSign').textContent = data.moonSign || 'Not available';

        // rashifal
        document.getElementById('rashifal').textContent = data.rashifal || 'Not available';

        // yogas
        const yogasList = document.getElementById('yogas');
        yogasList.innerHTML = '';
        if (Array.isArray(data.yogas) && data.yogas.length > 0) {
          data.yogas.forEach(yoga => {
            yogasList.innerHTML += `<li><span class="kundli-yoga-name">${yoga.name}</span>: <span class="kundli-yoga-desc">${yoga.description || ''}</span></li>`;
          });
        } else {
          yogasList.innerHTML = '<p>Not available</p>';
        }

        // dasha
        const dashaList = document.getElementById('dasha');
        dashaList.innerHTML = '';
        if (Array.isArray(data.dasha) && data.dasha.length > 0) {
          data.dasha.forEach(period => {
            dashaList.innerHTML += `<li><span class="kundli-dasha-period">${period.planet}</span>: ${period.from} - ${period.to}</li>`;
          });
        } else {
          dashaList.innerHTML = '<p>Not available</p>';
        }

        // transit
        const transitList = document.getElementById('transit');
        transitList.innerHTML = '';
        if (Array.isArray(data.transit) && data.transit.length > 0) {
          data.transit.forEach(tr => {
            transitList.innerHTML += `<li><span class="kundli-transit-planet">${tr.planet}</span>: ${tr.sign} (${tr.degree !== undefined ? tr.degree.toFixed(2) : ''}°)</li>`;
          });
        } else {
          transitList.innerHTML = '<p>Not available</p>';
        }

        // divisional
        const divisionalDiv = document.getElementById('divisional');
        if (data.divisional && typeof data.divisional === 'object') {
          let html = '';
          for (const [chart, value] of Object.entries(data.divisional)) {
            html += `<div class="kundli-divisional-title">${chart}</div>`;
            html += `<pre>${JSON.stringify(value, null, 2)}</pre>`;
          }
          divisionalDiv.innerHTML = html;
        } else {
          divisionalDiv.innerHTML = '<p>Not available</p>';
        }

        // Save Kundli button handler (update URL)
        document.getElementById('saveKundliBtn').onclick = async function() {
          const kundli = window._lastKundliData;
          if (!kundli) return alert('No kundli data to save!');
          try {
            const res = await fetch('https://astro-milan-1.onrender.com/api/save-kundli', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(kundli)
            });
            if (!res.ok) throw new Error('Failed to save kundli');
            alert('Kundli saved successfully!');
          } catch (e) {
            alert('Error saving kundli: ' + (e.message || e));
          }
        };
      } catch (err) {
        console.error('Failed to fetch:', err);
        resultDiv.style.display = '';
        resultDiv.innerHTML = '<div style="color:red;">Error fetching kundli: ' + (err.message || err) + '</div>';
      }
    });
  }
});
