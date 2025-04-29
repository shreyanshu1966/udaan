import html2pdf from 'html2pdf.js';

export const generatePDF = (elementId, fileName) => {
  const element = document.getElementById(elementId);
  
  const opt = {
    margin: [0.5, 0.5],
    filename: fileName,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { 
      scale: 2,
      logging: false,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  return html2pdf()
    .set(opt)
    .from(element)
    .toPdf()
    .get('pdf')
    .then((pdf) => {
      // Add page numbers
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128);
        pdf.text(
          `Page ${i} of ${totalPages}`, 
          pdf.internal.pageSize.getWidth() / 2, 
          pdf.internal.pageSize.getHeight() - 0.3,
          { align: 'center' }
        );
      }
    })
    .save();
};