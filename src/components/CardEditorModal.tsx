import React, { useState } from 'react';
import { CluedoCard, CardCategory } from '../types/cluedo.ts';
import { CardView } from './CardView.tsx';
import { AVAILABLE_ICONS } from '../utils/artworkLibrary.tsx';
import { X, Upload, Trash2, Check, Sparkles, Palette, Image as ImageIcon } from 'lucide-react';

interface CardEditorModalProps {
  card: CluedoCard;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCard: CluedoCard) => void;
}

const PRESET_PALETTES = [
  { name: 'Scarlett Rosso', hex: '#B91C1C' },
  { name: 'Mustard Giallo', hex: '#D97706' },
  { name: 'White Perla/Ardesia', hex: '#4B5563' },
  { name: 'Green Smeraldo', hex: '#047857' },
  { name: 'Peacock Blu Reale', hex: '#1D4ED8' },
  { name: 'Plum Viola Prugna', hex: '#6D28D9' },
  { name: 'Mogano Antico', hex: '#713F12' },
  { name: 'Bronzo Dorato', hex: '#B45309' },
  { name: 'Acciaio Canna Fucile', hex: '#1F2937' },
  { name: 'Bordeaux Vino', hex: '#831843' },
  { name: 'Verde Foresta', hex: '#15803D' },
  { name: 'Nero Inchiostro', hex: '#111827' },
];

export const CardEditorModal: React.FC<CardEditorModalProps> = ({
  card,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CluedoCard>({ ...card });
  const [activeTab, setActiveTab] = useState<'text' | 'art' | 'style'>('text');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("L'immagine è troppo grande. Usa un'immagine inferiore a 4MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          customImageData: event.target?.result as string,
          iconType: 'custom_image',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      customImageData: undefined,
      iconType: 'builtin',
    });
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#1A1816] border border-[#C5A059] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2A231C] to-[#1A1816] border-b border-[#C5A059]/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100 font-cinzel">
                Editor Carta Cluedo Personalizzata
              </h2>
              <p className="text-xs text-amber-300/70">
                Personalizza testi, armi, personaggi, icone e colori pronti per la stampa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            aria-label="Chiudi finestra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Two columns (Editor Controls & Real-Time Card Preview) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT: Controls (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-zinc-800 space-x-2">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
                  activeTab === 'text'
                    ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                1. Testi & Ruolo
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('art')}
                className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
                  activeTab === 'art'
                    ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                2. Icona & Immagine
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('style')}
                className={`py-2 px-3 text-xs font-semibold rounded-t-lg transition border-b-2 cursor-pointer ${
                  activeTab === 'style'
                    ? 'border-amber-400 text-amber-300 bg-amber-950/20'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                3. Palette & Colori
              </button>
            </div>

            {/* TAB 1: TEXTS */}
            {activeTab === 'text' && (
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    Nome Carta (es. Miss Scarlett, Candelabro, Cucina)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#110F0E] border border-zinc-700 focus:border-amber-400 rounded-lg px-3 py-2 text-sm text-zinc-100 outline-none"
                    placeholder="Nome..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                      Categoria Cluedo
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const cat = e.target.value as CardCategory;
                        const defaultBadge: Record<CardCategory, string> = {
                          suspect: 'SOSPETTATO',
                          weapon: 'ARMA DEL DELITTO',
                          room: 'SCENA DEL DELITTO',
                          clue: 'CARTA INDIZIO',
                        };
                        setFormData({
                          ...formData,
                          category: cat,
                          badgeText: defaultBadge[cat],
                        });
                      }}
                      className="w-full bg-[#110F0E] border border-zinc-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                    >
                      <option value="suspect">Sospettato (Personaggio)</option>
                      <option value="weapon">Arma del Delitto</option>
                      <option value="room">Stanza / Scena del Delitto</option>
                      <option value="clue">Carta Indizio / Suggerimento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                      Testo Badge Superiore
                    </label>
                    <input
                      type="text"
                      value={formData.badgeText || ''}
                      onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                      className="w-full bg-[#110F0E] border border-zinc-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                      placeholder="es. SOSPETTATO"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    Sottotitolo / Ruolo (es. "L'attrice affascinante", "Con passaggio segreto")
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full bg-[#110F0E] border border-zinc-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none"
                    placeholder="Sottotitolo..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    Descrizione / Alibi / Dettaglio Letale
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#110F0E] border border-zinc-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-zinc-100 outline-none resize-none"
                    placeholder="Descrizione per la carta..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/90 mb-1">
                    Codice Identificativo Carta (es. CLU-S01)
                  </label>
                  <input
                    type="text"
                    value={formData.cardIdCode || ''}
                    onChange={(e) => setFormData({ ...formData, cardIdCode: e.target.value })}
                    className="w-full bg-[#110F0E] border border-zinc-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 outline-none"
                    placeholder="CLU-01"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: ART & ICONS */}
            {activeTab === 'art' && (
              <div className="space-y-4">
                {/* Upload Custom Image */}
                <div className="bg-[#110F0E] p-4 rounded-xl border border-zinc-800">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Carica Foto / Illustrazione Personalizzata</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 mb-3">
                    Puoi caricare una foto del tuo amico, una grafica personalizzata o un disegno per rendere la carta unica.
                  </p>

                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-2 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow">
                      <Upload className="w-4 h-4" />
                      <span>Scegli Immagine da PC/Telefono</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>

                    {formData.customImageData && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="flex items-center space-x-1.5 px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-700/50 rounded-lg text-xs cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Rimuovi Foto (Usa Icona)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Built-in Vector Icon Selection */}
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                    Oppure Seleziona un'Icona Vettoriale Hasbro:
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1 bg-[#110F0E] rounded-xl border border-zinc-800">
                    {AVAILABLE_ICONS.map((icon) => (
                      <button
                        key={icon.id}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            iconName: icon.id,
                            iconType: 'builtin',
                            customImageData: undefined,
                          })
                        }
                        className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center transition cursor-pointer ${
                          formData.iconName === icon.id && !formData.customImageData
                            ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                            : 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span className="text-[10px] truncate max-w-full font-medium mt-1">
                          {icon.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PALETTE & STYLES */}
            {activeTab === 'style' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center space-x-2">
                    <Palette className="w-4 h-4" />
                    <span>Palette Ufficiali Cluedo & Hasbro</span>
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {PRESET_PALETTES.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: preset.hex })}
                        className={`p-2 rounded-lg border flex items-center space-x-2 text-left cursor-pointer transition ${
                          formData.color === preset.hex
                            ? 'border-amber-400 bg-zinc-800'
                            : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="text-[10px] text-zinc-200 font-medium truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#110F0E] p-4 rounded-xl border border-zinc-800 flex items-center space-x-4">
                  <div>
                    <label className="block text-xs font-semibold text-amber-200 mb-1">
                      Colore Personalizzato (HEX)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="w-24 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs font-mono text-zinc-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Live Interactive 3D Card Preview (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#110F0E] p-4 rounded-2xl border border-zinc-800/80">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-widest mb-3">
              Anteprima Live Carta (Clicca per girare)
            </span>

            <div className="py-2">
              <CardView card={formData} interactiveFlip={true} scale={1.05} />
            </div>

            <p className="text-[10px] text-zinc-400 italic mt-3 text-center">
              Passa il mouse o clicca sull'icona in alto a destra per vedere il retro della carta.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#141211] border-t border-zinc-800 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Salva Modifiche Carta</span>
          </button>
        </div>
      </div>
    </div>
  );
};
