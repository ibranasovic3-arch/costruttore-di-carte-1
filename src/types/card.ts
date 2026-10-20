export type CardFormatId = 'poker' | 'bridge' | 'tarot' | 'square' | 'mini' | 'custom';

export interface CardDimension {
  id: CardFormatId;
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
  defaultRadiusMm: number;
}

export type CornerStyle = 'rounded' | 'square';

export type FinishType = 'matte' | 'glossy' | 'linen' | 'softtouch';

export type PaperStock = '310_black_core' | '350_white_core' | '300_standard';

export type PackagingType = 'custom_box' | 'plastic_case' | 'velvet_pouch' | 'shrink_wrap';

export type ColorMode = 'sRGB' | 'cmyk_preview' | 'gamut_warning';

export type ElementType = 'text' | 'image' | 'icon' | 'badge' | 'shape' | 'frame';

export interface CardElement {
  id: string;
  type: ElementType;
  name: string;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  width: number; // percentage (0 - 100)
  height: number; // percentage (0 - 100)
  rotation: number; // degrees
  opacity: number; // 0 to 1
  zIndex: number;
  locked?: boolean;
  visible?: boolean;

  // Text specific
  text?: string;
  fontSize?: number; // relative pt
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold' | '900';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadow?: boolean;
  shadowColor?: string;
  badgeBg?: string; // background fill for stats badge
  badgeBorder?: string;

  // Image & Icon specific
  url?: string;
  iconName?: string;
  fit?: 'contain' | 'cover' | 'fill';
  tint?: string;

  // Shape specific
  shapeType?: 'rectangle' | 'circle' | 'shield' | 'star' | 'ribbon' | 'line';
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;

  // Frame specific
  frameStyle?: 'ornate_gold' | 'cyber_neon' | 'vintage_filigree' | 'minimal_thick' | 'gothic';
}

export type BackgroundPatternType =
  | 'none'
  | 'linen'
  | 'parchment'
  | 'carbon'
  | 'damask'
  | 'stars'
  | 'hexagons'
  | 'wood'
  | 'marble'
  | 'holographic'
  | 'circuit'
  | 'diamonds'
  | 'dots'
  | 'runic'
  | 'sunburst';

export type BackgroundFrameType =
  | 'none'
  | 'royal_gold'
  | 'filigree'
  | 'cyber_circuit'
  | 'double_line'
  | 'vintage_tarot';

export interface CardFace {
  backgroundColor: string;
  backgroundGradient?: {
    enabled: boolean;
    type: 'linear' | 'radial';
    colors: string[];
    angle: number;
  };
  backgroundImage?: string;
  backgroundPattern?: BackgroundPatternType;
  backgroundBorderFrame?: BackgroundFrameType;
  elements: CardElement[];
}

export interface CardItem {
  id: string;
  name: string;
  quantity: number;
  front: CardFace;
  back?: CardFace; // If null, uses deck.defaultBack
  notes?: string;
}

export interface Deck {
  id: string;
  title: string;
  format: CardFormatId;
  customWidthMm?: number;
  customHeightMm?: number;
  cornerStyle: CornerStyle;
  cornerMm: number; // usually 3.5mm for poker
  useSharedBack: boolean;
  sharedBack: CardFace;
  cards: CardItem[];
  createdAt: number;
  updatedAt: number;
}

export interface PrintSettings {
  paperSize: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  includeBleed: boolean;
  includeCropMarks: boolean;
  includeSafeZone: boolean;
  bleedMm: number; // usually 3mm
  safeMarginMm: number; // usually 3mm
  dpi: number; // usually 300
  colorMode: ColorMode;
  doubleSidedGuide: boolean;
}

export interface OrderPricingOptions {
  deckCardsCount: number;
  deckQuantity: number;
  cornerStyle: CornerStyle;
  finish: FinishType;
  paperStock: PaperStock;
  packaging: PackagingType;
}

export interface OrderQuote {
  baseDeckPrice: number;
  finishExtra: number;
  stockExtra: number;
  packagingPrice: number;
  unitPrice: number;
  discountPercentage: number;
  discountAmount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  estimatedDeliveryDays: number;
}

export interface PreflightIssue {
  cardId: string;
  cardName: string;
  face: 'front' | 'back';
  elementId?: string;
  elementName?: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  recommendation: string;
}
