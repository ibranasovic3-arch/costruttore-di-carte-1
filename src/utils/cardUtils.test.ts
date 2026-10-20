import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CARD_FORMATS,
  mmToPixels,
  pixelsToMm,
  calculateCanvasDimensions,
  calculateOrderQuote,
  runPreflightCheck,
  rgbToCmyk,
  cmykToRgb,
  isColorOutOfGamut,
} from './cardUtils.ts';
import type { Deck } from '../types/card.ts';

test('mmToPixels and pixelsToMm conversions at 300 DPI', () => {
  const mm = 25.4; // 1 inch
  const px = mmToPixels(mm, 300);
  assert.equal(px, 300);

  const reconverted = pixelsToMm(px, 300);
  assert.equal(Math.round(reconverted), 25);
});

test('calculateCanvasDimensions includes 3mm bleed on all sides', () => {
  const result = calculateCanvasDimensions('poker', 3, 300);
  const poker = CARD_FORMATS.poker;

  // Total width should be 63.5 + 6 = 69.5 mm
  assert.equal(result.totalWidthMm, 69.5);
  // Total height should be 88.9 + 6 = 94.9 mm
  assert.equal(result.totalHeightMm, 94.9);

  // Bleed offset should be mmToPixels(3, 300) = ~35px
  assert.equal(result.bleedOffsetPx, mmToPixels(3, 300));
  assert(result.bleedWidthPx > result.cardWidthPx);
  assert(result.bleedHeightPx > result.cardHeightPx);
});

test('calculateOrderQuote applies volume discounts properly', () => {
  const singleDeck = calculateOrderQuote({
    deckCardsCount: 54,
    deckQuantity: 1,
    cornerStyle: 'rounded',
    finish: 'glossy',
    paperStock: '310_black_core',
    packaging: 'custom_box',
  });

  assert.equal(singleDeck.discountPercentage, 0);
  assert(singleDeck.total > 0);

  const bulkDecks = calculateOrderQuote({
    deckCardsCount: 54,
    deckQuantity: 50,
    cornerStyle: 'rounded',
    finish: 'glossy',
    paperStock: '310_black_core',
    packaging: 'custom_box',
  });

  // 50 decks should trigger tier discount (35%)
  assert.equal(bulkDecks.discountPercentage, 35);
  assert(bulkDecks.unitPrice < singleDeck.unitPrice);
});

test('runPreflightCheck flags text outside safe margin', () => {
  const sampleDeck: Deck = {
    id: 'deck-1',
    title: 'Test Deck',
    format: 'poker',
    cornerStyle: 'rounded',
    cornerMm: 3.5,
    useSharedBack: true,
    sharedBack: {
      backgroundColor: '#1e293b',
      elements: [
        {
          id: 'b1',
          type: 'text',
          name: 'Back Logo',
          x: 20,
          y: 40,
          width: 60,
          height: 20,
          rotation: 0,
          opacity: 1,
          zIndex: 1,
          text: 'STUDIO DECK',
        },
      ],
    },
    cards: [
      {
        id: 'c1',
        name: 'Carta Pericolosa',
        quantity: 1,
        front: {
          backgroundColor: '#ffffff',
          elements: [
            {
              id: 'el-risky',
              type: 'text',
              name: 'Titolo Pericoloso',
              x: 1, // 1% is outside the 5% safe zone!
              y: 2,
              width: 50,
              height: 10,
              rotation: 0,
              opacity: 1,
              zIndex: 1,
              text: 'TAGLIO A RISCHIO',
            },
          ],
        },
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const issues = runPreflightCheck(sampleDeck);
  assert(issues.length > 0);
  const safeZoneIssue = issues.find((i) => i.elementId === 'el-risky');
  assert(safeZoneIssue !== undefined);
  assert(safeZoneIssue.message.includes('Area di Sicurezza'));
});

test('CMYK conversion & Gamut Warning detect neon colors', () => {
  const pureCyan = '#00ffff';
  assert.equal(isColorOutOfGamut(pureCyan), true);

  const normalNavy = '#1e3a8a';
  assert.equal(isColorOutOfGamut(normalNavy), false);

  const { c, m, y, k } = rgbToCmyk(255, 0, 0); // Pure Red
  assert.equal(c, 0);
  assert.equal(m, 1);
  assert.equal(y, 1);
  assert.equal(k, 0);

  const backRgb = cmykToRgb(c, m, y, k);
  assert.equal(backRgb.r, 255);
  assert.equal(backRgb.g, 0);
  assert.equal(backRgb.b, 0);
});
