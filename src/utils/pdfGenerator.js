import html2pdf from 'html2pdf.js';

export const generatePDF = (elementId, fileName) => {
  const element = document.getElementById(elementId);
  
  const opt = {
    margin: 1,
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  return html2pdf().set(opt).from(element).save();
};