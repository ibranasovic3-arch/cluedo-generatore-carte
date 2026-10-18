import React, { useState } from 'react';
import { CluedoProject, CARD_DIMENSIONS, CardSize } from '../types/cluedo.ts';
import { CardView } from './CardView.tsx';
import { generateDuplexCardsPdf } from '../utils/pdfGenerator.ts';
import { getDuplexBackIndex } from '../utils/cluedoRules.ts';
import {
  Printer,
  Download,
  Settings2,
  CheckCircle2,
  Layers,
  Scissors,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface PrintViewProps {
  project: CluedoProject;
  onUpdatePrintSettings: (settings: CluedoProject['printSettings']) => void;
}

export const PrintView: React.FC<PrintViewProps> = ({
  project,
  onUpdatePrintSettings,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [sheetSidePreview, setSheetSidePreview] = useState<'front' | 'back'>('front');

  const settings = project.printSettings;
  const cards = project.cards;

  const cardDim = CARD_DIMENSIONS[settings.cardSize] || CARD_DIMENSIONS.hasbro_classic;
  const cols = 3;
  const rows = 3;
  const cardsPerPage = cols * rows;
  const totalSheets = Math.ceil(cards.length / cardsPerPage);

  const currentSheetCards = cards.slice(
    activeSheetIndex * cardsPerPage,
    (activeSheetIndex + 1) * cardsPerPage
  );

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const blob = await generateDuplexCardsPdf(project);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cluedo_carte_cartoncino_${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Errore generazione PDF:', err);
      alert('Impossibile generare il PDF. Riprova tra poco.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#1C1814] border border-[#C5A059]/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <Printer className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-amber-100 font-cinzel">
              Stampa & PDF Professionale per Cartoncino
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Allineamento perfetto Fronte / Retro per stampanti fronte-retro o doppio passaggio, con segni di taglio da 2mm.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Generazione PDF in corso...' : 'Scarica PDF Cartoncino (Fronte/Retro)'}</span>
          </button>

          <button
            type="button"
            onClick={handleBrowserPrint}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition border border-zinc-700 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Stampa da Browser</span>
          </button>
        </div>
      </div>

      {/* Grid: Settings Panel & Sheet Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#181512] border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
              <Settings2 className="w-4 h-4" />
              <span>Impostazioni Foglio & Cartoncino</span>
            </h3>

            {/* Paper Size */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Formato Carta
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdatePrintSettings({ ...settings, paperSize: 'a4' })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    settings.paperSize === 'a4'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                      : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  A4 Standard (210×297)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdatePrintSettings({ ...settings, paperSize: 'letter' })}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    settings.paperSize === 'letter'
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                      : 'border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  US Letter (8.5×11")
                </button>
              </div>
            </div>

            {/* Card Size Format */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Dimensione Carte
              </label>
              <select
                value={settings.cardSize}
                onChange={(e) =>
                  onUpdatePrintSettings({ ...settings, cardSize: e.target.value as CardSize })
                }
                className="w-full bg-[#110F0E] border border-zinc-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
              >
                <option value="hasbro_classic">Originale Hasbro Cluedo (58 × 89 mm)</option>
                <option value="bridge">Standard Euro / Bridge (56 × 87 mm)</option>
                <option value="poker">Standard Poker Board Game (63.5 × 88.9 mm)</option>
              </select>
            </div>

            {/* Duplex Mode */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Modalità Fronte / Retro
              </label>
              <select
                value={settings.duplexMode}
                onChange={(e) =>
                  onUpdatePrintSettings({
                    ...settings,
                    duplexMode: e.target.value as any,
                  })
                }
                className="w-full bg-[#110F0E] border border-zinc-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
              >
                <option value="front_and_back_pages">Pagine Alternate (Pag. 1 Fronti, Pag. 2 Retro speculari)</option>
                <option value="front_only">Solo Pagine Fronti</option>
                <option value="back_only">Solo Pagine Retro</option>
              </select>
            </div>

            {/* Checkboxes: Crop marks & Card ID */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <label className="flex items-center space-x-2.5 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showCropMarks}
                  onChange={(e) =>
                    onUpdatePrintSettings({ ...settings, showCropMarks: e.target.checked })
                  }
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400 bg-zinc-900"
                />
                <span className="flex items-center space-x-1.5">
                  <Scissors className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mostra Segni di Taglio (Crop Marks)</span>
                </span>
              </label>

              <label className="flex items-center space-x-2.5 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showCardIdCode}
                  onChange={(e) =>
                    onUpdatePrintSettings({ ...settings, showCardIdCode: e.target.checked })
                  }
                  className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400 bg-zinc-900"
                />
                <span>Stampa Codice Identificativo (es. CLU-S01)</span>
              </label>
            </div>

            {/* Cardstock Tips Box */}
            <div className="bg-[#110F0E] p-3.5 rounded-xl border border-amber-500/20 space-y-1.5 text-[11px] text-zinc-300">
              <span className="font-bold text-amber-300 flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Consiglio per Cartoncino da Gioco:</span>
              </span>
              <p className="text-zinc-400 leading-relaxed">
                Per carte rigide come quelle originali Hasbro, usa cartoncino da <strong>250g o 300g satinato</strong>. Stampa al <strong>100% di scala</strong> (non adattare ai margini) per un allineamento fronte-retro al millimetro.
              </p>
            </div>
          </div>
        </div>

        {/* Sheet Preview Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Sheet Selector Header */}
          <div className="bg-[#181512] border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-zinc-400">Foglio di Stampa:</span>
              <div className="flex space-x-1">
                {Array.from({ length: totalSheets }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSheetIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeSheetIndex === idx
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    Foglio {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Preview: Front vs Back of this Sheet */}
            <div className="flex bg-[#110F0E] p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setSheetSidePreview('front')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  sheetSidePreview === 'front'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Anteprima Fronti (Pag. {(activeSheetIndex * 2) + 1})
              </button>
              <button
                type="button"
                onClick={() => setSheetSidePreview('back')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  sheetSidePreview === 'back'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Anteprima Retro Speculare (Pag. {(activeSheetIndex * 2) + 2})
              </button>
            </div>
          </div>

          {/* Realistic A4/Letter Sheet Canvas Preview with Crop Marks */}
          <div className="bg-[#141210] border border-zinc-800/80 rounded-2xl p-4 sm:p-8 flex items-center justify-center overflow-x-auto shadow-inner">
            <div
              className="bg-[#FFFDF9] text-zinc-900 shadow-2xl rounded p-6 relative border border-zinc-400"
              style={{
                width: '640px',
                minHeight: '840px',
              }}
            >
              {/* Sheet Title for Print Preview */}
              <div className="flex justify-between items-center text-[10px] text-zinc-500 pb-3 border-b border-zinc-300 mb-4 font-mono">
                <span>CLUEDO STUDIO PRO • {settings.paperSize.toUpperCase()} ({cardDim.label})</span>
                <span>FOGLIO {activeSheetIndex + 1} DI {totalSheets} • {sheetSidePreview.toUpperCase()}</span>
              </div>

              {/* 3x3 Card Grid */}
              <div className="grid grid-cols-3 gap-3 justify-items-center">
                {Array.from({ length: cardsPerPage }).map((_, slotIdx) => {
                  let cardToShow = currentSheetCards[slotIdx];

                  if (sheetSidePreview === 'back' && currentSheetCards.length > 0) {
                    // Mirror column position for duplex back side!
                    const col = slotIdx % cols;
                    const row = Math.floor(slotIdx / cols);
                    const mirroredCol = cols - 1 - col;
                    const sourceIdx = row * cols + mirroredCol;
                    cardToShow = currentSheetCards[sourceIdx];
                  }

                  return (
                    <div
                      key={slotIdx}
                      className="relative border border-zinc-300 rounded-lg p-0.5 bg-white shadow-sm flex items-center justify-center"
                      style={{ width: '180px', height: '254px' }}
                    >
                      {/* Corner Crop Marks */}
                      {settings.showCropMarks && (
                        <>
                          <div className="absolute -top-1.5 -left-1.5 w-2 h-2 border-t-2 border-l-2 border-zinc-900 pointer-events-none" />
                          <div className="absolute -top-1.5 -right-1.5 w-2 h-2 border-t-2 border-r-2 border-zinc-900 pointer-events-none" />
                          <div className="absolute -bottom-1.5 -left-1.5 w-2 h-2 border-b-2 border-l-2 border-zinc-900 pointer-events-none" />
                          <div className="absolute -bottom-1.5 -right-1.5 w-2 h-2 border-b-2 border-r-2 border-zinc-900 pointer-events-none" />
                        </>
                      )}

                      {cardToShow ? (
                        <CardView
                          card={cardToShow}
                          forceSide={sheetSidePreview}
                          interactiveFlip={false}
                          scale={0.70}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded text-zinc-300 text-[10px]">
                          <span>Slot Vuoto</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200 flex justify-between items-center text-[9px] text-zinc-400">
                <span>Stampa con orientamento verticale • Scala 100% (Non adattare)</span>
                <span>Progettato per Cluedo Hasbro da tavolo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
