import React, { useState } from 'react';
import { CluedoCard, CardCategory } from '../types/cluedo.ts';
import { CardView } from './CardView.tsx';
import { analyzeDeck } from '../utils/cluedoRules.ts';
import {
  Plus,
  Search,
  RotateCw,
  Copy,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface CardGridProps {
  cards: CluedoCard[];
  onAddCard: (category: CardCategory) => void;
  onEditCard: (card: CluedoCard) => void;
  onDuplicateCard: (card: CluedoCard) => void;
  onDeleteCard: (id: string) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onAddCard,
  onEditCard,
  onDuplicateCard,
  onDeleteCard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CardCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalSide, setGlobalSide] = useState<'front' | 'back'>('front');

  const deckStats = analyzeDeck(cards);

  const filteredCards = cards.filter((card) => {
    const matchesCat = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesQuery =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Deck Status & Stats */}
      <div className="bg-[#1C1814] border border-[#C5A059]/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            {deckStats.isStandardHasbroDeck ? (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/50 rounded-full text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mazzo Ufficiale Hasbro Perfetto (6 Sospettati, 6 Armi, 9 Stanze)</span>
              </span>
            ) : deckStats.isPlayable ? (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-950/60 border border-amber-500/50 rounded-full text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mazzo Giocabile Personalizzato ({cards.length} Carte)</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-red-950/60 border border-red-500/50 rounded-full text-red-300 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Mazzo Incompleto per il Delitto</span>
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            {deckStats.suspectsCount} Sospettati • {deckStats.weaponsCount} Armi • {deckStats.roomsCount} Stanze • {deckStats.cluesCount} Indizi speciali
          </p>
        </div>

        {/* Action Buttons: Add Card & Toggle All Card Sides */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setGlobalSide(globalSide === 'front' ? 'back' : 'front')}
            className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition border border-zinc-700 cursor-pointer"
            title="Mostra tutti i fronti o tutti i retro del mazzo"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Vista: {globalSide === 'front' ? 'Tutti i Fronti' : 'Tutti i Retro'}</span>
          </button>

          <button
            type="button"
            onClick={() => onAddCard(selectedCategory === 'all' ? 'suspect' : selectedCategory)}
            className="flex-1 md:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Aggiungi Nuova Carta</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center overflow-x-auto pb-1 sm:pb-0 space-x-1.5 bg-[#141210] p-1.5 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Tutte ({cards.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('suspect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === 'suspect'
                ? 'bg-red-700 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Sospettati ({deckStats.suspectsCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('weapon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === 'weapon'
                ? 'bg-amber-600 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Armi ({deckStats.weaponsCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('room')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === 'room'
                ? 'bg-stone-700 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Stanze ({deckStats.roomsCount})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('clue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === 'clue'
                ? 'bg-purple-800 text-white shadow'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            Indizi Speciali ({deckStats.cluesCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per nome o indizio..."
            className="w-full pl-9 pr-3 py-2 bg-[#141210] border border-zinc-800 focus:border-amber-400 rounded-xl text-xs text-zinc-200 outline-none"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16 bg-[#161412] border border-zinc-800/80 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm mb-3">Nessuna carta trovata per i criteri selezionati.</p>
          <button
            type="button"
            onClick={() => onAddCard(selectedCategory === 'all' ? 'suspect' : selectedCategory)}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            Crea la prima carta in questa categoria
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-items-center">
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col items-center bg-[#181512] border border-zinc-800/80 rounded-2xl p-3 shadow-lg hover:border-amber-500/50 transition duration-200"
            >
              {/* Card Rendering */}
              <div className="cursor-pointer" onClick={() => onEditCard(card)}>
                <CardView
                  card={card}
                  forceSide={globalSide}
                  interactiveFlip={true}
                  onEdit={onEditCard}
                  scale={0.96}
                />
              </div>

              {/* Bottom Card Card Control Strip */}
              <div className="w-full flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/80 px-1 text-xs text-zinc-400">
                <span className="font-mono text-[10px] text-amber-300 font-semibold truncate max-w-[100px]">
                  {card.cardIdCode || card.name}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => onEditCard(card)}
                    className="p-1 hover:text-amber-300 rounded hover:bg-zinc-800 transition cursor-pointer"
                    title="Modifica carta"
                    aria-label={`Modifica ${card.name}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicateCard(card)}
                    className="p-1 hover:text-zinc-200 rounded hover:bg-zinc-800 transition cursor-pointer"
                    title="Duplica carta"
                    aria-label={`Duplica ${card.name}`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Sei sicuro di voler eliminare "${card.name}"?`)) {
                        onDeleteCard(card.id);
                      }
                    }}
                    className="p-1 hover:text-red-400 rounded hover:bg-zinc-800 transition cursor-pointer"
                    title="Elimina carta"
                    aria-label={`Elimina ${card.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
