import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, Volume2, MapPin, Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Product, Language } from '../types';
import { getTranslation } from '../data/translations';

interface ProductCardProps {
  product: Product;
  currentLang: Language;
  onAddToCart: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentLang,
  onAddToCart,
  onOpenDetail,
}) => {
  const t = getTranslation(currentLang);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Dynamic language display
  const displayTitle =
    currentLang === 'ha' && product.titleHausa
      ? product.titleHausa
      : currentLang === 'za' && product.titleZarma
      ? product.titleZarma
      : product.title;

  const displayDescription =
    currentLang === 'ha' && product.descriptionHausa
      ? product.descriptionHausa
      : currentLang === 'za' && product.descriptionZarma
      ? product.descriptionZarma
      : product.description;

  // WhatsApp negotiation link (African informal commerce model)
  const whatsappText = `${t.chatPromptWhatsapp} "${displayTitle}" au prix de ${product.priceFcfa.toLocaleString()} FCFA sur Barewa MarketPlace. Est-il toujours disponible ?`;
  const whatsappUrl = `https://wa.me/${product.seller.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

  // Voice narration for low literacy accessibility
  const handleAudioSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${displayTitle}. Prix : ${product.priceFcfa} Francs CFA. Vendeur : ${product.seller.shopName} à ${product.seller.quartier}.`);
      utterance.lang = currentLang === 'ha' ? 'ha-NG' : 'fr-FR';
      utterance.rate = 0.95;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onOpenDetail(product)}
      className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:border-orange-400 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Origin Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-900 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full shadow-xs border border-neutral-200">
            <MapPin className="w-3 h-3 text-orange-600" />
            {product.regionOrigin}
          </span>

          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-950 bg-amber-300/95 px-2 py-0.5 rounded-full shadow-xs">
              <Award className="w-3 h-3" />
              Vedette Niger
            </span>
          )}
        </div>

        {/* Vector Similarity Match Pill (if searching) */}
        {typeof product.similarity === 'number' && (
          <div className="absolute top-2.5 right-2.5 bg-neutral-900/90 backdrop-blur text-white text-[11px] font-bold px-2 py-1 rounded-lg border border-neutral-700 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{(product.similarity * 100).toFixed(0)}% pertinence</span>
          </div>
        )}

        {/* Audio narration button for low literacy */}
        <button
          id={`audio-narrate-${product.id}`}
          onClick={handleAudioSpeak}
          className={`absolute bottom-2.5 right-2.5 p-2 rounded-full shadow-md transition cursor-pointer ${
            isPlayingAudio
              ? 'bg-orange-600 text-white animate-pulse'
              : 'bg-white/95 text-neutral-800 hover:bg-orange-500 hover:text-white'
          }`}
          title="Écouter le titre et le prix (Accessibilité vocale)"
          aria-label="Écouter la description vocale"
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Seller shop & trial verification badge */}
          <div className="flex items-center justify-between gap-2 text-xs text-neutral-500 mb-1">
            <span className="font-semibold text-neutral-700 truncate">
              {product.seller.shopName}
            </span>
            {product.seller.isTrialPeriod && (
              <span
                className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0"
                title="Commerçant bénéficiant de l'offre de lancement Barewa à 0% de commission"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                0% Com.
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
            {displayTitle}
          </h3>

          {/* Semantic Match Reason if available */}
          {product.searchExplanation && (
            <p className="mt-1 text-[11px] text-orange-800 bg-orange-50 p-1.5 rounded-md italic">
              « {product.searchExplanation} »
            </p>
          )}

          {/* Short Description */}
          <p className="mt-1.5 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {displayDescription}
          </p>
        </div>

        {/* Price, Loyalty Points & Actions */}
        <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-lg font-black text-neutral-950">
                {product.priceFcfa.toLocaleString()}{' '}
                <span className="text-xs font-bold text-orange-700">{t.fcfa}</span>
              </span>
            </div>

            {/* Barewa Points Bonus */}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
              <Award className="w-3 h-3 text-amber-600" />
              +{product.pointsEarned} pts
            </span>
          </div>

          {/* Dual Action Buttons : WhatsApp Direct & Cart */}
          <div className="grid grid-cols-2 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            {/* WhatsApp negotiation (informal African commerce standard) */}
            <a
              id={`whatsapp-btn-${product.id}`}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
              title="Discuter directement avec le vendeur sur WhatsApp"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Add to Cart / Order button */}
            <button
              id={`add-cart-btn-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 bg-neutral-900 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.addToCart}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
