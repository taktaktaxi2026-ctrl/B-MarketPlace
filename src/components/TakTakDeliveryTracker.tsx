import React, { useState } from 'react';
import { X, Bike, MapPin, Navigation, Phone, Clock, CheckCircle2, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { mockTakTakCouriers, mockBarewaMapPoints } from '../data/mockProducts';

interface TakTakDeliveryTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TakTakDeliveryTracker: React.FC<TakTakDeliveryTrackerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [selectedHub, setSelectedHub] = useState(mockBarewaMapPoints[0]);
  const [activeStep, setActiveStep] = useState<number>(2); // Simulation step
  const courier = mockTakTakCouriers[0];

  const steps = [
    { title: 'Commande confirmée', desc: 'Vendeur notifié au Grand Marché Niamey' },
    { title: 'Coursier TAK TAK assigné', desc: `${courier.name} (Moto ${courier.vehiclePlate})` },
    { title: 'Colis récupéré au point relais', desc: 'En transit vers le quartier de destination' },
    { title: 'Livré au destinataire', desc: 'Paiement espèces / Mobile Money validé' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div 
        id="taktak-tracker-modal"
        className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-900">
                  Écosystème Barewa : TAK TAK TAXI & Barewa Maps
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                  Logistique Locale
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Attribution intelligente des livraisons et points relais dans Niamey
              </p>
            </div>
          </div>

          <button
            id="close-taktak-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Driver Economic Loop Banner */}
          <div className="p-4 bg-emerald-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide block mb-1">
                Boucle Économique Circulaire
              </span>
              <p className="text-sm font-semibold text-neutral-100">
                Les chauffeurs de TAK TAK TAXI deviennent les livreurs officiels de Barewa MarketPlace.
              </p>
              <p className="text-xs text-emerald-200 mt-1">
                Revenu moyen supplémentaire : 1 200 à 1 500 FCFA par course de livraison assurée.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-800/80 px-3 py-2 rounded-xl border border-emerald-700 text-xs shrink-0">
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span className="font-bold">150+ Chauffeurs Actifs</span>
            </div>
          </div>

          {/* Active Delivery Simulator */}
          <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="font-bold text-neutral-900 text-sm">
                  Course en Direct : Commande #BW-7892
                </h3>
              </div>
              <span className="text-xs font-bold text-neutral-600 bg-white px-2.5 py-1 rounded-full border border-neutral-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                Arrivée estimée : 18 minutes
              </span>
            </div>

            {/* Courier Profile Widget */}
            <div className="p-3.5 bg-white rounded-xl border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 font-extrabold flex items-center justify-center text-lg">
                  MO
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-neutral-900 text-sm">{courier.name}</h4>
                    <span className="text-[10px] font-bold bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-700">
                      Moto {courier.vehiclePlate}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Position actuelle : <strong className="text-neutral-700">{courier.currentLocationName}</strong>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-600">
                    <span className="text-amber-600 font-bold">★ {courier.rating}</span>
                    <span>• {courier.completedDeliveries} livraisons réussies</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${courier.phone}`}
                  className="flex-1 sm:flex-initial py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>

            {/* Timeline steps */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
              {steps.map((step, idx) => {
                const isPast = idx < activeStep;
                const isCurrent = idx === activeStep;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-orange-50 border-orange-400 text-orange-950 shadow-xs'
                        : isPast
                        ? 'bg-emerald-50/60 border-emerald-200 text-neutral-900'
                        : 'bg-white border-neutral-200 text-neutral-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold uppercase">Étape {idx + 1}</span>
                        {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {isCurrent && <Bike className="w-3.5 h-3.5 text-orange-600 animate-bounce" />}
                      </div>
                      <h5 className="font-bold text-xs">{step.title}</h5>
                    </div>
                    <p className="text-[11px] mt-1 line-clamp-2 opacity-80">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Barewa Maps Hubs in Niamey */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  Points de Retrait & Hubs Relais Barewa Maps (Niamey)
                </h3>
                <p className="text-xs text-neutral-500">
                  Sélectionnez un point relais pour voir les horaires et la zone de distribution
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {mockBarewaMapPoints.map((hub) => {
                const isSelected = selectedHub.id === hub.id;
                return (
                  <div
                    key={hub.id}
                    id={`hub-card-${hub.id}`}
                    onClick={() => setSelectedHub(hub)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isSelected ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {hub.quartier}
                        </span>
                        <span className={`text-[11px] ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {hub.city}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm leading-snug">{hub.name}</h4>
                    </div>

                    <div className="pt-2 border-t border-neutral-200/40 text-xs flex flex-col gap-1">
                      <div className={`flex items-center gap-1.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{hub.openHours}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{hub.contact}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
