import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  AlertTriangle,
  RotateCw,
  Move,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  AlignCenterHorizontal,
  AlignCenterVertical,
  Ruler,
} from 'lucide-react';
import {
  CardElement,
  CardFace,
  CardFormatId,
  ColorMode,
  CornerStyle,
} from '../types/card.ts';
import { getCardDimensions, isColorOutOfGamut } from '../utils/cardUtils.ts';
import { GAME_ICONS } from '../data/assetLibrary.ts';

interface CanvasEditorProps {
  face: CardFace;
  format: CardFormatId;
  customWidthMm?: number;
  customHeightMm?: number;
  cornerStyle: CornerStyle;
  cornerMm: number;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CardElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  face,
  format,
  customWidthMm,
  customHeightMm,
  cornerStyle,
  cornerMm,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
}) => {
  const cardFormat = getCardDimensions(format, customWidthMm, customHeightMm);
  const [zoom, setZoom] = useState<number>(1);
  const [showBleed, setShowBleed] = useState<boolean>(true);
  const [showSafeZone, setShowSafeZone] = useState<boolean>(true);
  const [showCutLine, setShowCutLine] = useState<boolean>(true);
  const [colorMode, setColorMode] = useState<ColorMode>('sRGB');

  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    elementId: string;
    startX: number;
    startY: number;
    elemX: number;
    elemY: number;
    action: 'move' | 'resize';
    startW: number;
    startH: number;
  } | null>(null);

  // Selected element lookup
  const selectedElement = face.elements.find((el) => el.id === selectedElementId) || null;

  // Keyboard navigation & delete shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo / Redo keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          if (onRedo && canRedo) {
            e.preventDefault();
            onRedo();
          }
        } else {
          if (onUndo && canUndo) {
            e.preventDefault();
            onUndo();
          }
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (onRedo && canRedo) {
          e.preventDefault();
          onRedo();
        }
        return;
      }

      if (!selectedElementId) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const el = face.elements.find((item) => item.id === selectedElementId);
      if (!el) return;

      const step = e.shiftKey ? 5 : 1;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteElement(selectedElementId);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onUpdateElement(selectedElementId, { x: Math.max(0, el.x - step) });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onUpdateElement(selectedElementId, { x: Math.min(100 - el.width, el.x + step) });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onUpdateElement(selectedElementId, { y: Math.max(0, el.y - step) });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onUpdateElement(selectedElementId, { y: Math.min(100 - el.height, el.y + step) });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, face.elements, onDeleteElement, onUpdateElement, onUndo, onRedo, canUndo, canRedo]);

  // Card dimensions on screen (base 360px width for standard aspect ratio)
  const baseWidthPx = 360;
  const ratio = cardFormat.heightMm / cardFormat.widthMm;
  const baseHeightPx = Math.round(baseWidthPx * ratio);

  // Bleed margin in px (3mm proportionally)
  const bleedMarginPx = showBleed ? (3 / cardFormat.widthMm) * baseWidthPx : 0;
  const safeMarginPx = showSafeZone ? (3 / cardFormat.widthMm) * baseWidthPx : 0;

  // Handle Drag Move & Resize
  const handlePointerDown = (
    e: React.PointerEvent,
    element: CardElement,
    action: 'move' | 'resize'
  ) => {
    e.stopPropagation();
    onSelectElement(element.id);

    dragRef.current = {
      elementId: element.id,
      startX: e.clientX,
      startY: e.clientY,
      elemX: element.x,
      elemY: element.y,
      startW: element.width,
      startH: element.height,
      action,
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      if (!dragRef.current || !cardRef.current) return;
      const { elementId, startX, startY, elemX, elemY, startW, startH, action } = dragRef.current;

      const currentScale = zoom;
      const deltaX = (moveEvt.clientX - startX) / currentScale;
      const deltaY = (moveEvt.clientY - startY) / currentScale;

      const deltaXPct = (deltaX / baseWidthPx) * 100;
      const deltaYPct = (deltaY / baseHeightPx) * 100;

      if (action === 'move') {
        const newX = Math.round(elemX + deltaXPct);
        const newY = Math.round(elemY + deltaYPct);
        onUpdateElement(elementId, { x: newX, y: newY });
      } else if (action === 'resize') {
        const newW = Math.max(5, Math.round(startW + deltaXPct));
        const newH = Math.max(5, Math.round(startH + deltaYPct));
        onUpdateElement(elementId, { width: newW, height: newH });
      }
    };

    const handlePointerUp = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Center alignment helpers
  const handleCenterHorizontal = () => {
    if (!selectedElement) return;
    const centeredX = Math.round((100 - selectedElement.width) / 2);
    onUpdateElement(selectedElement.id, { x: centeredX });
  };

  const handleCenterVertical = () => {
    if (!selectedElement) return;
    const centeredY = Math.round((100 - selectedElement.height) / 2);
    onUpdateElement(selectedElement.id, { y: centeredY });
  };

  // Background style computation using non-shorthand properties
  const bgStyle: React.CSSProperties = {
    backgroundColor: face.backgroundColor || '#ffffff',
    backgroundImage:
      face.backgroundGradient?.enabled && face.backgroundGradient.colors.length >= 2
        ? face.backgroundGradient.type === 'radial'
          ? `radial-gradient(circle at center, ${face.backgroundGradient.colors.join(', ')})`
          : `linear-gradient(${face.backgroundGradient.angle || 180}deg, ${face.backgroundGradient.colors.join(', ')})`
        : 'none',
  };

  // Filter effect for CMYK simulation or Gamut Warning
  let colorFilterStyle: React.CSSProperties = {};
  if (colorMode === 'cmyk_preview') {
    colorFilterStyle = { filter: 'saturate(0.92) contrast(1.02) brightness(0.98)' };
  }

  return (
    <div
      className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden select-none"
      onClick={() => onSelectElement(null)}
    >
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none flex-wrap gap-2">
        {/* Guides & Color Mode Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg pointer-events-auto text-xs text-slate-300">
          <span className="font-semibold text-slate-400 mr-1 text-[11px]">Guide:</span>

          <button
            onClick={() => setShowBleed(!showBleed)}
            title="Abbondaggio 3mm esterno per taglio al vivo"
            className={`px-2 py-1 rounded cursor-pointer transition flex items-center gap-1 text-[11px] ${
              showBleed ? 'bg-red-950/80 text-red-300 border border-red-700/50 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
            <span>Abbondaggio (3mm)</span>
          </button>

          <button
            onClick={() => setShowCutLine(!showCutLine)}
            title="Linea di taglio finale (Rifilo)"
            className={`px-2 py-1 rounded cursor-pointer transition flex items-center gap-1 text-[11px] ${
              showCutLine ? 'bg-amber-950/80 text-amber-300 border border-amber-700/50 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            <span>Rifilo ({cardFormat.widthMm}x{cardFormat.heightMm}mm)</span>
          </button>

          <button
            onClick={() => setShowSafeZone(!showSafeZone)}
            title="Area di sicurezza interna 3mm da bordi di taglio"
            className={`px-2 py-1 rounded cursor-pointer transition flex items-center gap-1 text-[11px] ${
              showSafeZone ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span>Sicurezza (3mm)</span>
          </button>
        </div>

        {/* Selected Element Quick Action Bar (Visible when an element is selected) */}
        {selectedElement && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/50 shadow-xl pointer-events-auto text-xs animate-in fade-in"
          >
            <span className="text-[11px] font-mono text-amber-400 font-bold truncate max-w-[120px]">
              {selectedElement.name || selectedElement.type}
            </span>

            <div className="h-4 w-px bg-slate-700 mx-1" />

            {/* Horizontal Center */}
            <button
              onClick={handleCenterHorizontal}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Centra orizzontalmente sulla carta"
            >
              <AlignCenterHorizontal className="w-4 h-4 text-amber-400" />
            </button>

            {/* Vertical Center */}
            <button
              onClick={handleCenterVertical}
              className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Centra verticalmente sulla carta"
            >
              <AlignCenterVertical className="w-4 h-4 text-amber-400" />
            </button>

            {/* Duplicate */}
            {onDuplicateElement && (
              <button
                onClick={() => onDuplicateElement(selectedElement.id)}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Duplica elemento"
              >
                <Copy className="w-4 h-4 text-blue-400" />
              </button>
            )}

            {/* PROMINENT DELETE BUTTON */}
            <button
              onClick={() => onDeleteElement(selectedElement.id)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition cursor-pointer ml-1"
              title="Elimina elemento selezionato (Tasto Canc o Backspace)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Elimina</span>
              <kbd className="hidden sm:inline text-[9px] bg-rose-900/80 px-1 rounded font-mono font-normal">Canc</kbd>
            </button>
          </div>
        )}

        {/* Color Soft Proofing */}
        <div className="flex items-center gap-2 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg pointer-events-auto text-xs text-slate-300">
          <span className="font-semibold text-slate-400 text-[11px]">Colore:</span>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as ColorMode)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="sRGB">sRGB (Schermo)</option>
            <option value="cmyk_preview">CMYK (FOGRA39)</option>
            <option value="gamut_warning">Allarme Gamut</option>
          </select>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative"
        >
          {/* Bleed Container (extends 3mm outwards) */}
          <div
            className="relative transition-all shadow-2xl"
            style={{
              padding: `${bleedMarginPx}px`,
              backgroundColor: '#090d16',
            }}
          >
            {/* Bleed Boundary Indicator */}
            {showBleed && (
              <div
                className="absolute inset-0 pointer-events-none border border-dashed border-red-500/70 z-30"
                title="Bordo Abbondaggio (3mm): la grafica deve estendersi fino a qui"
              >
                <div className="absolute -top-5 left-1 text-[10px] font-mono text-red-400 font-semibold tracking-wider bg-red-950/80 px-1.5 py-0.5 rounded border border-red-800/60">
                  ABBONDAGGIO ESTERNO 3mm
                </div>
              </div>
            )}

            {/* Actual Card Body */}
            <div
              ref={cardRef}
              style={{
                width: `${baseWidthPx}px`,
                height: `${baseHeightPx}px`,
                borderRadius: cornerStyle === 'rounded' ? `${(cornerMm / cardFormat.widthMm) * baseWidthPx}px` : '0px',
                ...bgStyle,
                ...colorFilterStyle,
              }}
              className="relative overflow-hidden shadow-2xl cursor-default transition-all"
            >
              {/* Pattern Overlay with extended designs */}
              {face.backgroundPattern && face.backgroundPattern !== 'none' && (
                <div
                  className={`absolute inset-0 pointer-events-none opacity-20 ${
                    face.backgroundPattern === 'linen'
                      ? 'bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]'
                      : face.backgroundPattern === 'damask'
                      ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent [background-size:24px_24px]'
                      : face.backgroundPattern === 'stars'
                      ? 'bg-[radial-gradient(#fef08a_1px,transparent_1px)] [background-size:16px_16px]'
                      : face.backgroundPattern === 'hexagons'
                      ? 'bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]'
                      : face.backgroundPattern === 'carbon'
                      ? 'bg-[linear-gradient(45deg,#000_25%,transparent_25%),linear-gradient(-45deg,#000_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#000_75%),linear-gradient(-45deg,transparent_75%,#000_75%)] [background-size:8px_8px]'
                      : face.backgroundPattern === 'wood'
                      ? 'bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06)_0%,_transparent_70%)] [background-size:100%_16px]'
                      : face.backgroundPattern === 'marble'
                      ? 'bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_50%)]'
                      : face.backgroundPattern === 'holographic'
                      ? 'bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20'
                      : face.backgroundPattern === 'circuit'
                      ? 'bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:14px_14px]'
                      : face.backgroundPattern === 'diamonds'
                      ? 'bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.1)_45%,rgba(255,255,255,0.1)_55%,transparent_55%),linear-gradient(-45deg,transparent_45%,rgba(255,255,255,0.1)_45%,rgba(255,255,255,0.1)_55%,transparent_55%)] [background-size:16px_22px]'
                      : face.backgroundPattern === 'dots'
                      ? 'bg-[radial-gradient(rgba(255,255,255,0.15)_2px,transparent_2px)] [background-size:12px_12px]'
                      : face.backgroundPattern === 'runic'
                      ? 'bg-[radial-gradient(circle,_rgba(245,158,11,0.15)_10%,_transparent_20%)] [background-size:32px_32px]'
                      : face.backgroundPattern === 'sunburst'
                      ? 'bg-[conic-gradient(from_0deg_at_50%_50%,_rgba(255,255,255,0.08)_0deg_10deg,_transparent_10deg_20deg)]'
                      : 'bg-repeat'
                  }`}
                />
              )}

              {/* Safe Zone Boundary */}
              {showSafeZone && (
                <div
                  style={{
                    inset: `${safeMarginPx}px`,
                    borderRadius: cornerStyle === 'rounded' ? `${Math.max(2, ((cornerMm - 2) / cardFormat.widthMm) * baseWidthPx)}px` : '0px',
                  }}
                  className="absolute pointer-events-none border border-dashed border-emerald-400/60 z-30"
                  title="Area di Sicurezza (3mm interna): mantieni testi e icone importanti dentro questa linea"
                />
              )}

              {/* Cut Line Indicator */}
              {showCutLine && (
                <div
                  style={{
                    borderRadius: cornerStyle === 'rounded' ? `${(cornerMm / cardFormat.widthMm) * baseWidthPx}px` : '0px',
                  }}
                  className="absolute inset-0 pointer-events-none border border-amber-400/80 z-30"
                  title="Linea di Taglio / Rifilo"
                />
              )}

              {/* Elements rendering */}
              {face.elements.map((el) => {
                const isSelected = el.id === selectedElementId;
                const isOutOfGamut = colorMode === 'gamut_warning' && el.color && isColorOutOfGamut(el.color);

                return (
                  <div
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectElement(el.id);
                    }}
                    onPointerDown={(e) => handlePointerDown(e, el, 'move')}
                    style={{
                      left: `${el.x}%`,
                      top: `${el.y}%`,
                      width: `${el.width}%`,
                      height: `${el.height}%`,
                      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                      opacity: el.opacity ?? 1,
                      zIndex: el.zIndex ?? 1,
                    }}
                    className={`absolute select-none cursor-move flex items-center justify-center transition-shadow ${
                      isSelected
                        ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-black/50'
                        : 'hover:ring-1 hover:ring-amber-400/60'
                    }`}
                  >
                    {/* Out of gamut warning indicator */}
                    {isOutOfGamut && (
                      <div className="absolute -top-3 -right-3 z-40 bg-pink-600 text-white p-0.5 rounded-full shadow-md animate-pulse" title="Colore fuori dal gamut CMYK: risulterà meno brillante in stampa">
                        <AlertTriangle className="w-3 h-3" />
                      </div>
                    )}

                    {/* Element content */}
                    {el.type === 'text' && (
                      <div
                        style={{
                          fontFamily: el.fontFamily || 'Inter',
                          fontSize: `${((el.fontSize || 12) / 360) * baseWidthPx}px`,
                          fontWeight: el.fontWeight || 'normal',
                          fontStyle: el.fontStyle || 'normal',
                          color: el.color || '#000000',
                          textAlign: el.textAlign || 'center',
                          textShadow: el.shadow ? '0 2px 4px rgba(0,0,0,0.8)' : undefined,
                          WebkitTextStroke: el.strokeWidth && el.strokeColor ? `${el.strokeWidth}px ${el.strokeColor}` : undefined,
                        }}
                        className="w-full h-full flex items-center justify-center break-words leading-tight"
                      >
                        {el.text}
                      </div>
                    )}

                    {el.type === 'icon' && (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-full h-full fill-current"
                          viewBox="0 0 24 24"
                          style={{ color: el.tint || '#d97706' }}
                        >
                          <path
                            d={
                              GAME_ICONS.find((i) => i.id === el.iconName)?.svgPath ||
                              GAME_ICONS[0].svgPath
                            }
                          />
                        </svg>
                      </div>
                    )}

                    {el.type === 'shape' && (
                      <div
                        style={{
                          backgroundColor: el.fillColor || 'transparent',
                          borderColor: el.borderColor || 'transparent',
                          borderWidth: el.borderWidth ? `${el.borderWidth * 2}px` : 0,
                          borderRadius:
                            el.shapeType === 'circle'
                              ? '50%'
                              : el.borderRadius
                              ? `${el.borderRadius * 2}px`
                              : '0px',
                        }}
                        className="w-full h-full"
                      />
                    )}

                    {el.type === 'image' && el.url && (
                      <img
                        src={el.url}
                        alt={el.name}
                        className={`w-full h-full pointer-events-none rounded ${
                          el.fit === 'contain' ? 'object-contain' : 'object-cover'
                        }`}
                      />
                    )}

                    {/* On-element Quick Action Pill for Delete & Duplicate */}
                    {isSelected && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 bg-slate-900/95 backdrop-blur-md px-1.5 py-0.5 rounded-lg border border-amber-500/70 shadow-lg text-[10px] pointer-events-auto select-none whitespace-nowrap"
                      >
                        <button
                          onClick={() => onDeleteElement(el.id)}
                          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition shadow-xs"
                          title="Elimina elemento selezionato (Tasto Canc o Backspace)"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Elimina</span>
                        </button>
                        {onDuplicateElement && (
                          <button
                            onClick={() => onDuplicateElement(el.id)}
                            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer transition"
                            title="Duplica elemento"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Duplica</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Resize Handle for Selected Element */}
                    {isSelected && (
                      <div
                        onPointerDown={(e) => handlePointerDown(e, el, 'resize')}
                        className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-amber-400 border border-slate-900 rounded-sm cursor-nwse-resize shadow-sm hover:scale-125 transition-transform z-30"
                        title="Trascina per ridimensionare"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Controls: Undo/Redo, Physical Dimensions & Zoom */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: Quick Undo/Redo & Dimension Info */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Physical Dimension Pill */}
          <div className="flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg text-xs text-slate-300">
            <Ruler className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">
              {cardFormat.widthMm} x {cardFormat.heightMm} mm
            </span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              ({cardFormat.name})
            </span>
          </div>

          {/* Quick Undo / Redo in Canvas */}
          <div className="flex items-center gap-1 bg-slate-900/95 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg">
            {onUndo && (
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold cursor-pointer transition"
                title="Annulla ultima modifica (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Annulla</span>
              </button>
            )}

            {onRedo && (
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold cursor-pointer transition"
                title="Ripristina modifica (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Ripristina</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 shadow-lg text-xs text-slate-300 pointer-events-auto">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.15).toFixed(2)))}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="font-mono font-semibold text-[11px] w-12 text-center text-amber-400">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.15).toFixed(2)))}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoom(1)}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer ml-1"
            title="Reimposta 100%"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
