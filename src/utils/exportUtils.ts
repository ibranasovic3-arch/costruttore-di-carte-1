import { jsPDF } from 'jspdf';
import {
  CardFace,
  CardFormatId,
  Deck,
  PrintSettings,
} from '../types/card.ts';
import {
  CARD_FORMATS,
  getCardDimensions,
  calculateCanvasDimensions,
  mmToPixels,
  rgbToCmyk,
  cmykToRgb,
  isColorOutOfGamut,
} from './cardUtils.ts';
import { GAME_ICONS } from '../data/assetLibrary.ts';

/**
 * Render a single CardFace to an HTML5 Canvas at exact DPI (default 300 DPI for press quality)
 */
export async function renderCardFaceToCanvas(
  face: CardFace,
  formatId: CardFormatId,
  options: {
    dpi?: number;
    includeBleed?: boolean;
    bleedMm?: number;
    showGuides?: boolean;
    colorMode?: 'sRGB' | 'cmyk_preview' | 'gamut_warning';
    cornerStyle?: 'rounded' | 'square';
    cornerMm?: number;
    customWidthMm?: number;
    customHeightMm?: number;
  } = {}
): Promise<HTMLCanvasElement> {
  const dpi = options.dpi || 300;
  const includeBleed = options.includeBleed !== false;
  const bleedMm = includeBleed ? options.bleedMm ?? 3 : 0;
  const format = getCardDimensions(formatId, options.customWidthMm, options.customHeightMm);

  const dims = calculateCanvasDimensions(
    formatId,
    bleedMm,
    dpi,
    options.customWidthMm,
    options.customHeightMm
  );
  const width = includeBleed ? dims.bleedWidthPx : dims.cardWidthPx;
  const height = includeBleed ? dims.bleedHeightPx : dims.cardHeightPx;
  const bleedOffset = includeBleed ? dims.bleedOffsetPx : 0;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get 2d canvas context');

  // Fill Background
  ctx.save();
  if (face.backgroundGradient?.enabled && face.backgroundGradient.colors.length >= 2) {
    let grad: CanvasGradient;
    if (face.backgroundGradient.type === 'radial') {
      const cx = width / 2;
      const cy = height / 2;
      grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) / 1.5);
    } else {
      const angleRad = ((face.backgroundGradient.angle || 0) * Math.PI) / 180;
      const x2 = width * Math.cos(angleRad);
      const y2 = height * Math.sin(angleRad);
      grad = ctx.createLinearGradient(0, 0, Math.abs(x2), Math.abs(y2));
    }
    face.backgroundGradient.colors.forEach((col, idx) => {
      grad.addColorStop(idx / (face.backgroundGradient!.colors.length - 1), col);
    });
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = face.backgroundColor || '#ffffff';
  }
  ctx.fillRect(0, 0, width, height);

  // Background pattern if any
  if (face.backgroundPattern && face.backgroundPattern !== 'none') {
    drawBackgroundPattern(ctx, face.backgroundPattern, width, height);
  }

  // Draw background image if provided
  if (face.backgroundImage) {
    await drawImageOntoCanvas(ctx, face.backgroundImage, 0, 0, width, height, 'cover');
  }
  ctx.restore();

  // Elements are positioned relative to the trimmed card area
  // We offset by bleedOffset
  const cardAreaX = bleedOffset;
  const cardAreaY = bleedOffset;
  const cardAreaW = dims.cardWidthPx;
  const cardAreaH = dims.cardHeightPx;

  // Sort elements by zIndex
  const sortedElements = [...(face.elements || [])].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  for (const el of sortedElements) {
    if (el.visible === false) continue;

    ctx.save();
    const elX = cardAreaX + (el.x / 100) * cardAreaW;
    const elY = cardAreaY + (el.y / 100) * cardAreaH;
    const elW = (el.width / 100) * cardAreaW;
    const elH = (el.height / 100) * cardAreaH;

    ctx.globalAlpha = el.opacity ?? 1;

    // Handle rotation around element center
    if (el.rotation) {
      ctx.translate(elX + elW / 2, elY + elH / 2);
      ctx.rotate((el.rotation * Math.PI) / 180);
      ctx.translate(-(elX + elW / 2), -(elY + elH / 2));
    }

    if (el.type === 'shape') {
      drawShape(ctx, el, elX, elY, elW, elH, dpi);
    } else if (el.type === 'text') {
      drawText(ctx, el, elX, elY, elW, elH, dpi);
    } else if (el.type === 'icon') {
      drawIcon(ctx, el, elX, elY, elW, elH);
    } else if (el.type === 'image' && el.url) {
      await drawImageOntoCanvas(ctx, el.url, elX, elY, elW, elH, el.fit || 'cover');
    }

    ctx.restore();
  }

  // Draw Guides if requested
  if (options.showGuides) {
    drawGuides(ctx, {
      width,
      height,
      cardAreaX,
      cardAreaY,
      cardAreaW,
      cardAreaH,
      dpi,
      bleedOffset,
      cornerStyle: options.cornerStyle || 'rounded',
      cornerMm: options.cornerMm ?? format.defaultRadiusMm,
    });
  }

  // Soft proofing: simulated CMYK or gamut warning
  if (options.colorMode && options.colorMode !== 'sRGB') {
    applyColorSoftProofing(ctx, width, height, options.colorMode);
  }

  return canvas;
}

function drawBackgroundPattern(
  ctx: CanvasRenderingContext2D,
  pattern: string,
  width: number,
  height: number
) {
  ctx.save();
  if (pattern === 'linen') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else if (pattern === 'damask') {
    ctx.fillStyle = 'rgba(255, 215, 0, 0.04)';
    for (let x = 0; x < width; x += 40) {
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.arc(x + 20, y + 20, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeRect(x + 10, y + 10, 20, 20);
      }
    }
  } else if (pattern === 'stars') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 60; i++) {
      const rx = (i * 97) % width;
      const ry = (i * 131) % height;
      ctx.beginPath();
      ctx.arc(rx, ry, (i % 3) + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === 'hexagons') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    const r = 24;
    for (let y = 0; y < height + r; y += r * 1.5) {
      for (let x = 0; x < width + r; x += r * Math.sqrt(3)) {
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const angle = (a * 60 * Math.PI) / 180;
          const hx = x + r * Math.cos(angle);
          const hy = y + r * Math.sin(angle);
          if (a === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  } else if (pattern === 'parchment') {
    ctx.fillStyle = 'rgba(120, 53, 15, 0.03)';
    for (let i = 0; i < 400; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      ctx.fillRect(px, py, Math.random() * 4, Math.random() * 4);
    }
  } else if (pattern === 'carbon') {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let x = 0; x < width; x += 8) {
      for (let y = 0; y < height; y += 8) {
        if ((x / 8 + y / 8) % 2 === 0) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
  } else if (pattern === 'wood') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 2;
    for (let y = 0; y < height; y += 14) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(width * 0.33, y + Math.sin(y) * 8, width * 0.66, y - Math.cos(y) * 8, width, y);
      ctx.stroke();
    }
  } else if (pattern === 'marble') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, 0);
      ctx.bezierCurveTo(width * 0.2, height * 0.4, width * 0.8, height * 0.6, Math.random() * width, height);
      ctx.stroke();
    }
  } else if (pattern === 'holographic') {
    const holoGrad = ctx.createLinearGradient(0, 0, width, height);
    holoGrad.addColorStop(0, 'rgba(236, 72, 153, 0.1)');
    holoGrad.addColorStop(0.33, 'rgba(139, 92, 246, 0.1)');
    holoGrad.addColorStop(0.66, 'rgba(6, 182, 212, 0.1)');
    holoGrad.addColorStop(1, 'rgba(16, 185, 129, 0.1)');
    ctx.fillStyle = holoGrad;
    ctx.fillRect(0, 0, width, height);
  } else if (pattern === 'circuit') {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1.5;
    for (let x = 20; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height * 0.3);
      ctx.lineTo(x + 20, height * 0.3 + 20);
      ctx.lineTo(x + 20, height);
      ctx.stroke();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(x + 18, height * 0.3 + 18, 5, 5);
    }
  } else if (pattern === 'diamonds') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.2;
    const stepX = 24;
    const stepY = 32;
    for (let y = -stepY; y < height + stepY; y += stepY) {
      for (let x = -stepX; x < width + stepX; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, y - stepY / 2);
        ctx.lineTo(x + stepX / 2, y);
        ctx.lineTo(x, y + stepY / 2);
        ctx.lineTo(x - stepX / 2, y);
        ctx.closePath();
        ctx.stroke();
      }
    }
  } else if (pattern === 'dots') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    const spacing = 16;
    for (let y = 8; y < height; y += spacing) {
      for (let x = 8; x < width; x += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (pattern === 'runic') {
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
    ctx.lineWidth = 1.5;
    const cx = width / 2;
    const cy = height / 2;
    for (let r = 40; r < Math.min(width, height) * 0.45; r += 35) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let a = 0; a < 8; a++) {
      const angle = (a * 45 * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * (width * 0.4), cy + Math.sin(angle) * (height * 0.4));
      ctx.stroke();
    }
  } else if (pattern === 'sunburst') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    const cx = width / 2;
    const cy = height / 2;
    const count = 36;
    const maxR = Math.max(width, height) * 1.2;
    for (let i = 0; i < count; i += 2) {
      const a1 = (i * 2 * Math.PI) / count;
      const a2 = ((i + 1) * 2 * Math.PI) / count;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, a1, a2);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  el: any,
  x: number,
  y: number,
  w: number,
  h: number,
  dpi: number
) {
  ctx.save();
  const shapeType = el.shapeType || 'rectangle';
  const borderWidth = el.borderWidth ? mmToPixels(el.borderWidth * 0.35, dpi) : 0;
  const borderRadius = el.borderRadius ? mmToPixels(el.borderRadius * 0.35, dpi) : 0;

  ctx.beginPath();
  if (shapeType === 'circle') {
    ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  } else if (shapeType === 'shield') {
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h * 0.2);
    ctx.quadraticCurveTo(x + w, y + h * 0.75, x + w / 2, y + h);
    ctx.quadraticCurveTo(x, y + h * 0.75, x, y + h * 0.2);
    ctx.closePath();
  } else {
    // Rounded rectangle
    if (borderRadius > 0 && ctx.roundRect) {
      ctx.roundRect(x, y, w, h, borderRadius);
    } else {
      ctx.rect(x, y, w, h);
    }
  }

  if (el.fillColor && el.fillColor !== 'transparent') {
    ctx.fillStyle = el.fillColor;
    ctx.fill();
  }

  if (el.borderColor && el.borderColor !== 'transparent' && borderWidth > 0) {
    ctx.strokeStyle = el.borderColor;
    ctx.lineWidth = borderWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function drawText(
  ctx: CanvasRenderingContext2D,
  el: any,
  x: number,
  y: number,
  w: number,
  h: number,
  dpi: number
) {
  ctx.save();
  const basePt = el.fontSize || 12;
  const scaledPx = Math.round((basePt * dpi) / 72);
  const fontWeight = el.fontWeight || 'normal';
  const fontStyle = el.fontStyle || 'normal';
  const fontFamily = el.fontFamily || 'Inter, sans-serif';

  ctx.font = `${fontStyle} ${fontWeight} ${scaledPx}px ${fontFamily}`;
  ctx.textAlign = (el.textAlign as CanvasTextAlign) || 'center';
  ctx.textBaseline = 'middle';

  let targetX = x + w / 2;
  if (el.textAlign === 'left') targetX = x;
  if (el.textAlign === 'right') targetX = x + w;

  const targetY = y + h / 2;

  if (el.shadow) {
    ctx.shadowColor = el.shadowColor || 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = Math.round(dpi / 50);
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }

  if (el.strokeColor && el.strokeWidth) {
    ctx.strokeStyle = el.strokeColor;
    ctx.lineWidth = Math.round((el.strokeWidth * dpi) / 72);
    ctx.strokeText(el.text || '', targetX, targetY, w);
  }

  ctx.fillStyle = el.color || '#000000';
  ctx.fillText(el.text || '', targetX, targetY, w);
  ctx.restore();
}

function drawIcon(
  ctx: CanvasRenderingContext2D,
  el: any,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.save();
  const icon = GAME_ICONS.find((i) => i.id === el.iconName) || GAME_ICONS[0];
  ctx.fillStyle = el.tint || '#d97706';

  // SVG path 24x24 viewBox scaling
  ctx.translate(x, y);
  const scaleX = w / 24;
  const scaleY = h / 24;
  ctx.scale(scaleX, scaleY);

  const path = new Path2D(icon.svgPath);
  ctx.fill(path);
  ctx.restore();
}

function drawImageOntoCanvas(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  w: number,
  h: number,
  fit: 'cover' | 'contain' | 'fill'
): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.save();
      if (fit === 'fill') {
        ctx.drawImage(img, x, y, w, h);
      } else {
        const imgRatio = img.width / img.height;
        const boxRatio = w / h;
        let drawW = w;
        let drawH = h;
        let offsetX = x;
        let offsetY = y;

        if (fit === 'cover') {
          if (imgRatio > boxRatio) {
            drawW = h * imgRatio;
            offsetX = x - (drawW - w) / 2;
          } else {
            drawH = w / imgRatio;
            offsetY = y - (drawH - h) / 2;
          }
          ctx.beginPath();
          ctx.rect(x, y, w, h);
          ctx.clip();
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        } else {
          // contain
          if (imgRatio > boxRatio) {
            drawH = w / imgRatio;
            offsetY = y + (h - drawH) / 2;
          } else {
            drawW = h * imgRatio;
            offsetX = x + (w - drawW) / 2;
          }
          ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        }
      }
      ctx.restore();
      resolve();
    };
    img.onerror = () => {
      // Fallback placeholder rectangle
      ctx.fillStyle = '#374151';
      ctx.fillRect(x, y, w, h);
      resolve();
    };
    img.src = url;
  });
}

function drawGuides(
  ctx: CanvasRenderingContext2D,
  opts: {
    width: number;
    height: number;
    cardAreaX: number;
    cardAreaY: number;
    cardAreaW: number;
    cardAreaH: number;
    dpi: number;
    bleedOffset: number;
    cornerStyle: 'rounded' | 'square';
    cornerMm: number;
  }
) {
  const { cardAreaX, cardAreaY, cardAreaW, cardAreaH, dpi, bleedOffset } = opts;
  const safeMarginPx = mmToPixels(3, dpi);

  ctx.save();
  // 1. Cut Line (Red dashed line at trim edge)
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);

  if (opts.cornerStyle === 'rounded') {
    const radiusPx = mmToPixels(opts.cornerMm, dpi);
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(cardAreaX, cardAreaY, cardAreaW, cardAreaH, radiusPx);
      ctx.stroke();
    } else {
      ctx.strokeRect(cardAreaX, cardAreaY, cardAreaW, cardAreaH);
    }
  } else {
    ctx.strokeRect(cardAreaX, cardAreaY, cardAreaW, cardAreaH);
  }

  // 2. Safe Zone Line (Green dashed line 3mm inside trim line)
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(
    cardAreaX + safeMarginPx,
    cardAreaY + safeMarginPx,
    cardAreaW - safeMarginPx * 2,
    cardAreaH - safeMarginPx * 2
  );

  // 3. Corner Crop Marks (if bleed offset > 0)
  if (bleedOffset > 0) {
    ctx.setLineDash([]);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    const markLen = bleedOffset * 0.7;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(cardAreaX, 0);
    ctx.lineTo(cardAreaX, markLen);
    ctx.moveTo(0, cardAreaY);
    ctx.lineTo(markLen, cardAreaY);

    // Top-right
    ctx.moveTo(cardAreaX + cardAreaW, 0);
    ctx.lineTo(cardAreaX + cardAreaW, markLen);
    ctx.moveTo(opts.width, cardAreaY);
    ctx.lineTo(opts.width - markLen, cardAreaY);

    // Bottom-left
    ctx.moveTo(cardAreaX, opts.height);
    ctx.lineTo(cardAreaX, opts.height - markLen);
    ctx.moveTo(0, cardAreaY + cardAreaH);
    ctx.lineTo(markLen, cardAreaY + cardAreaH);

    // Bottom-right
    ctx.moveTo(cardAreaX + cardAreaW, opts.height);
    ctx.lineTo(cardAreaX + cardAreaW, opts.height - markLen);
    ctx.moveTo(opts.width, cardAreaY + cardAreaH);
    ctx.lineTo(opts.width - markLen, cardAreaY + cardAreaH);

    ctx.stroke();
  }
  ctx.restore();
}

/** Soft proofing simulation (CMYK FOGRA39 tone mapping or out-of-gamut zebra/pink indicator) */
function applyColorSoftProofing(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mode: 'cmyk_preview' | 'gamut_warning'
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    if (mode === 'gamut_warning') {
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      if (isColorOutOfGamut(hex)) {
        // Highlight in electric magenta to show press gamut limitation
        data[i] = 255;
        data[i + 1] = 0;
        data[i + 2] = 255;
      }
    } else if (mode === 'cmyk_preview') {
      // Simulate CMYK ink compression
      const cmyk = rgbToCmyk(r, g, b);
      const simulated = cmykToRgb(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
      data[i] = simulated.r;
      data[i + 1] = simulated.g;
      data[i + 2] = simulated.b;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Generate a ready-to-print multi-page PDF (A4 or US Letter) with front sheet & aligned back sheet
 */
export async function generatePrintSheetPdf(
  deck: Deck,
  settings: PrintSettings
): Promise<jsPDF> {
  const isA4 = settings.paperSize === 'a4';
  const paperW = isA4 ? 210 : 215.9; // mm
  const paperH = isA4 ? 297 : 279.4; // mm

  const doc = new jsPDF({
    orientation: settings.orientation,
    unit: 'mm',
    format: [paperW, paperH],
  });

  const format = getCardDimensions(deck.format, deck.customWidthMm, deck.customHeightMm);
  const cardW = format.widthMm;
  const cardH = format.heightMm;

  // Grid layout: compute how many fit horizontally and vertically
  const marginX = 10;
  const marginY = 12;
  const availableW = paperW - marginX * 2;
  const availableH = paperH - marginY * 2;

  const cols = Math.max(1, Math.floor(availableW / (cardW + 2))); // e.g. 3 cols for poker on A4
  const rows = Math.max(1, Math.floor(availableH / (cardH + 2))); // e.g. 3 rows for poker on A4
  const cardsPerPage = cols * rows;

  const spacingX = cols > 1 ? (availableW - cols * cardW) / (cols - 1) : 0;
  const spacingY = rows > 1 ? (availableH - rows * cardH) / (rows - 1) : 0;

  // Group cards into pages
  const totalCards = deck.cards.length;
  const pageCount = Math.ceil(totalCards / cardsPerPage);

  for (let pageIdx = 0; pageIdx < pageCount; pageIdx++) {
    if (pageIdx > 0) doc.addPage([paperW, paperH], settings.orientation);

    const pageCards = deck.cards.slice(pageIdx * cardsPerPage, (pageIdx + 1) * cardsPerPage);

    // --- FRONT SHEET ---
    // Title header
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `${deck.title} — FOGLIO FRONTE ${pageIdx + 1}/${pageCount} (${cardW}x${cardH}mm 300DPI - Rifilo Pronto)`,
      marginX,
      8
    );

    // Draw front cards in grid
    for (let i = 0; i < pageCards.length; i++) {
      const card = pageCards[i];
      const col = i % cols;
      const row = Math.floor(i / cols);

      const posX = marginX + col * (cardW + spacingX);
      const posY = marginY + row * (cardH + spacingY);

      // Render front to canvas
      const canvas = await renderCardFaceToCanvas(card.front, deck.format, {
        dpi: 300,
        includeBleed: settings.includeBleed,
        bleedMm: settings.bleedMm,
        showGuides: settings.includeCropMarks,
        cornerStyle: deck.cornerStyle,
        cornerMm: deck.cornerMm,
        customWidthMm: deck.customWidthMm,
        customHeightMm: deck.customHeightMm,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      doc.addImage(imgData, 'JPEG', posX, posY, cardW, cardH);

      // Cutting crosshairs around the card
      if (settings.includeCropMarks) {
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.2);
        // Top-left
        doc.line(posX - 2, posY, posX + 2, posY);
        doc.line(posX, posY - 2, posX, posY + 2);
        // Bottom-right
        doc.line(posX + cardW - 2, posY + cardH, posX + cardW + 2, posY + cardH);
        doc.line(posX + cardW, posY + cardH - 2, posX + cardW, posY + cardH + 2);
      }
    }

    // --- BACK SHEET (PAGE 2) ---
    // Mirrored horizontally so double-sided printing on long edge lines up exactly!
    doc.addPage([paperW, paperH], settings.orientation);
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `${deck.title} — FOGLIO RETRO ALLINEATO (Stampa Fronte/Retro Asse Lungo) Pagina ${pageIdx + 1}/${pageCount}`,
      marginX,
      8
    );

    for (let i = 0; i < pageCards.length; i++) {
      const card = pageCards[i];
      const col = i % cols;
      const row = Math.floor(i / cols);

      // CRITICAL FOR DUPLEX PRINTING: Mirror the column!
      const mirroredCol = cols - 1 - col;
      const posX = marginX + mirroredCol * (cardW + spacingX);
      const posY = marginY + row * (cardH + spacingY);

      const backFace = deck.useSharedBack ? deck.sharedBack : card.back || deck.sharedBack;

      const canvas = await renderCardFaceToCanvas(backFace, deck.format, {
        dpi: 300,
        includeBleed: settings.includeBleed,
        bleedMm: settings.bleedMm,
        showGuides: settings.includeCropMarks,
        cornerStyle: deck.cornerStyle,
        cornerMm: deck.cornerMm,
        customWidthMm: deck.customWidthMm,
        customHeightMm: deck.customHeightMm,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      doc.addImage(imgData, 'JPEG', posX, posY, cardW, cardH);
    }
  }

  return doc;
}
