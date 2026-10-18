import { jsPDF } from 'jspdf';
import { CluedoProject, CARD_DIMENSIONS } from '../types/cluedo.ts';
import { getDuplexBackIndex } from './cluedoRules.ts';

/**
 * Generates a ready-to-print vector PDF for cardstock duplex printing.
 */
export async function generateDuplexCardsPdf(project: CluedoProject): Promise<Blob> {
  const settings = project.printSettings;
  const isA4 = settings.paperSize === 'a4';
  const pageWidth = isA4 ? 210 : 215.9;
  const pageHeight = isA4 ? 297 : 279.4;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: settings.paperSize === 'a4' ? 'a4' : 'letter',
  });

  const cardDim = CARD_DIMENSIONS[settings.cardSize] || CARD_DIMENSIONS.hasbro_classic;
  const cardW = cardDim.widthMm;
  const cardH = cardDim.heightMm;

  // Layout: 3 columns x 3 rows = 9 cards per sheet (or 2x3 depending on card size)
  const cols = 3;
  const rows = 3;
  const cardsPerPage = cols * rows;

  // Margin calculation to center grid on paper
  const totalGridW = cols * cardW;
  const totalGridH = rows * cardH;
  const startX = Math.max(5, (pageWidth - totalGridW) / 2);
  const startY = Math.max(5, (pageHeight - totalGridH) / 2);

  const cards = project.cards;
  const totalPages = Math.ceil(cards.length / cardsPerPage);

  for (let p = 0; p < totalPages; p++) {
    // --- FRONT PAGE ---
    if (p > 0) doc.addPage();
    drawCutMarks(doc, cols, rows, cardW, cardH, startX, startY, pageWidth, pageHeight);

    const pageCards = cards.slice(p * cardsPerPage, (p + 1) * cardsPerPage);

    for (let i = 0; i < pageCards.length; i++) {
      const card = pageCards[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * cardW;
      const y = startY + row * cardH;

      drawSingleCardFrontPdf(doc, card, x, y, cardW, cardH, settings.showCardIdCode);
    }

    // --- BACK PAGE (MIRRORED FOR DUPLEX PRINTING) ---
    if (settings.duplexMode === 'front_and_back_pages') {
      doc.addPage();
      drawCutMarks(doc, cols, rows, cardW, cardH, startX, startY, pageWidth, pageHeight);

      for (let i = 0; i < pageCards.length; i++) {
        // Mirrored column index for duplex alignment
        const mirroredCol = cols - 1 - (i % cols);
        const row = Math.floor(i / cols);
        const x = startX + mirroredCol * cardW;
        const y = startY + row * cardH;

        drawSingleCardBackPdf(doc, pageCards[i], x, y, cardW, cardH, project.name);
      }
    }
  }

  return doc.output('blob');
}

/**
 * Draws sharp, professional crop cut marks at grid intersections and outer borders
 */
function drawCutMarks(
  doc: jsPDF,
  cols: number,
  rows: number,
  w: number,
  h: number,
  startX: number,
  startY: number,
  pageW: number,
  pageH: number
) {
  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(0.15);
  const markLen = 3.5;

  // Vertical lines
  for (let c = 0; c <= cols; c++) {
    const x = startX + c * w;
    // Top mark
    doc.line(x, Math.max(1, startY - markLen), x, startY);
    // Bottom mark
    doc.line(x, startY + rows * h, x, Math.min(pageH - 1, startY + rows * h + markLen));
  }

  // Horizontal lines
  for (let r = 0; r <= rows; r++) {
    const y = startY + r * h;
    // Left mark
    doc.line(Math.max(1, startX - markLen), y, startX, y);
    // Right mark
    doc.line(startX + cols * w, y, Math.min(pageW - 1, startX + cols * w + markLen), y);
  }
}

/**
 * Draws high-fidelity Hasbro Cluedo Card Front
 */
function drawSingleCardFrontPdf(
  doc: jsPDF,
  card: any,
  x: number,
  y: number,
  w: number,
  h: number,
  showCode = true
) {
  // Bleed / Outer border
  doc.setFillColor(252, 250, 246); // Vintage Ivory Cardstock
  doc.roundedRect(x + 0.5, y + 0.5, w - 1, h - 1, 2, 2, 'F');

  // Outer Gold Decorative Border
  doc.setDrawColor(200, 155, 60); // Antique Cluedo Gold
  doc.setLineWidth(0.7);
  doc.roundedRect(x + 1.8, y + 1.8, w - 3.6, h - 3.6, 1.5, 1.5, 'D');

  // Inner Fine Border
  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(0.2);
  doc.rect(x + 2.8, y + 2.8, w - 5.6, h - 5.6, 'D');

  // Top Category Banner
  const categoryBg = hexToRgb(card.color || '#B91C1C');
  doc.setFillColor(categoryBg.r, categoryBg.g, categoryBg.b);
  doc.rect(x + 3.2, y + 3.2, w - 6.4, 6.5, 'F');

  // Category Badge Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(7.5);
  const badgeLabel = (card.badgeText || card.category).toUpperCase();
  doc.text(badgeLabel, x + w / 2, y + 7.8, { align: 'center' });

  // Artwork Central Box
  const artY = y + 11.5;
  const artH = h * 0.44;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(x + 4.5, artY, w - 9, artH, 1, 1, 'F');
  doc.setDrawColor(210, 180, 110);
  doc.setLineWidth(0.3);
  doc.roundedRect(x + 4.5, artY, w - 9, artH, 1, 1, 'D');

  // Draw Card Name Banner
  doc.setFillColor(categoryBg.r, categoryBg.g, categoryBg.b);
  doc.rect(x + 4, artY + artH + 1.5, w - 8, 6.8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(8.5);
  doc.text(card.name, x + w / 2, artY + artH + 6, { align: 'center' });

  // Subtitle / Trait
  if (card.subtitle) {
    doc.setTextColor(90, 70, 40);
    doc.setFont('times', 'italic');
    doc.setFontSize(6);
    doc.text(card.subtitle, x + w / 2, artY + artH + 11, { align: 'center' });
  }

  // Description / Clue / Alibi Box
  if (card.description) {
    doc.setTextColor(45, 45, 45);
    doc.setFont('times', 'normal');
    doc.setFontSize(5.5);
    const splitText = doc.splitTextToSize(card.description, w - 10);
    doc.text(splitText, x + 5, artY + artH + 14.5);
  }

  // Bottom Card ID / Authentic Hasbro Label
  if (showCode && card.cardIdCode) {
    doc.setTextColor(140, 120, 90);
    doc.setFont('courier', 'bold');
    doc.setFontSize(5);
    doc.text(card.cardIdCode, x + 5, y + h - 4);
    doc.setFont('times', 'italic');
    doc.text('CLUEDO • CARD STUDIO PRO', x + w - 5, y + h - 4, { align: 'right' });
  }
}

/**
 * Draws Authentic Cluedo Card Back with luxury Victorian pattern and iconic logo
 */
function drawSingleCardBackPdf(
  doc: jsPDF,
  card: any,
  x: number,
  y: number,
  w: number,
  h: number,
  projectName: string
) {
  // Deep Rich Bordeaux / Vintage Cluedo Red
  doc.setFillColor(90, 12, 18);
  doc.roundedRect(x + 0.5, y + 0.5, w - 1, h - 1, 2, 2, 'F');

  // Double Gold Filigree Border
  doc.setDrawColor(218, 165, 32); // Gold
  doc.setLineWidth(0.8);
  doc.roundedRect(x + 2.5, y + 2.5, w - 5, h - 5, 1.5, 1.5, 'D');

  doc.setDrawColor(245, 215, 110);
  doc.setLineWidth(0.2);
  doc.roundedRect(x + 3.5, y + 3.5, w - 7, h - 7, 1, 1, 'D');

  // Center Emblem Oval
  const centerX = x + w / 2;
  const centerY = y + h / 2;

  doc.setFillColor(50, 6, 10);
  doc.setDrawColor(218, 165, 32);
  doc.setLineWidth(0.6);
  doc.ellipse(centerX, centerY, w * 0.36, h * 0.28, 'FD');

  // Iconic Magnifying Glass silhouette in center
  doc.setDrawColor(245, 215, 110);
  doc.setLineWidth(0.6);
  doc.circle(centerX, centerY - 6, 9, 'D');
  doc.line(centerX + 6.5, centerY, centerX + 15, centerY + 10);

  // CLUEDO Classic Logo
  doc.setTextColor(245, 215, 110);
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('CLUEDO', centerX, centerY + 8, { align: 'center' });

  // Subtitle
  doc.setFont('times', 'italic');
  doc.setFontSize(5);
  doc.setTextColor(230, 200, 120);
  doc.text('EDIZIONE MISTERI & CASI', centerX, centerY + 12, { align: 'center' });
  doc.text('TUDOR MANSION', centerX, centerY + 15, { align: 'center' });
}

/**
 * Generates printable Detective Sheet (Taccuino Indagini Cluedo) in PDF
 */
export async function generateDetectiveSheetPdf(project: CluedoProject): Promise<Blob> {
  const isA4 = project.printSettings.paperSize === 'a4';
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: isA4 ? 'a4' : 'letter',
  });

  const pageWidth = isA4 ? 210 : 215.9;
  const pageHeight = isA4 ? 297 : 279.4;

  // Render 2x2 = 4 sheets per A4 page!
  const sheetW = (pageWidth - 15) / 2;
  const sheetH = (pageHeight - 15) / 2;

  const positions = [
    { x: 5, y: 5 },
    { x: 10 + sheetW, y: 5 },
    { x: 5, y: 10 + sheetH },
    { x: 10 + sheetW, y: 10 + sheetH },
  ];

  for (const pos of positions) {
    drawSingleDetectiveSheet(doc, project, pos.x, pos.y, sheetW, sheetH);
  }

  // Draw cutting dotted cross in the center
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(pageWidth / 2, 0, pageWidth / 2, pageHeight);
  doc.line(0, pageHeight / 2, pageWidth, pageHeight / 2);

  return doc.output('blob');
}

function drawSingleDetectiveSheet(
  doc: jsPDF,
  project: CluedoProject,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Border
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.4);
  doc.rect(x + 1, y + 1, w - 2, h - 2, 'D');

  // Header
  doc.setFillColor(90, 12, 18);
  doc.rect(x + 1.2, y + 1.2, w - 2.4, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(8);
  doc.text('CLUEDO • TACCUINO DEL DETECTIVE', x + w / 2, y + 5.5, { align: 'center' });

  // Case & Player line
  doc.setTextColor(50, 50, 50);
  doc.setFont('times', 'normal');
  doc.setFontSize(5.5);
  doc.text('Investigatore: _______________________', x + 3, y + 11.5);
  doc.text('Data: ___/___/___', x + w - 25, y + 11.5);

  let currentY = y + 15;

  const suspects = project.cards.filter((c) => c.category === 'suspect');
  const weapons = project.cards.filter((c) => c.category === 'weapon');
  const rooms = project.cards.filter((c) => c.category === 'room');

  currentY = drawCategorySection(doc, 'SOSPETTATI', suspects, x + 3, currentY, w - 6);
  currentY = drawCategorySection(doc, 'ARMI DEL DELITTO', weapons, x + 3, currentY + 1.5, w - 6);
  currentY = drawCategorySection(doc, 'STANZE / LUOGHI', rooms, x + 3, currentY + 1.5, w - 6);

  // Bottom Solution Envelope Box
  doc.setFillColor(245, 235, 220);
  doc.rect(x + 3, y + h - 14, w - 6, 11, 'FD');
  doc.setTextColor(90, 12, 18);
  doc.setFont('times', 'bold');
  doc.setFontSize(5.5);
  doc.text('BUSTA DEL DELITTO (SOLUZIONE SEGRETA)', x + w / 2, y + h - 11, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(5);
  doc.text('Chi: [                    ]  Arma: [                    ]  Dove: [                    ]', x + w / 2, y + h - 6, { align: 'center' });
}

function drawCategorySection(
  doc: jsPDF,
  title: string,
  items: any[],
  x: number,
  startY: number,
  width: number
): number {
  doc.setFillColor(235, 235, 235);
  doc.rect(x, startY, width, 4.5, 'F');
  doc.setTextColor(40, 40, 40);
  doc.setFont('times', 'bold');
  doc.setFontSize(5.5);
  doc.text(title, x + 2, startY + 3.2);

  // Column headers for player tracking (P1, P2, P3, P4, P5, P6)
  const colsX = x + width - 36;
  for (let c = 0; c < 6; c++) {
    doc.text(`G${c + 1}`, colsX + c * 6 + 1.5, startY + 3.2);
  }

  let y = startY + 4.5;
  doc.setFont('times', 'normal');
  doc.setFontSize(5);

  items.slice(0, 10).forEach((item, idx) => {
    y += 3.5;
    if (idx % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(x, y - 2.8, width, 3.4, 'F');
    }
    // Item name
    doc.setTextColor(30, 30, 30);
    doc.text(item.name, x + 2, y);

    // 6 Player Checkboxes
    for (let c = 0; c < 6; c++) {
      doc.setDrawColor(160, 160, 160);
      doc.setLineWidth(0.15);
      doc.rect(colsX + c * 6, y - 2.5, 3.5, 3, 'D');
    }
  });

  return y + 2;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}
