'use client'

import { useState, useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Project {
  id: number
  title: string
  category: string
  year: string
  emoji: string
  color: string
  description: string
  tags: string[]
  features: string[]
  problem: string
  solution: string
  github: string
  videoUrl?: string
  videoDescription?: string
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:       '#F7F6F2',   // warm off-white
  surface:  '#FFFFFF',
  surface2: '#F0EFF9',   // light violet tint for hover
  border:   '#E8E6E0',
  t1:       '#1A1815',   // primary text
  t2:       '#6B6560',   // secondary
  t3:       '#A09890',   // muted
  black:    '#18181B',   // CTA / buttons
  violet:   '#7C3AED',   // accent
  green:    '#16A34A',   // available / success
  red:      '#DC2626',   // error
}

// ─── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_PROJECTS: Project[] = [
  { id: 1, title: 'DataShare', category: 'Application Desktop', year: '2026', emoji: '📡', color: '#2563EB', description: "Application de partage de fichiers sécurisé en réseau local avec découverte automatique via Zeroconf et vérification d'intégrité SHA-256.", tags: ['Python', 'Tkinter', 'Zeroconf', 'Socket', 'Threading', 'SHA-256'], features: ['Découverte automatique Zeroconf', 'Authentification sécurisée par nonce', 'Vérification SHA-256', 'Interface CustomTkinter', 'Transfert temps réel avec progression'], problem: 'Transférer des fichiers volumineux entre PC sans internet ni clé USB', solution: 'Architecture client-serveur avec découverte réseau automatique et chiffrement', github: 'https://github.com/KAMGAx86', videoUrl: '', videoDescription: '' },
  { id: 2, title: 'Inventry', category: 'Automatisation', year: '2024', emoji: '🖼️', color: '#059669', description: "Outil d'extraction automatique d'images depuis des fichiers Excel avec interface graphique Tkinter, nommage intelligent et logs détaillés.", tags: ['Python', 'OpenPyXL', 'Tkinter', 'PIL', 'openpyxl-image-loader'], features: ['Extraction automatique par lots', 'Nommage intelligent des fichiers', 'Interface graphique intuitive', 'Barre de progression temps réel', 'Gestion des erreurs robuste'], problem: "Extraire manuellement des centaines d'images dans des catalogues Excel est fastidieux", solution: 'Automation complète avec détection et extraction intelligente via OpenPyXL', github: 'https://github.com/KAMGAx86', videoUrl: '', videoDescription: '' },
  { id: 3, title: 'IMC Calculator', category: 'Application Desktop', year: '2024', emoji: '⚖️', color: '#EA580C', description: "Application de calcul de l'IMC avec interface graphique moderne développée avec Kivy et KivyMD.", tags: ['Python', 'Kivy', 'KivyMD', 'Cross-platform'], features: ['Interface Material Design', 'Calcul IMC instantané', 'Affichage catégorie santé', 'Design responsive Kivy', 'Compatible multi-plateforme'], problem: "Besoin d'un outil simple et visuel pour calculer et interpréter son IMC", solution: 'App desktop cross-platform avec Kivy, rendu natif et UI soignée', github: 'https://github.com/KAMGAx86', videoUrl: '', videoDescription: '' },
  { id: 4, title: 'Pong Game', category: 'Jeu Python', year: '2024', emoji: '🏓', color: '#E11D48', description: 'Recréation du jeu culte Pong en Python avec gestion des collisions, score, vitesse évolutive et mode 2 joueurs.', tags: ['Python', 'Pygame', 'Game Dev', '2D'], features: ['Mode 2 joueurs local', 'Physique des collisions', 'Vitesse évolutive', 'Système de score', 'Interface rétro pixel'], problem: 'Comprendre la logique des jeux 2D : boucle de jeu, collisions, rendu', solution: 'Implémentation complète avec Pygame, gestion des événements et physique simple', github: 'https://github.com/KAMGAx86', videoUrl: '', videoDescription: '' },
  { id: 5, title: 'Trouve le Pays Caché', category: 'Jeu Python', year: '2025', emoji: '🌍', color: '#D97706', description: "Jeu de devinette géographique : l'utilisateur trouve un pays caché à partir d'indices progressifs.", tags: ['Python', 'Tkinter', 'JSON', 'Logique de jeu'], features: ['Indices progressifs par pays', 'Base de données de pays', 'Système de score', 'Interface Tkinter', 'Plusieurs niveaux de difficulté'], problem: "Rendre l'apprentissage de la géographie fun et interactif", solution: 'Jeu de devinette basé sur des indices avec logique de progression dynamique', github: 'https://github.com/KAMGAx86', videoUrl: '', videoDescription: '' },
  { id: 6, title: 'Excel Analytics', category: 'Data Analysis', year: '2024', emoji: '📊', color: '#7C3AED', description: 'Script de consolidation et analyse de ventes trimestrielles avec génération automatique de graphiques BarChart.', tags: ['Python', 'OpenPyXL', 'Data Analysis', 'Excel', 'Charts'], features: ['Agrégation multi-fichiers', 'Génération de graphiques', 'Consolidation trimestrielle', 'Export Excel formaté', 'Visualisations professionnelles'], problem: 'Consolider manuellement les données de ventes mensuelles prend trop de temps', solution: 'Script automatisé qui agrège, analyse et visualise les données en un clic', github: 'https://github.com/KAMGAx86', videoUrl: '', videoDescription: '' },
]

const SKILLS = [
  { cat: 'Desktop & GUI', icon: '🖥️', color: '#2563EB', items: ['Python', 'Tkinter', 'CustomTkinter', 'Kivy', 'KivyMD', 'PyQt'], level: 92 },
  { cat: 'Backend & API', icon: '⚙️', color: '#059669', items: ['Django', 'FastAPI', 'REST API', 'JWT Auth', 'SQLite', 'PostgreSQL'], level: 85 },
  { cat: 'Automatisation', icon: '🤖', color: '#EA580C', items: ['OpenPyXL', 'Pandas', 'Selenium', 'PIL', 'Threading', 'Subprocess'], level: 90 },
  { cat: 'Réseau & Sys', icon: '📡', color: '#E11D48', items: ['Socket', 'Zeroconf', 'TCP/IP', 'P2P', 'SHA-256', 'Threading'], level: 82 },
  { cat: 'Game Dev', icon: '🎮', color: '#D97706', items: ['Pygame', 'Kivy', 'Logique 2D', 'Collision', 'Game Loop'], level: 75 },
  { cat: 'Web', icon: '🌐', color: '#7C3AED', items: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'HTML/CSS'], level: 78 },
]

const NAV_LINKS = [
  { name: 'Projets', id: 'projects' },
  { name: 'Compétences', id: 'skills' },
  { name: 'À propos', id: 'about' },
  { name: 'Contact', id: 'contact' },
]

// ─── Helper: YouTube embed ────────────────────────────────────────────────────
function getYtEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (m) return `https://www.youtube.com/embed/${m[1]}?autoplay=0&rel=0`
  if (url.includes('youtube.com/embed/')) return url
  return null
}

// ─── Component: Project Thumbnail ─────────────────────────────────────────────
function ProjectThumbnail({ p, size = 'lg' }: { p: Project; size?: 'sm' | 'lg' }) {
  const fs = size === 'sm' ? 28 : 56
  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: `linear-gradient(145deg, ${p.color}18 0%, ${p.color}06 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Subtle grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${p.color}14 1px, transparent 1px)`, backgroundSize: '24px 24px', opacity: 0.5 }} />
      <span style={{ fontSize: fs, zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>{p.emoji}</span>
      {/* Bottom bar — YouTube thumbnail style */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: size === 'sm' ? '20px 10px 8px' : '40px 16px 12px', background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)' }}>
        <div style={{ color: '#fff', fontSize: size === 'sm' ? 10 : 13, fontWeight: 700, lineHeight: 1.2 }}>{p.title}</div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: size === 'sm' ? 9 : 11, marginTop: 2 }}>{p.category}</div>
      </div>
      {/* "No video" badge */}
      {!p.videoUrl && size === 'lg' && (
        <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, color: C.t2 }}>
          Aperçu
        </div>
      )}
      {p.videoUrl && size === 'lg' && (
        <div style={{ position: 'absolute', top: 12, right: 12, background: C.black, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>▶</span> Démo
        </div>
      )}
    </div>
  )
}

// ─── Component: Video Player ───────────────────────────────────────────────────
function VideoPlayer({ url }: { url: string }) {
  const yt = getYtEmbed(url)
  if (yt) return <iframe src={yt} style={{ width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
  if (/\.(mp4|webm|ogg)$/i.test(url)) return <video src={url} controls style={{ width: '100%', height: '100%', background: '#000' }} />
  return <ProjectThumbnail p={{ id: 0, title: '', category: '', year: '', emoji: '🎬', color: '#7C3AED', description: '', tags: [], features: [], problem: '', solution: '', github: '' }} />
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS)
  const [featured, setFeatured] = useState<Project>(DEFAULT_PROJECTS[0])
  const [filterCat, setFilterCat] = useState('Tous')
  const [scrollY, setScrollY] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [formError, setFormError] = useState('')
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set())
  const refs = useRef<Record<string, Element | null>>({})

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then((d: Project[]) => {
      if (Array.isArray(d) && d.length) { setProjects(d); setFeatured(d[0]) }
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    setLoaded(true)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) setMenuOpen(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = (e.target as HTMLElement).dataset.id
          if (id) setVisibleIds(prev => new Set([...prev, id]))
        }
      })
    }, { threshold: 0.08 })
    Object.values(refs.current).forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [projects])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const cats = ['Tous', ...Array.from(new Set(projects.map(p => p.category)))]
  const filtered = filterCat === 'Tous' ? projects : projects.filter(p => p.category === filterCat)

  const handleFilterChange = (cat: string) => {
    setFilterCat(cat)
    const list = cat === 'Tous' ? projects : projects.filter(p => p.category === cat)
    if (list.length) setFeatured(list[0])
  }

  const handleContact = async () => {
    if (!form.name.trim()) { setFormError('Veuillez entrer votre nom.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setFormError('Email invalide.'); return }
    if (!form.message.trim()) { setFormError('Veuillez entrer un message.'); return }
    setFormState('sending'); setFormError('')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (res.ok) { setFormState('sent'); setForm({ name: '', email: '', message: '' }); setTimeout(() => setFormState('idle'), 7000) }
      else { setFormState('error'); setFormError(data.error || "Erreur lors de l'envoi.") }
    } catch { setFormState('error'); setFormError('Erreur réseau. Réessayez.') }
  }

  const scrollPct = Math.min(100, (scrollY / Math.max(1, (typeof document !== 'undefined' ? document.body.scrollHeight : 1) - (typeof window !== 'undefined' ? window.innerHeight : 1))) * 100)

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", background: C.bg, color: C.t1, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:#D4CFC5;border-radius:3px}
        ::-webkit-scrollbar-thumb:hover{background:#A09890}
        a{color:inherit;text-decoration:none}
        button{cursor:pointer;border:none;background:none;font-family:inherit}
        input,textarea{font-family:inherit}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        .nav-desk{display:flex}
        .nav-ham{display:none}
        @media(max-width:768px){.nav-desk{display:none!important}.nav-ham{display:flex!important}}
        .hero-grid{display:grid;grid-template-columns:1fr auto;gap:48px;align-items:center}
        @media(max-width:900px){.hero-grid{grid-template-columns:1fr!important;gap:40px}}
        .yt-layout{display:grid;grid-template-columns:1fr 340px;gap:28px}
        @media(max-width:1024px){.yt-layout{grid-template-columns:1fr 280px!important}}
        @media(max-width:768px){.yt-layout{grid-template-columns:1fr!important}}
        .yt-sidebar{max-height:560px;overflow-y:auto;scrollbar-width:thin}
        .yt-sidebar::-webkit-scrollbar{width:3px}
        .yt-sidebar::-webkit-scrollbar-thumb{background:#D4CFC5;border-radius:2px}
        @media(max-width:768px){.yt-sidebar{max-height:none!important}}
        .skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
        @media(max-width:600px){.skills-grid{grid-template-columns:1fr!important}}
        .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:start}
        @media(max-width:1024px){.about-grid{grid-template-columns:1fr!important;gap:40px}}
        .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
        @media(max-width:1024px){.contact-grid{grid-template-columns:1fr!important;gap:40px}}
        .footer-row{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
        .section-p{padding:96px 64px}
        @media(max-width:768px){.section-p{padding:64px 20px!important}}
        @media(min-width:769px) and (max-width:1024px){.section-p{padding:80px 40px!important}}
        .hero-p{padding:120px 64px 80px}
        @media(max-width:768px){.hero-p{padding:96px 20px 60px!important}}
        .hide-mob{display:block}
        @media(max-width:640px){.hide-mob{display:none!important}}
      `}</style>

      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, height: 2, width: `${scrollPct}%`, background: C.violet, zIndex: 1001, transition: 'width 0.1s' }} />

      {/* ── NAV ───────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 1000, height: 64,
        background: scrollY > 40 ? 'rgba(247,246,242,0.95)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 40 ? `1px solid ${C.border}` : 'none',
        boxShadow: scrollY > 40 ? '0 1px 16px rgba(26,24,21,0.06)' : 'none',
        transition: 'all 0.3s ease', padding: '0 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={() => scrollTo('hero')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.black, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>DK</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.t1, letterSpacing: -0.3 }}>Davy Karim</span>
        </button>

        <div className="nav-desk" style={{ gap: 6, alignItems: 'center' }}>
          {NAV_LINKS.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)}
              style={{ padding: '7px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500, color: C.t2, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124,58,237,0.07)'; e.currentTarget.style.color = C.violet }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.t2 }}
            >{l.name}</button>
          ))}
          <button onClick={() => scrollTo('contact')} style={{
            marginLeft: 8, padding: '8px 18px', background: C.black, color: '#fff', borderRadius: 8,
            fontSize: 13, fontWeight: 600, transition: 'all 0.2s', border: 'none',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.violet; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.black; e.currentTarget.style.transform = 'translateY(0)' }}
          >Me contacter</button>
        </div>

        <button className="nav-ham" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', flexDirection: 'column', gap: 5, padding: 8, background: 'none', border: 'none' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 20, height: 2, background: C.t1, borderRadius: 1, transition: 'all 0.25s',
              transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(5px,5px)' : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'scaleX(0)') : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999, background: 'rgba(247,246,242,0.98)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}`, padding: '12px 20px 24px', animation: 'fadeIn 0.2s ease' }}>
          {NAV_LINKS.map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '13px 0', fontSize: 16, fontWeight: 500, color: C.t1, borderBottom: `1px solid ${C.border}` }}>{l.name}</button>
          ))}
          <button onClick={() => { scrollTo('contact'); setMenuOpen(false) }} style={{ marginTop: 16, width: '100%', padding: '12px', background: C.black, color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600 }}>Me contacter</button>
        </div>
      )}

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section id="hero" className="hero-p" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <div className="hero-grid" style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(20px)', transition: 'all 0.9s ease' }}>
          <div>
            {/* Available badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 100, marginBottom: 32 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#15803D', letterSpacing: 0.3 }}>Disponible pour missions</span>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontWeight: 800, letterSpacing: -2.5, lineHeight: 0.92, color: C.t1, fontSize: 'clamp(48px, 9vw, 108px)', marginBottom: 0 }}>
                TCHOUKA KAMGA <br />
                <span style={{ color: C.violet }}>DAVY KARIM </span>
              </h1>
            </div>

            {/* Role line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ height: 2, width: 40, background: C.border }} />
              <span style={{ fontSize: 16, fontWeight: 500, color: C.t2, letterSpacing: 0.2 }}>Développeur Python & Applications Desktop</span>
            </div>

            <p style={{ fontSize: 17, lineHeight: 1.75, color: C.t2, maxWidth: 520, marginBottom: 40 }}>
              Je construis des outils Python qui résolvent de vrais problèmes — applications desktop, APIs modernes, automatisation et jeux. Basé à <strong style={{ color: C.t1 }}>Douala, Cameroun</strong>.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
              <button onClick={() => scrollTo('projects')} style={{ padding: '13px 28px', background: C.black, color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 14, transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(24,24,27,0.2)' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.violet; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(124,58,237,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.background = C.black; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(24,24,27,0.2)' }}
              >Voir mes projets →</button>
              <button onClick={() => scrollTo('contact')} style={{ padding: '13px 28px', background: 'transparent', color: C.t1, borderRadius: 10, fontWeight: 600, fontSize: 14, border: `1.5px solid ${C.border}`, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.violet; e.currentTarget.style.color = C.violet; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.t1; e.currentTarget.style.transform = 'translateY(0)' }}
              >Me contacter</button>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'GitHub', url: 'https://github.com/KAMGAx86' },
                { label: 'LinkedIn', url: 'https://www.linkedin.com/in/tchouka-kamga-davy-karim-a32678366/' },
                { label: 'Email', url: 'mailto:tchoukakamgadavykarim@gmail.com' },
              ].map(s => (
                <a key={s.label} href={s.url} target={s.url.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer"
                  style={{ padding: '7px 14px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 500, color: C.t2, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.violet; e.currentTarget.style.color = C.violet }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.t2 }}
                >{s.label}</a>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div className="hide-mob" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              {/* Decorative ring */}
              <div style={{ position: 'absolute', inset: -16, borderRadius: '50%', border: `2px dashed ${C.border}`, animation: 'spin 30s linear infinite' }} />
              <div style={{ width: 'clamp(200px, 20vw, 300px)', height: 'clamp(200px, 20vw, 300px)', borderRadius: '50%', overflow: 'hidden', border: `4px solid ${C.surface}`, boxShadow: `0 0 0 1px ${C.border}, 0 16px 40px rgba(26,24,21,0.12)` }}>
                <img src="/profile.jpg" alt="Tchouka Kamga Davy Karim" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* Python badge */}
              <div style={{ position: 'absolute', bottom: 8, right: -20, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '8px 14px', fontSize: 13, fontWeight: 700, color: C.t1, boxShadow: '0 4px 16px rgba(26,24,21,0.1)', whiteSpace: 'nowrap' }}>
                🐍 Python Dev
              </div>
              <div style={{ position: 'absolute', top: 8, left: -24, background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: 12, padding: '7px 12px', fontSize: 12, fontWeight: 600, color: '#15803D', boxShadow: '0 4px 12px rgba(22,163,74,0.15)', whiteSpace: 'nowrap' }}>
                ● En ligne
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: loaded ? 1 : 0, transition: 'opacity 1.5s ease 1s' }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: C.t3, letterSpacing: 2 }}>SCROLL</span>
          <div style={{ width: 1, height: 40, background: `linear-gradient(${C.border}, transparent)` }} />
        </div>
      </section>

      {/* ── PROJECTS (YouTube style) ───────────────────────────────────────────── */}
      <section id="projects" className="section-p" style={{ background: C.surface }}>
        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.violet, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>01 · Réalisations</div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: -1.5, color: C.t1, lineHeight: 1 }}>Mes projets</h2>
          </div>
          {/* Category filter */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {cats.map(c => (
              <button key={c} onClick={() => handleFilterChange(c)} style={{
                padding: '6px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500, transition: 'all 0.2s',
                background: filterCat === c ? C.black : 'transparent',
                color: filterCat === c ? '#fff' : C.t2,
                border: `1px solid ${filterCat === c ? C.black : C.border}`,
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* YouTube layout */}
        <div className="yt-layout">
          {/* ── Left: Featured player ─── */}
          <div>
            {/* Video/Thumbnail area */}
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', background: C.bg, position: 'relative', boxShadow: '0 8px 32px rgba(26,24,21,0.1)' }}>
              {featured.videoUrl
                ? <VideoPlayer url={featured.videoUrl} />
                : <ProjectThumbnail p={featured} size="lg" />
              }
            </div>

            {/* Project details below player */}
            <div style={{ padding: '20px 0 0' }}>
              {/* Title row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 800, fontSize: 22, color: C.t1, letterSpacing: -0.5, lineHeight: 1.2, marginBottom: 6 }}>
                    {featured.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', background: `${featured.color}12`, color: featured.color, borderRadius: 6, border: `1px solid ${featured.color}25` }}>{featured.category}</span>
                    <span style={{ fontSize: 12, color: C.t3 }}>·</span>
                    <span style={{ fontSize: 12, color: C.t2, fontWeight: 500 }}>{featured.year}</span>
                    {featured.videoUrl && <span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>● Vidéo disponible</span>}
                  </div>
                </div>
                <a href={featured.github} target="_blank" rel="noopener noreferrer"
                  style={{ flexShrink: 0, padding: '9px 18px', background: C.black, color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 7 }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.violet; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.black; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <span>⌨</span> GitHub
                </a>
              </div>

              {/* Description */}
              <p style={{ fontSize: 14, lineHeight: 1.75, color: C.t2, marginBottom: 16, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                {featured.description}
              </p>

              {/* Video description */}
              {featured.videoDescription && (
                <div style={{ padding: '12px 16px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#4F46E5', letterSpacing: 1, marginBottom: 6 }}>📝 À PROPOS DE CETTE DÉMO</div>
                  <p style={{ fontSize: 13, color: '#3730A3', lineHeight: 1.6 }}>{featured.videoDescription}</p>
                </div>
              )}

              {/* Problem / Solution */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { label: '🎯 Problème', text: featured.problem },
                  { label: '💡 Solution', text: featured.solution },
                ].map(item => (
                  <div key={item.label} style={{ padding: '14px 16px', background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: featured.color, letterSpacing: 1, marginBottom: 6 }}>{item.label}</div>
                    <p style={{ fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10 }}>Fonctionnalités</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {featured.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.t2 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: featured.color, flexShrink: 0 }} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {featured.tags.map((t, i) => (
                  <span key={i} style={{ fontSize: 12, fontWeight: 500, padding: '4px 10px', background: C.bg, border: `1px solid ${C.border}`, color: C.t2, borderRadius: 6 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Playlist sidebar ─── */}
          <div className="yt-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.t3, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12, padding: '0 4px' }}>
              {filtered.length} projet{filtered.length > 1 ? 's' : ''} · {filterCat}
            </div>
            {filtered.map((p, idx) => {
              const isActive = p.id === featured.id
              return (
                <div key={p.id}
                  data-id={`p-${p.id}`}
                  ref={el => { refs.current[`p-${p.id}`] = el }}
                  onClick={() => setFeatured(p)}
                  style={{
                    display: 'flex', gap: 12, padding: '10px', borderRadius: 12, cursor: 'pointer',
                    background: isActive ? `${p.color}10` : 'transparent',
                    border: isActive ? `1.5px solid ${p.color}30` : '1.5px solid transparent',
                    transition: 'all 0.2s',
                    opacity: visibleIds.has(`p-${p.id}`) ? 1 : 0,
                    transform: visibleIds.has(`p-${p.id}`) ? 'none' : 'translateY(12px)',
                    transitionDelay: `${idx * 60}ms`,
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = C.bg; e.currentTarget.style.borderColor = C.border } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' } }}
                >
                  {/* Mini thumbnail */}
                  <div style={{ width: 120, height: 68, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                    <ProjectThumbnail p={p} size="sm" />
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: isActive ? p.color : C.t1, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {isActive && <span style={{ marginRight: 6 }}>▶</span>}{p.title}
                    </div>
                    <div style={{ fontSize: 11, color: C.t2, marginBottom: 2 }}>{p.category}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 10, color: C.t3 }}>{p.year}</span>
                      {p.videoUrl && <span style={{ fontSize: 9, fontWeight: 700, color: C.green, letterSpacing: 0.5 }}>● VIDÉO</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                      {p.tags.slice(0, 2).map((t, i) => (
                        <span key={i} style={{ fontSize: 9, padding: '2px 7px', background: `${p.color}12`, color: p.color, borderRadius: 4, fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SKILLS ────────────────────────────────────────────────────────────── */}
      <section id="skills" className="section-p" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.violet, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>02 · Stack technique</div>
          <h2 style={{ fontWeight: 800, fontSize: 'clamp(28px, 5vw, 52px)', letterSpacing: -1.5, color: C.t1 }}>Compétences</h2>
        </div>
        <div className="skills-grid">
          {SKILLS.map((s, i) => (
            <div key={i} data-id={`sk-${i}`} ref={el => { refs.current[`sk-${i}`] = el }}
              style={{ padding: '20px', background: C.surface, borderRadius: 14, border: `1.5px solid ${C.border}`, transition: 'all 0.25s', opacity: visibleIds.has(`sk-${i}`) ? 1 : 0, transform: visibleIds.has(`sk-${i}`) ? 'none' : 'translateY(16px)', transitionDelay: `${i * 70}ms`, boxShadow: '0 1px 4px rgba(26,24,21,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.color + '50'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 28px ${s.color}14` }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(26,24,21,0.04)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.t1 }}>{s.cat}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.level}%</span>
              </div>
              <div style={{ height: 4, background: C.bg, borderRadius: 2, marginBottom: 14, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: visibleIds.has(`sk-${i}`) ? `${s.level}%` : '0%', background: s.color, borderRadius: 2, transition: 'width 1.1s cubic-bezier(.22,.61,.36,1)', transitionDelay: `${i * 70 + 200}ms` }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {s.items.map((it, j) => <span key={j} style={{ fontSize: 11, padding: '3px 8px', background: `${s.color}08`, border: `1px solid ${s.color}18`, color: C.t2, borderRadius: 5, fontWeight: 500 }}>{it}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────────── */}
      <section id="about" className="section-p" style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
        <div className="about-grid">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.violet, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>03 · À propos</div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: -1.5, color: C.t1, lineHeight: 1.1, marginBottom: 32 }}>Qui suis-je ?</h2>

            <p style={{ fontSize: 15, lineHeight: 1.85, color: C.t2, marginBottom: 24 }}>
              Je suis <strong style={{ color: C.t1 }}>Tchouka Kamga Davy Karim</strong>, développeur Python passionné basé à Douala, Cameroun. Je construis des outils qui résolvent de vrais problèmes — des applications réseau sécurisées aux automatisations bureautiques, en passant par des jeux et des APIs REST.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: C.t2, marginBottom: 32 }}>
              Chaque projet est une opportunité d&apos;apprendre quelque chose de nouveau. Je maîtrise l&apos;écosystème Python dans sa diversité : GUI avec Kivy & CustomTkinter, backend avec Django & FastAPI, automatisation avec OpenPyXL, et développement web avec React & Next.js.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
              {[
                { n: '6+', l: 'Projets réalisés', c: C.violet },
                { n: '8+', l: 'Technologies', c: '#059669' },
                { n: '3+', l: 'Frameworks Python', c: '#EA580C' },
                { n: '2+', l: "Années d'xp", c: '#E11D48' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '16px 20px', background: C.bg, borderRadius: 12, border: `1.5px solid ${C.border}`, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = s.c + '40'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ fontWeight: 800, fontSize: 28, color: s.c, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: C.t3, marginTop: 6, fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <a href="https://github.com/KAMGAx86" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontWeight: 600, color: C.t1, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.violet; e.currentTarget.style.color = C.violet; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.t1; e.currentTarget.style.transform = 'translateY(0)' }}
            >⌨ Voir GitHub ↗</a>
          </div>

          {/* Code block */}
          <div>
            <div className="hide-mob" style={{ background: '#0D1117', border: '1px solid #30363D', borderRadius: 14, overflow: 'hidden', fontFamily: "'JetBrains Mono', 'Consolas', monospace", boxShadow: '0 16px 48px rgba(13,17,23,0.3)' }}>
              <div style={{ padding: '12px 16px', background: '#161B22', borderBottom: '1px solid #30363D', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
                <span style={{ marginLeft: 12, fontSize: 12, color: '#7D8590', letterSpacing: 0.3 }}>davy_karim.py</span>
              </div>
              <div style={{ padding: '24px 28px', fontSize: 13, lineHeight: 2.1 }}>
                <div style={{ color: '#7D8590' }}><span style={{ color: '#FF7B72' }}>class</span> <span style={{ color: '#79C0FF' }}>Developer</span><span style={{ color: '#E6EDF3' }}>:</span></div>
                <div style={{ paddingLeft: 24, color: '#E6EDF3' }}>
                  <div><span style={{ color: '#FF7B72' }}>def</span> <span style={{ color: '#D2A8FF' }}>__init__</span><span style={{ color: '#E6EDF3' }}>(self):</span></div>
                  <div style={{ paddingLeft: 24 }}>
                    <div>self.<span style={{ color: '#79C0FF' }}>name</span> = <span style={{ color: '#A5D6FF' }}>&quot;Tchouka Kamga Davy Karim&quot;</span></div>
                    <div>self.<span style={{ color: '#79C0FF' }}>location</span> = <span style={{ color: '#A5D6FF' }}>&quot;Douala, Cameroun 🇨🇲&quot;</span></div>
                    <div>self.<span style={{ color: '#79C0FF' }}>github</span> = <span style={{ color: '#A5D6FF' }}>&quot;github.com/KAMGAx86&quot;</span></div>
                    <div>self.<span style={{ color: '#79C0FF' }}>stack</span> = [</div>
                    <div style={{ paddingLeft: 24, color: '#A5D6FF' }}>&quot;Python&quot;, &quot;Django&quot;, &quot;FastAPI&quot;,</div>
                    <div style={{ paddingLeft: 24, color: '#A5D6FF' }}>&quot;Kivy&quot;, &quot;Next.js&quot;, &quot;Pygame&quot;</div>
                    <div>]</div>
                    <div>self.<span style={{ color: '#79C0FF' }}>available</span> = <span style={{ color: '#79C0FF' }}>True</span> <span style={{ color: '#7D8590' }}># Open to work!</span></div>
                  </div>
                </div>
                <div style={{ color: '#7D8590', marginTop: 8 }}>
                  <span># Prêt à coder 🚀</span>
                  <span style={{ display: 'inline-block', width: 2, height: 14, background: '#58A6FF', marginLeft: 4, verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }} />
                </div>
              </div>
            </div>

            {/* Tech tags marquee */}
            <div style={{ marginTop: 20, overflow: 'hidden', mask: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
              <div style={{ display: 'flex', gap: 8, animation: 'marquee 20s linear infinite', width: 'max-content' }}>
                {['Python', 'Django', 'FastAPI', 'Kivy', 'OpenPyXL', 'Pygame', 'React', 'Next.js', 'SQLite', 'Zeroconf', 'Pandas', 'Selenium', 'Python', 'Django', 'FastAPI', 'Kivy', 'OpenPyXL', 'Pygame'].map((t, i) => (
                  <span key={i} style={{ padding: '6px 14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 100, fontSize: 12, fontWeight: 500, color: C.t2, whiteSpace: 'nowrap' }}>{t}</span>
                ))}
              </div>
              <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="section-p" style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div className="contact-grid">
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.violet, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>04 · Contact</div>
            <h2 style={{ fontWeight: 800, fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: -1.5, color: C.t1, lineHeight: 1.1, marginBottom: 20 }}>
              Travaillons<br />ensemble
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: C.t2, marginBottom: 36, maxWidth: 380 }}>
              Un projet d&apos;automatisation, une app desktop, une API ou simplement discuter de Python ? Je réponds en général sous 24h.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📧', label: 'Email', value: 'tchoukakamgadavykarim@gmail.com', color: '#2563EB', href: 'mailto:tchoukakamgadavykarim@gmail.com' },
                { icon: '⌨', label: 'GitHub', value: 'github.com/KAMGAx86', color: '#059669', href: 'https://github.com/KAMGAx86' },
                { icon: '💼', label: 'LinkedIn', value: 'Tchouka Kamga Davy Karim', color: C.violet, href: 'https://www.linkedin.com/in/tchouka-kamga-davy-karim-a32678366/' },
                { icon: '📍', label: 'Localisation', value: 'Douala, Cameroun 🇨🇲', color: '#D97706', href: null },
              ].map((c, i) => (
                <div key={i} onClick={() => c.href && window.open(c.href, c.href.startsWith('mailto') ? '_self' : '_blank')}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 12, cursor: c.href ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(26,24,21,0.04)' }}
                  onMouseEnter={e => { if (c.href) { e.currentTarget.style.borderColor = c.color + '40'; e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 4px 16px ${c.color}10` } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(26,24,21,0.04)' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${c.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{c.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.value}</div>
                  </div>
                  {c.href && <span style={{ color: C.t3, fontSize: 16 }}>↗</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <div style={{ background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: '32px', boxShadow: '0 4px 24px rgba(26,24,21,0.06)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { key: 'name', label: 'Votre nom', type: 'text', placeholder: 'Jean Dupont' },
                  { key: 'email', label: 'Votre email', type: 'email', placeholder: 'jean@example.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 8 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key as 'name' | 'email']}
                      onChange={e => { setForm({ ...form, [f.key]: e.target.value }); setFormError('') }}
                      style={{ width: '100%', padding: '11px 14px', background: C.bg, border: `1.5px solid ${C.border}`, color: C.t1, fontSize: 14, outline: 'none', borderRadius: 9, transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                      onFocus={e => { e.target.style.borderColor = C.violet; e.target.style.boxShadow = `0 0 0 3px ${C.violet}12` }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 8 }}>Message</label>
                  <textarea placeholder="Parlez-moi de votre projet ou de votre idée..." value={form.message}
                    onChange={e => { setForm({ ...form, message: e.target.value }); setFormError('') }}
                    rows={5}
                    style={{ width: '100%', padding: '11px 14px', background: C.bg, border: `1.5px solid ${C.border}`, color: C.t1, fontSize: 14, outline: 'none', resize: 'vertical', borderRadius: 9, transition: 'border-color 0.2s', fontFamily: 'inherit' }}
                    onFocus={e => { e.target.style.borderColor = C.violet; e.target.style.boxShadow = `0 0 0 3px ${C.violet}12` }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                  />
                </div>

                {formError && (
                  <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 13, color: C.red }}>
                    {formError}
                  </div>
                )}
                {formState === 'sent' && (
                  <div style={{ padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, fontSize: 13, color: '#15803D', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>✓</span>
                    Message envoyé ! Je vous réponds dans les 24h.
                  </div>
                )}

                <button onClick={handleContact} disabled={formState === 'sending' || formState === 'sent'}
                  style={{ padding: '13px', background: formState === 'sent' ? C.green : C.black, color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 9, cursor: formState === 'sending' || formState === 'sent' ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: formState === 'sending' ? 0.7 : 1 }}
                  onMouseEnter={e => { if (formState === 'idle') { e.currentTarget.style.background = C.violet; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 8px 20px ${C.violet}30` } }}
                  onMouseLeave={e => { e.currentTarget.style.background = formState === 'sent' ? C.green : C.black; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {formState === 'sending' ? (
                    <><div style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Envoi en cours...</>
                  ) : formState === 'sent' ? '✓ Message envoyé !' : 'Envoyer le message →'}
                </button>

                <p style={{ fontSize: 12, color: C.t3, textAlign: 'center' }}>Réponse sous 24h</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer style={{ padding: '24px 64px', borderTop: `1px solid ${C.border}`, background: C.surface }}>
        <div className="footer-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: C.black, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>DK</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 14, color: C.t1 }}>Davy Karim</span>
          </div>
          <span style={{ fontSize: 13, color: C.t3 }}>© 2026 Tchouka Kamga Davy Karim · Douala 🇨🇲</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { l: 'GitHub', u: 'https://github.com/KAMGAx86' },
              { l: 'LinkedIn', u: 'https://www.linkedin.com/in/tchouka-kamga-davy-karim-a32678366/' },
              { l: 'Email', u: 'mailto:tchoukakamgadavykarim@gmail.com' },
            ].map(s => (
              <a key={s.l} href={s.u} target={s.u.startsWith('mailto') ? '_self' : '_blank'} rel="noopener noreferrer"
                style={{ padding: '6px 12px', border: `1px solid ${C.border}`, borderRadius: 7, fontSize: 12, fontWeight: 500, color: C.t3, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = C.violet; e.currentTarget.style.borderColor = C.violet + '40' }}
                onMouseLeave={e => { e.currentTarget.style.color = C.t3; e.currentTarget.style.borderColor = C.border }}
              >{s.l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
