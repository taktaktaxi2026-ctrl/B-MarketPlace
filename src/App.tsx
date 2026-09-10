/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { VectorSearchBar } from './components/VectorSearchBar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellerAiAssistantModal } from './components/SellerAiAssistantModal';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { TakTakDeliveryTracker } from './components/TakTakDeliveryTracker';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { mockProducts, mockSellers } from './data/mockProducts';
import { Product, CartItem, Language } from './types';
import { getTranslation } from './data/translations';
import { Sparkles, Award, ShieldCheck, Bike, Smartphone, HeartHandshake, HelpCircle } from 'lucide-react';

export default function App() {
  // Application State
  const [currentLang, setCurrentLang] = useState<Language>('fr');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: mockProducts[2], quantity: 2 }, // 2 Kilichi prefilled for instant demo
  ]);
  const [barewaPoints, setBarewaPoints] = useState<number>(35);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isVectorSearching, setIsVectorSearching] = useState(false);
  const [isVectorActive, setIsVectorActive] = useState(false);

  // Modals & Drawers
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSellerAiOpen, setIsSellerAiOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isTakTakTrackerOpen, setIsTakTakTrackerOpen] = useState(false);

  const t = getTranslation(currentLang);

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Vector Search Engine handler
  const handleExecuteVectorSearch = async (query: string) => {
    if (!query.trim()) {
      setIsVectorActive(false);
      return;
    }

    setIsVectorSearching(true);
    try {
      const res = await fetch('/api/ai/vector-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, products }),
      });
      const data = await res.json();
      if (data.results && Array.isArray(data.results)) {
        setProducts(data.results);
        setIsVectorActive(true);
      }
    } catch (err) {
      console.error('Vector search error:', err);
      // Fallback local heuristic
      const q = query.toLowerCase();
      const scored = products.map((p) => {
        let score = 0;
        if (p.title.toLowerCase().includes(q)) score += 0.8;
        if (p.description.toLowerCase().includes(q)) score += 0.5;
        if (p.tags.some((t) => t.toLowerCase().includes(q))) score += 0.6;
        return { ...p, similarity: score > 0 ? Math.min(0.96, score + 0.2) : 0.4 };
      });
      scored.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
      setProducts(scored);
      setIsVectorActive(true);
    } finally {
      setIsVectorSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsVectorActive(false);
    setProducts(mockProducts);
  };

  // Dynamic Product Filtering (Category & Region)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = !selectedCategory || p.category === selectedCategory;
      const matchRegion = !selectedRegion || p.regionOrigin.toLowerCase().includes(selectedRegion.toLowerCase());
      return matchCategory && matchRegion;
    });
  }, [products, selectedCategory, selectedRegion]);

  const featuredNigerProducts = useMemo(() => {
    return filteredProducts.filter((p) => p.isFeatured);
  }, [filteredProducts]);

  const totalCartFcfa = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.product.priceFcfa * item.quantity, 0);
  }, [cartItems]);

  const handleProductPublished = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleOrderSuccess = (pointsGained: number) => {
    setBarewaPoints((prev) => prev + pointsGained);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* 1. Header with Language switch, points, cart, and modals */}
      <Header
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAiAssistant={() => setIsSellerAiOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenTakTakTracker={() => setIsTakTakTrackerOpen(true)}
        barewaPoints={barewaPoints}
      />

      {/* 2. Hero Sovereign Banner & Region Filtering */}
      <HeroBanner
        currentLang={currentLang}
        onOpenAiAssistant={() => setIsSellerAiOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
      />

      {/* 3. Category Selector Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        currentLang={currentLang}
      />

      {/* 4. Intelligent Vector Search with pgvector simulator & voice search */}
      <VectorSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExecuteVectorSearch={handleExecuteVectorSearch}
        isVectorSearching={isVectorSearching}
        currentLang={currentLang}
        onClearSearch={handleClearSearch}
        isVectorActive={isVectorActive}
      />

      {/* 5. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col gap-10">
        {/* Onboarding Seller Banner (0% Commission) */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-600 to-emerald-700 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {t.freeTrialBanner}
              </h3>
              <p className="text-xs sm:text-sm text-orange-100 mt-0.5">
                Utilisez l'Assistant IA Barewa pour rédiger vos fiches en 1 clic en Français, Haoussa et Zarma.
              </p>
            </div>
          </div>

          <button
            id="seller-join-banner-btn"
            onClick={() => setIsSellerAiOpen(true)}
            className="px-5 py-3 bg-white text-neutral-900 hover:bg-neutral-100 font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition cursor-pointer whitespace-nowrap"
          >
            {t.joinAsSeller} (0% Commission)
          </button>
        </div>

        {/* Section: Vedettes du Niger (National artisan & terroir highlights) */}
        {featuredNigerProducts.length > 0 && !selectedCategory && (
          <section id="featured-section" className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-600"></span>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                    {t.featuredNiger}
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  {t.featuredBadge}
                </p>
              </div>

              <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                {featuredNigerProducts.length} articles d'exception
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {featuredNigerProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentLang={currentLang}
                  onAddToCart={handleAddToCart}
                  onOpenDetail={setSelectedProductDetail}
                />
              ))}
            </div>
          </section>
        )}

        {/* Section: All Products / Search Results */}
        <section id="catalog-section" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                {selectedCategory
                  ? `${t.categoriesList[selectedCategory as keyof typeof t.categoriesList] || 'Catalogue'}`
                  : isVectorActive
                  ? 'Résultats de la Recherche Vectorielle pgvector'
                  : t.allCategories}
              </h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                {filteredProducts.length} produits disponibles avec livraison TAK TAK TAXI
              </p>
            </div>

            {isVectorActive && (
              <button
                onClick={handleClearSearch}
                className="text-xs font-bold text-neutral-600 hover:text-orange-600 underline cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 flex flex-col items-center justify-center gap-3">
              <Sparkles className="w-10 h-10 text-neutral-400" />
              <h3 className="font-bold text-neutral-800 text-base">Aucun produit trouvé</h3>
              <p className="text-xs text-neutral-500 max-w-sm">
                Essayez une description plus large dans le moteur de recherche sémantique ou réinitialisez les filtres.
              </p>
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentLang={currentLang}
                  onAddToCart={handleAddToCart}
                  onOpenDetail={setSelectedProductDetail}
                />
              ))}
            </div>
          )}
        </section>

        {/* Deliverables & Technical Architecture Spotlight */}
        <section className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Livrables Requis du Projet Barewa MarketPlace</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Schéma Supabase, Recherche pgvector & Écosystème TAK TAK TAXI
            </h3>
            <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
              Consultez le script SQL complet avec tables relationnelles (vendeurs, produits, commandes, paiements), index vectoriels HNSW, fonction RPC <code className="text-orange-400 font-mono">match_products</code>, et code d'intégration Node.js / Supabase SDK.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="view-architecture-spotlight-btn"
              onClick={() => setIsArchitectureOpen(true)}
              className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              Consulter le Schéma & Code SQL
            </button>

            <button
              id="view-taktak-spotlight-btn"
              onClick={() => setIsTakTakTrackerOpen(true)}
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold rounded-2xl text-xs sm:text-sm border border-neutral-700 transition cursor-pointer"
            >
              Suivi Coursiers & Barewa Maps
            </button>
          </div>
        </section>
      </main>

      {/* 6. Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-12 py-8 px-4 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-sm flex items-center justify-center">
                B
              </div>
              <span className="font-black text-base text-neutral-900">Barewa MarketPlace</span>
            </div>
            <p className="text-neutral-500 leading-relaxed">
              Marché souverain et intelligent pour la République du Niger. Intégré à l'écosystème Barewa.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 mb-2">Paiements Souverains</h4>
            <ul className="flex flex-col gap-1.5 text-neutral-600">
              <li>• Orange Money Niger (#144#)</li>
              <li>• Moov Money Flooz (*155#)</li>
              <li>• Wave Niger</li>
              <li>• Espèces à la livraison (Cash on Delivery)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 mb-2">Écosystème & Logistique</h4>
            <ul className="flex flex-col gap-1.5 text-neutral-600">
              <li>• Coursiers TAK TAK TAXI (Motos & Tricycles)</li>
              <li>• Points de retrait Barewa Maps (Niamey)</li>
              <li>• Commerce informel via WhatsApp 1-Clic</li>
              <li>• Programme de fidélité Barewa Points</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 mb-2">Architecture & IA</h4>
            <ul className="flex flex-col gap-1.5 text-neutral-600">
              <li>• React 19 + TypeScript + Tailwind CSS</li>
              <li>• Supabase PostgreSQL 15 + extension pgvector</li>
              <li>• Assistant IA Vendeur (Gemini 3.8 Flash)</li>
              <li>• Support Multilingue : FR / Hausa / Zarma</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Barewa MarketPlace Niger. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsArchitectureOpen(true)}
              className="text-orange-700 font-bold hover:underline"
            >
              Schéma Base de Données
            </button>
            <button
              onClick={() => setIsSellerAiOpen(true)}
              className="text-orange-700 font-bold hover:underline"
            >
              Espace Vendeurs (0% com.)
            </button>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onAddToCart={handleAddToCart}
        currentLang={currentLang}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
        currentLang={currentLang}
      />

      {/* Sovereign Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalFcfa={totalCartFcfa}
        onOrderSuccess={handleOrderSuccess}
        barewaPoints={barewaPoints}
      />

      {/* Seller AI Assistant Modal */}
      <SellerAiAssistantModal
        isOpen={isSellerAiOpen}
        onClose={() => setIsSellerAiOpen(false)}
        onProductPublished={handleProductPublished}
        currentSellers={mockSellers}
      />

      {/* Architecture & SQL Deliverables Modal */}
      <ArchitectureDocsModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* TAK TAK TAXI & Barewa Maps Tracker Modal */}
      <TakTakDeliveryTracker
        isOpen={isTakTakTrackerOpen}
        onClose={() => setIsTakTakTrackerOpen(false)}
      />
    </div>
  );
}
