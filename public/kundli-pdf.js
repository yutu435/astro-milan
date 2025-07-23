// kundli-pdf.js: Handles PDF download with watermark for kundli
// Requires jsPDF and html2canvas (or html2pdf)


async function downloadKundliPDF() {
  const kundliResult = document.getElementById('kundliResult');
  if (!kundliResult) return;

  // Clone the node and add watermark only for PDF
  const clone = kundliResult.cloneNode(true);
  clone.style.display = 'block';
  clone.style.position = 'fixed';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  clone.style.width = '700px';
  clone.style.minHeight = kundliResult.offsetHeight + 'px';
  clone.style.background = '#fff';
  clone.style.color = '#2d2d2d';
  clone.style.boxSizing = 'border-box';
  // Add page-break CSS to kundli-section
  Array.from(clone.querySelectorAll('.kundli-section')).forEach(sec => {
    sec.style.pageBreakInside = 'avoid';
    sec.style.breakInside = 'avoid';
    sec.style.overflow = 'visible';
    sec.style.maxWidth = '100%';
  });
  // Add watermark
  const watermark = document.createElement('div');
  watermark.textContent = 'ASTRO MILAN';
  watermark.style.position = 'absolute';
  watermark.style.top = '50%';
  watermark.style.left = '50%';
  watermark.style.transform = 'translate(-50%, -50%) rotate(-30deg)';
  watermark.style.fontSize = '3rem';
  watermark.style.color = 'rgba(229,57,53,0.13)';
  watermark.style.fontWeight = 'bold';
  watermark.style.pointerEvents = 'none';
  watermark.style.zIndex = '1000';
  watermark.style.width = '100%';
  watermark.style.textAlign = 'center';
  clone.appendChild(watermark);

  // Attach clone to DOM off-screen
  document.body.appendChild(clone);

  // Use html2pdf with auto page height
  await html2pdf().set({
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: 'kundli.pdf',
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fff',
      logging: false
    },
    jsPDF: {
      unit: 'in',
      format: 'a4',
      orientation: 'portrait',
      putOnlyUsedFonts: true,
      compress: true
    },
    pagebreak: { mode: ['css', 'legacy'] }
  }).from(clone).save();

  // Remove clone after PDF is generated
  document.body.removeChild(clone);
}

window.downloadKundliPDF = downloadKundliPDF;
