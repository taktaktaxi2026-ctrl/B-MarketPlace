import React from 'react';
import { ShoppingBag, Sparkles, Database, Globe, Bike, Award, Wifi, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAiAssistant: () => void;
  onOpenArchitecture: () => void;
  onOpenTakTakTracker: () => void;
  barewaPoints: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  cartCount,
  onOpenCart,
  onOpenAiAssistant,
  onOpenArchitecture,
  onOpenTakTakTracker,
  barewaPoints,
}) => {
  const t = getTranslation(currentLang);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200 shadow-xs">
      {/* Top Sovereignty & Ecosystem Bar */}
      <div className="bg-neutral-900 text-neutral-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Barewa Écosystème
            </span>
            <span className="text-neutral-400 hidden sm:inline">•</span>
            <span className="text-neutral-300 hidden sm:inline">
              Niger : Marché Souverain • Paiements Mobile Money • Coursiers TAK TAK TAXI
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Offline PWA Ready Badge */}
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
              <Wifi className="w-3 h-3" />
              <span>{t.offlineMode}</span>
            </span>

            {/* Language Switcher with native labels */}
            <div className="flex items-center bg-neutral-800 rounded-md p-0.5 text-xs font-medium">
              <Globe className="w-3 h-3 text-neutral-400 ml-1.5 mr-1" />
              <button
                id="lang-fr-btn"
                onClick={() => onLanguageChange('fr')}
                className={`px-2 py-0.5 rounded transition ${
                  currentLang === 'fr' ? 'bg-orange-600 text-white font-bold' : 'text-neutral-300 hover:text-white'
                }`}
                title="Français"
              >
                FR
              </button>
              <button
                id="lang-ha-btn"
                onClick={() => onLanguageChange('ha')}
                className={`px-2 py-0.5 rounded transition ${
                  currentLang === 'ha' ? 'bg-orange-600 text-white font-bold' : 'text-neutral-300 hover:text-white'
                }`}
                title="Hausa (Harshen Hausa)"
              >
                HA
              </button>
              <button
                id="lang-za-btn"
                onClick={() => onLanguageChange('za')}
                className={`px-2 py-0.5 rounded transition ${
                  currentLang === 'za' ? 'bg-orange-600 text-white font-bold' : 'text-neutral-300 hover:text-white'
                }`}
                title="Zarma (Zarmaci)"
              >
                ZA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-600 to-emerald-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-orange-500/20">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight text-neutral-900 leading-none">
                {t.appTitle}
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded">
                Niger
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-medium hidden md:block mt-0.5">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Quick Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Barewa Points Widget */}
          <div 
            className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
            title="Vos points de fidélité cumulés sur Barewa MarketPlace"
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Barewa Points:</span>
            <span className="bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">
              {barewaPoints}
            </span>
          </div>

          {/* TAK TAK Couriers & Barewa Maps */}
          <button
            id="taktak-tracker-btn"
            onClick={onOpenTakTakTracker}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            title="Suivi coursiers TAK TAK TAXI et carte Barewa Maps"
          >
            <Bike className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">TAK TAK TAXI</span>
          </button>

          {/* Seller AI Assistant */}
          <button
            id="seller-ai-btn"
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            title={t.sellerAiDescription}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">{t.sellerAiAssistant}</span>
            <span className="sm:hidden">IA</span>
          </button>

          {/* Architecture Deliverable Modal */}
          <button
            id="arch-docs-btn"
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
            title="Consulter le Schéma SQL Supabase & Moteur pgvector"
          >
            <Database className="w-4 h-4 text-neutral-600" />
            <span className="hidden lg:inline">{t.architectureDocs}</span>
            <span className="lg:hidden">SQL</span>
          </button>

          {/* Cart Button */}
          <button
            id="cart-drawer-btn"
            onClick={onOpenCart}
            className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition cursor-pointer shadow-xs"
            aria-label="Voir le panier"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
