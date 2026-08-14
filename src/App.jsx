import { useState, useEffect, useRef, useCallback } from "react";

const CATEGORIES = [
  { id: "culture", label: "Culture G", emoji: "🌍", color: "#00F5A0" },
  { id: "business", label: "Business", emoji: "💡", color: "#0062FF" },
  { id: "immo", label: "Immobilier", emoji: "🏙️", color: "#7B2FFF" },
  { id: "devperso", label: "Dev Perso", emoji: "🧠", color: "#00F5A0" },
  { id: "news", label: "Actualités", emoji: "📰", color: "#0062FF" },
];

const SEED_CARDS = [
  { id: 1, category: "culture", emoji: "🌍", title: "Le saviez-vous ?", body: "Paris compte 20 arrondissements disposés en spirale depuis le centre. Ce système unique date du baron Haussmann qui a redessiné la ville entre 1853 et 1870.", tag: "Histoire" },
  { id: 2, category: "business", emoji: "💡", title: "Règle des 1000 fans", body: "Kevin Kelly a théorisé qu'un créateur n'a besoin que de 1000 vrais fans pour vivre de sa passion. 1000 personnes qui achètent tout ce que tu produis suffisent pour générer un revenu solide.", tag: "Entrepreneuriat" },
  { id: 3, category: "immo", emoji: "🏙️", title: "Prix au m² à Paris", body: "Le prix moyen au m² à Paris est d'environ 9 500€ en 2025. Le 7ème arrondissement reste le plus cher avec plus de 14 000€/m², tandis que le 20ème est le plus accessible.", tag: "Marché" },
  { id: 4, category: "devperso", emoji: "🧠", title: "L'effet Dunning-Kruger", body: "Plus on est débutant dans un domaine, plus on surestime ses compétences. L'expertise apporte l'humilité. C'est pourquoi les vrais experts doutent toujours d'eux-mêmes.", tag: "Psychologie" },
  { id: 5, category: "news", emoji: "📰", title: "IA et emploi", body: "Selon le FMI, 40% des emplois mondiaux seront affectés par l'intelligence artificielle dans les 5 prochaines années. Mais l'histoire montre que chaque révolution technologique crée plus d'emplois qu'elle n'en détruit.", tag: "Tech" },
  { id: 6, category: "culture", emoji: "🌍", title: "Origine du mot Salaire", body: "Le mot salaire vient du latin salarium, lié au sel. Dans la Rome antique, les soldats étaient parfois payés en sel — une denrée précieuse et rare. D'où l'expression ne pas valoir son sel.", tag: "Étymologie" },
  { id: 7, category: "business", emoji: "💡", title: "La loi de Pareto", body: "80% de tes résultats viennent de 20% de tes efforts. En business, 80% de ton chiffre d'affaires vient souvent de 20% de tes clients. Identifie ces 20% et concentre-toi dessus.", tag: "Productivité" },
  { id: 8, category: "devperso", emoji: "🧠", title: "La règle des 2 minutes", body: "Si une tâche prend moins de 2 minutes, fais-la maintenant. Cette règle simple de David Allen élimine la procrastination sur les petites choses et libère ton énergie mentale pour ce qui compte vraiment.", tag: "Productivité" },
];

const categoryMap = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));

function LoadingDots() {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: "linear-gradient(135deg, #00F5A0, #0062FF)",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`
        }} />
      ))}
    </div>
  );
}

function Card({ card }) {
  const cat = categoryMap[card.category] || CATEGORIES[0];
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true);
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleTap}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "28px 24px 100px",
        position: "relative",
        userSelect: "none",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 70% 20%, ${cat.color}18 0%, transparent 60%), linear-gradient(180deg, #06060c 0%, #0d0d18 100%)`,
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute", top: 40, right: -30,
        width: 180, height: 180, borderRadius: "50%",
        border: `1px solid ${cat.color}22`, zIndex: 0,
      }} />

      {showHeart && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center", zIndex: 10,
          animation: "heartPop 0.8s ease forwards", fontSize: 80,
        }}>❤️</div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `${cat.color}15`,
          border: `1px solid ${cat.color}40`,
          borderRadius: 20, padding: "4px 12px", marginBottom: 16,
        }}>
          <span style={{ fontSize: 14 }}>{cat.emoji}</span>
          <span style={{ fontSize: 11, color: cat.color, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }}>
            {cat.label}
          </span>
        </div>

        <div style={{ fontSize: 11, color: "#444", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          #{card.tag}
        </div>

        <h2 style={{
          fontSize: 26, fontFamily: "'Space Grotesk', sans-serif",
          color: "#f0ede6", fontWeight: 700, margin: "0 0 14px", lineHeight: 1.2,
        }}>
          {card.title}
        </h2>

        <p style={{ fontSize: 15, color: "#8888a8", lineHeight: 1.7, margin: "0 0 24px" }}>
          {card.body}
        </p>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button onClick={() => setLiked(!liked)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            color: liked ? "#E84747" : "#555", fontSize: 13, padding: 0,
          }}>
            <span style={{ fontSize: 20 }}>{liked ? "❤️" : "🤍"}</span> J'aime
          </button>
          <button onClick={() => setSaved(!saved)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            color: saved ? "#00F5A0" : "#555", fontSize: 13, padding: 0,
          }}>
            <span style={{ fontSize: 20 }}>{saved ? "🔖" : "📌"}</span> Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}

function AICard({ category, onDone }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const cat = categoryMap[category] || CATEGORIES[0];

  useEffect(() => {
    let cancelled = false;
    async function fetchCard() {
      const prompts = {
        culture: "Génère un fait de culture générale surprenant et peu connu. Format JSON strict: {\"title\": \"...\", \"body\": \"...\", \"tag\": \"...\"} — title: accroche courte max 40 chars, body: explication fascinante 2-3 phrases, tag: mot-clé. JSON uniquement, aucun markdown.",
        business: "Génère un conseil business ou entrepreneuriat actionnable. Format JSON strict: {\"title\": \"...\", \"body\": \"...\", \"tag\": \"...\"} — title: accroche courte max 40 chars, body: conseil concret 2-3 phrases, tag: mot-clé. JSON uniquement, aucun markdown.",
        immo: "Génère un fait ou conseil sur l'immobilier à Paris ou en France. Format JSON strict: {\"title\": \"...\", \"body\": \"...\", \"tag\": \"...\"} — title: accroche courte max 40 chars, body: info utile 2-3 phrases, tag: mot-clé. JSON uniquement, aucun markdown.",
        devperso: "Génère un insight de développement personnel basé sur la psychologie. Format JSON strict: {\"title\": \"...\", \"body\": \"...\", \"tag\": \"...\"} — title: concept court max 40 chars, body: explication profonde 2-3 phrases, tag: mot-clé. JSON uniquement, aucun markdown.",
        news: "Génère une tendance mondiale ou actualité importante de 2025. Format JSON strict: {\"title\": \"...\", \"body\": \"...\", \"tag\": \"...\"} — title: accroche courte max 40 chars, body: contexte et enjeux 2-3 phrases, tag: mot-clé. JSON uniquement, aucun markdown.",
      };

      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompts[category] || prompts.culture }],
          }),
        });
        const data = await res.json();
        if (cancelled) return;
        const text = data.content?.map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(text);
        setContent({ ...parsed, category, emoji: cat.emoji, id: Date.now() });
      } catch (e) {
        if (!cancelled) setContent({
          title: "Nouvelle carte",
          body: "Continue à scroller pour découvrir de nouveaux savoirs.",
          tag: "Zid",
          category, emoji: cat.emoji, id: Date.now(),
        });
      } finally {
        if (!cancelled) { setLoading(false); onDone && onDone(); }
      }
    }
    fetchCard();
    return () => { cancelled = true; };
  }, [category]);

  if (loading) return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(180deg, #06060c 0%, #0d0d18 100%)",
    }}>
      <div style={{ fontSize: 40, marginBottom: 16 }}>{cat.emoji}</div>
      <p style={{ color: "#444", fontSize: 14, marginBottom: 8 }}>Génération en cours...</p>
      <LoadingDots />
    </div>
  );

  return <Card card={content} />;
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cards, setCards] = useState(SEED_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const touchStartY = useRef(null);
  const wheelTimeout = useRef(null);

  const filteredCards = activeCategory === "all" ? cards : cards.filter(c => c.category === activeCategory);

  const addAICard = useCallback((cat) => {
    if (generating) return;
    setGenerating(true);
    const targetCat = cat === "all" ? CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].id : cat;
    setCards(prev => [...prev, { id: `ai-${Date.now()}`, category: targetCat, isAI: true }]);
  }, [generating]);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => {
      const next = prev + 1;
      if (next >= filteredCards.length - 1) addAICard(activeCategory);
      return Math.min(next, filteredCards.length - 1);
    });
  }, [filteredCards.length, addAICard, activeCategory]);

  const goPrev = useCallback(() => setCurrentIndex(prev => Math.max(prev - 1, 0)), []);

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
    touchStartY.current = null;
  };

  const handleWheel = (e) => {
    if (wheelTimeout.current) return;
    if (e.deltaY > 30) goNext();
    else if (e.deltaY < -30) goPrev();
    wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null; }, 600);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "ArrowDown") goNext(); if (e.key === "ArrowUp") goPrev(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const currentCard = filteredCards[currentIndex];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #06060c; overflow: hidden; -webkit-font-smoothing: antialiased; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
        @keyframes heartPop { 0% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } 100% { opacity: 0; transform: scale(1); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        ::-webkit-scrollbar { display: none; }
        button { transition: opacity 0.2s; }
        button:hover { opacity: 0.8; }
      `}</style>

      <div style={{
        width: "100vw", height: "100vh", background: "#06060c",
        display: "flex", flexDirection: "column", overflow: "hidden",
        maxWidth: 420, margin: "0 auto", position: "relative",
        fontFamily: "'Space Grotesk', sans-serif",
      }}>

        {/* Header */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
          padding: "16px 24px 12px",
          background: "linear-gradient(to bottom, #06060c 60%, transparent)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: "#333", fontFamily: "monospace", letterSpacing: 2, textTransform: "uppercase" }}>
                Découvrir
              </div>
              <div style={{
                fontSize: 24, fontWeight: 700, letterSpacing: -1,
                background: "linear-gradient(135deg, #ffffff, #8888aa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Zid<span style={{ background: "linear-gradient(135deg, #00F5A0, #0062FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>·</span>
              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #00F5A0, #0062FF)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>🔥</div>
          </div>

          {/* Category filters */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {[{ id: "all", label: "Tout", emoji: "⚡", color: "#00F5A0" }, ...CATEGORIES].map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setCurrentIndex(0); }}
                style={{
                  flexShrink: 0, padding: "5px 12px", borderRadius: 20,
                  border: activeCategory === cat.id ? `1px solid ${cat.color}` : "1px solid #1a1a2e",
                  background: activeCategory === cat.id ? `${cat.color}18` : "transparent",
                  color: activeCategory === cat.id ? cat.color : "#444",
                  fontSize: 11, cursor: "pointer", fontFamily: "monospace",
                  letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card area */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          style={{ flex: 1, position: "relative", overflow: "hidden", animation: "slideUp 0.4s ease" }}
        >
          {currentCard ? (
            currentCard.isAI
              ? <AICard category={currentCard.category} onDone={() => setGenerating(false)} />
              : <Card card={currentCard} />
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333" }}>
              Aucune carte dans cette catégorie
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div style={{
          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 4, zIndex: 10,
        }}>
          {filteredCards.slice(Math.max(0, currentIndex - 3), currentIndex + 5).map((_, i) => {
            const realIndex = Math.max(0, currentIndex - 3) + i;
            return (
              <div key={realIndex} style={{
                width: 3,
                height: realIndex === currentIndex ? 20 : 6,
                borderRadius: 3,
                background: realIndex === currentIndex
                  ? "linear-gradient(180deg, #00F5A0, #0062FF)"
                  : "#222",
                transition: "all 0.3s ease",
              }} />
            );
          })}
        </div>

        {/* Bottom hint */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20,
          padding: "60px 24px 20px",
          background: "linear-gradient(to top, #06060c 50%, transparent)",
          display: "flex", justifyContent: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#222", fontSize: 11, fontFamily: "monospace", letterSpacing: 1 }}>
            <span>↑</span>
            <span>{currentIndex + 1} / {filteredCards.length}</span>
            <span>↓</span>
          </div>
        </div>
      </div>
    </>
  );
}
