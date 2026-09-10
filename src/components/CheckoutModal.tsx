import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Smartphone, Bike, Award, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { CartItem, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalFcfa: number;
  onOrderSuccess: (pointsEarned: number) => void;
  barewaPoints: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  totalFcfa,
  onOrderSuccess,
  barewaPoints,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Niamey');
  const [customerQuartier, setCustomerQuartier] = useState('Wadata');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange_money');
  const [useBarewaPoints, setUseBarewaPoints] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any>(null);

  // Delivery fee via TAK TAK TAXI
  const deliveryFeeFcfa = 1500;
  // Loyalty points discount (1 point = 10 FCFA)
  const discountFcfa = useBarewaPoints ? Math.min(totalFcfa, barewaPoints * 10) : 0;
  const grandTotalFcfa = Math.max(0, totalFcfa + deliveryFeeFcfa - discountFcfa);
  const pointsToEarn = Math.floor(grandTotalFcfa / 1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || !customerName) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const fakeOrder = {
        orderId: `BW-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        customerPhone,
        paymentMethod,
        total: grandTotalFcfa,
        pointsEarned: pointsToEarn,
      };
      setOrderCompleted(fakeOrder);
      onOrderSuccess(pointsToEarn);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="checkout-modal"
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Paiement Souverain & Livraison TAK TAK TAXI
              </h2>
              <p className="text-xs text-neutral-500">
                Orange Money • Moov Flooz • Wave • Espèces à la livraison
              </p>
            </div>
          </div>

          <button
            id="close-checkout-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderCompleted ? (
          /* Order Confirmation Screen */
          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Commande Validée avec Succès
              </span>
              <h3 className="text-2xl font-black text-neutral-900 mt-2">
                Référence #{orderCompleted.orderId}
              </h3>
              <p className="text-sm text-neutral-600 mt-1 max-w-md mx-auto">
                Merci {orderCompleted.customerName} ! Votre commande a été transmise aux vendeurs. Un coursier TAK TAK TAXI a été pré-assigné pour la livraison à {customerQuartier}, {customerCity}.
              </p>
            </div>

            {/* Mobile Money prompt message */}
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 text-xs text-orange-950 max-w-md w-full text-left">
              <span className="font-bold block text-sm mb-1 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-orange-600" />
                Notification Mobile Money envoyée :
              </span>
              {orderCompleted.paymentMethod === 'orange_money' && (
                <p>Un message push Orange Money a été envoyé au <strong>{orderCompleted.customerPhone}</strong>. Veuillez taper votre code secret pour valider le montant de {orderCompleted.total.toLocaleString()} FCFA.</p>
              )}
              {orderCompleted.paymentMethod === 'moov_flooz' && (
                <p>Une demande Flooz a été transmise au <strong>{orderCompleted.customerPhone}</strong>. Confirmez avec votre code USSD Moov Money.</p>
              )}
              {orderCompleted.paymentMethod === 'wave' && (
                <p>Notification Wave Niger envoyée sur l'application Wave de votre numéro.</p>
              )}
              {orderCompleted.paymentMethod === 'cash_on_delivery' && (
                <p>Vous réglerez {orderCompleted.total.toLocaleString()} FCFA directement en espèces au coursier TAK TAK TAXI à la remise du colis.</p>
              )}
            </div>

            {/* Barewa Points Earned Badge */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3 text-amber-950 text-xs font-bold w-full max-w-md">
              <Award className="w-5 h-5 text-amber-600 shrink-0" />
              <span>+{orderCompleted.pointsEarned} Barewa Points crédités sur votre compte fidélité !</span>
            </div>

            <button
              id="finish-order-btn"
              onClick={onClose}
              className="py-3 px-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold shadow-md cursor-pointer transition"
            >
              Retourner au Marché
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
            {/* Delivery address */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <Bike className="w-4 h-4 text-orange-600" />
                1. Coordonnées de Livraison TAK TAK TAXI
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Nom complet du destinataire *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Adamou Souley"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Numéro de Téléphone (Mobile Money) *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ex: +227 90 12 34 56"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Ville
                  </label>
                  <select
                    id="checkout-city"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white"
                  >
                    <option value="Niamey">Niamey</option>
                    <option value="Maradi">Maradi</option>
                    <option value="Zinder">Zinder</option>
                    <option value="Tahoua">Tahoua</option>
                    <option value="Agadez">Agadez</option>
                    <option value="Dosso">Dosso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Quartier / Repère précis *
                  </label>
                  <input
                    id="checkout-quartier"
                    type="text"
                    required
                    value={customerQuartier}
                    onChange={(e) => setCustomerQuartier(e.target.value)}
                    placeholder="Ex: Wadata, près de la grande mosquée"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-medium focus:outline-none focus:border-orange-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Sovereign Payment Methods */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                2. Mode de Paiement Souverain Local
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Orange Money */}
                <label
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === 'orange_money'
                      ? 'border-orange-600 bg-orange-50/50'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="orange_money"
                    checked={paymentMethod === 'orange_money'}
                    onChange={() => setPaymentMethod('orange_money')}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <div className="w-9 h-9 rounded-xl bg-orange-500 text-white font-black text-xs flex items-center justify-center">
                    OM
                  </div>
                  <div>
                    <span className="font-bold text-xs text-neutral-900 block">Orange Money Niger</span>
                    <span className="text-[11px] text-neutral-500">Paiement instantané (#144#)</span>
                  </div>
                </label>

                {/* Moov Flooz */}
                <label
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === 'moov_flooz'
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="moov_flooz"
                    checked={paymentMethod === 'moov_flooz'}
                    onChange={() => setPaymentMethod('moov_flooz')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                    FL
                  </div>
                  <div>
                    <span className="font-bold text-xs text-neutral-900 block">Moov Money Flooz</span>
                    <span className="text-[11px] text-neutral-500">Paiement direct (*155#)</span>
                  </div>
                </label>

                {/* Wave Niger */}
                <label
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === 'wave'
                      ? 'border-cyan-600 bg-cyan-50/50'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="wave"
                    checked={paymentMethod === 'wave'}
                    onChange={() => setPaymentMethod('wave')}
                    className="text-cyan-600 focus:ring-cyan-500"
                  />
                  <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white font-black text-xs flex items-center justify-center">
                    W
                  </div>
                  <div>
                    <span className="font-bold text-xs text-neutral-900 block">Wave Niger</span>
                    <span className="text-[11px] text-neutral-500">0% frais de transfert</span>
                  </div>
                </label>

                {/* Cash on delivery */}
                <label
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center gap-3 transition ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === 'cash_on_delivery'}
                    onChange={() => setPaymentMethod('cash_on_delivery')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    CASH
                  </div>
                  <div>
                    <span className="font-bold text-xs text-neutral-900 block">Espèces à la Livraison</span>
                    <span className="text-[11px] text-neutral-500">Payer au coursier TAK TAK</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Barewa Points Loyalty Redemption */}
            {barewaPoints > 0 && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-amber-950 block">
                      Utiliser vos Barewa Points ({barewaPoints} pts disponibles)
                    </span>
                    <span className="text-[11px] text-amber-800">
                      Économisez jusqu'à {(barewaPoints * 10).toLocaleString()} FCFA sur cette commande
                    </span>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useBarewaPoints}
                    onChange={(e) => setUseBarewaPoints(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span className="text-xs font-bold text-neutral-900">Appliquer</span>
                </label>
              </div>
            )}

            {/* Order Summary Recap */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Articles ({cartItems.reduce((acc, i) => acc + i.quantity, 0)}) :</span>
                <span className="font-bold text-neutral-900">{totalFcfa.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Livraison express TAK TAK TAXI :</span>
                <span className="font-bold text-emerald-700">+{deliveryFeeFcfa.toLocaleString()} FCFA</span>
              </div>
              {discountFcfa > 0 && (
                <div className="flex justify-between text-amber-800 font-bold">
                  <span>Réduction Barewa Points :</span>
                  <span>-{discountFcfa.toLocaleString()} FCFA</span>
                </div>
              )}
              <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-neutral-900">Montant Total :</span>
                <span className="text-xl font-black text-neutral-950">
                  {grandTotalFcfa.toLocaleString()} <span className="text-xs font-bold text-orange-600">FCFA</span>
                </span>
              </div>
            </div>

            {/* Submit */}
            <button
              id="confirm-checkout-btn"
              type="submit"
              disabled={isProcessing}
              className="py-3.5 px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Traitement sécurisé du paiement...</span>
                </>
              ) : (
                <>
                  <span>Confirmer la commande ({grandTotalFcfa.toLocaleString()} FCFA)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
