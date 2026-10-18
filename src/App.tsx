import React, { useState, useEffect, useRef } from 'react';
import { CluedoProject, CluedoCard, CardCategory, MysteryCase, PrintSettings } from './types/cluedo.ts';
import { INITIAL_PROJECT } from './data/defaultCluedoData.ts';
import {
  getAllProjects,
  getActiveProject,
  saveProject,
  deleteProject,
  parseCloudSyncCode,
} from './utils/storage.ts';
import { Navbar } from './components/Navbar.tsx';
import { CardGrid } from './components/CardGrid.tsx';
import { CardEditorModal } from './components/CardEditorModal.tsx';
import { PrintView } from './components/PrintView.tsx';
import { DetectiveSheetView } from './components/DetectiveSheetView.tsx';
import { MysteryCaseModal } from './components/MysteryCaseModal.tsx';
import { CloudSyncModal } from './components/CloudSyncModal.tsx';
import { Sparkles, Plus, FolderPlus, Shield } from 'lucide-react';

export default function App() {
  const [currentProject, setCurrentProject] = useState<CluedoProject>(INITIAL_PROJECT);
  const [allProjects, setAllProjects] = useState<CluedoProject[]>([INITIAL_PROJECT]);
  const [activeView, setActiveView] = useState<'deck' | 'print' | 'detective' | 'mystery'>('deck');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // Modals state
  const [editingCard, setEditingCard] = useState<CluedoCard | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [isMysteryCaseOpen, setIsMysteryCaseOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const isInitialLoad = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Load from Local Database & URL Cloud Sync check
  useEffect(() => {
    async function init() {
      // Check for URL Cloud Sync hash: #sync=<base64>
      if (typeof window !== 'undefined' && window.location.hash.startsWith('#sync=')) {
        const hashPayload = window.location.hash.replace('#sync=', '');
        const synced = parseCloudSyncCode(hashPayload);
        if (synced) {
          await saveProject(synced);
          setCurrentProject(synced);
          const projects = await getAllProjects();
          setAllProjects(projects);
          setLastSavedAt(Date.now());
          isInitialLoad.current = false;
          // clear hash without reload
          window.history.replaceState(null, '', window.location.pathname);
          return;
        }
      }

      // Normal Local Database load
      const active = await getActiveProject();
      const projects = await getAllProjects();
      setCurrentProject(active);
      setAllProjects(projects);
      setLastSavedAt(active.updatedAt || Date.now());
      isInitialLoad.current = false;
    }

    init();
  }, []);

  // 2. Debounced Automatic Saving to Local Database (Autosave)
  useEffect(() => {
    if (isInitialLoad.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      await saveProject(currentProject);
      setLastSavedAt(Date.now());
      const projects = await getAllProjects();
      setAllProjects(projects);
    }, 450);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [currentProject]);

  // Project Actions
  const handleSelectProject = (id: string) => {
    const selected = allProjects.find((p) => p.id === id);
    if (selected) {
      setCurrentProject(selected);
    }
  };

  const handleCreateNewProject = (name: string) => {
    const newProj: CluedoProject = {
      ...INITIAL_PROJECT,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim() || 'Nuovo Caso Personalizzato',
      cards: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentProject(newProj);
    setIsNewProjectModalOpen(false);
    setNewProjectName('');
  };

  const handleDuplicateProject = () => {
    const duplicated: CluedoProject = {
      ...currentProject,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${currentProject.name} (Copia)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentProject(duplicated);
  };

  const handleResetToHasbro = () => {
    const resetProj: CluedoProject = {
      ...INITIAL_PROJECT,
      id: currentProject.id,
      name: currentProject.name,
      updatedAt: Date.now(),
    };
    setCurrentProject(resetProj);
  };

  // Card Operations
  const handleAddCard = (category: CardCategory) => {
    const categoryCount = currentProject.cards.filter((c) => c.category === category).length;
    const prefix = category === 'suspect' ? 'S' : category === 'weapon' ? 'W' : category === 'room' ? 'R' : 'C';

    const defaultNames: Record<CardCategory, string> = {
      suspect: `Nuovo Sospettato ${categoryCount + 1}`,
      weapon: `Nuova Arma ${categoryCount + 1}`,
      room: `Nuova Stanza ${categoryCount + 1}`,
      clue: `Nuovo Indizio ${categoryCount + 1}`,
    };

    const defaultColors: Record<CardCategory, string> = {
      suspect: '#B91C1C',
      weapon: '#B45309',
      room: '#3F3F46',
      clue: '#831843',
    };

    const newCard: CluedoCard = {
      id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: defaultNames[category],
      category,
      subtitle: 'Personalizzato',
      description: 'Inserisci qui la descrizione, alibi o dettaglio del delitto...',
      color: defaultColors[category],
      iconType: 'builtin',
      iconName: category === 'suspect' ? 'detective' : category === 'weapon' ? 'candlestick' : category === 'room' ? 'hall' : 'alibi',
      cardBackStyle: 'classic_hasbro',
      cardIdCode: `CLU-${prefix}${String(categoryCount + 1).padStart(2, '0')}`,
      isCustom: true,
    };

    setEditingCard(newCard);
    setIsEditorOpen(true);
  };

  const handleEditCard = (card: CluedoCard) => {
    setEditingCard(card);
    setIsEditorOpen(true);
  };

  const handleSaveCard = (updatedCard: CluedoCard) => {
    const exists = currentProject.cards.some((c) => c.id === updatedCard.id);
    let updatedList: CluedoCard[];

    if (exists) {
      updatedList = currentProject.cards.map((c) =>
        c.id === updatedCard.id ? updatedCard : c
      );
    } else {
      updatedList = [...currentProject.cards, updatedCard];
    }

    setCurrentProject({
      ...currentProject,
      cards: updatedList,
      updatedAt: Date.now(),
    });
  };

  const handleDuplicateCard = (card: CluedoCard) => {
    const duplicated: CluedoCard = {
      ...card,
      id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${card.name} (Copia)`,
      cardIdCode: `${card.cardIdCode || 'CLU'}-B`,
      isCustom: true,
    };
    setCurrentProject({
      ...currentProject,
      cards: [...currentProject.cards, duplicated],
      updatedAt: Date.now(),
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setCurrentProject({
      ...currentProject,
      cards: currentProject.cards.filter((c) => c.id !== cardId),
      updatedAt: Date.now(),
    });
  };

  const handleUpdatePrintSettings = (settings: PrintSettings) => {
    setCurrentProject({
      ...currentProject,
      printSettings: settings,
      updatedAt: Date.now(),
    });
  };

  const handleSaveMysteryCase = (mysteryCase: MysteryCase) => {
    setCurrentProject({
      ...currentProject,
      activeCase: mysteryCase,
      savedCases: [...(currentProject.savedCases || []), mysteryCase],
      updatedAt: Date.now(),
    });
  };

  const handleImportProject = async (imported: CluedoProject) => {
    await saveProject(imported);
    setCurrentProject(imported);
    const projects = await getAllProjects();
    setAllProjects(projects);
  };

  return (
    <div className="min-h-screen bg-[#0E0C0B] text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        currentProject={currentProject}
        allProjects={allProjects}
        activeView={activeView}
        setActiveView={setActiveView}
        onSelectProject={handleSelectProject}
        onCreateNewProject={() => setIsNewProjectModalOpen(true)}
        onDuplicateProject={handleDuplicateProject}
        onResetProject={handleResetToHasbro}
        onOpenCloudSync={() => setIsCloudSyncOpen(true)}
        onOpenMysteryCase={() => setIsMysteryCaseOpen(true)}
        lastSavedAt={lastSavedAt}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeView === 'deck' && (
          <CardGrid
            cards={currentProject.cards}
            onAddCard={handleAddCard}
            onEditCard={handleEditCard}
            onDuplicateCard={handleDuplicateCard}
            onDeleteCard={handleDeleteCard}
          />
        )}

        {activeView === 'print' && (
          <PrintView
            project={currentProject}
            onUpdatePrintSettings={handleUpdatePrintSettings}
          />
        )}

        {activeView === 'detective' && (
          <DetectiveSheetView project={currentProject} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#14110F] border-t border-zinc-800/80 py-6 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-amber-400 font-cinzel">CLUEDO CARD STUDIO PRO</span>
            <span>• Generatore carte originali Hasbro & casi misteriosi</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-zinc-400">
            <span>Stampa Ottimizzata Fronte/Retro</span>
            <span>•</span>
            <span>Database Locale IndexedDB</span>
            <span>•</span>
            <span>Cloud Sync Multi-Device</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Card WYSIWYG Editor Modal */}
      {editingCard && (
        <CardEditorModal
          card={editingCard}
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingCard(null);
          }}
          onSave={handleSaveCard}
        />
      )}

      {/* 2. Mystery Case & Crime Envelope Modal */}
      <MysteryCaseModal
        project={currentProject}
        isOpen={isMysteryCaseOpen}
        onClose={() => setIsMysteryCaseOpen(false)}
        onSaveCase={handleSaveMysteryCase}
      />

      {/* 3. Cloud Sync & Export/Import Modal */}
      <CloudSyncModal
        project={currentProject}
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        onImportProject={handleImportProject}
      />

      {/* 4. New Project Dialog Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#1C1814] border border-[#C5A059] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-amber-300 font-bold font-cinzel">
              <FolderPlus className="w-5 h-5" />
              <span>Crea Nuovo Caso / Mazzo Cluedo</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Nome del Mazzo o Edizione Speciale
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="es. Delitto a Venezia, Mistero sull'Orient Express..."
                className="w-full bg-[#110F0E] border border-zinc-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={() => handleCreateNewProject(newProjectName)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-lg shadow cursor-pointer"
              >
                Crea Mazzo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
