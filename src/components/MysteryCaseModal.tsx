import React, { useState } from 'react';
import { CluedoProject, MysteryCase } from '../types/cluedo.ts';
import { generateMysteryCase } from '../utils/cluedoRules.ts';
import { CardView } from './CardView.tsx';
import {
  Sparkles,
  Eye,
  EyeOff,
  FolderLock,
  RefreshCw,
  Printer,
  X,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

interface MysteryCaseModalProps {
  project: CluedoProject;
  isOpen: boolean;
  onClose: () => void;
  onSaveCase: (mysteryCase: MysteryCase) => void;
}

export const MysteryCaseModal: React.FC<MysteryCaseModalProps> = ({
  project,
  isOpen,
  onClose,
  onSaveCase,
}) => {
  const [activeCase, setActiveCase] = useState<MysteryCase | null>(
    project.activeCase || null
  );
  const [difficulty, setDifficulty] = useState<'Facile' | 'Classica' | 'Esperto'>('Classica');
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const newCase = generateMysteryCase(project.cards, difficulty);
    if (!newCase) {
      alert('Il mazzo deve contenere almeno 1 sospettato, 1 arma e 1 stanza.');
      return;
    }
    setActiveCase(newCase);
    setIsRevealed(false);
  };

  const suspectCard = project.cards.find((c) => c.id === activeCase?.suspectId);
  const weaponCard = project.cards.find((c) => c.id === activeCase?.weaponId);
  const roomCard = project.cards.find((c) => c.id === activeCase?.roomId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#1A1816] border border-[#C5A059] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2A231C] to-[#1A1816] border-b border-[#C5A059]/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100 font-cinzel">
                Generatore Caso Misterioso & Busta del Delitto
              </h2>
              <p className="text-xs text-amber-300/70">
                Crea la soluzione segreta della partita e genera indizi per i giocatori
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Controls to generate case */}
          <div className="bg-[#12100E] p-4 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <span className="text-xs font-semibold text-zinc-300">Difficoltà:</span>
              <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                {(['Facile', 'Classica', 'Esperto'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                      difficulty === diff
                        ? 'bg-amber-500 text-zinc-950 shadow'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Genera Nuovo Caso Casuale</span>
            </button>
          </div>

          {activeCase ? (
            <div className="space-y-6">
              {/* Mystery Briefing & Motive */}
              <div className="bg-[#141210] border border-[#C5A059]/40 rounded-xl p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    DOSSIER CRIMINALE SEGRETO • {activeCase.difficulty}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    ID: {activeCase.id.slice(0, 12)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-amber-100 font-cinzel">
                  {activeCase.title}
                </h3>

                <p className="text-xs text-zinc-300 font-serif leading-relaxed italic bg-[#1E1B17] p-3 rounded-lg border border-zinc-800">
                  "{activeCase.detectiveBriefing}"
                </p>

                <div className="pt-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                    Movente del Delitto:
                  </span>
                  <p className="text-xs text-zinc-300">{activeCase.motive}</p>
                </div>

                {/* Clues */}
                <div className="pt-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                    Indizi Speciali Rivelabili Durante il Gioco:
                  </span>
                  <ul className="space-y-1">
                    {activeCase.clues.map((clue, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-zinc-400 flex items-start space-x-2 bg-zinc-900/50 p-2 rounded border border-zinc-800/80"
                      >
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{clue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Secret Murder Solution Envelope (Busta del Delitto) */}
              <div className="bg-[#2D0A10] border-2 border-[#D4AF37] rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#D4AF37]/40 mb-4">
                  <div className="flex items-center space-x-2">
                    <FolderLock className="w-5 h-5 text-amber-300" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-200 font-cinzel uppercase">
                        Contenuto della Busta del Delitto
                      </h4>
                      <p className="text-[11px] text-amber-300/70">
                        Le 3 carte sigillate che risolvono l'omicidio
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRevealed(!isRevealed)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-black/60 hover:bg-black text-amber-300 rounded-lg text-xs font-semibold transition border border-amber-400/40 cursor-pointer"
                  >
                    {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{isRevealed ? 'Nascondi Soluzione' : 'Rivela Soluzione'}</span>
                  </button>
                </div>

                {/* 3 Secret Cards Grid */}
                {isRevealed ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
                    {suspectCard && (
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-red-300 uppercase tracking-widest mb-1">
                          1. IL COLPEVOLE
                        </span>
                        <CardView card={suspectCard} interactiveFlip={false} scale={0.65} />
                      </div>
                    )}
                    {weaponCard && (
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-1">
                          2. L'ARMA
                        </span>
                        <CardView card={weaponCard} interactiveFlip={false} scale={0.65} />
                      </div>
                    )}
                    {roomCard && (
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">
                          3. LA STANZA
                        </span>
                        <CardView card={roomCard} interactiveFlip={false} scale={0.65} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 bg-black/30 rounded-xl border border-dashed border-[#D4AF37]/50">
                    <FolderLock className="w-10 h-10 text-amber-400/80 animate-pulse" />
                    <h5 className="text-sm font-bold text-amber-200 font-cinzel">
                      Busta Sigillata Elettronicamente
                    </h5>
                    <p className="text-xs text-amber-300/60 max-w-md">
                      La soluzione è al sicuro. I giocatori possono iniziare l'indagine a Villa Tudor senza sbirciare!
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-[#141210] border border-zinc-800 rounded-xl p-6">
              <FolderLock className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-300 text-sm font-semibold mb-1">
                Nessun caso attualmente generato.
              </p>
              <p className="text-zinc-500 text-xs mb-4">
                Clicca su "Genera Nuovo Caso Casuale" per creare automaticamente la busta del delitto e il movente.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Genera Caso Adesso
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#141211] border-t border-zinc-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Chiudi
          </button>

          {activeCase && (
            <button
              type="button"
              onClick={() => {
                onSaveCase(activeCase);
                onClose();
              }}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Imposta Come Caso Attivo della Partita</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
