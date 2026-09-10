import React, { useState } from 'react';
import { Search, Sparkles, Mic, X, Cpu, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';

interface VectorSearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onExecuteVectorSearch: (q: string) => void;
  isVectorSearching: boolean;
  currentLang: Language;
  onClearSearch: () => void;
  isVectorActive: boolean;
}

export const VectorSearchBar: React.FC<VectorSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onExecuteVectorSearch,
  isVectorSearching,
  currentLang,
  onClearSearch,
  isVectorActive,
}) => {
  const t = getTranslation(currentLang);
  const [isListening, setIsListening] = useState(false);

  // Quick query examples adapted for Niger
  const sampleQueries = [
    { label: 'Viande séchée épicée', query: 'viande séchée assaisonnée au kulikuli' },
    { label: 'Bijou argent touareg', query: 'croix ou bijou touareg fait main' },
    { label: 'Tenue mariage festif', query: 'habit traditionnel élégant pour grand événement' },
    { label: 'Garder l\'eau fraîche', query: 'objet artisanal pour rafraîchir l\'eau sans électricité' },
    { label: 'Oignons de Galmi', query: 'oignon violet savoureux de Tahoua' },
  ];

  const handleVoiceSearch = () => {
    // Web speech recognition support or mock simulation
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = currentLang === 'ha' ? 'ha-NG' : currentLang === 'za' ? 'fr-FR' : 'fr-FR';
      recognition.interimResults = false;
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSearchChange(transcript);
        onExecuteVectorSearch(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Friendly fallback if browser doesn't support mic
      setIsListening(true);
      setTimeout(() => {
        const mockVoice = 'Kilichi traditionnel savoureux de Niamey';
        onSearchChange(mockVoice);
        onExecuteVectorSearch(mockVoice);
        setIsListening(false);
      }, 1200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onExecuteVectorSearch(searchQuery.trim());
    }
  };

  return (
    <div className="w-full bg-linear-to-b from-orange-50/60 to-white py-4 px-4 border-b border-neutral-200">
      <div className="max-w-4xl mx-auto">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-5 h-5 text-neutral-500" />
            </div>

            <input
              id="vector-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-11 pr-24 py-3 bg-white border-2 border-neutral-300 focus:border-orange-500 focus:outline-none rounded-2xl text-sm sm:text-base font-medium text-neutral-900 shadow-sm transition"
            />

            <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition cursor-pointer"
                  title="Effacer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Voice search button for accessible search */}
              <button
                type="button"
                id="voice-search-btn"
                onClick={handleVoiceSearch}
                className={`p-2 rounded-xl text-xs font-medium flex items-center transition cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
                title={t.voiceSearch}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search Button with pgvector pill */}
          <button
            id="submit-search-btn"
            type="submit"
            disabled={isVectorSearching}
            className="px-5 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl shadow-sm text-sm sm:text-base flex items-center gap-2 transition cursor-pointer whitespace-nowrap"
          >
            {isVectorSearching ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>Recherche...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{t.searchButton}</span>
              </>
            )}
          </button>
        </form>

        {/* Vector search active status indicator & sample prompt pills */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-100/80 text-orange-900 border border-orange-200">
            <Cpu className="w-3.5 h-3.5 text-orange-600" />
            <span>pgvector cosine similarity</span>
            {isVectorActive && (
              <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" /> Actif
              </span>
            )}
          </div>

          <span className="text-xs text-neutral-500 hidden sm:inline">Exemples :</span>

          {sampleQueries.map((item, idx) => (
            <button
              key={idx}
              type="button"
              id={`sample-query-${idx}`}
              onClick={() => {
                onSearchChange(item.query);
                onExecuteVectorSearch(item.query);
              }}
              className="text-xs bg-white hover:bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200 shadow-2xs transition cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
