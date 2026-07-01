'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0F172A', fontFamily: "'Space Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { font-family: inherit; }
        button { font-family: inherit; cursor: pointer; }
      `}</style>

      <div style={{
        background: '#1E293B', border: '1px solid #334155', borderRadius: 12,
        padding: '40px', width: '100%', maxWidth: 420,
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
          <h1 style={{ color: '#F1F5F9', fontSize: 20, fontWeight: 700, letterSpacing: 2 }}>
            ADMIN ACCESS
          </h1>
          <p style={{ color: '#64748B', fontSize: 12, marginTop: 8, letterSpacing: 1 }}>
            Portfolio de Davy Karim
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: 2, color: '#94A3B8', marginBottom: 8 }}>
              MOT DE PASSE
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              placeholder="••••••••"
              autoFocus
              required
              style={{
                width: '100%', padding: '12px 16px',
                background: '#0F172A', border: '1px solid #334155',
                color: '#F1F5F9', fontSize: 14, borderRadius: 6, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#334155')}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6,
              color: '#F87171', fontSize: 12, letterSpacing: 0.5,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: '13px', background: loading ? '#1D4ED8' : '#2563EB',
              color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: 2,
              border: 'none', borderRadius: 6, opacity: !password ? 0.5 : 1,
              transition: 'all 0.2s', marginTop: 4,
            }}
            onMouseEnter={(e) => { if (!loading && password) e.currentTarget.style.background = '#1D4ED8' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB' }}
          >
            {loading ? 'CONNEXION...' : 'SE CONNECTER →'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a href="/" style={{ color: '#475569', fontSize: 11, letterSpacing: 1, textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            ← Retour au portfolio
          </a>
        </div>
      </div>
    </div>
  )
}
