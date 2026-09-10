import React from 'react';
import { ShieldCheck, Sparkles, Bike, MapPin, Award, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../data/translations';

interface HeroBannerProps {
  currentLang: Language;
  onOpenAiAssistant: () => void;
  onOpenArchitecture: () => void;
  selectedRegion: string | null;
  onSelectRegion: (region: string | null) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentLang,
  onOpenAiAssistant,
  onOpenArchitecture,
  selectedRegion,
  onSelectRegion,
}) => {
  const t = getTranslation(currentLang);

  const nigerRegions = ['Niamey', 'Agadez', 'Maradi', 'Tahoua', 'Tillabéri', 'Zinder', 'Dosso'];

  return (
    <div className="w-full bg-linear-to-b from-orange-600 via-orange-700 to-neutral-900 text-white pt-8 pb-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Main Pitch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-neutral-900 bg-amber-400 px-2.5 py-1 rounded-full shadow-xs">
                <Award className="w-3.5 h-3.5" />
                Plateforme Souveraine du Niger
              </span>
              <span className="text-xs text-orange-200 bg-white/10 backdrop-blur px-2.5 py-1 rounded-full border border-white/20">
                Orange Money • Moov Flooz • Wave • TAK TAK TAXI
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Le Marché Intelligent & Équitable des Artisans et Producteurs du Niger
            </h2>

            <p className="text-sm sm:text-base text-orange-100 max-w-2xl leading-relaxed">
              Valorisez le savoir-faire nigérien : achetez directement en circuit court, négociez par WhatsApp, payez par Mobile Money et recevez vos colis en 30 minutes grâce aux coursiers TAK TAK TAXI.
            </p>

            {/* Quick Action CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-seller-cta"
                onClick={onOpenAiAssistant}
                className="px-5 py-3 bg-white text-neutral-900 hover:bg-neutral-100 font-extrabold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Publier un Produit avec l'IA Vendeur (0% Commission)</span>
              </button>

              <button
                id="hero-arch-cta"
                onClick={onOpenArchitecture}
                className="px-4 py-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-2xl text-xs sm:text-sm border border-white/25 transition cursor-pointer backdrop-blur"
              >
                <span>Voir le Schéma SQL & pgvector</span>
              </button>
            </div>
          </div>

          {/* Value Props Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 flex flex-col gap-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Pourquoi Barewa MarketPlace ?
            </h3>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-orange-500/80 flex items-center justify-center shrink-0 text-white font-bold">
                  0%
                </div>
                <div>
                  <strong className="block text-white">Période d'essai commerçants</strong>
                  <span className="text-orange-100">0% de commission sur les 30 premières ventes.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/80 flex items-center justify-center shrink-0 text-white">
                  <Bike className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="block text-white">Flotte TAK TAK TAXI intégrée</strong>
                  <span className="text-orange-100">Livraison express locale & revenus pour les chauffeurs.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-amber-500/80 flex items-center justify-center shrink-0 text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="block text-white">Recherche sémantique vectorielle</strong>
                  <span className="text-orange-100">Trouvez tout sans connaître le mot-clé exact (pgvector).</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Region Filter Bar */}
        <div className="pt-2 border-t border-white/15 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-orange-200 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Origine Terroir :
          </span>

          <button
            onClick={() => onSelectRegion(null)}
            className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
              selectedRegion === null
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {t.allRegions}
          </button>

          {nigerRegions.map((region) => (
            <button
              key={region}
              onClick={() => onSelectRegion(region === selectedRegion ? null : region)}
              className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                selectedRegion === region
                  ? 'bg-amber-400 text-neutral-950 shadow-xs font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
