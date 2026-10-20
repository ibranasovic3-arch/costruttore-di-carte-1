import type {
  CardDimension,
  CardFormatId,
  Deck,
  OrderPricingOptions,
  OrderQuote,
  PreflightIssue,
} from '../types/card.ts';

export const CARD_FORMATS: Record<CardFormatId, CardDimension> = {
  poker: {
    id: 'poker',
    name: 'Poker Standard (B8)',
    widthMm: 63.5,
    heightMm: 88.9,
    description: 'Il formato standard da gioco (2.5" x 3.5"), ideale per carte collezionabili, TCG e giochi da tavolo.',
    defaultRadiusMm: 3.5,
  },
  bridge: {
    id: 'bridge',
    name: 'Bridge / Slim',
    widthMm: 57.0,
    heightMm: 88.9,
    description: 'Più stretto del poker (2.25" x 3.5"), perfetto per mani ricche di carte, burraco e giochi tradizionali.',
    defaultRadiusMm: 3.5,
  },
  tarot: {
    id: 'tarot',
    name: 'Tarocchi & Grandi Opere',
    widthMm: 70.0,
    heightMm: 120.0,
    description: 'Formato maestoso (2.75" x 4.75") per illustrazioni dettagliate, oracoli, tarocchi e carte boss.',
    defaultRadiusMm: 4.0,
  },
  square: {
    id: 'square',
    name: 'Quadrato Boardgame',
    widthMm: 70.0,
    heightMm: 70.0,
    description: 'Formato quadrato moderno (70x70 mm) per tessere di gioco, mappe modulari e carte abilità.',
    defaultRadiusMm: 3.0,
  },
  mini: {
    id: 'mini',
    name: 'Mini Euro / Token',
    widthMm: 44.0,
    heightMm: 67.0,
    description: 'Formato compatto europeo per carte oggetto, equipaggiamenti secondari o mazzetti add-on.',
    defaultRadiusMm: 2.5,
  },
  custom: {
    id: 'custom',
    name: 'Misura Personalizzata (mm)',
    widthMm: 63.5,
    heightMm: 88.9,
    description: 'Imposta liberamente larghezza e altezza in millimetri per prototipi, tessere o fustelle speciali.',
    defaultRadiusMm: 3.5,
  },
};

/** Get card physical dimensions taking custom sizes into account */
export function getCardDimensions(
  formatId: CardFormatId,
  customWidthMm?: number,
  customHeightMm?: number
): CardDimension {
  const base = CARD_FORMATS[formatId] || CARD_FORMATS.poker;
  if (formatId === 'custom') {
    return {
      ...base,
      widthMm: Math.max(15, Math.min(350, customWidthMm || 63.5)),
      heightMm: Math.max(15, Math.min(350, customHeightMm || 88.9)),
    };
  }
  return base;
}

/** Convert millimeters to pixels at a given DPI */
export function mmToPixels(mm: number, dpi = 300): number {
  return Math.round((mm / 25.4) * dpi);
}

/** Convert pixels to millimeters at a given DPI */
export function pixelsToMm(px: number, dpi = 300): number {
  return (px / dpi) * 25.4;
}

/** Calculate full canvas dimensions including bleed */
export function calculateCanvasDimensions(
  formatId: CardFormatId,
  bleedMm = 3,
  dpi = 300,
  customWidthMm?: number,
  customHeightMm?: number
): {
  cardWidthPx: number;
  cardHeightPx: number;
  bleedWidthPx: number;
  bleedHeightPx: number;
  bleedOffsetPx: number;
  totalWidthMm: number;
  totalHeightMm: number;
} {
  const format = getCardDimensions(formatId, customWidthMm, customHeightMm);
  const cardWidthPx = mmToPixels(format.widthMm, dpi);
  const cardHeightPx = mmToPixels(format.heightMm, dpi);
  const bleedOffsetPx = mmToPixels(bleedMm, dpi);

  const totalWidthMm = format.widthMm + bleedMm * 2;
  const totalHeightMm = format.heightMm + bleedMm * 2;

  const bleedWidthPx = mmToPixels(totalWidthMm, dpi);
  const bleedHeightPx = mmToPixels(totalHeightMm, dpi);

  return {
    cardWidthPx,
    cardHeightPx,
    bleedWidthPx,
    bleedHeightPx,
    bleedOffsetPx,
    totalWidthMm,
    totalHeightMm,
  };
}

/** Calculate order quote based on spec options */
export function calculateOrderQuote(options: OrderPricingOptions): OrderQuote {
  const {
    deckCardsCount,
    deckQuantity,
    cornerStyle,
    finish,
    paperStock,
    packaging,
  } = options;

  // Base price per card depends on deck size
  // e.g. 54-card deck base is ~14.90 EUR for 1 copy
  const baseCardRate = 0.22; // € per card
  const deckBaseCost = Math.max(9.5, deckCardsCount * baseCardRate);

  // Finishes:
  let finishExtra = 0;
  if (finish === 'glossy') {
    finishExtra = 2.0; // Verniciatura UV Lucida
  } else if (finish === 'linen') {
    finishExtra = 2.8; // Trama tela casinò air-cushion
  } else if (finish === 'softtouch') {
    finishExtra = 3.5; // Soft-touch vellutata
  }
  // matte is standard +0

  // Paper stock:
  let stockExtra = 0;
  if (paperStock === '310_black_core') {
    stockExtra = 3.2; // Casinò Black Core professionale tedesco
  } else if (paperStock === '350_white_core') {
    stockExtra = 2.0; // 350gsm super rigido
  }
  // 300_standard is 0

  // Corner style die-cut surcharge
  const cornerExtra = cornerStyle === 'rounded' ? 0.8 : 0;

  // Packaging:
  let packagingPrice = 0;
  if (packaging === 'custom_box') {
    packagingPrice = 4.5;
  } else if (packaging === 'plastic_case') {
    packagingPrice = 2.2;
  } else if (packaging === 'velvet_pouch') {
    packagingPrice = 3.0;
  } else if (packaging === 'shrink_wrap') {
    packagingPrice = 0.5;
  }

  const rawUnitDeckPrice =
    deckBaseCost + finishExtra + stockExtra + cornerExtra + packagingPrice;

  // Bulk discount based on deck quantity
  let discountPercentage = 0;
  if (deckQuantity >= 100) {
    discountPercentage = 45;
  } else if (deckQuantity >= 50) {
    discountPercentage = 35;
  } else if (deckQuantity >= 20) {
    discountPercentage = 25;
  } else if (deckQuantity >= 10) {
    discountPercentage = 18;
  } else if (deckQuantity >= 5) {
    discountPercentage = 12;
  } else if (deckQuantity >= 2) {
    discountPercentage = 5;
  }

  const unitPrice = +(rawUnitDeckPrice * (1 - discountPercentage / 100)).toFixed(2);
  const subtotal = +(unitPrice * deckQuantity).toFixed(2);
  const regularTotal = +(rawUnitDeckPrice * deckQuantity).toFixed(2);
  const discountAmount = +(regularTotal - subtotal).toFixed(2);

  // Shipping
  const shipping = subtotal > 60 ? 0 : 5.9;
  const tax = +(subtotal * 0.22).toFixed(2); // 22% IVA
  const total = +(subtotal + shipping).toFixed(2);

  // Delivery time
  let estimatedDeliveryDays = 4;
  if (finish === 'linen' || paperStock === '310_black_core') {
    estimatedDeliveryDays += 1;
  }
  if (deckQuantity >= 50) {
    estimatedDeliveryDays += 2;
  }

  return {
    baseDeckPrice: +deckBaseCost.toFixed(2),
    finishExtra: +finishExtra.toFixed(2),
    stockExtra: +stockExtra.toFixed(2),
    packagingPrice: +packagingPrice.toFixed(2),
    unitPrice,
    discountPercentage,
    discountAmount,
    subtotal,
    shipping,
    tax,
    total,
    estimatedDeliveryDays,
  };
}

/** Pre-flight check before printing or ordering */
export function runPreflightCheck(deck: Deck): PreflightIssue[] {
  const issues: PreflightIssue[] = [];

  if (!deck.cards || deck.cards.length === 0) {
    issues.push({
      cardId: 'deck',
      cardName: deck.title,
      face: 'front',
      severity: 'error',
      message: 'Il mazzo non contiene carte',
      recommendation: 'Aggiungi almeno una carta per esportare o ordinare.',
    });
    return issues;
  }

  // Safe zone threshold (elements within 5% from edges risk being clipped if shifted during cutting)
  const safeMarginPct = 5.0;

  deck.cards.forEach((card, index) => {
    const cardTitle = card.name || `Carta #${index + 1}`;

    // Front check
    const front = card.front;
    if (!front || front.elements.length === 0) {
      issues.push({
        cardId: card.id,
        cardName: cardTitle,
        face: 'front',
        severity: 'warning',
        message: 'Il fronte della carta è completamente vuoto',
        recommendation: 'Aggiungi testi o grafiche per personalizzare la carta.',
      });
    }

    front?.elements.forEach((el) => {
      // Check if text is dangerously close to cut edges
      if (el.type === 'text') {
        const rightEdge = el.x + el.width;
        const bottomEdge = el.y + el.height;

        if (
          el.x < safeMarginPct ||
          el.y < safeMarginPct ||
          rightEdge > 100 - safeMarginPct ||
          bottomEdge > 100 - safeMarginPct
        ) {
          issues.push({
            cardId: card.id,
            cardName: cardTitle,
            face: 'front',
            elementId: el.id,
            elementName: el.name || el.text?.slice(0, 15) || 'Testo',
            severity: 'warning',
            message: `Elemento testuale fuori dall'Area di Sicurezza (${safeMarginPct}%)`,
            recommendation:
              'Sposta il testo verso il centro per evitare che venga parzialmente tagliato durante la rifilatura tipografica.',
          });
        }
      }
    });

    // Back check
    const back = deck.useSharedBack ? deck.sharedBack : card.back || deck.sharedBack;
    if (!back || back.elements.length === 0) {
      issues.push({
        cardId: card.id,
        cardName: cardTitle,
        face: 'back',
        severity: 'warning',
        message: 'Il retro della carta non ha alcun elemento grafico',
        recommendation: 'Imposta un design o un colore di sfondo per il retro del mazzo.',
      });
    }
  });

  return issues;
}

/**
 * Color math: Approximate RGB to CMYK conversion and back to simulate ink gamut compression.
 * Helps designers see if vibrant RGB neon colors will desaturate when printed on physical press.
 */
export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 1 };
  }

  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.min(1, Math.max(0, c)),
    m: Math.min(1, Math.max(0, m)),
    y: Math.min(1, Math.max(0, y)),
    k: Math.min(1, Math.max(0, k)),
  };
}

export function cmykToRgb(c: number, m: number, y: number, k: number): { r: number; g: number; b: number } {
  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));

  return {
    r: Math.min(255, Math.max(0, r)),
    g: Math.min(255, Math.max(0, g)),
    b: Math.min(255, Math.max(0, b)),
  };
}

/** Check if an RGB color exceeds typical offset press gamut (e.g. electric cyan/green/magenta) */
export function isColorOutOfGamut(hex: string): boolean {
  if (!hex || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;

  // Highly saturated bright values far from neutral grey often fall outside standard CMYK (e.g. #00ff00, #00ffff, #ff00ff)
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const saturation = max === 0 ? 0 : delta / max;

  // Very high brightness and high saturation beyond printable threshold
  if (saturation > 0.88 && max > 230 && (min < 30 || max - min > 180)) {
    return true;
  }
  return false;
}
