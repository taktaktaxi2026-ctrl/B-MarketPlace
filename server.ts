import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    marketplace: "Barewa MarketPlace",
    country: "Niger",
    version: "1.0.0",
    hasAiKey: !!apiKey,
  });
});

// AI Assistant for Sellers: Generates optimized product descriptions & translations
app.post("/api/ai/generate-product", async (req, res) => {
  try {
    const { rawTitle, category, rawDescription, priceFcfa, targetRegion } = req.body;

    if (!rawTitle) {
      return res.status(400).json({ error: "Le titre ou le nom de l'article est requis." });
    }

    if (!ai) {
      // Fallback generator if API key is not yet set
      const cleanTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      return res.json({
        optimizedTitle: `${cleanTitle} - Fait au Niger (Qualité Supérieure)`,
        descriptionFr: `Découvrez notre ${rawTitle.toLowerCase()}, produit avec soin selon les savoir-faire traditionnels et modernes du Niger. Idéal pour un usage quotidien ou comme cadeau raffiné. Disponible avec livraison express TAK TAK TAXI à Niamey et expédition dans tout le pays.`,
        descriptionHausa: `Wannan ${cleanTitle} ne mai inganci wanda aka yi shi a Nijar. Yana da kyau kuma yana da saukin amfani. Za a iya kawo muku shi da sauri ta hanyar TAK TAK TAXI.`,
        descriptionZarma: `Woo ${cleanTitle} fo no kaŋ gonda sah̃a kaŋ borey tee Nejer ra. A ga boori nda bine baani. TAK TAK TAXI ga hin k'a sambu ka kand'a war se.`,
        tags: [category || "Artisanat", "Niger", "Qualité", "Fait Maison", "Commerce Local"],
        suggestedPriceRange: priceFcfa ? `${priceFcfa} FCFA` : "2 500 - 15 000 FCFA",
        commissionNote: "Période d'essai commerçant : 0% de commission sur vos 30 premières ventes !",
        seoScore: 92,
      });
    }

    const prompt = `Tu es l'assistant commercial IA de Barewa MarketPlace, la première plateforme e-commerce souveraine du Niger.
Tu aides les commerçants, artisans et agriculteurs locaux à rédiger une fiche produit percutante et accessible.
Le commerçant a fourni :
- Nom ou idée : "${rawTitle}"
- Catégorie : "${category || "Non spécifiée"}"
- Brève description : "${rawDescription || "Non spécifiée"}"
- Prix indicatif : "${priceFcfa || "À suggérer"}" FCFA
- Région / Ville : "${targetRegion || "Niamey, Niger"}"

Rédige une réponse JSON stricte avec ce format exact :
{
  "optimizedTitle": "Titre valorisant et clair avec mention d'origine nigérienne",
  "descriptionFr": "Description commerciale chaleureuse en français (2-3 phrases accrocheuses mettant en valeur le produit, son authenticité et la livraison TAK TAK TAXI)",
  "descriptionHausa": "Brève description claire en langue Haoussa (1-2 phrases)",
  "descriptionZarma": "Brève description claire en langue Zarma (1-2 phrases)",
  "tags": ["3 à 5 mots-clés pertinents"],
  "suggestedPriceRange": "Fourchette de prix réaliste en FCFA pour le marché nigérien",
  "commissionNote": "Note encourageante sur la commission (ex: 0% d'essai)",
  "seoScore": 95
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("AI Generation error:", error);
    res.status(500).json({
      error: "Erreur lors de la génération avec l'IA. Mode de secours activé.",
      fallbackTitle: `${req.body.rawTitle || "Produit"} - Artisanal du Niger`,
    });
  }
});

// Semantic Vector Search Endpoint
app.post("/api/ai/vector-search", async (req, res) => {
  try {
    const { query, products } = req.body;
    if (!query) {
      return res.json({ results: products || [] });
    }

    if (!ai) {
      // Return smart keyword / heuristic ranking if no API key
      const q = query.toLowerCase();
      const scored = (products || []).map((p: any) => {
        let score = 0;
        if (p.title.toLowerCase().includes(q)) score += 0.8;
        if (p.description.toLowerCase().includes(q)) score += 0.5;
        if (p.category.toLowerCase().includes(q)) score += 0.4;
        if (p.region.toLowerCase().includes(q)) score += 0.3;
        if (p.tags?.some((t: string) => t.toLowerCase().includes(q))) score += 0.6;
        return { ...p, similarity: Math.min(0.98, Math.max(0.35, score + 0.2)) };
      });
      scored.sort((a: any, b: any) => b.similarity - a.similarity);
      return res.json({ results: scored });
    }

    const prompt = `Tu es le moteur de recherche sémantique vectoriel de Barewa MarketPlace (Niger).
Voici la requête d'un client : "${query}".
Voici la liste des produits disponibles au format JSON :
${JSON.stringify((products || []).map((p: any) => ({ id: p.id, title: p.title, description: p.description, category: p.category, region: p.region })))}

Analyse l'intention de recherche sémantique du client (qui peut être en français, avec des termes haoussa ou zarma, ou des descriptions indirectes comme "quelque chose pour le thé", "tenue de fête", "viande séchée", "souvenir du désert").
Attribue à chaque produit un score de similarité vectorielle cosinus entre 0.00 et 0.99.
Renvoie un JSON strict :
{
  "matches": [
    { "id": "id du produit", "similarity": 0.95, "reason": "Pourquoi ce produit correspond" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const matchMap = new Map((parsed.matches || []).map((m: any) => [m.id, m]));
    
    const results = (products || []).map((p: any) => {
      const match = matchMap.get(p.id) as { similarity?: number; reason?: string } | undefined;
      return {
        ...p,
        similarity: match?.similarity ?? 0.3,
        searchExplanation: match?.reason || "Correspondance générale",
      };
    });

    results.sort((a: any, b: any) => (b.similarity || 0) - (a.similarity || 0));
    res.json({ results });
  } catch (error: any) {
    console.error("Vector search error:", error);
    res.status(500).json({ error: "Erreur lors de la recherche vectorielle." });
  }
});

// Start the server with Vite middleware in dev mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Barewa MarketPlace server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
