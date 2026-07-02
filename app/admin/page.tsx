'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

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
  videoUrl: string
  videoDescription: string
}

type VideoMode = 'url' | 'file'
type UploadState = 'idle' | 'uploading' | 'done' | 'error'

const EMPTY: Omit<Project, 'id'> = {
  title: '', category: '', year: new Date().getFullYear().toString(),
  emoji: '🚀', color: '#7C3AED', description: '', tags: [], features: [],
  problem: '', solution: '', github: '', videoUrl: '', videoDescription: '',
}
const COLORS = ['#2563EB', '#059669', '#EA580C', '#E11D48', '#D97706', '#7C3AED', '#0891B2', '#DB2777']

// ─── Design tokens ────────────────────────────────────────────────────────────
const A = {
  bg: '#0B0F1A',
  surface: '#111827',
  surface2: '#1F2937',
  border: '#1F2937',
  border2: '#374151',
  t1: '#F9FAFB',
  t2: '#9CA3AF',
  t3: '#6B7280',
  violet: '#7C3AED',
  green: '#059669',
  red: '#DC2626',
  blue: '#2563EB',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isYouTube(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be')
}
function isLocalVideo(url: string) {
  return url.startsWith('/videos/')
}
function getYtEmbed(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : url.includes('youtube.com/embed/') ? url : null
}
function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function VideoPreview({ url }: { url: string }) {
  if (!url) return null
  const yt = isYouTube(url) ? getYtEmbed(url) : null
  return (
    <div style={{ marginTop: 12, borderRadius: 10, overflow: 'hidden', border: `1px solid ${A.border2}`, background: '#000', aspectRatio: '16/9' }}>
      {yt
        ? <iframe src={yt} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
        : <video src={url} controls style={{ width: '100%', height: '100%', display: 'block' }} />
      }
    </div>
  )
}

function ProjectCard({
  p, onEdit, onDelete, deleteConfirmId, setDeleteConfirm,
}: {
  p: Project
  onEdit: () => void
  onDelete: () => void
  deleteConfirmId: number | null
  setDeleteConfirm: (id: number | null) => void
}) {
  return (
    <div style={{
      background: A.surface, border: `1px solid ${A.border2}`, borderRadius: 14,
      padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14,
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = p.color + '50')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = A.border2)}
    >
      {/* Thumbnail / emoji */}
      <div style={{ width: 56, height: 56, borderRadius: 10, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, border: `1px solid ${p.color}25` }}>
        {p.emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: A.t1 }}>{p.title}</span>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 5, background: `${p.color}20`, color: p.color, fontWeight: 600, letterSpacing: 0.5 }}>{p.category}</span>
          <span style={{ fontSize: 11, color: A.t3 }}>{p.year}</span>
          {p.videoUrl && (
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 5, background: '#052e16', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              {isLocalVideo(p.videoUrl) ? '📁' : '▶'} {isLocalVideo(p.videoUrl) ? 'Fichier local' : isYouTube(p.videoUrl) ? 'YouTube' : 'Vidéo URL'}
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, color: A.t2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 480 }}>{p.description}</p>
        <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
          {p.tags.slice(0, 4).map((t, i) => <span key={i} style={{ fontSize: 10, padding: '2px 7px', background: A.surface2, border: `1px solid ${A.border2}`, color: A.t2, borderRadius: 4 }}>{t}</span>)}
          {p.tags.length > 4 && <span style={{ fontSize: 10, color: A.t3 }}>+{p.tags.length - 4}</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
        <button onClick={onEdit} style={{ padding: '7px 16px', background: 'transparent', border: `1px solid ${A.border2}`, color: A.t2, fontSize: 12, borderRadius: 7, fontWeight: 500, transition: 'all 0.2s', fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = A.blue; e.currentTarget.style.color = A.blue }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = A.border2; e.currentTarget.style.color = A.t2 }}
        >Modifier</button>
        {deleteConfirmId === p.id ? (
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onDelete} style={{ padding: '7px 12px', background: A.red, border: 'none', color: '#fff', fontSize: 11, borderRadius: 7, fontWeight: 600, fontFamily: 'inherit' }}>Confirmer</button>
            <button onClick={() => setDeleteConfirm(null)} style={{ padding: '7px 10px', background: 'transparent', border: `1px solid ${A.border2}`, color: A.t2, fontSize: 11, borderRadius: 7, fontFamily: 'inherit' }}>Non</button>
          </div>
        ) : (
          <button onClick={() => setDeleteConfirm(p.id)} style={{ padding: '7px 10px', background: 'transparent', border: `1px solid ${A.red}40`, color: '#F87171', fontSize: 12, borderRadius: 7, transition: 'all 0.2s', fontFamily: 'inherit' }}
            onMouseEnter={e => (e.currentTarget.style.background = `${A.red}15`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >✕</button>
        )}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState<Omit<Project, 'id'>>(EMPTY)
  const [tagsInput, setTagsInput] = useState('')
  const [featuresInput, setFeaturesInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  // Video state
  const [videoMode, setVideoMode] = useState<VideoMode>('url')
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedInfo, setUploadedInfo] = useState<{ name: string; size: number; filename: string } | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const notify = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  const fetchProjects = useCallback(async () => {
    try {
      const r = await fetch('/api/projects')
      setProjects(await r.json())
    } catch { notify('Erreur de chargement', 'err') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY); setTagsInput(''); setFeaturesInput('')
    setEditing(null); resetVideo(); setModal('add')
  }

  const openEdit = (p: Project) => {
    setForm({ title: p.title, category: p.category, year: p.year, emoji: p.emoji, color: p.color, description: p.description, tags: p.tags, features: p.features, problem: p.problem, solution: p.solution, github: p.github, videoUrl: p.videoUrl || '', videoDescription: p.videoDescription || '' })
    setTagsInput(p.tags.join(', '))
    setFeaturesInput(p.features.join('\n'))
    setEditing(p)
    resetVideo()
    // Pre-select mode based on existing URL
    setVideoMode(p.videoUrl && isLocalVideo(p.videoUrl) ? 'file' : 'url')
    if (p.videoUrl && isLocalVideo(p.videoUrl)) {
      const parts = p.videoUrl.split('/')
      setUploadedInfo({ name: parts[parts.length - 1], size: 0, filename: parts[parts.length - 1] })
      setUploadState('done')
    }
    setModal('edit')
  }

  const closeModal = () => { setModal(null); setEditing(null); resetVideo() }

  const resetVideo = () => {
    setVideoMode('url'); setUploadState('idle'); setUploadProgress(0); setUploadedInfo(null); setDragOver(false)
  }

  // ── File upload — dual mode: Vercel Blob (prod) / XHR stream (local) ────────
  const IS_VERCEL = process.env.NEXT_PUBLIC_IS_VERCEL === '1'

  const uploadFile = async (file: File) => {
    if (!/\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(file.name)) {
      notify('Format non supporté. Utilisez MP4, WebM, MOV ou AVI.', 'err'); return
    }
    if (file.size > 500 * 1024 * 1024) {
      notify('Fichier trop volumineux (max 500 MB)', 'err'); return
    }

    setUploadState('uploading'); setUploadProgress(0); setUploadedInfo(null)

    if (IS_VERCEL) {
      // ── Vercel Blob: direct upload from browser (bypasses serverless body limit) ──
      try {
        const { upload } = await import('@vercel/blob/client')
        // Timestamp prefix guarantees a unique path even if same filename is re-uploaded
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
        const blob = await upload(`videos/${Date.now()}-${safeName}`, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          onUploadProgress: ({ percentage }) => setUploadProgress(Math.round(percentage)),
        })
        setUploadedInfo({ name: file.name, size: file.size, filename: blob.pathname })
        setForm(f => ({ ...f, videoUrl: blob.url }))
        setUploadState('done')
        notify('Vidéo uploadée sur Vercel Blob !')
      } catch (err) {
        setUploadState('error')
        const msg = err instanceof Error ? err.message : 'Erreur upload'
        notify(msg.includes('autorisé') ? 'Session expirée — reconnectez-vous.' : msg, 'err')
      }
      return
    }

    // ── Local dev: stream raw file body → no RAM buffering ────────────────────
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100))
    })

    xhr.addEventListener('load', () => {
      let data: Record<string, string> = {}
      try { data = JSON.parse(xhr.responseText) } catch { /* non-JSON */ }

      if (xhr.status === 200 || xhr.status === 201) {
        setUploadedInfo({ name: file.name, size: file.size, filename: data.filename })
        setForm(f => ({ ...f, videoUrl: data.url }))
        setUploadState('done')
        notify('Vidéo enregistrée !')
      } else if (xhr.status === 401) {
        setUploadState('error')
        notify('Session expirée — déconnectez-vous et reconnectez-vous.', 'err')
      } else {
        setUploadState('error')
        notify(data.error || `Erreur serveur (${xhr.status})`, 'err')
      }
    })

    xhr.addEventListener('error', () => { setUploadState('error'); notify('Erreur réseau.', 'err') })
    xhr.addEventListener('timeout', () => { setUploadState('error'); notify('Délai dépassé.', 'err') })
    xhr.timeout = 10 * 60 * 1000

    xhr.open('POST', `/api/upload?filename=${encodeURIComponent(file.name)}`)
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
    xhr.send(file)
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  const removeVideo = async () => {
    if (form.videoUrl) {
      try {
        if (form.videoUrl.includes('blob.vercel-storage.com')) {
          // Delete from Vercel Blob store
          await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: form.videoUrl }),
          })
        } else if (isLocalVideo(form.videoUrl) && uploadedInfo?.filename) {
          // Delete local file
          await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: uploadedInfo.filename }),
          })
        }
      } catch { /* best-effort — video removed from form regardless */ }
    }
    setForm(f => ({ ...f, videoUrl: '', videoDescription: '' }))
    resetVideo()
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) { notify('Titre et description sont requis.', 'err'); return }
    setSaving(true)
    const payload = {
      ...form,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      features: featuresInput.split('\n').map(f => f.trim()).filter(Boolean),
    }
    try {
      const res = await fetch(
        modal === 'edit' && editing ? `/api/projects/${editing.id}` : '/api/projects',
        { method: modal === 'edit' ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      )
      if (res.ok) { await fetchProjects(); closeModal(); notify(modal === 'edit' ? 'Projet mis à jour !' : 'Projet ajouté !') }
      else { const d = await res.json(); notify(d.error || 'Erreur de sauvegarde inconnue', 'err') }
    } catch (err) { notify(`Erreur réseau : ${err instanceof Error ? err.message : 'connexion impossible'}`, 'err') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    const r = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
    if (r.ok) { await fetchProjects(); setDeleteConfirm(null); notify('Projet supprimé') }
    else notify('Erreur lors de la suppression', 'err')
  }

  const handleLogout = async () => { await fetch('/api/auth', { method: 'DELETE' }); router.push('/admin/login') }

  // ── Shared input style ────────────────────────────────────────────────────
  const inp: React.CSSProperties = { width: '100%', padding: '10px 13px', background: A.bg, border: `1px solid ${A.border2}`, color: A.t1, fontSize: 13, borderRadius: 8, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' }
  const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: A.t2, marginBottom: 6, letterSpacing: 0.5 }

  const statsData = [
    { v: projects.length, l: 'Projets', c: A.blue },
    { v: projects.filter(p => p.videoUrl).length, l: 'Avec vidéo', c: A.green },
    { v: projects.filter(p => p.videoUrl && isLocalVideo(p.videoUrl)).length, l: 'Vidéos locales', c: A.violet },
    { v: Array.from(new Set(projects.map(p => p.category))).length, l: 'Catégories', c: '#D97706' },
  ]

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: A.bg, color: A.t1, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        input,textarea,select{font-family:inherit}
        button{font-family:inherit;cursor:pointer}
        textarea{resize:vertical}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:${A.bg}}
        ::-webkit-scrollbar-thumb{background:${A.border2};border-radius:3px}
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes progress{from{width:0%}to{width:100%}}
        .inp-focus:focus{border-color:${A.violet}!important;box-shadow:0 0 0 3px ${A.violet}18!important}
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: toast.type === 'ok' ? A.green : A.red, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'slideIn 0.3s ease', display: 'flex', alignItems: 'center', gap: 8 }}>
          {toast.type === 'ok' ? '✓' : '✕'} {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={{ background: A.surface, borderBottom: `1px solid ${A.border2}`, padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: A.violet, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔐</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: A.t1 }}>Admin Panel</div>
            <div style={{ fontSize: 11, color: A.t3 }}>Portfolio · Davy Karim</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/" target="_blank" style={{ padding: '7px 14px', border: `1px solid ${A.border2}`, borderRadius: 7, fontSize: 12, fontWeight: 500, color: A.t2, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = A.t2; e.currentTarget.style.color = A.t1 }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = A.border2; e.currentTarget.style.color = A.t2 }}
          >Voir le site ↗</a>
          <button onClick={handleLogout} style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${A.red}40`, borderRadius: 7, fontSize: 12, fontWeight: 500, color: '#F87171', transition: 'all 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = `${A.red}15`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >Déconnexion</button>
        </div>
      </header>

      <main style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
          {statsData.map((s, i) => (
            <div key={i} style={{ padding: '16px 18px', background: A.surface, border: `1px solid ${A.border2}`, borderRadius: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 26, color: s.c, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: A.t3, marginTop: 6, fontWeight: 500 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Action bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: A.t1 }}>Mes projets</h2>
          <button onClick={openAdd} style={{ padding: '9px 20px', background: A.violet, border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 9, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = A.violet; e.currentTarget.style.transform = 'translateY(0)' }}
          >+ Ajouter un projet</button>
        </div>

        {/* Project list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: A.t3 }}>
            <div style={{ width: 24, height: 24, border: `2px solid ${A.border2}`, borderTopColor: A.violet, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            Chargement...
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 32px', background: A.surface, border: `1px dashed ${A.border2}`, borderRadius: 14, color: A.t3, fontSize: 14 }}>
            Aucun projet — cliquez sur &quot;+ Ajouter&quot; pour commencer
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projects.map(p => (
              <ProjectCard key={p.id} p={p} onEdit={() => openEdit(p)} onDelete={() => handleDelete(p.id)} deleteConfirmId={deleteConfirm} setDeleteConfirm={setDeleteConfirm} />
            ))}
          </div>
        )}
      </main>

      {/* ── MODAL ────────────────────────────────────────────────────────────── */}
      {modal && (
        <div onClick={closeModal} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: A.surface, border: `1px solid ${A.border2}`, borderRadius: 16, width: '100%', maxWidth: 780, padding: '28px 32px', margin: 'auto' }}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: A.t1 }}>{modal === 'edit' ? '✏️ Modifier le projet' : '✨ Nouveau projet'}</h2>
              <button onClick={closeModal} style={{ width: 32, height: 32, background: A.bg, border: `1px solid ${A.border2}`, color: A.t2, borderRadius: 8, fontSize: 16, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = A.red; e.currentTarget.style.color = '#F87171' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = A.border2; e.currentTarget.style.color = A.t2 }}
              >✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {/* Title */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>TITRE *</label>
                <input className="inp-focus" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="ex: DataShare" style={inp} />
              </div>

              {/* Category + Year */}
              <div>
                <label style={lbl}>CATÉGORIE *</label>
                <input className="inp-focus" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="ex: Application Desktop" style={inp} />
              </div>
              <div>
                <label style={lbl}>ANNÉE</label>
                <input className="inp-focus" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="2024" style={inp} />
              </div>

              {/* Emoji + Color */}
              <div>
                <label style={lbl}>EMOJI</label>
                <input className="inp-focus" value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} placeholder="🚀" style={{ ...inp, fontSize: 22 }} />
              </div>
              <div>
                <label style={lbl}>COULEUR</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: 40, height: 36, padding: 2, background: A.bg, border: `1px solid ${A.border2}`, borderRadius: 6, cursor: 'pointer' }} />
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })} style={{ width: 22, height: 22, borderRadius: 5, background: c, border: form.color === c ? '2px solid #fff' : '2px solid transparent', padding: 0, transition: 'transform 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>DESCRIPTION *</label>
                <textarea className="inp-focus" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description courte du projet..." rows={3} style={inp} />
              </div>

              {/* Tags */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>TECHNOLOGIES <span style={{ color: A.t3, fontWeight: 400 }}>(séparées par virgules)</span></label>
                <input className="inp-focus" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="Python, Django, FastAPI, React" style={inp} />
              </div>

              {/* Features */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>FONCTIONNALITÉS <span style={{ color: A.t3, fontWeight: 400 }}>(une par ligne)</span></label>
                <textarea className="inp-focus" value={featuresInput} onChange={e => setFeaturesInput(e.target.value)} placeholder={'Découverte automatique\nAuthentification sécurisée\nTransfert temps réel'} rows={4} style={inp} />
              </div>

              {/* Problem + Solution */}
              <div>
                <label style={lbl}>PROBLÉMATIQUE</label>
                <textarea className="inp-focus" value={form.problem} onChange={e => setForm({ ...form, problem: e.target.value })} placeholder="Quel problème résout ce projet ?" rows={3} style={inp} />
              </div>
              <div>
                <label style={lbl}>SOLUTION</label>
                <textarea className="inp-focus" value={form.solution} onChange={e => setForm({ ...form, solution: e.target.value })} placeholder="Comment ce projet résout le problème ?" rows={3} style={inp} />
              </div>

              {/* GitHub */}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>LIEN GITHUB</label>
                <input className="inp-focus" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." type="url" style={inp} />
              </div>

              {/* ── VIDEO SECTION ────────────────────────────────────────────── */}
              <div style={{ gridColumn: '1/-1', borderTop: `1px solid ${A.border2}`, paddingTop: 20, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: A.green }}>🎬 Vidéo de démonstration</div>
                  {/* Mode tabs */}
                  <div style={{ display: 'flex', background: A.bg, borderRadius: 8, padding: 3, gap: 2 }}>
                    {(['url', 'file'] as VideoMode[]).map(m => (
                      <button key={m} onClick={() => { setVideoMode(m); if (m === 'url' && isLocalVideo(form.videoUrl)) { setForm(f => ({ ...f, videoUrl: '' })); setUploadState('idle'); setUploadedInfo(null) } }}
                        style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, transition: 'all 0.15s', border: 'none', background: videoMode === m ? A.surface : 'transparent', color: videoMode === m ? A.t1 : A.t3, boxShadow: videoMode === m ? '0 1px 4px rgba(0,0,0,0.3)' : 'none' }}
                      >{m === 'url' ? '🔗 URL' : '📁 Fichier local'}</button>
                    ))}
                  </div>
                </div>

                {/* URL mode */}
                {videoMode === 'url' && (
                  <div>
                    <label style={lbl}>URL VIDÉO <span style={{ color: A.t3, fontWeight: 400 }}>(YouTube, lien direct…)</span></label>
                    <input className="inp-focus" value={isLocalVideo(form.videoUrl) ? '' : form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://youtube.com/watch?v=... ou https://example.com/video.mp4" type="url" style={inp} />
                    {form.videoUrl && !isLocalVideo(form.videoUrl) && <VideoPreview url={form.videoUrl} />}
                  </div>
                )}

                {/* File mode */}
                {videoMode === 'file' && (
                  <div>
                    {/* Existing uploaded file */}
                    {uploadState === 'done' && uploadedInfo ? (
                      <div style={{ padding: '14px 16px', background: '#052e16', border: '1px solid #166534', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <span style={{ fontSize: 24 }}>🎬</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#34d399', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{uploadedInfo.name}</div>
                          {uploadedInfo.size > 0 && <div style={{ fontSize: 11, color: '#6ee7b7', marginTop: 2 }}>{formatSize(uploadedInfo.size)} · Enregistré dans /public/videos/</div>}
                          <div style={{ fontSize: 11, color: '#6ee7b7', marginTop: 1, fontFamily: "'JetBrains Mono', monospace" }}>{form.videoUrl}</div>
                        </div>
                        <button onClick={removeVideo} style={{ padding: '5px 10px', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#F87171', borderRadius: 6, fontSize: 11, fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.3)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.15)')}
                        >✕ Supprimer</button>
                      </div>
                    ) : uploadState === 'uploading' ? (
                      /* Progress bar */
                      <div style={{ padding: '20px 20px', background: A.bg, border: `1px solid ${A.border2}`, borderRadius: 10, marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <span style={{ fontSize: 13, color: A.t2, fontWeight: 500 }}>
                            {uploadProgress < 100 ? 'Transfert en cours…' : '⚙️ Enregistrement sur le serveur…'}
                          </span>
                          <span style={{ fontSize: 13, color: A.violet, fontWeight: 700 }}>{uploadProgress}%</span>
                        </div>
                        <div style={{ height: 6, background: A.border2, borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${uploadProgress}%`, background: `linear-gradient(90deg, ${A.violet}, #A78BFA)`, borderRadius: 3, transition: 'width 0.3s' }} />
                        </div>
                        <div style={{ fontSize: 11, color: A.t3, marginTop: 8 }}>
                          {uploadProgress < 100 ? 'Ne fermez pas cette fenêtre…' : 'Vidéo reçue — finalisation en cours…'}
                        </div>
                      </div>
                    ) : (
                      /* Drop zone */
                      <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          padding: '32px 24px', border: `2px dashed ${dragOver ? A.violet : A.border2}`, borderRadius: 12,
                          textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 12,
                          background: dragOver ? `${A.violet}08` : A.bg,
                          transform: dragOver ? 'scale(1.01)' : 'scale(1)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = A.violet; e.currentTarget.style.background = `${A.violet}06` }}
                        onMouseLeave={e => { if (!dragOver) { e.currentTarget.style.borderColor = A.border2; e.currentTarget.style.background = A.bg } }}
                      >
                        <div style={{ fontSize: 36, marginBottom: 12 }}>📹</div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: A.t1, marginBottom: 6 }}>Glissez votre vidéo ici</div>
                        <div style={{ fontSize: 13, color: A.t2, marginBottom: 12 }}>ou cliquez pour parcourir vos fichiers</div>
                        <div style={{ fontSize: 11, color: A.t3 }}>MP4, WebM, MOV, AVI · Max 500 MB</div>
                      </div>
                    )}

                    {uploadState === 'error' && (
                      <div style={{ padding: '10px 14px', background: `${A.red}10`, border: `1px solid ${A.red}30`, borderRadius: 8, fontSize: 12, color: '#F87171', marginBottom: 12 }}>
                        ✕ Erreur d&apos;upload — Réessayez
                      </div>
                    )}

                    <input ref={fileInputRef} type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo,.mp4,.webm,.ogg,.mov,.avi,.mkv" style={{ display: 'none' }}
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = '' }}
                    />

                    {/* Video preview */}
                    {form.videoUrl && isLocalVideo(form.videoUrl) && <VideoPreview url={form.videoUrl} />}
                  </div>
                )}

                {/* Video description — always shown if there's a video */}
                {(form.videoUrl || uploadState === 'done') && (
                  <div style={{ marginTop: 14 }}>
                    <label style={lbl}>DESCRIPTION DE LA VIDÉO <span style={{ color: A.t3, fontWeight: 400 }}>(optionnel)</span></label>
                    <textarea className="inp-focus" value={form.videoDescription} onChange={e => setForm({ ...form, videoDescription: e.target.value })} placeholder="Décrivez ce que montre la démonstration vidéo..." rows={2} style={inp} />
                  </div>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end', borderTop: `1px solid ${A.border2}`, paddingTop: 20 }}>
              <button onClick={closeModal} style={{ padding: '10px 22px', background: 'transparent', border: `1px solid ${A.border2}`, color: A.t2, fontSize: 13, fontWeight: 500, borderRadius: 9 }}>Annuler</button>
              <button onClick={handleSave} disabled={saving || uploadState === 'uploading'} style={{
                padding: '10px 28px', background: saving ? A.violet + 'a0' : A.violet, border: 'none',
                color: '#fff', fontSize: 13, fontWeight: 700, borderRadius: 9, opacity: saving ? 0.7 : 1, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#6D28D9' }}
                onMouseLeave={e => { e.currentTarget.style.background = saving ? A.violet + 'a0' : A.violet }}
              >
                {saving ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Sauvegarde...</> : modal === 'edit' ? '✓ Mettre à jour' : '✨ Ajouter le projet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
