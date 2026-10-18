import React, { useState } from 'react';
import { CluedoProject } from '../types/cluedo.ts';
import {
  generateCloudSyncCode,
  parseCloudSyncCode,
  exportProjectToJson,
} from '../utils/storage.ts';
import {
  Cloud,
  Copy,
  Check,
  Download,
  Upload,
  Link as LinkIcon,
  Smartphone,
  Laptop,
  X,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface CloudSyncModalProps {
  project: CluedoProject;
  isOpen: boolean;
  onClose: () => void;
  onImportProject: (importedProject: CluedoProject) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  project,
  isOpen,
  onClose,
  onImportProject,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inputSyncCode, setInputSyncCode] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const syncCode = generateCloudSyncCode(project);
  const syncUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#sync=${syncCode}`
    : '';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(syncCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(syncUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleImportCode = () => {
    setImportError(null);
    if (!inputSyncCode.trim()) {
      setImportError('Inserisci un codice o incolla i dati JSON.');
      return;
    }

    // Try base64 sync code first
    let imported = parseCloudSyncCode(inputSyncCode);
    if (!imported) {
      // Try raw JSON
      try {
        const parsed = JSON.parse(inputSyncCode);
        if (parsed && parsed.cards && Array.isArray(parsed.cards)) {
          imported = parsed;
        }
      } catch {
        // failed
      }
    }

    if (imported) {
      onImportProject(imported);
      onClose();
    } else {
      setImportError('Codice non valido o formato non riconosciuto. Verifica la stringa.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed && Array.isArray(parsed.cards)) {
            onImportProject(parsed);
            onClose();
          } else {
            setImportError('Il file caricato non sembra un progetto Cluedo valido.');
          }
        } catch {
          setImportError('Errore durante la lettura del file JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#1A1816] border border-[#C5A059] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#2A231C] to-[#1A1816] border-b border-[#C5A059]/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100 font-cinzel">
                Sincronizzazione Cloud & Esportazione
              </h2>
              <p className="text-xs text-amber-300/70">
                Sincronizza le tue carte e casi tra tutti i dispositivi senza alcuna perdita di qualità
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

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quality Guarantee Chip */}
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-emerald-200">
              <strong>100% Fedeltà Vettoriale:</strong> Tutti i testi, le illustrazioni, le foto caricate e i parametri di stampa vengono sincronizzati integralmente con risoluzione nativa.
            </p>
          </div>

          {/* Section 1: Quick Sync via Link or Code */}
          <div className="bg-[#12100E] border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
              <Smartphone className="w-4 h-4" />
              <span>1. Trasferisci su Smartphone, Tablet o Altro PC</span>
            </h3>

            {/* Sync URL Button */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Link Rapido di Sincronizzazione:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={syncUrl}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 outline-none select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiato!' : 'Copia Link'}</span>
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                Invia questo link via WhatsApp, Telegram o email: aprendolo caricherà istantaneamente il mazzo.
              </p>
            </div>

            {/* Sync Code Button */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Oppure Copia Codice Cloud Singolo:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={syncCode}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 outline-none select-all truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-semibold transition shrink-0 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copiato!' : 'Copia Codice'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: JSON Backup & File Export */}
          <div className="bg-[#12100E] border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>2. Backup File JSON (Archivio Permanente)</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Scarica il file di progetto completo sul tuo computer per conservarlo per sempre o inviarlo agli amici.
            </p>
            <button
              type="button"
              onClick={() => exportProjectToJson(project)}
              className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Scarica File Progetto (.json)</span>
            </button>
          </div>

          {/* Section 3: Import / Incolla Dati */}
          <div className="bg-[#12100E] border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>3. Ricevi / Importa Mazzo da Altro Dispositivo</span>
            </h3>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <input
                type="text"
                value={inputSyncCode}
                onChange={(e) => setInputSyncCode(e.target.value)}
                placeholder="Incolla qui il codice cloud o JSON..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-200 outline-none"
              />
              <button
                type="button"
                onClick={handleImportCode}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer"
              >
                Carica Codice
              </button>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <span className="text-xs text-zinc-500">oppure</span>
              <label className="flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 cursor-pointer underline">
                <Upload className="w-3.5 h-3.5" />
                <span>Carica da file .json</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {importError && (
              <div className="flex items-center space-x-2 text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-800/50">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#141211] border-t border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-bold cursor-pointer"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};
