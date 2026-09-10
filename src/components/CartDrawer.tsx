import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Award, MessageCircle } from 'lucide-react';
import { CartItem, Language } from '../types';
import { getTranslation } from '../data/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedCheckout: () => void;
  currentLang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  currentLang,
}) => {
  if (!isOpen) return null;
  const t = getTranslation(currentLang);

  const subtotalFcfa = cartItems.reduce(
    (sum, item) => sum + item.product.priceFcfa * item.quantity,
    0
  );
  const totalPoints = cartItems.reduce(
    (sum, item) => sum + (item.product.pointsEarned || 5) * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <div 
        id="cart-drawer"
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="font-bold text-lg text-neutral-900">{t.cart}</h2>
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} articles
            </span>
          </div>

          <button
            id="close-cart-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <ShoppingBag className="w-12 h-12 mb-2 stroke-1 text-neutral-300" />
              <p className="font-semibold text-neutral-600">{t.emptyCart}</p>
              <p className="text-xs text-neutral-400 mt-1">
                Explorez l'artisanat et les récoltes du Niger pour remplir votre panier !
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                id={`cart-item-${item.product.id}`}
                className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center gap-3"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 truncate">
                    {item.product.title}
                  </h4>
                  <p className="text-xs font-extrabold text-orange-600 mt-0.5">
                    {item.product.priceFcfa.toLocaleString()} FCFA
                  </p>
                  <p className="text-[11px] text-neutral-500 truncate">
                    Vendeur : {item.product.seller.shopName}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 rounded-md bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 transition"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-md bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center hover:bg-neutral-100 transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-2 text-neutral-400 hover:text-red-600 transition"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50 flex flex-col gap-3">
            {/* Loyalty bonus */}
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 bg-amber-100/80 px-3 py-2 rounded-xl">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                Points à gagner :
              </span>
              <span>+{totalPoints} Barewa Points</span>
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-semibold text-neutral-600">Sous-total :</span>
              <span className="text-xl font-black text-neutral-950">
                {subtotalFcfa.toLocaleString()}{' '}
                <span className="text-xs font-bold text-orange-600">{t.fcfa}</span>
              </span>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-checkout-btn"
              onClick={() => {
                onClose();
                onProceedCheckout();
              }}
              className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-orange-600 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <span>{t.orderNow} (Mobile Money / Cash)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
