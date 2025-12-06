import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const generatePdf = async (fileName: string = "report") => {
  const pages = ['report-page-1', 'report-page-2'];
  
  // Create standard A4 PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Create a container for the clones that is off-screen but part of the DOM
  // This ensures fonts and styles are computed correctly without being affected by the main app's layout/scaling
  const cloneContainer = document.createElement('div');
  cloneContainer.style.position = 'absolute';
  cloneContainer.style.top = '-9999px';
  cloneContainer.style.left = '-9999px';
  cloneContainer.style.width = '210mm'; // Force A4 width
  document.body.appendChild(cloneContainer);

  try {
    for (let i = 0; i < pages.length; i++) {
      const originalElement = document.getElementById(pages[i]);
      if (!originalElement) continue;

      // Deep clone the element
      const clone = originalElement.cloneNode(true) as HTMLElement;
      
      // Reset any transforms or scaling that might be on the original element's parents
      // We do this by putting the clone in a clean container
      clone.style.transform = 'none';
      clone.style.margin = '0';
      clone.style.boxShadow = 'none';
      
      // Add to the off-screen container
      cloneContainer.appendChild(clone);

      // Capture the clone
      const canvas = await html2canvas(clone, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794, // 210mm at 96 DPI (standard screen)
        height: 1123, // 297mm at 96 DPI
        windowWidth: 794, 
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      // Clean up the clone for the next iteration
      cloneContainer.removeChild(clone);
    }

    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    // Always clean up the container
    document.body.removeChild(cloneContainer);
  }
};