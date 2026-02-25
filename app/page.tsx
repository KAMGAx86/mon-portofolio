'use client'

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY;



const NAV_LINKS = [
  { name: "Accueil", id: "hero" },
  { name: "Projets", id: "projects" },
  { name: "Compétences", id: "skills" },
  { name: "À propos", id: "about" },
  { name: "Contact", id: "contact" },
];

const SOCIAL_LINKS = [
  { name: "GitHub", url: "https://github.com/KAMGAx86" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/tchouka-kamga-davy-karim-a32678366/" },
  { name: "Email", url: "mailto:tchoukakamgadavykarim@gmail.com" },
];

const PROJECTS = [
  {
    id: 1,
    title: "DataShare",
    category: "Application Desktop",
    year: "2024",
    emoji: "📡",
    color: "#00E5FF",
    bg: "linear-gradient(135deg, #0a1628 60%, #00294d 100%)",
    description: "Application de partage de fichiers sécurisé en réseau local avec découverte automatique via Zeroconf et vérification d'intégrité SHA-256.",
    tags: ["Python", "Tkinter", "Zeroconf", "Socket", "Threading", "SHA-256"],
    features: ["Découverte automatique Zeroconf", "Authentification sécurisée par nonce", "Vérification SHA-256", "Interface CustomTkinter", "Transfert temps réel avec progression"],
    problem: "Transférer des fichiers volumineux entre PC sans internet ni clé USB",
    solution: "Architecture client-serveur avec découverte réseau automatique et chiffrement",
    github: "https://github.com/KAMGAx86",
  },
  {
    id: 2,
    title: "Inventry",
    category: "Automatisation",
    year: "2024",
    emoji: "🖼️",
    color: "#39FF14",
    bg: "linear-gradient(135deg, #0a1a0a 60%, #003a00 100%)",
    description: "Outil d'extraction automatique d'images depuis des fichiers Excel avec interface graphique Tkinter, nommage intelligent et logs détaillés.",
    tags: ["Python", "OpenPyXL", "Tkinter", "PIL", "openpyxl-image-loader"],
    features: ["Extraction automatique par lots", "Nommage intelligent des fichiers", "Interface graphique intuitive", "Barre de progression temps réel", "Gestion des erreurs robuste"],
    problem: "Extraire manuellement des centaines d'images dans des catalogues Excel est fastidieux",
    solution: "Automation complète avec détection et extraction intelligente via OpenPyXL",
    github: "https://github.com/KAMGAx86",
  },
  {
    id: 3,
    title: "IMC Calculator",
    category: "Application Desktop",
    year: "2024",
    emoji: "⚖️",
    color: "#FF6B35",
    bg: "linear-gradient(135deg, #1a0a05 60%, #3a1500 100%)",
    description: "Application de calcul de l'Indice de Masse Corporelle avec interface graphique moderne développée avec Kivy et KivyMD.",
    tags: ["Python", "Kivy", "KivyMD", "Cross-platform"],
    features: ["Interface Material Design", "Calcul IMC instantané", "Affichage catégorie santé", "Design responsive Kivy", "Compatible multi-plateforme"],
    problem: "Besoin d'un outil simple et visuel pour calculer et interpréter son IMC",
    solution: "App desktop cross-platform avec Kivy, rendu natif et UI soignée",
    github: "https://github.com/KAMGAx86",
  },
  {
    id: 4,
    title: "Pong Game",
    category: "Jeu Python",
    year: "2024",
    emoji: "🏓",
    color: "#FF2D78",
    bg: "linear-gradient(135deg, #1a0010 60%, #3a0020 100%)",
    description: "Recréation du jeu culte Pong en Python avec gestion des collisions, score, vitesse évolutive et mode 2 joueurs.",
    tags: ["Python", "Pygame", "Game Dev", "2D"],
    features: ["Mode 2 joueurs local", "Physique des collisions", "Vitesse évolutive", "Système de score", "Interface rétro pixel"],
    problem: "Comprendre la logique des jeux 2D : boucle de jeu, collisions, rendu",
    solution: "Implémentation complète avec Pygame, gestion des événements et physique simple",
    github: "https://github.com/KAMGAx86",
  },
  {
    id: 5,
    title: "Trouve le Pays Caché",
    category: "Jeu Python",
    year: "2024",
    emoji: "🌍",
    color: "#FFD700",
    bg: "linear-gradient(135deg, #1a1500 60%, #3a2e00 100%)",
    description: "Jeu de devinette géographique : l'utilisateur doit trouver un pays caché à partir d'indices progressifs.",
    tags: ["Python", "Tkinter", "JSON", "Logique de jeu"],
    features: ["Indices progressifs par pays", "Base de données de pays", "Système de score", "Interface Tkinter", "Plusieurs niveaux de difficulté"],
    problem: "Rendre l'apprentissage de la géographie fun et interactif",
    solution: "Jeu de devinette basé sur des indices avec logique de progression dynamique",
    github: "https://github.com/KAMGAx86",
  },
  {
    id: 6,
    title: "Excel Analytics",
    category: "Data Analysis",
    year: "2024",
    emoji: "📊",
    color: "#A855F7",
    bg: "linear-gradient(135deg, #0d0a1a 60%, #1e0a3a 100%)",
    description: "Script de consolidation et analyse de ventes trimestrielles avec génération automatique de graphiques BarChart dans Excel.",
    tags: ["Python", "OpenPyXL", "Data Analysis", "Excel", "Charts"],
    features: ["Agrégation multi-fichiers", "Génération de graphiques", "Consolidation trimestrielle", "Export Excel formaté", "Visualisations professionnelles"],
    problem: "Consolider manuellement les données de ventes mensuelles prend trop de temps",
    solution: "Script automatisé qui agrège, analyse et visualise les données en un clic",
    github: "https://github.com/KAMGAx86",
  },
];

const SKILLS = [
  { cat: "Desktop & GUI", icon: "🖥️", color: "#00E5FF", items: ["Python", "Tkinter", "CustomTkinter", "Kivy", "KivyMD", "PyQt"], level: 92 },
  { cat: "Backend & API", icon: "⚙️", color: "#39FF14", items: ["Django", "FastAPI", "REST API", "JWT Auth", "SQLite", "PostgreSQL"], level: 85 },
  { cat: "Automatisation", icon: "🤖", color: "#FF6B35", items: ["OpenPyXL", "Pandas", "Selenium", "PIL", "Threading", "Subprocess"], level: 90 },
  { cat: "Réseau & Sys", icon: "📡", color: "#FF2D78", items: ["Socket", "Zeroconf", "TCP/IP", "P2P", "SHA-256", "Threading"], level: 82 },
  { cat: "Game Dev", icon: "🎮", color: "#FFD700", items: ["Pygame", "Kivy (jeux)", "Logique 2D", "Collision", "Game Loop"], level: 75 },
  { cat: "Web", icon: "🌐", color: "#A855F7", items: ["Next.js", "React", "TailwindCSS", "TypeScript", "HTML/CSS"], level: 78 },
];

const STACK_HIGHLIGHTS = [
  { name: "Python", icon: "🐍", note: "Langage principal" },
  { name: "Kivy", icon: "📱", note: "Apps cross-platform" },
  { name: "Django", icon: "🎸", note: "Web backend" },
  { name: "FastAPI", icon: "⚡", note: "APIs modernes" },
  { name: "CustomTkinter", icon: "🎨", note: "GUI moderne" },
  { name: "OpenPyXL", icon: "📊", note: "Excel automation" },
  { name: "Pygame", icon: "🎮", note: "Game dev" },
  { name: "Socket", icon: "📡", note: "Réseau P2P" },
];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [filterCat, setFilterCat] = useState("Tous");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef({});

  useEffect(() => {
    // Initialise EmailJS une seule fois au montage
    emailjs.init(EMAILJS_PUBLIC_KEY as string);
  }, []);

  useEffect(() => {
    setLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouse = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set([...prev, entry.target.dataset.id]));
          }
        });
      },
      { threshold: 0.15 }
    );
    Object.values(cardRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const cats = ["Tous", ...new Set(PROJECTS.map((p) => p.category))];
  const filtered = filterCat === "Tous" ? PROJECTS : PROJECTS.filter((p) => p.category === filterCat);

  // ============================================================
  // ✅ ENVOI RÉEL AVEC EMAILJS
  // ============================================================
  const handleSubmit = async () => {
    setFormError("");

    // Validation
    if (!formData.name.trim()) {
      setFormError("Veuillez entrer votre nom.");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Veuillez entrer une adresse email valide.");
      return;
    }
    if (!formData.message.trim()) {
      setFormError("Veuillez entrer un message.");
      return;
    }

    setSending(true);

    try {
      await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_email: "tchoukakamgadavykarim@gmail.com",
      },
      EMAILJS_PUBLIC_KEY // La clé est ici !
      );

      setSent(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 6000);
    } catch (error) {
      console.error("EmailJS error:", error);
      setFormError("❌ Une erreur s'est produite. Vérifiez votre connexion et réessayez.");
    } finally {
      setSending(false);
    }
  };

  const scrollProgress = Math.min(
    100,
    (scrollY / ((typeof document !== "undefined" ? document.body?.scrollHeight : 1) - (typeof window !== "undefined" ? window.innerHeight : 0) || 1)) * 100
  );

  return (
    <div style={{ fontFamily: "'Syne', 'Space Mono', monospace", background: "#080a0f", color: "#e8eaed", minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080a0f; }
        ::-webkit-scrollbar-thumb { background: #00E5FF; border-radius: 2px; }
        a { color: inherit; text-decoration: none; }
        button { cursor: pointer; border: none; background: none; font-family: inherit; }
        input, textarea { font-family: inherit; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes slideUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      {/* Custom cursor */}
      <div style={{ position: "fixed", left: cursorPos.x, top: cursorPos.y, width: 20, height: 20, border: "2px solid #00E5FF", borderRadius: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 9999, mixBlendMode: "difference" }} />

      {/* Scroll progress */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 3, width: `${scrollProgress}%`, background: "linear-gradient(90deg, #00E5FF, #39FF14, #FF2D78)", zIndex: 1000, transition: "width 0.1s" }} />

      {/* Scanline */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.015) 2px, rgba(0,229,255,0.015) 4px)" }} />

      {/* Grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      {/* Glows */}
      <div style={{ position: "fixed", top: "20%", left: "10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "20%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(57,255,20,0.05) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, background: scrollY > 50 ? "rgba(8,10,15,0.92)" : "transparent", backdropFilter: scrollY > 50 ? "blur(20px)" : "none", borderBottom: scrollY > 50 ? "1px solid rgba(0,229,255,0.15)" : "none", transition: "all 0.4s", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, letterSpacing: 2 }}>
          <span style={{ color: "#00E5FF" }}>{"<"}</span><span style={{ color: "#e8eaed" }}>DAVY</span><span style={{ color: "#39FF14" }}>_KARIM</span><span style={{ color: "#00E5FF" }}>{"/>"}</span>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 2, color: "#8892a4", textTransform: "uppercase", padding: "4px 0", borderBottom: "2px solid transparent", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#00E5FF"; e.currentTarget.style.borderBottomColor = "#00E5FF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#8892a4"; e.currentTarget.style.borderBottomColor = "transparent"; }}
            >{l.name}</button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" style={{ minHeight: "100vh", padding: "120px 60px 80px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)", transition: "all 1s ease", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "60px" }}>
          <div style={{ flex: "1 1 500px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32, padding: "8px 20px", border: "1px solid rgba(57,255,20,0.3)", background: "rgba(57,255,20,0.05)", borderRadius: 2 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#39FF14", animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#39FF14", letterSpacing: 2 }}>DISPONIBLE POUR MISSIONS</span>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(56px, 8vw, 100px)", lineHeight: 0.9, letterSpacing: -2, color: "#e8eaed" }}>TCHOUKA KAMGA</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(56px, 8vw, 100px)", lineHeight: 0.9, letterSpacing: -2, background: "linear-gradient(90deg, #00E5FF, #39FF14)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DAVY KARIM</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(56px, 8vw, 100px)", lineHeight: 0.9, letterSpacing: -2, color: "rgba(232,234,237,0.15)", WebkitTextStroke: "1px rgba(0,229,255,0.4)" }}>DÉVELOPPEUR</div>
            </div>
            <p style={{ maxWidth: 600, fontSize: 18, lineHeight: 1.7, color: "#8892a4", marginBottom: 48, fontFamily: "'Syne', sans-serif" }}>
              Passionné par Python sous toutes ses formes — des applications desktop avec Kivy & CustomTkinter, aux APIs modernes avec FastAPI & Django, en passant par l'automatisation et le game dev.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button onClick={() => scrollTo("projects")} style={{ padding: "16px 36px", background: "#00E5FF", color: "#080a0f", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))", transition: "all 0.3s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#39FF14")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#00E5FF")}
              >Voir mes projets →</button>
              <button onClick={() => scrollTo("contact")} style={{ padding: "16px 36px", background: "transparent", color: "#00E5FF", fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 13, letterSpacing: 2, textTransform: "uppercase", border: "1px solid #00E5FF", clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))", transition: "all 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,229,255,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >Me contacter</button>
            </div>
          </div>

          <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ position: "relative", width: "clamp(280px, 25vw, 400px)", height: "clamp(280px, 25vw, 400px)", borderRadius: "12px", border: "1px solid rgba(0,229,255,0.3)", background: "rgba(0,229,255,0.02)", padding: "16px", transform: "rotate(3deg)", transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", cursor: "pointer" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(0deg) scale(1.02) translateY(-10px)"; e.currentTarget.style.borderColor = "#00E5FF"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,229,255,0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "rotate(3deg) scale(1) translateY(0)"; e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: "100%", height: "100%", borderRadius: "8px", overflow: "hidden", position: "relative", background: "#0d1117" }}>
                <img src="/profile.jpg" alt="Tchouka Kamga Davy Karim" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(110%) saturate(90%)", transition: "all 0.4s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.filter = "contrast(100%) saturate(100%)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.filter = "contrast(110%) saturate(90%)"; }}
                />
                <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.05) 2px, rgba(0,229,255,0.05) 4px)", pointerEvents: "none" }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80, display: "flex", gap: 16, flexWrap: "wrap", opacity: loaded ? 1 : 0, transition: "opacity 1.5s ease 0.5s" }}>
          {STACK_HIGHLIGHTS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2, animation: `float ${3 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#e8eaed", fontWeight: 700 }}>{s.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#4a5568" }}>{s.note}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 2s ease-in-out infinite" }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#4a5568", letterSpacing: 3 }}>SCROLL</div>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, #00E5FF, transparent)" }} />
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "120px 60px", position: "relative", zIndex: 2 }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#00E5FF", letterSpacing: 4, marginBottom: 16 }}>// 01. RÉALISATIONS</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1, letterSpacing: -2, marginBottom: 32 }}>
            MES <span style={{ WebkitTextStroke: "2px #00E5FF", color: "transparent" }}>PROJETS</span>
          </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {cats.map((c) => (
              <button key={c} onClick={() => setFilterCat(c)} style={{ padding: "8px 20px", fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", border: filterCat === c ? "1px solid #00E5FF" : "1px solid rgba(255,255,255,0.1)", background: filterCat === c ? "rgba(0,229,255,0.1)" : "transparent", color: filterCat === c ? "#00E5FF" : "#8892a4", transition: "all 0.3s", borderRadius: 2 }}>{c}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 24 }}>
          {filtered.map((p, i) => (
            <div key={p.id} data-id={`proj-${p.id}`} ref={(el) => (cardRefs.current[`proj-${p.id}`] = el)} onClick={() => setSelectedProject(p)}
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden", cursor: "pointer", transition: "all 0.4s", opacity: visibleCards.has(`proj-${p.id}`) ? 1 : 0, transform: visibleCards.has(`proj-${p.id}`) ? "translateY(0)" : "translateY(40px)", transitionDelay: `${i * 80}ms` }}
              onMouseEnter={(e) => { e.currentTarget.style.border = `1px solid ${p.color}40`; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 60px ${p.color}15`; }}
              onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ padding: 32, background: p.bg, display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 120, position: "relative", overflow: "hidden" }}>
                <div style={{ fontSize: 56 }}>{p.emoji}</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: p.color, marginBottom: 4 }}>{p.year}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>{p.category}</div>
                </div>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 80% 50%, ${p.color}15, transparent 60%)` }} />
              </div>
              <div style={{ padding: "24px 28px 28px" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 24, marginBottom: 12, color: "#e8eaed" }}>{p.title}<span style={{ color: p.color }}> _</span></div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, lineHeight: 1.6, color: "#8892a4", marginBottom: 20 }}>{p.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {p.tags.map((t, ti) => (<span key={ti} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 1, padding: "4px 12px", border: `1px solid ${p.color}30`, color: p.color, borderRadius: 2 }}>{t}</span>))}
                </div>
                <div style={{ marginTop: 20, fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#4a5568", letterSpacing: 2 }}>VOIR DÉTAILS →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ padding: "120px 60px", background: "rgba(0,229,255,0.02)", borderTop: "1px solid rgba(0,229,255,0.08)", borderBottom: "1px solid rgba(0,229,255,0.08)", position: "relative", zIndex: 2 }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#39FF14", letterSpacing: 4, marginBottom: 16 }}>// 02. STACK TECHNIQUE</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1, letterSpacing: -2 }}>
            COMPÉTENCES <span style={{ WebkitTextStroke: "2px #39FF14", color: "transparent" }}>TECH</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {SKILLS.map((s, i) => (
            <div key={i} data-id={`skill-${i}`} ref={(el) => (cardRefs.current[`skill-${i}`] = el)}
              style={{ padding: 28, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, transition: "all 0.4s", opacity: visibleCards.has(`skill-${i}`) ? 1 : 0, transform: visibleCards.has(`skill-${i}`) ? "translateY(0)" : "translateY(30px)", transitionDelay: `${i * 100}ms` }}
              onMouseEnter={(e) => { e.currentTarget.style.border = `1px solid ${s.color}40`; e.currentTarget.style.background = `${s.color}05`; }}
              onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 1, color: s.color }}>{s.cat}</span>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#4a5568" }}>{s.level}%</span>
              </div>
              <div style={{ height: 2, background: "rgba(255,255,255,0.07)", marginBottom: 20, borderRadius: 1, overflow: "hidden" }}>
                <div style={{ height: "100%", width: visibleCards.has(`skill-${i}`) ? `${s.level}%` : "0%", background: `linear-gradient(90deg, ${s.color}, ${s.color}80)`, transition: "width 1.2s ease", transitionDelay: `${i * 100 + 300}ms` }} />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {s.items.map((item, j) => (<span key={j} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, padding: "4px 10px", background: `${s.color}10`, border: `1px solid ${s.color}25`, color: "#e8eaed", borderRadius: 2 }}>{item}</span>))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "120px 60px", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#FF2D78", letterSpacing: 4, marginBottom: 16 }}>// 03. À PROPOS</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1, letterSpacing: -2, marginBottom: 32 }}>
              QUI <span style={{ WebkitTextStroke: "2px #FF2D78", color: "transparent" }}>SUIS-JE</span> ?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "🐍", text: "Développeur Python passionné, je construis des outils concrets qui résolvent de vrais problèmes — de l'automatisation bureautique aux applications réseau P2P." },
                { icon: "🎮", text: "Je code aussi par plaisir : jeux Pygame, calculateurs Kivy, scripts d'analyse de données. Chaque projet est une occasion d'apprendre." },
                { icon: "⚡", text: "Maîtrise de Django et FastAPI pour le backend, OpenPyXL pour l'automatisation Excel, Kivy pour les apps cross-platform et React/Next.js pour le web." },
                { icon: "📍", text: "Basé à Douala, Cameroun. Disponible pour des projets freelance et des collaborations à distance." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, transition: "all 0.3s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,45,120,0.4)"; e.currentTarget.style.background = "rgba(255,45,120,0.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                >
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, lineHeight: 1.6, color: "#8892a4" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ background: "#0d1117", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 8, overflow: "hidden", fontFamily: "'Space Mono', monospace" }}>
              <div style={{ padding: "12px 20px", background: "#161b22", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
                <span style={{ marginLeft: 12, fontSize: 12, color: "#4a5568" }}>davy_karim.py</span>
              </div>
              <div style={{ padding: 28, fontSize: 13, lineHeight: 2 }}>
                <div style={{ color: "#8892a4" }}><span style={{ color: "#00E5FF" }}>class</span> <span style={{ color: "#39FF14" }}>Developer</span>:</div>
                <div style={{ paddingLeft: 20 }}>
                  <div style={{ color: "#8892a4" }}><span style={{ color: "#00E5FF" }}>def</span> <span style={{ color: "#FFD700" }}>__init__</span>(self):</div>
                  <div style={{ paddingLeft: 20 }}>
                    <div style={{ color: "#8892a4" }}>self.<span style={{ color: "#FF6B35" }}>name</span> = <span style={{ color: "#39FF14" }}>"Tchouka Kamga Davy Karim"</span></div>
                    <div style={{ color: "#8892a4" }}>self.<span style={{ color: "#FF6B35" }}>location</span> = <span style={{ color: "#39FF14" }}>"Douala, Cameroun"</span></div>
                    <div style={{ color: "#8892a4" }}>self.<span style={{ color: "#FF6B35" }}>github</span> = <span style={{ color: "#39FF14" }}>"github.com/KAMGAx86"</span></div>
                    <div style={{ color: "#8892a4" }}>self.<span style={{ color: "#FF6B35" }}>languages</span> = [<span style={{ color: "#39FF14" }}>"Python", "JavaScript"</span>]</div>
                    <div style={{ color: "#8892a4" }}>self.<span style={{ color: "#FF6B35" }}>frameworks</span> = [</div>
                    <div style={{ paddingLeft: 20, color: "#39FF14" }}>"Django", "FastAPI", "Kivy",</div>
                    <div style={{ paddingLeft: 20, color: "#39FF14" }}>"CustomTkinter", "Next.js"</div>
                    <div style={{ color: "#8892a4" }}>]</div>
                    <div style={{ color: "#8892a4" }}>self.<span style={{ color: "#FF6B35" }}>passion</span> = <span style={{ color: "#39FF14" }}>"Build real tools 🛠️"</span></div>
                    <div style={{ color: "#8892a4" }}>self.<span style={{ color: "#FF6B35" }}>available</span> = <span style={{ color: "#00E5FF" }}>True</span></div>
                  </div>
                </div>
                <div style={{ color: "#8892a4", marginTop: 8 }}>
                  <span style={{ color: "#4a5568" }}># Prêt à coder !</span>
                  <span style={{ display: "inline-block", width: 2, height: 16, background: "#00E5FF", marginLeft: 4, verticalAlign: "middle", animation: "blink 1s step-end infinite" }} />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
              {[
                { n: "6+", l: "Projets réalisés", c: "#00E5FF" },
                { n: "8+", l: "Technologies maîtrisées", c: "#39FF14" },
                { n: "3+", l: "Frameworks Python", c: "#FF6B35" },
                { n: "2+", l: "Années d'expérience", c: "#FF2D78" },
              ].map((s, i) => (
                <div key={i} style={{ padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: s.c, lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#4a5568", letterSpacing: 1 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "120px 60px", background: "rgba(0,229,255,0.02)", borderTop: "1px solid rgba(0,229,255,0.08)", position: "relative", zIndex: 2 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#FFD700", letterSpacing: 4, marginBottom: 16 }}>// 04. CONTACT</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 1, letterSpacing: -2, marginBottom: 24 }}>
              ON <span style={{ WebkitTextStroke: "2px #FFD700", color: "transparent" }}>COLLABORE</span> ?
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, lineHeight: 1.7, color: "#8892a4", marginBottom: 48, maxWidth: 400 }}>
              Un projet d'automatisation, une application desktop, une API REST ou simplement échanger sur Python ? N'hésitez pas à me contacter !
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { icon: "📧", label: "Email", value: "tchoukakamgadavykarim@gmail.com", color: "#00E5FF", href: "mailto:tchoukakamgadavykarim@gmail.com" },
                { icon: "⌨️", label: "GitHub", value: "github.com/KAMGAx86", color: "#39FF14", href: "https://github.com/KAMGAx86" },
                { icon: "💼", label: "LinkedIn", value: "Tchouka Kamga Davy Karim", color: "#FF2D78", href: "https://www.linkedin.com/in/tchouka-kamga-davy-karim-a32678366/" },
                { icon: "📍", label: "Localisation", value: "Douala, Cameroun 🇨🇲", color: "#FFD700", href: null },
              ].map((c, i) => (
                <div key={i}
                  onClick={() => c.href && window.open(c.href, c.href.startsWith("mailto") ? "_self" : "_blank")}
                  style={{ display: "flex", alignItems: "center", gap: 20, padding: 20, background: "rgba(255,255,255,0.02)", border: `1px solid ${c.color}20`, borderRadius: 4, transition: "all 0.3s", cursor: c.href ? "pointer" : "default" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = `${c.color}08`; if (c.href) e.currentTarget.style.borderColor = `${c.color}50`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = `${c.color}20`; }}
                >
                  <span style={{ fontSize: 28, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", background: `${c.color}15`, borderRadius: 4, flexShrink: 0 }}>{c.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#4a5568", marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, color: c.color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.value}</div>
                  </div>
                  {c.href && <span style={{ color: "#4a5568", fontSize: 14, flexShrink: 0 }}>↗</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ✅ FORMULAIRE EMAILJS FONCTIONNEL */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { key: "name", label: "VOTRE NOM", type: "text", placeholder: "ex: Jean Dupont" },
                { key: "email", label: "VOTRE EMAIL", type: "email", placeholder: "ex: jean@example.com" },
              ].map((field) => (
                <div key={field.key}>
                  <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#00E5FF", display: "block", marginBottom: 10 }}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key]}
                    onChange={(e) => { setFormData({ ...formData, [field.key]: e.target.value }); setFormError(""); }}
                    style={{ width: "100%", padding: "16px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8eaed", fontSize: 15, outline: "none", borderRadius: 2, transition: "border-color 0.3s" }}
                    onFocus={(e) => (e.target.style.borderColor = "#00E5FF")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#00E5FF", display: "block", marginBottom: 10 }}>MESSAGE</label>
                <textarea
                  placeholder="Parlez-moi de votre projet..."
                  value={formData.message}
                  onChange={(e) => { setFormData({ ...formData, message: e.target.value }); setFormError(""); }}
                  rows={5}
                  style={{ width: "100%", padding: "16px 20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#e8eaed", fontSize: 15, outline: "none", resize: "none", borderRadius: 2, transition: "border-color 0.3s" }}
                  onFocus={(e) => (e.target.style.borderColor = "#00E5FF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>

              {/* Message d'erreur */}
              {formError && (
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#FF2D78", padding: "12px 16px", border: "1px solid rgba(255,45,120,0.3)", background: "rgba(255,45,120,0.05)", borderRadius: 2, lineHeight: 1.6 }}>
                  {formError}
                </div>
              )}

              {/* Message de succès */}
              {sent && (
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#39FF14", padding: "12px 16px", border: "1px solid rgba(57,255,20,0.3)", background: "rgba(57,255,20,0.05)", borderRadius: 2, lineHeight: 1.6 }}>
                  ✓ Message envoyé avec succès ! à <span style={{ color: "#e8eaed" }}>tchoukakamgadavykarim@gmail.com</span>
                </div>
              )}

              {/* Bouton envoi */}
              <button
                onClick={handleSubmit}
                disabled={sending || sent}
                style={{
                  padding: "18px 32px",
                  background: sent ? "#39FF14" : sending ? "rgba(0,229,255,0.5)" : "#00E5FF",
                  color: "#080a0f",
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  border: "none",
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                  cursor: sending || sent ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  transition: "all 0.3s",
                }}
              >
                {sending ? (
                  <>
                    <div style={{ width: 16, height: 16, border: "2px solid #080a0f", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Envoi en cours...
                  </>
                ) : sent ? (
                  "✓ MESSAGE ENVOYÉ !"
                ) : (
                  "ENVOYER LE MESSAGE →"
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 60px", borderTop: "1px solid rgba(0,229,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2, flexWrap: "wrap", gap: 20 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 16 }}>
          <span style={{ color: "#00E5FF" }}>{"<"}</span><span style={{ color: "#e8eaed" }}>DAVY</span><span style={{ color: "#39FF14" }}>_KARIM</span><span style={{ color: "#00E5FF" }}>{"/>"}</span>
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#4a5568", letterSpacing: 1 }}>
          © 2026 Tchouka Kamga Davy Karim — Douala, Cameroun 🇨🇲
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {SOCIAL_LINKS.map((s) => (
            <a key={s.name} href={s.url} target={s.url.startsWith("mailto") ? "_self" : "_blank"} rel="noopener noreferrer"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#4a5568", padding: "8px 16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2, transition: "all 0.3s", display: "inline-block", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#00E5FF"; e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#4a5568"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >{s.name}</a>
          ))}
        </div>
      </footer>

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div onClick={() => setSelectedProject(null)} style={{ position: "fixed", inset: 0, background: "rgba(8,10,15,0.95)", backdropFilter: "blur(20px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, animation: "fadeIn 0.3s ease" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#0d1117", border: `1px solid ${selectedProject.color}40`, borderRadius: 8, maxWidth: 700, width: "100%", maxHeight: "85vh", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
            <div style={{ padding: 40, background: selectedProject.bg, display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
              <div>
                <div style={{ fontSize: 56, marginBottom: 12 }}>{selectedProject.emoji}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 36, color: selectedProject.color }}>{selectedProject.title}</h3>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: 2, marginTop: 8 }}>{selectedProject.category} • {selectedProject.year}</div>
              </div>
              <button onClick={() => setSelectedProject(null)} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)", color: "#e8eaed", fontSize: 20, borderRadius: 4, flexShrink: 0, transition: "all 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = selectedProject.color; e.currentTarget.style.color = "#080a0f"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#e8eaed"; }}
              >✕</button>
            </div>
            <div style={{ padding: "36px 40px" }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, lineHeight: 1.7, color: "#8892a4", marginBottom: 32 }}>{selectedProject.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
                <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: selectedProject.color, letterSpacing: 3, marginBottom: 12 }}>🎯 PROBLÉMATIQUE</div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, lineHeight: 1.6, color: "#8892a4" }}>{selectedProject.problem}</p>
                </div>
                <div style={{ padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4 }}>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: selectedProject.color, letterSpacing: 3, marginBottom: 12 }}>💡 SOLUTION</div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, lineHeight: 1.6, color: "#8892a4" }}>{selectedProject.solution}</p>
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: selectedProject.color, letterSpacing: 3, marginBottom: 16 }}>✨ FONCTIONNALITÉS</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {selectedProject.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#8892a4" }}>
                      <span style={{ color: selectedProject.color, fontWeight: 700 }}>›</span>{f}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: selectedProject.color, letterSpacing: 3, marginBottom: 16 }}>🛠️ TECHNOLOGIES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {selectedProject.tags.map((t, i) => (
                    <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, padding: "6px 16px", border: `1px solid ${selectedProject.color}40`, color: selectedProject.color, background: `${selectedProject.color}0a`, borderRadius: 2 }}>{t}</span>
                  ))}
                </div>
              </div>
              <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 24px", background: "transparent", color: selectedProject.color, fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", border: `1px solid ${selectedProject.color}60`, borderRadius: 2, transition: "all 0.3s", textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${selectedProject.color}15`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >⌨️ VOIR SUR GITHUB →</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
