import React, { useState } from 'react';
import { X, MessageCircle, ShoppingBag, MapPin, Bike, Volume2, ShieldCheck, Award, Star, Clock } from 'lucide-react';
import { Product, Language } from '../types';
import { getTranslation } from '../data/translations';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  currentLang: Language;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  currentLang,
}) => {
  if (!product) return null;
  const t = getTranslation(currentLang);
  const [activeLangTab, setActiveLangTab] = useState<'fr' | 'ha' | 'za'>(currentLang);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const getActiveTitle = () => {
    if (activeLangTab === 'ha' && product.titleHausa) return product.titleHausa;
    if (activeLangTab === 'za' && product.titleZarma) return product.titleZarma;
    return product.title;
  };

  const getActiveDescription = () => {
    if (activeLangTab === 'ha' && product.descriptionHausa) return product.descriptionHausa;
    if (activeLangTab === 'za' && product.descriptionZarma) return product.descriptionZarma;
    return product.description;
  };

  const whatsappText = `${t.chatPromptWhatsapp} "${product.title}" (${product.priceFcfa.toLocaleString()} FCFA). Je souhaite commander ou poser une question.`;
  const whatsappUrl = `https://wa.me/${product.seller.whatsapp}?text=${encodeURIComponent(whatsappText)}`;

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${getActiveTitle()}. ${getActiveDescription()}. Prix : ${product.priceFcfa} Francs CFA.`);
      utterance.lang = activeLangTab === 'ha' ? 'ha-NG' : 'fr-FR';
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="product-detail-modal"
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200"
      >
        {/* Close Button */}
        <button
          id="close-detail-modal"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 text-neutral-700 hover:bg-neutral-100 flex items-center justify-center shadow-md cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative aspect-16/9 w-full bg-neutral-100 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-neutral-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              Origine : {product.regionOrigin}
            </span>
            {product.isFeatured && (
              <span className="bg-amber-400 text-amber-950 text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                Vedette Nationale
              </span>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Header & Seller Info */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
                  {product.category}
                </span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs text-neutral-500 font-medium">
                  Réf: #{product.id.slice(0, 8)}
                </span>
              </div>

              {/* Loyalty Bonus */}
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                +{product.pointsEarned} points Barewa
              </span>
            </div>

            <h2 className="text-2xl font-black text-neutral-950 leading-tight">
              {getActiveTitle()}
            </h2>

            {/* Language Selector for Product Description */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-500">Langue :</span>
              <button
                type="button"
                onClick={() => setActiveLangTab('fr')}
                className={`text-xs px-2.5 py-1 rounded-md font-bold transition ${
                  activeLangTab === 'fr' ? 'bg-orange-600 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                Français
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('ha')}
                className={`text-xs px-2.5 py-1 rounded-md font-bold transition ${
                  activeLangTab === 'ha' ? 'bg-orange-600 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                Hausa
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('za')}
                className={`text-xs px-2.5 py-1 rounded-md font-bold transition ${
                  activeLangTab === 'za' ? 'bg-orange-600 text-white' : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                Zarma
              </button>

              <button
                type="button"
                onClick={handleSpeak}
                className={`ml-auto text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition ${
                  isPlayingAudio ? 'bg-orange-600 text-white animate-pulse' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
                title="Écouter la lecture vocale"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isPlayingAudio ? 'Lecture...' : 'Écouter'}</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <p className="text-sm text-neutral-700 leading-relaxed">
              {getActiveDescription()}
            </p>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-medium bg-white text-neutral-600 px-2 py-0.5 rounded-md border border-neutral-200">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Barewa Ecosystem Integration Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Seller & Barewa Maps Pickup Point */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  Point Vendeur (Barewa Maps)
                </span>
                <p className="font-bold text-neutral-900 text-sm mt-1">
                  {product.seller.shopName}
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {product.seller.pickupPoint}, {product.seller.city}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Vendeur Certifié
                </span>
                <span className="text-neutral-500 flex items-center gap-0.5 font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {product.seller.rating} ({product.seller.salesCount} ventes)
                </span>
              </div>
            </div>

            {/* TAK TAK TAXI Delivery estimation */}
            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                  <Bike className="w-3.5 h-3.5 text-emerald-600" />
                  Livraison TAK TAK TAXI
                </span>
                <p className="font-bold text-emerald-950 text-sm mt-1">
                  Coursier de proximité assigné
                </p>
                <p className="text-xs text-emerald-800 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Livré en 25 à 45 min à Niamey (1 500 FCFA)
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-emerald-200 text-xs text-emerald-900 font-medium">
                Paiement espèces au coursier ou Mobile Money
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-200">
            <div>
              <span className="text-xs text-neutral-500 font-semibold uppercase">Prix TTC</span>
              <div className="text-2xl font-black text-neutral-950">
                {product.priceFcfa.toLocaleString()}{' '}
                <span className="text-sm font-bold text-orange-600">FCFA</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* WhatsApp direct talk */}
              <a
                id="whatsapp-detail-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Négocier sur WhatsApp</span>
              </a>

              {/* Add to cart */}
              <button
                id="add-to-cart-detail-btn"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 py-3 px-5 bg-neutral-900 hover:bg-orange-600 text-white rounded-xl text-sm font-bold shadow-sm transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
