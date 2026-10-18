import React, { useState } from 'react';
import { CluedoProject } from '../types/cluedo.ts';
import { generateDetectiveSheetPdf } from '../utils/pdfGenerator.ts';
import { Download, Printer, FileSpreadsheet, Check, X, HelpCircle } from 'lucide-react';

interface DetectiveSheetViewProps {
  project: CluedoProject;
}

export const DetectiveSheetView: React.FC<DetectiveSheetViewProps> = ({ project }) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Io',
    'G2',
    'G3',
    'G4',
    'G5',
    'G6',
  ]);

  // Interactive digital checklist state
  const [checkedCells, setCheckedCells] = useState<Record<string, string>>({});

  const suspects = project.cards.filter((c) => c.category === 'suspect');
  const weapons = project.cards.filter((c) => c.category === 'weapon');
  const rooms = project.cards.filter((c) => c.category === 'room');

  const toggleCell = (itemId: string, colIdx: number) => {
    const key = `${itemId}_${colIdx}`;
    const current = checkedCells[key];
    const next = !current ? 'X' : current === 'X' ? 'V' : current === 'V' ? '?' : '';
    setCheckedCells({ ...checkedCells, [key]: next });
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const blob = await generateDetectiveSheetPdf(project);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cluedo_taccuino_detective_${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Errore generazione PDF Taccuino:', err);
      alert('Impossibile scaricare il taccuino PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#1C1814] border border-[#C5A059]/40 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-amber-100 font-cinzel">
              Taccuino Indagini del Detective (Scheda Giocatore)
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Scheda di deduzione Cluedo aggiornata con i tuoi sospettati, armi e stanze personalizzati. Stampabile in PDF (4 schede per foglio A4).
          </p>
        </div>

        {/* PDF Download Button */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Generazione...' : 'Scarica PDF Taccuino (4 per A4)'}</span>
          </button>
        </div>
      </div>

      {/* Main Detective Sheet Preview Container */}
      <div className="max-w-2xl mx-auto bg-[#FAF7F2] text-zinc-900 border-2 border-[#8C6D2D] rounded-2xl p-4 sm:p-8 shadow-2xl">
        {/* Sheet Header */}
        <div className="text-center pb-4 border-b-2 border-[#8C6D2D] mb-4">
          <div className="inline-block bg-[#530c14] text-[#FDE047] px-4 py-1 rounded font-cinzel font-bold text-sm tracking-widest uppercase mb-1">
            CLUEDO • TACCUINO INDAGINI
          </div>
          <h3 className="text-xs font-serif font-bold text-[#530c14] uppercase tracking-wider">
            {project.name}
          </h3>
          <p className="text-[10px] text-zinc-500 italic mt-0.5">
            Clicca sulle caselle per segnare indizi: X (Non è), V (Ha la carta), ? (Dubbio)
          </p>
        </div>

        {/* Players columns name row */}
        <div className="grid grid-cols-12 gap-1 pb-2 border-b border-zinc-300 text-xs font-bold font-serif text-[#530c14]">
          <div className="col-span-6 pl-2">Elemento da Indagare</div>
          <div className="col-span-6 grid grid-cols-6 gap-1 text-center font-mono text-[10px]">
            {playerNames.map((name, idx) => (
              <input
                key={idx}
                type="text"
                value={name}
                onChange={(e) => {
                  const updated = [...playerNames];
                  updated[idx] = e.target.value;
                  setPlayerNames(updated);
                }}
                className="w-full text-center bg-transparent border-b border-zinc-400 focus:border-amber-600 text-[10px] font-bold text-zinc-800 outline-none"
              />
            ))}
          </div>
        </div>

        {/* Section 1: SOSPETTATI */}
        <div className="mt-3">
          <div className="bg-[#530c14] text-white text-[11px] font-bold px-2 py-0.5 font-cinzel tracking-wider rounded-t">
            SOSPETTATI ({suspects.length})
          </div>
          <div className="divide-y divide-zinc-200 border-x border-b border-zinc-300">
            {suspects.map((s) => (
              <div key={s.id} className="grid grid-cols-12 gap-1 items-center py-1 px-2 hover:bg-amber-50">
                <div className="col-span-6 flex items-center space-x-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color || '#991B1B' }}
                  />
                  <span className="text-xs font-serif font-semibold text-zinc-900 truncate">
                    {s.name}
                  </span>
                </div>
                <div className="col-span-6 grid grid-cols-6 gap-1">
                  {playerNames.map((_, colIdx) => {
                    const key = `${s.id}_${colIdx}`;
                    const val = checkedCells[key] || '';
                    return (
                      <button
                        key={colIdx}
                        type="button"
                        onClick={() => toggleCell(s.id, colIdx)}
                        className={`h-6 rounded border text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                          val === 'X'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : val === '✓'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                            : val === '?'
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-white border-zinc-300 hover:bg-zinc-100 text-transparent'
                        }`}
                      >
                        {val || '-'}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: ARMI */}
        <div className="mt-4">
          <div className="bg-[#B45309] text-white text-[11px] font-bold px-2 py-0.5 font-cinzel tracking-wider rounded-t">
            ARMI DEL DELITTO ({weapons.length})
          </div>
          <div className="divide-y divide-zinc-200 border-x border-b border-zinc-300">
            {weapons.map((w) => (
              <div key={w.id} className="grid grid-cols-12 gap-1 items-center py-1 px-2 hover:bg-amber-50">
                <div className="col-span-6 flex items-center space-x-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: w.color || '#B45309' }}
                  />
                  <span className="text-xs font-serif font-semibold text-zinc-900 truncate">
                    {w.name}
                  </span>
                </div>
                <div className="col-span-6 grid grid-cols-6 gap-1">
                  {playerNames.map((_, colIdx) => {
                    const key = `${w.id}_${colIdx}`;
                    const val = checkedCells[key] || '';
                    return (
                      <button
                        key={colIdx}
                        type="button"
                        onClick={() => toggleCell(w.id, colIdx)}
                        className={`h-6 rounded border text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                          val === 'X'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : val === '✓'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                            : val === '?'
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-white border-zinc-300 hover:bg-zinc-100 text-transparent'
                        }`}
                      >
                        {val || '-'}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: STANZE */}
        <div className="mt-4">
          <div className="bg-[#3F3F46] text-white text-[11px] font-bold px-2 py-0.5 font-cinzel tracking-wider rounded-t">
            STANZE / LUOGHI ({rooms.length})
          </div>
          <div className="divide-y divide-zinc-200 border-x border-b border-zinc-300">
            {rooms.map((r) => (
              <div key={r.id} className="grid grid-cols-12 gap-1 items-center py-1 px-2 hover:bg-amber-50">
                <div className="col-span-6 flex items-center space-x-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: r.color || '#3F3F46' }}
                  />
                  <span className="text-xs font-serif font-semibold text-zinc-900 truncate">
                    {r.name}
                  </span>
                </div>
                <div className="col-span-6 grid grid-cols-6 gap-1">
                  {playerNames.map((_, colIdx) => {
                    const key = `${r.id}_${colIdx}`;
                    const val = checkedCells[key] || '';
                    return (
                      <button
                        key={colIdx}
                        type="button"
                        onClick={() => toggleCell(r.id, colIdx)}
                        className={`h-6 rounded border text-xs font-mono font-bold flex items-center justify-center transition cursor-pointer ${
                          val === 'X'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : val === '✓'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                            : val === '?'
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-white border-zinc-300 hover:bg-zinc-100 text-transparent'
                        }`}
                      >
                        {val || '-'}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Solution Box: Busta del Delitto */}
        <div className="mt-6 p-4 bg-[#F2ECE1] border-2 border-dashed border-[#8C6D2D] rounded-xl text-center">
          <span className="text-[11px] font-bold text-[#530c14] uppercase tracking-wider font-cinzel">
            La Mia Accusa Finale (Busta del Delitto)
          </span>
          <div className="grid grid-cols-3 gap-3 mt-2 text-xs">
            <div className="bg-white p-2 rounded border border-zinc-300">
              <span className="block text-[9px] text-zinc-400 font-bold uppercase">Chi (Sospettato)</span>
              <input
                type="text"
                placeholder="Nome..."
                className="w-full text-center font-bold text-[#530c14] text-xs outline-none bg-transparent"
              />
            </div>
            <div className="bg-white p-2 rounded border border-zinc-300">
              <span className="block text-[9px] text-zinc-400 font-bold uppercase">Con Cosa (Arma)</span>
              <input
                type="text"
                placeholder="Arma..."
                className="w-full text-center font-bold text-[#B45309] text-xs outline-none bg-transparent"
              />
            </div>
            <div className="bg-white p-2 rounded border border-zinc-300">
              <span className="block text-[9px] text-zinc-400 font-bold uppercase">Dove (Stanza)</span>
              <input
                type="text"
                placeholder="Stanza..."
                className="w-full text-center font-bold text-zinc-800 text-xs outline-none bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
