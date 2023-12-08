const PDFDocument = require('pdfkit');
const fs = require('fs');

function createWorkOrderPDF(workOrder, path) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(path));

    doc.font('Helvetica').fontSize(25).text('Work Order', {
      underline: true,
    });

    doc.fontSize(10).text(`Date: ${new Date(workOrder.createdDate).toLocaleDateString()}`);
    doc.text(`Status: ${workOrder.status}`);

    doc.moveDown();
    doc.fontSize(12).text('Items:', { underline: true });
    workOrder.items.forEach((item, index) => {
      doc.fontSize(10).text(`${index + 1}. ${item.inventoryItem.name} - Quantity: ${item.quantity}`);
    });

    doc.moveDown();
    doc.text('QC Signature: ____________________', {
      underline: false,
    });

    doc.end();
    doc.on('finish', () => resolve(path));
    doc.on('error', reject);
  });
}

module.exports = { createWorkOrderPDF };
