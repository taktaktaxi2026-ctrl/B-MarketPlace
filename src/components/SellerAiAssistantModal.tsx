import React, { useState } from 'react';
import { X, Sparkles, Wand2, CheckCircle2, ShieldCheck, Tag, Globe, ArrowRight } from 'lucide-react';
import { Product, Seller } from '../types';

interface SellerAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductPublished: (product: Product) => void;
  currentSellers: Seller[];
}

export const SellerAiAssistantModal: React.FC<SellerAiAssistantModalProps> = ({
  isOpen,
  onClose,
  onProductPublished,
  currentSellers,
}) => {
  if (!isOpen) return null;

  const [rawTitle, setRawTitle] = useState('');
  const [category, setCategory] = useState<'artisanat' | 'agriculture' | 'mode' | 'alimentation' | 'electronique' | 'maison'>('artisanat');
  const [priceFcfa, setPriceFcfa] = useState('15000');
  const [rawDescription, setRawDescription] = useState('');
  const [region, setRegion] = useState('Niamey');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Quick preset templates for fast demonstration
  const presets = [
    { title: 'Kilichi extra épicé fait maison', category: 'alimentation', price: '7000', region: 'Niamey (Wadata)' },
    { title: 'Collier pendentif Croix d\'Agadez en argent', category: 'artisanat', price: '28000', region: 'Agadez' },
    { title: 'Tissu Bazin riche brodé pour fête de tabaski', category: 'mode', price: '45000', region: 'Niamey (Yantala)' },
    { title: 'Sac de mil et niébé récolte fraîche', category: 'agriculture', price: '12500', region: 'Maradi' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawTitle.trim()) return;

    setIsLoading(true);
    setGeneratedResult(null);
    setPublishedSuccess(false);

    try {
      const response = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawTitle,
          category,
          priceFcfa: parseInt(priceFcfa, 10) || 10000,
          rawDescription,
          targetRegion: region,
        }),
      });

      const data = await response.json();
      setGeneratedResult(data);
    } catch (err) {
      console.error('Erreur génération IA:', err);
      // Fallback
      setGeneratedResult({
        optimizedTitle: `${rawTitle} - Confection Artisanale Authentique du Niger`,
        descriptionFr: `Découvrez ce magnifique produit d'artisanat et de terroir nigérien, façonné avec soin et savoir-faire traditionnel. Qualité garantie, disponible en livraison rapide TAK TAK TAXI à Niamey et expédition interurbaine.`,
        descriptionHausa: `Wannan kayan mai inganci ne wanda aka yi shi a Nijar. Yana da kyau kuma yana da saukin amfani ta hanyar cinikin gaskiya.`,
        descriptionZarma: `Woo jinay kunkuni no kaŋ borey te Nejer laabo ra. A ga boori kora se nda alhabar.`,
        tags: ['Artisanat', 'Niger', 'Qualité', 'Commerce Local', 'Barewa'],
        suggestedPriceRange: `${priceFcfa} FCFA`,
        commissionNote: "Période d'essai commerçant : 0% de commission sur vos 30 premières ventes !",
        seoScore: 94,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = () => {
    if (!generatedResult) return;

    const seller = currentSellers[0] || {
      id: 'seller-new',
      name: 'Artisan Vendeur Barewa',
      shopName: `Boutique ${rawTitle.split(' ')[0]} & Terroir`,
      phone: '+227 90 00 11 22',
      whatsapp: '22790001122',
      city: region,
      quartier: 'Centre-ville',
      rating: 5.0,
      salesCount: 1,
      isVerified: true,
      isTrialPeriod: true,
      pickupPoint: `Hub Barewa ${region}`,
      latitude: 13.5136,
      longitude: 2.1154,
    };

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      title: generatedResult.optimizedTitle || rawTitle,
      titleHausa: rawTitle,
      titleZarma: rawTitle,
      description: generatedResult.descriptionFr,
      descriptionHausa: generatedResult.descriptionHausa,
      descriptionZarma: generatedResult.descriptionZarma,
      category: category as any,
      priceFcfa: parseInt(priceFcfa, 10) || 15000,
      sellerId: seller.id,
      seller: seller,
      imageUrl:
        category === 'artisanat'
          ? 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
          : category === 'alimentation'
          ? 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
          : category === 'mode'
          ? 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
          : category === 'agriculture'
          ? 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=800&q=80'
          : 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      isFeatured: true,
      stock: 10,
      regionOrigin: region,
      tags: generatedResult.tags || ['Nouveau', 'Niger', 'Barewa'],
      pointsEarned: Math.max(5, Math.floor((parseInt(priceFcfa, 10) || 10000) / 1000)),
    };

    onProductPublished(newProduct);
    setPublishedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div 
        id="seller-ai-modal"
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Assistant IA Vendeur Barewa
              </h2>
              <p className="text-xs text-neutral-500">
                Générez des fiches produits percutantes en Français, Haoussa et Zarma
              </p>
            </div>
          </div>

          <button
            id="close-ai-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Sovereign Seller Trial Guarantee Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold text-emerald-950 block text-sm">
                Offre Souveraine de Lancement : 0% de Commission
              </span>
              Pour bâtir la masse critique au Niger, tous les nouveaux commerçants et artisans bénéficient d'une période d'essai gratuite sans prélèvement sur leurs 30 premières ventes.
            </div>
          </div>

          {/* Quick Presets for Demo */}
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide block mb-2">
              Exemples d'articles nigériens à tester :
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  id={`preset-${idx}`}
                  type="button"
                  onClick={() => {
                    setRawTitle(p.title);
                    setCategory(p.category as any);
                    setPriceFcfa(p.price);
                    setRegion(p.region);
                  }}
                  className="text-xs bg-neutral-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-200 transition cursor-pointer"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Nom ou idée du produit (mots bruts) *
              </label>
              <input
                id="raw-title-input"
                type="text"
                required
                value={rawTitle}
                onChange={(e) => setRawTitle(e.target.value)}
                placeholder="Ex: Croix touareg argent pur faite à Agadez"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Catégorie
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition"
              >
                <option value="artisanat">Artisanat & Bijoux</option>
                <option value="alimentation">Alimentation & Épices</option>
                <option value="agriculture">Agriculture & Terroir</option>
                <option value="mode">Mode & Bazin</option>
                <option value="electronique">Électronique & Solaire</option>
                <option value="maison">Maison & Décoration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Prix souhaité (FCFA)
              </label>
              <input
                id="price-input"
                type="number"
                min="500"
                step="500"
                value={priceFcfa}
                onChange={(e) => setPriceFcfa(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Région d'origine / Quartier de vente
              </label>
              <input
                id="region-input"
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Ex: Niamey (Grand Marché), Agadez, Maradi..."
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white transition"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                id="generate-ai-submit-btn"
                type="submit"
                disabled={isLoading || !rawTitle.trim()}
                className="w-full py-3 px-5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>L'IA rédige la fiche produit...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Générer le Titre & Descriptions Multilingues avec l'IA</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* AI Result Card */}
          {generatedResult && (
            <div className="p-5 bg-orange-50/70 border-2 border-orange-300 rounded-2xl flex flex-col gap-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  Résultat Optimisé par l'IA
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Score SEO : {generatedResult.seoScore || 95}/100
                </span>
              </div>

              {/* Title */}
              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase">Titre Commercial Optimisé :</span>
                <p className="font-extrabold text-neutral-900 text-base mt-0.5">
                  {generatedResult.optimizedTitle}
                </p>
              </div>

              {/* Multilingual Tabs Output */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold text-blue-700 uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Français
                  </span>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    {generatedResult.descriptionFr}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Haoussa
                  </span>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    {generatedResult.descriptionHausa}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-neutral-200">
                  <span className="text-[11px] font-bold text-purple-700 uppercase flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Zarma
                  </span>
                  <p className="text-xs text-neutral-700 mt-1 leading-relaxed">
                    {generatedResult.descriptionZarma}
                  </p>
                </div>
              </div>

              {/* Tags & Pricing */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-orange-200 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-neutral-500" />
                  {(generatedResult.tags || []).map((t: string, i: number) => (
                    <span key={i} className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="font-bold text-neutral-900">
                  Fourchette suggérée : {generatedResult.suggestedPriceRange}
                </div>
              </div>

              {/* Publish Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {publishedSuccess ? (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-100 px-4 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Article publié avec succès sur Barewa MarketPlace !</span>
                  </div>
                ) : (
                  <button
                    id="publish-product-btn"
                    type="button"
                    onClick={handlePublish}
                    className="py-2.5 px-5 bg-neutral-900 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-sm cursor-pointer transition"
                  >
                    <span>Mettre en ligne sur le Marché</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
