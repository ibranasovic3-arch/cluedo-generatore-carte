import React, { useState } from 'react';
import { CluedoProject } from '../types/cluedo.ts';
import {
  Layers,
  Printer,
  FileSpreadsheet,
  FolderLock,
  Cloud,
  FolderOpen,
  Plus,
  Copy,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentProject: CluedoProject;
  allProjects: CluedoProject[];
  activeView: 'deck' | 'print' | 'detective' | 'mystery';
  setActiveView: (view: 'deck' | 'print' | 'detective' | 'mystery') => void;
  onSelectProject: (id: string) => void;
  onCreateNewProject: () => void;
  onDuplicateProject: () => void;
  onResetProject: () => void;
  onOpenCloudSync: () => void;
  onOpenMysteryCase: () => void;
  lastSavedAt: number | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProject,
  allProjects,
  activeView,
  setActiveView,
  onSelectProject,
  onCreateNewProject,
  onDuplicateProject,
  onResetProject,
  onOpenCloudSync,
  onOpenMysteryCase,
  lastSavedAt,
}) => {
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#161311]/95 backdrop-blur-md border-b border-[#C5A059]/40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand / Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c1723] to-[#38060d] border border-[#D4AF37] flex items-center justify-center shadow-lg shadow-red-950/40">
              <span className="text-[#FDE047] font-black text-sm tracking-tighter font-cinzel">
                CLU
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black text-[#F5E6C8] font-cinzel tracking-wider flex items-center gap-1.5">
                  <span>CLUEDO</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                    CARD STUDIO PRO
                  </span>
                </h1>
              </div>

              {/* Project selector dropdown button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProjectsMenuOpen(!isProjectsMenuOpen)}
                  className="flex items-center space-x-1.5 text-xs text-amber-300/80 hover:text-amber-200 transition cursor-pointer font-serif"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold underline underline-offset-2 max-w-[140px] sm:max-w-[200px] truncate">
                    {currentProject.name}
                  </span>
                </button>

                {/* Project Menu Dropdown */}
                {isProjectsMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-[#1B1815] border border-[#C5A059] rounded-xl shadow-2xl p-2 z-50 divide-y divide-zinc-800">
                    <div className="pb-2 space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2">
                        Progetti Salvati nel Database Locale:
                      </span>
                      {allProjects.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            onSelectProject(p.id);
                            setIsProjectsMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between cursor-pointer ${
                            p.id === currentProject.id
                              ? 'bg-amber-500/20 text-amber-200 font-bold border border-amber-500/40'
                              : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <span className="truncate">{p.name}</span>
                          <span className="text-[10px] text-zinc-500">{p.cards.length} carte</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          onCreateNewProject();
                          setIsProjectsMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-amber-300 hover:bg-zinc-800 transition flex items-center space-x-2 cursor-pointer font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Crea Nuovo Mazzo da Zero</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDuplicateProject();
                          setIsProjectsMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-300 hover:bg-zinc-800 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Duplica Progetto Corrente</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Vuoi ripristinare il mazzo alle carte ufficiali Hasbro Cluedo?')) {
                            onResetProject();
                          }
                          setIsProjectsMenuOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-red-300 hover:bg-red-950/30 transition flex items-center space-x-2 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Ripristina Originali Hasbro</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center: Main View Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#100E0C] p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveView('deck')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeView === 'deck'
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mazzo Carte ({currentProject.cards.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('print')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeView === 'print'
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Stampa & PDF Cartoncino</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('detective')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeView === 'detective'
                  ? 'bg-amber-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Taccuino Detective</span>
            </button>
          </nav>

          {/* Right: Autosave status & Cloud/Mystery buttons */}
          <div className="flex items-center space-x-2">
            {/* Auto-save status indicator */}
            <div
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 rounded-full text-emerald-300 text-[10px] font-medium"
              title="Ogni modifica viene salvata in tempo reale nel database locale del browser"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Autosave attivo</span>
            </div>

            {/* Mystery Case button */}
            <button
              type="button"
              onClick={onOpenMysteryCase}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-amber-200 border border-amber-500/40 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              title="Genera il caso misterioso con la busta segreta della soluzione"
            >
              <FolderLock className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Caso Misterioso</span>
            </button>

            {/* Cloud Sync button */}
            <button
              type="button"
              onClick={onOpenCloudSync}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#25201A] hover:bg-[#322B23] text-amber-300 border border-[#C5A059]/40 rounded-xl text-xs font-bold transition cursor-pointer"
              title="Sincronizza il progetto tra smartphone, tablet e PC"
            >
              <Cloud className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Cloud Sync</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-zinc-800/80 space-x-1">
          <button
            type="button"
            onClick={() => setActiveView('deck')}
            className={`flex-1 py-1.5 px-2 text-center text-xs font-bold rounded-lg transition whitespace-nowrap ${
              activeView === 'deck' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400'
            }`}
          >
            Mazzo ({currentProject.cards.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('print')}
            className={`flex-1 py-1.5 px-2 text-center text-xs font-bold rounded-lg transition whitespace-nowrap ${
              activeView === 'print' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400'
            }`}
          >
            Stampa & PDF
          </button>
          <button
            type="button"
            onClick={() => setActiveView('detective')}
            className={`flex-1 py-1.5 px-2 text-center text-xs font-bold rounded-lg transition whitespace-nowrap ${
              activeView === 'detective' ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400'
            }`}
          >
            Taccuino
          </button>
        </div>
      </div>
    </header>
  );
};
