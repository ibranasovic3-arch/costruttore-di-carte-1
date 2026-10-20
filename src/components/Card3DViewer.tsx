import React, { useState, useRef } from 'react';
import {
  Rotate3d,
  Sparkles,
  Layers,
  Play,
  Pause,
  Maximize,
  HelpCircle,
} from 'lucide-react';
import { CardFace, CardFormatId, CornerStyle, FinishType } from '../types/card.ts';
import { getCardDimensions } from '../utils/cardUtils.ts';
import { GAME_ICONS } from '../data/assetLibrary.ts';

interface Card3DViewerProps {
  cardName: string;
  front: CardFace;
  back: CardFace;
  format: CardFormatId;
  customWidthMm?: number;
  customHeightMm?: number;
  cornerStyle: CornerStyle;
  cornerMm: number;
}

export const Card3DViewer: React.FC<Card3DViewerProps> = ({
  cardName,
  front,
  back,
  format,
  customWidthMm,
  customHeightMm,
  cornerStyle,
  cornerMm,
}) => {
  const cardFormat = getCardDimensions(format, customWidthMm, customHeightMm);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [finish, setFinish] = useState<FinishType>('glossy');
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAutoSpin) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt limits: -25 to +25 degrees
    const rotateY = ((x - centerX) / centerX) * 22;
    const rotateX = -((y - centerY) / centerY) * 22;

    setTilt({ x: rotateX, y: rotateY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    if (!isAutoSpin) {
      setTilt({ x: 0, y: 0 });
      setGlarePos({ x: 50, y: 50 });
    }
  };

  const cardWidthPx = 340;
  const ratio = cardFormat.heightMm / cardFormat.widthMm;
  const cardHeightPx = cardWidthPx * ratio;
  const borderRadiusPx = cornerStyle === 'rounded' ? `${(cornerMm / cardFormat.widthMm) * cardWidthPx}px` : '0px';

  const renderFaceContent = (face: CardFace, label: string) => {
    const bgStyle: React.CSSProperties = {
      backgroundColor: face.backgroundColor || '#ffffff',
      backgroundImage:
        face.backgroundGradient?.enabled && face.backgroundGradient.colors.length >= 2
          ? face.backgroundGradient.type === 'radial'
            ? `radial-gradient(circle at center, ${face.backgroundGradient.colors.join(', ')})`
            : `linear-gradient(${face.backgroundGradient.angle || 180}deg, ${face.backgroundGradient.colors.join(', ')})`
          : 'none',
    };

    return (
      <div
        style={{
          width: `${cardWidthPx}px`,
          height: `${cardHeightPx}px`,
          borderRadius: borderRadiusPx,
          ...bgStyle,
        }}
        className="relative overflow-hidden select-none shadow-2xl border border-white/10 w-full h-full"
      >
        {/* Pattern texture overlay */}
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

        {/* Finish Glare / Specular Layer */}
        {finish === 'glossy' && (
          <div
            style={{
              backgroundImage: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 35%, transparent 70%)`,
            }}
            className="absolute inset-0 pointer-events-none z-30 transition-opacity mix-blend-overlay"
          />
        )}

        {finish === 'linen' && (
          <div className="absolute inset-0 pointer-events-none z-30 opacity-25 mix-blend-overlay bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />
        )}

        {finish === 'softtouch' && (
          <div className="absolute inset-0 pointer-events-none z-30 opacity-15 mix-blend-soft-light bg-gradient-to-tr from-white/30 to-black/30" />
        )}

        {/* Elements */}
        {face.elements?.map((el) => {
          if (el.visible === false) return null;
          return (
            <div
              key={el.id}
              style={{
                left: `${el.x}%`,
                top: `${el.y}%`,
                width: `${el.width}%`,
                height: `${el.height}%`,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                opacity: el.opacity ?? 1,
                zIndex: el.zIndex ?? 1,
              }}
              className="absolute flex items-center justify-center pointer-events-none"
            >
              {el.type === 'text' && (
                <div
                  style={{
                    fontFamily: el.fontFamily || 'Inter',
                    fontSize: `${((el.fontSize || 12) / 360) * cardWidthPx}px`,
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
                  className={`w-full h-full rounded ${
                    el.fit === 'contain' ? 'object-contain' : 'object-cover'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 bg-radial from-slate-900 to-slate-950 flex flex-col select-none overflow-hidden relative">
      {/* Top Floating Controls */}
      <div className="p-4 z-20 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase tracking-wider block">
            Visualizzatore 3D Realistico
          </span>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>{cardName}</span>
            <span className="text-xs text-slate-400 font-normal">
              ({cardFormat.widthMm} x {cardFormat.heightMm} mm)
            </span>
          </h2>
        </div>

        {/* Finish & Flip Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Finitura superficiale */}
          <div className="flex items-center bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 font-medium">Finitura:</span>
            <button
              onClick={() => setFinish('matte')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                finish === 'matte' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Opaca (Anti-Riflesso)
            </button>
            <button
              onClick={() => setFinish('glossy')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                finish === 'glossy' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lucida (UV Glare)
            </button>
            <button
              onClick={() => setFinish('linen')}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                finish === 'linen' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lino Casinò
            </button>
          </div>

          {/* Auto spin toggle */}
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-medium cursor-pointer transition ${
              isAutoSpin
                ? 'bg-amber-600/20 text-amber-300 border-amber-600/50'
                : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Rotazione Continua 360°"
          >
            {isAutoSpin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Auto-Giro</span>
          </button>

          {/* Flip button */}
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
          >
            <Rotate3d className="w-4 h-4" />
            <span>Capovolgi ({isFlipped ? 'Mostra Fronte' : 'Mostra Retro'})</span>
          </button>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
        className="flex-1 flex items-center justify-center cursor-pointer p-8 perspective-[1200px]"
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: isAutoSpin
              ? undefined
              : `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg)`,
            transition: isAutoSpin ? undefined : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className={`relative ${isAutoSpin ? 'animate-spin-slow' : ''}`}
        >
          {/* Card Thickness / Rim Layer */}
          <div
            style={{
              width: `${cardWidthPx}px`,
              height: `${cardHeightPx}px`,
              borderRadius: borderRadiusPx,
              transform: 'translateZ(0px)',
            }}
            className="absolute inset-0 bg-slate-800 shadow-2xl pointer-events-none"
          />

          {/* FRONT FACE */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg) translateZ(2px)',
            }}
            className="relative"
          >
            {renderFaceContent(front, 'FRONTE')}
          </div>

          {/* BACK FACE */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg) translateZ(2px)',
            }}
            className="absolute inset-0"
          >
            {renderFaceContent(back, 'RETRO')}
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Muovi il mouse per inclinare e ammirare il riflesso luminoso • Clicca sulla carta per capovolgerla</span>
      </div>
    </div>
  );
};
