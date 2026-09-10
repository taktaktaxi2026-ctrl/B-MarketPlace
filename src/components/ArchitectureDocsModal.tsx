import React, { useState } from 'react';
import { X, Copy, Check, Database, Cpu, Layers, ShieldCheck, Bike, Smartphone, FileText } from 'lucide-react';
import { SUPABASE_DATABASE_SCHEMA_SQL, PGVECTOR_SEARCH_PYTHON_OR_NODE_CODE } from '../data/schemaSql';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'schema' | 'search_code' | 'model'>('schema');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_DATABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PGVECTOR_SEARCH_PYTHON_OR_NODE_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="architecture-docs-modal"
        className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-20 px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-900">
                  Livrables d'Architecture & Schéma Technique
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Niger Souverain
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Spécifications Supabase, pgvector, Mobile Money & Écosystème Barewa
              </p>
            </div>
          </div>

          <button
            id="close-arch-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4 border-b border-neutral-200 bg-neutral-50/70 flex gap-2">
          <button
            id="tab-sql-schema"
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'schema'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>1. Schéma SQL Supabase (vendeurs, produits, commandes, paiements)</span>
          </button>

          <button
            id="tab-search-code"
            onClick={() => setActiveTab('search_code')}
            className={`pb-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'search_code'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>2. Code Moteur Vectoriel (pgvector + Gemini)</span>
          </button>

          <button
            id="tab-business-model"
            onClick={() => setActiveTab('model')}
            className={`pb-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
              activeTab === 'model'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Modèle Économique & Synergies TAK TAK TAXI</span>
          </button>
        </div>

        {/* Tab 1: SQL Schema Deliverable */}
        {activeTab === 'schema' && (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm">
                  Script DDL Complet Supabase PostgreSQL + Extension pgvector
                </h3>
                <p className="text-xs text-neutral-500">
                  Prêt au déploiement dans l'éditeur SQL de Supabase avec RLS et fonction RPC <code className="text-orange-600 font-mono">match_products</code>.
                </p>
              </div>

              <button
                id="copy-sql-btn"
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-xs"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copié !' : 'Copier le SQL'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-neutral-950 text-neutral-200 p-4 font-mono text-xs overflow-x-auto max-h-[58vh] border border-neutral-800">
              <pre>
                <code>{SUPABASE_DATABASE_SCHEMA_SQL}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Vector Search Code Deliverable */}
        {activeTab === 'search_code' && (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 text-sm">
                  Implémentation du Moteur de Recherche Sémantique Hybride (pgvector)
                </h3>
                <p className="text-xs text-neutral-500">
                  Génération d'embeddings à 768 dimensions et matching par distance cosinus <code className="text-orange-600 font-mono">&lt;=&gt;</code>
                </p>
              </div>

              <button
                id="copy-code-btn"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-xs"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copié !' : 'Copier le Code'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-neutral-950 text-neutral-200 p-4 font-mono text-xs overflow-x-auto max-h-[58vh] border border-neutral-800">
              <pre>
                <code>{PGVECTOR_SEARCH_PYTHON_OR_NODE_CODE}</code>
              </pre>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-xs text-neutral-900 block mb-1">
                  1. Tolérance au Langage Naturel
                </span>
                <p className="text-xs text-neutral-600">
                  Le client peut chercher « viande séchée avec piment » ou « habiyoyin daurin aure », pgvector comprend l'intention sans mot-clé exact.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-xs text-neutral-900 block mb-1">
                  2. Indexation HNSW Ultra-Rapide
                </span>
                <p className="text-xs text-neutral-600">
                  L'index HNSW <code className="font-mono text-[11px]">vector_cosine_ops</code> garantit des réponses sous les 12 millisecondes même avec 100 000 articles.
                </p>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-xs text-neutral-900 block mb-1">
                  3. Filtrage Hybride Métadonnées
                </span>
                <p className="text-xs text-neutral-600">
                  Filtrage combiné par distance vectorielle et critères relationnels (catégorie, région d'origine nigérienne, prix FCFA).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Business Model & Barewa Ecosystem Synergies */}
        {activeTab === 'model' && (
          <div className="p-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Revenue Model */}
              <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-orange-600" />
                  <h4 className="font-bold text-neutral-900 text-sm">
                    Modèle de Revenus & Masse Critique
                  </h4>
                </div>
                <ul className="text-xs text-neutral-700 flex flex-col gap-2 leading-relaxed">
                  <li>
                    <strong>• Période d'essai 0% de commission :</strong> Les 30 premières transactions de chaque vendeur ou artisan sont exonérées de commission pour vaincre la réticence numérique initiale.
                  </li>
                  <li>
                    <strong>• Commission soutenable (5.00%) :</strong> Prélèvement uniquement sur les ventes réussies, bien en-deçà des 15-25% pratiqués par les marketplaces internationales.
                  </li>
                  <li>
                    <strong>• Aucun abonnement fixe :</strong> Barrière à l'entrée zéro pour les artisans et producteurs agricoles nigériens.
                  </li>
                </ul>
              </div>

              {/* Sovereign Payments */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-neutral-900 text-sm">
                    Paiements Souverains & Mobile Money
                  </h4>
                </div>
                <ul className="text-xs text-neutral-700 flex flex-col gap-2 leading-relaxed">
                  <li>
                    <strong>• Orange Money Niger :</strong> Intégration API directe via codes USSD #144# et push OTP pour confirmation instantanée.
                  </li>
                  <li>
                    <strong>• Moov Money Flooz & Wave :</strong> Couverture de l'ensemble des opérateurs GSM et portefeuilles numériques du Niger.
                  </li>
                  <li>
                    <strong>• Espèces à la livraison (Cash on Delivery) :</strong> Remise de l'argent liquide directement au coursier TAK TAK TAXI après vérification du colis.
                  </li>
                </ul>
              </div>
            </div>

            {/* TAK TAK TAXI Synergies */}
            <div className="p-4 bg-neutral-900 text-white rounded-2xl flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0">
                <Bike className="w-6 h-6" />
              </div>
              <div className="flex-1 text-xs">
                <h4 className="font-bold text-sm text-neutral-100 mb-1">
                  Boucle Économique Circulaire avec TAK TAK TAXI
                </h4>
                <p className="text-neutral-300 leading-relaxed">
                  Chaque commande passée sur Barewa MarketPlace déclenche une mission de coursier pour les chauffeurs moto, tricycle et taxi de la flotte TAK TAK TAXI. Cela augmente leurs revenus quotidiens tout en garantissant une livraison en moins de 45 minutes dans tous les quartiers de Niamey (Wadata, Grand Marché, Yantala, Talladjé, Harobanda).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
