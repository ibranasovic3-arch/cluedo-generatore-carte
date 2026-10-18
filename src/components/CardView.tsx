import React, { useState } from 'react';
import { CluedoCard, CardSize, CARD_DIMENSIONS } from '../types/cluedo.ts';
import { renderCardArtwork } from '../utils/artworkLibrary.tsx';
import { RotateCw, Sparkles, Scissors } from 'lucide-react';

interface CardViewProps {
  card: CluedoCard;
  cardSize?: CardSize;
  forceSide?: 'front' | 'back';
  showBleedGuides?: boolean;
  interactiveFlip?: boolean;
  onEdit?: (card: CluedoCard) => void;
  scale?: number;
  className?: string;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  cardSize = 'hasbro_classic',
  forceSide,
  showBleedGuides = false,
  interactiveFlip = true,
  onEdit,
  scale = 1,
  className = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const displaySide = forceSide ? forceSide : isFlipped ? 'back' : 'front';

  const categoryLabels: Record<string, string> = {
    suspect: 'SOSPETTATO',
    weapon: 'ARMA DEL DELITTO',
    room: 'SCENA DEL DELITTO',
    clue: 'CARTA INDIZIO',
  };

  const badgeText = card.badgeText || categoryLabels[card.category] || card.category.toUpperCase();

  return (
    <div
      className={`relative select-none group inline-block transition-transform duration-200 ${className}`}
      style={{
        width: `${58 * 4.2 * scale}px`,
        height: `${89 * 4.2 * scale}px`,
        perspective: '1200px',
      }}
    >
      {/* 3D Flip Container */}
      <div
        className="w-full h-full relative transition-transform duration-500 rounded-xl shadow-xl hover:shadow-2xl"
        style={{
          transformStyle: 'preserve-3d',
          transform: displaySide === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ===================== FRONT SIDE ===================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#C5A059] flex flex-col justify-between p-2.5"
          style={{
            backfaceVisibility: 'hidden',
            boxShadow: 'inset 0 0 14px rgba(197, 160, 89, 0.25)',
          }}
        >
          {/* Card Bleed Guide Overlay */}
          {showBleedGuides && (
            <div className="absolute inset-1.5 border border-dashed border-red-500/70 pointer-events-none z-30 flex items-start justify-end p-0.5">
              <span className="text-[7px] text-red-600 font-mono bg-white/90 px-0.5 rounded">Taglio 2mm</span>
            </div>
          )}

          {/* Double Gold Ornate Filigree Frame */}
          <div className="absolute inset-1 border border-[#D4AF37] rounded-lg pointer-events-none" />
          <div className="absolute inset-1.5 border border-[#8C6D2D]/40 rounded-md pointer-events-none" />

          {/* Top Category Badge */}
          <div
            className="w-full py-1 px-2 rounded-t text-center shadow-sm relative z-10 flex items-center justify-center space-x-1"
            style={{
              backgroundColor: card.color || '#991B1B',
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-sm" />
            <span className="text-white text-[10px] tracking-widest font-black uppercase font-cinzel">
              {badgeText}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-sm" />
          </div>

          {/* Center Illustration Frame */}
          <div className="relative flex-1 my-1.5 bg-gradient-to-b from-[#F3EFE6] to-[#E9E2D4] rounded border border-[#C5A059] flex flex-col items-center justify-center overflow-hidden p-2 shadow-inner">
            {/* Background Corner Victorian Flourishes */}
            <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#C5A059]/60 pointer-events-none" />
            <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#C5A059]/60 pointer-events-none" />
            <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#C5A059]/60 pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#C5A059]/60 pointer-events-none" />

            {/* Custom Image or SVG Vector Artwork */}
            {card.customImageData ? (
              <img
                src={card.customImageData}
                alt={card.name}
                className="w-full h-full object-cover rounded shadow-md"
              />
            ) : (
              <div
                className="w-28 h-28 max-w-full max-h-full flex items-center justify-center drop-shadow-md"
                style={{ color: card.color || '#991B1B' }}
              >
                {renderCardArtwork(card.iconName, 'w-full h-full', card.color)}
              </div>
            )}
          </div>

          {/* Card Name Banner */}
          <div className="relative z-10">
            <div
              className="py-1 px-1.5 rounded shadow text-center relative border border-amber-400/40"
              style={{
                backgroundColor: card.color || '#991B1B',
              }}
            >
              <h3 className="text-white text-xs sm:text-sm font-bold font-serif tracking-wider truncate">
                {card.name}
              </h3>
            </div>

            {/* Subtitle / Trait */}
            {card.subtitle && (
              <p className="text-[9px] text-[#785E2F] font-serif italic text-center font-semibold mt-0.5 truncate">
                {card.subtitle}
              </p>
            )}

            {/* Description / Alibi Text */}
            <div className="bg-[#FAF7F2]/90 rounded p-1 mt-0.5 min-h-[38px] max-h-[46px] overflow-hidden border border-[#D5C29D]/50 text-[8px] text-[#3D3325] leading-tight font-serif text-center">
              {card.description}
            </div>

            {/* Card Footer Code & Cluedo Authentic Mark */}
            <div className="flex items-center justify-between text-[7px] text-[#8C6D2D] font-mono px-0.5 pt-1">
              <span>{card.cardIdCode || 'CLU-PRO'}</span>
              <span className="font-serif italic font-bold">CLUEDO HASBRO ED.</span>
            </div>
          </div>
        </div>

        {/* ===================== BACK SIDE ===================== */}
        <div
          className="absolute inset-0 w-full h-full rounded-xl overflow-hidden bg-[#530c14] border border-[#D4AF37] flex flex-col items-center justify-center p-3 text-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundImage: `radial-gradient(#7c1723 15%, transparent 16%), radial-gradient(#38060d 15%, transparent 16%)`,
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 8px 8px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)',
          }}
        >
          {/* Card Bleed Guide Overlay */}
          {showBleedGuides && (
            <div className="absolute inset-1.5 border border-dashed border-yellow-300/60 pointer-events-none z-30" />
          )}

          {/* Double Gold Filigree Borders */}
          <div className="absolute inset-1.5 border-2 border-[#D4AF37] rounded-lg pointer-events-none" />
          <div className="absolute inset-2.5 border border-[#FDE047]/50 rounded-md pointer-events-none" />

          {/* Center Ornate Seal */}
          <div className="w-36 h-36 rounded-full bg-[#35050b] border-2 border-[#D4AF37] shadow-2xl flex flex-col items-center justify-center p-2 relative">
            <div className="absolute inset-1 rounded-full border border-dashed border-[#FDE047]/40 pointer-events-none" />

            {/* Magnifier Icon */}
            <div className="w-10 h-10 text-amber-300 drop-shadow mb-1">
              {renderCardArtwork('magnifier', 'w-full h-full', '#FDE047')}
            </div>

            {/* Authentic Cluedo Logo */}
            <h2 className="text-[#FDE047] font-black text-xl tracking-[0.2em] font-cinzel drop-shadow-md">
              CLUEDO
            </h2>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#FDE047] to-transparent my-0.5" />
            <p className="text-[#E6C875] text-[7px] tracking-widest font-serif uppercase">
              CASI MISTERIOSI
            </p>
            <p className="text-[#D4AF37] text-[6px] font-mono tracking-tighter mt-0.5">
              EDIZIONE DA COLLEZIONE
            </p>
          </div>

          <div className="absolute bottom-2 text-[#E6C875]/80 text-[6.5px] font-serif italic tracking-wide">
            HASBRO GAMING COMPATIBILE
          </div>
        </div>
      </div>

      {/* Floating Action Controls on Hover */}
      {interactiveFlip && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex space-x-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFlipped(!isFlipped);
            }}
            className="p-1.5 bg-black/80 hover:bg-black text-amber-300 rounded-full shadow-lg backdrop-blur cursor-pointer hover:scale-110 transition-transform"
            title="Gira carta (Fronte / Retro)"
            aria-label="Gira carta"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              className="p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform"
              title="Modifica dettagli carta"
              aria-label="Modifica carta"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
