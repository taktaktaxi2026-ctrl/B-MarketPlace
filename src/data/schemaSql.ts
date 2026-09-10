export const SUPABASE_DATABASE_SCHEMA_SQL = `-- ============================================================================
-- ARCHITECTURE BASE DE DONNÉES : BAREWA MARKETPLACE (NIGER)
-- SGBD : PostgreSQL 15+ / Supabase avec extension vectorielle pgvector
-- Écosystème : Intégration TAK TAK TAXI, Barewa Maps, Mobile Money & IA
-- ============================================================================

-- 1. ACTIVATION DES EXTENSIONS REQUISES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Moteur vectoriel pour recherche sémantique IA

-- 2. TABLE DES VENDEURS ET ARTISANS DU NIGER
-- Modèle économique : période d'essai gratuite 0% commission, puis 5-6%
CREATE TABLE IF NOT EXISTS public.vendeurs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nom_commercial VARCHAR(150) NOT NULL,
    responsable_nom VARCHAR(120) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    numero_whatsapp VARCHAR(30) NOT NULL, -- Commerce informel & canal direct
    ville VARCHAR(60) NOT NULL DEFAULT 'Niamey',
    quartier VARCHAR(100) NOT NULL,
    coordonnees_gps POINT, -- Lat/Lng pour intégration Barewa Maps
    est_en_periode_essai BOOLEAN NOT NULL DEFAULT TRUE, -- 0% commission sur 30 premières ventes
    commission_taux DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- Passe à 5.00% après l'essai
    total_ventes_compteur INT NOT NULL DEFAULT 0,
    est_verifie BOOLEAN NOT NULL DEFAULT FALSE,
    note_moyenne DECIMAL(3,2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLE DES CATÉGORIES ADAPTÉES AU MARCHÉ NIGÉRIEN
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    nom_fr VARCHAR(100) NOT NULL,
    nom_ha VARCHAR(100) NOT NULL, -- Haoussa
    nom_za VARCHAR(100) NOT NULL, -- Zarma
    icone_name VARCHAR(50) NOT NULL,
    ordre_affichage INT DEFAULT 0
);

-- 4. TABLE DES PRODUITS AVEC EMBEDDINGS VECTORIELS PGVECTOR
CREATE TABLE IF NOT EXISTS public.produits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendeur_id UUID NOT NULL REFERENCES public.vendeurs(id) ON DELETE CASCADE,
    categorie_id UUID NOT NULL REFERENCES public.categories(id),
    titre VARCHAR(255) NOT NULL,
    titre_hausa VARCHAR(255),
    titre_zarma VARCHAR(255),
    description TEXT NOT NULL,
    description_hausa TEXT,
    description_zarma TEXT,
    prix_fcfa INT NOT NULL CHECK (prix_fcfa >= 100),
    stock INT NOT NULL DEFAULT 1 CHECK (stock >= 0),
    region_origine VARCHAR(80) NOT NULL DEFAULT 'Niamey', -- Ex: Agadez, Maradi, Tahoua
    est_vedette BOOLEAN NOT NULL DEFAULT FALSE, -- Section "Vedette du Niger"
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    points_fidelite INT NOT NULL DEFAULT 5, -- Barewa Points attribués
    -- VECTEUR SÉMANTIQUE DE 768 DIMENSIONS (Généré par Gemini / text-embedding)
    embedding vector(768),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE DES COURSIERS DE L'ÉCOSYSTÈME TAK TAK TAXI
CREATE TABLE IF NOT EXISTS public.coursiers_taktak (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chauffeur_nom VARCHAR(120) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    type_vehicule VARCHAR(30) NOT NULL DEFAULT 'moto', -- 'moto', 'tricycle', 'taxi'
    immatriculation VARCHAR(30) NOT NULL,
    quartier_base VARCHAR(100) NOT NULL,
    position_lat DECIMAL(10, 8),
    position_lng DECIMAL(11, 8),
    note_moyenne DECIMAL(3,2) DEFAULT 4.90,
    courses_terminees INT DEFAULT 0,
    est_disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLE DES COMMANDES
CREATE TABLE IF NOT EXISTS public.commandes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_barewa VARCHAR(40) UNIQUE NOT NULL,
    client_nom VARCHAR(120) NOT NULL,
    client_telephone VARCHAR(30) NOT NULL,
    ville_livraison VARCHAR(60) NOT NULL DEFAULT 'Niamey',
    quartier_livraison VARCHAR(120) NOT NULL,
    point_relais_id UUID, -- Si retrait au point Barewa Maps
    montant_articles_fcfa INT NOT NULL,
    frais_livraison_fcfa INT NOT NULL DEFAULT 1500, -- Tarif TAK TAK TAXI standard
    montant_total_fcfa INT NOT NULL,
    -- Paiement souverain
    mode_paiement VARCHAR(40) NOT NULL, -- 'orange_money', 'moov_flooz', 'wave', 'cash_on_delivery'
    statut_paiement VARCHAR(30) NOT NULL DEFAULT 'en_attente', -- 'en_attente', 'valide', 'echec'
    statut_livraison VARCHAR(30) NOT NULL DEFAULT 'recherche_coursier', -- 'attribue_taktak', 'en_route', 'livre'
    coursier_taktak_id UUID REFERENCES public.coursiers_taktak(id),
    points_fidelite_gagnes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLE DES LIGNES DE COMMANDE
CREATE TABLE IF NOT EXISTS public.lignes_commande (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commande_id UUID NOT NULL REFERENCES public.commandes(id) ON DELETE CASCADE,
    produit_id UUID NOT NULL REFERENCES public.produits(id),
    vendeur_id UUID NOT NULL REFERENCES public.vendeurs(id),
    quantite INT NOT NULL DEFAULT 1 CHECK (quantite > 0),
    prix_unitaire_fcfa INT NOT NULL,
    commission_barewa_fcfa INT NOT NULL DEFAULT 0
);

-- 8. TABLE DES TRANSACTIONS SOUVERAINES MOBILE MONEY (Orange Money, Moov Flooz, Wave)
CREATE TABLE IF NOT EXISTS public.paiements_mobile_money (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commande_id UUID NOT NULL REFERENCES public.commandes(id),
    operateur VARCHAR(30) NOT NULL, -- 'orange_money', 'moov_flooz', 'wave'
    numero_payeur VARCHAR(30) NOT NULL,
    reference_operateur VARCHAR(100),
    montant_fcfa INT NOT NULL,
    statut VARCHAR(30) NOT NULL DEFAULT 'initie',
    payload_callback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PROGRAMME DE FIDÉLISATION « BAREWA POINTS »
CREATE TABLE IF NOT EXISTS public.points_fidelite (
    telephone_client VARCHAR(30) PRIMARY KEY,
    solde_points INT NOT NULL DEFAULT 0,
    points_cumules_total INT NOT NULL DEFAULT 0,
    derniere_mise_a_jour TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- INDEXATION ET OPTIMISATIONS PGVECTOR
-- ============================================================================

-- Index vectoriel HNSW (Hierarchical Navigable Small World) pour une recherche sémantique ultra-rapide (<10ms)
CREATE INDEX IF NOT EXISTS idx_produits_embedding_hnsw 
ON public.produits 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Index relationnels classiques
CREATE INDEX IF NOT EXISTS idx_produits_vendeur ON public.produits(vendeur_id);
CREATE INDEX IF NOT EXISTS idx_produits_categorie ON public.produits(categorie_id);
CREATE INDEX IF NOT EXISTS idx_commandes_client ON public.commandes(client_telephone);
CREATE INDEX IF NOT EXISTS idx_coursiers_dispo ON public.coursiers_taktak(est_disponible);

-- ============================================================================
-- FONCTION RPC SUPABASE : RECHERCHE VECTORIELLE AVEC COSINE SIMILARITY
-- Permet de trouver des produits à partir d'une description naturelle,
-- même sans mots-clés exacts (ex: "quelque chose pour assaisonner sauce")
-- ============================================================================

CREATE OR REPLACE FUNCTION match_products (
    query_embedding vector(768),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 10,
    category_slug text DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    titre VARCHAR(255),
    description TEXT,
    prix_fcfa INT,
    region_origine VARCHAR(80),
    image_url TEXT,
    similarity float,
    vendeur_nom VARCHAR(150),
    numero_whatsapp VARCHAR(30)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.titre,
        p.description,
        p.prix_fcfa,
        p.region_origine,
        p.image_url,
        1 - (p.embedding <=> query_embedding) AS similarity,
        v.nom_commercial AS vendeur_nom,
        v.numero_whatsapp
    FROM public.produits p
    INNER JOIN public.vendeurs v ON p.vendeur_id = v.id
    LEFT JOIN public.categories c ON p.categorie_id = c.id
    WHERE 
        (category_slug IS NULL OR c.slug = category_slug)
        AND 1 - (p.embedding <=> query_embedding) > match_threshold
    ORDER BY p.embedding <=> query_embedding ASC
    LIMIT match_count;
END;
$$;
`;

export const PGVECTOR_SEARCH_PYTHON_OR_NODE_CODE = `// ============================================================================
// CODE MOTEUR DE RECHERCHE IA VECTORIEL (Node.js / Supabase SDK + Gemini)
// ============================================================================
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Moteur de recherche sémantique hybride vectoriel pour Barewa MarketPlace
 * Supporte le français, haoussa, zarma et les requêtes indirectes.
 */
export async function semanticProductSearch(userQuery: string, categoryFilter?: string) {
  try {
    // 1. Génération de l'embedding vectoriel (768 dimensions) de la requête avec Gemini
    const embeddingResponse = await ai.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: userQuery,
    });

    const queryVector = embeddingResponse.embedding?.values;
    if (!queryVector) throw new Error('Impossible de générer le vecteur');

    // 2. Appel de la fonction RPC Supabase match_products avec distance cosinus <=>
    const { data: matchedProducts, error } = await supabase.rpc('match_products', {
      query_embedding: queryVector,
      match_threshold: 0.60, // Seuil de pertinence minimum 60%
      match_count: 8,         // Top 8 résultats les plus pertinents
      category_slug: categoryFilter || null,
    });

    if (error) throw error;

    return {
      success: true,
      query: userQuery,
      totalMatches: matchedProducts.length,
      results: matchedProducts,
    };
  } catch (err) {
    console.error('Erreur recherche vectorielle pgvector:', err);
    // Fallback recherche textuelle plein-texte si nécessaire
    return { success: false, fallback: true, results: [] };
  }
}
`;
