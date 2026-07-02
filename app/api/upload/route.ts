import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const IS_VERCEL = process.env.VERCEL === '1'
const ALLOWED_EXT = /\.(mp4|webm|ogg|mov|avi|mkv)$/i
const MAX_SIZE = 500 * 1024 * 1024

function isAuthenticated(request: Request): boolean {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/admin_token=([^;]+)/)
  const token = match?.[1]
  const secret = process.env.ADMIN_SECRET || 'portfolio-secret-2026'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const expected = createHmac('sha256', secret).update(password).digest('hex')
  return token === expected
}

// ── Vercel Blob: token generation for client-side direct upload ───────────────
async function handleBlobUpload(request: Request): Promise<Response> {
  const { handleUpload } = await import('@vercel/blob/client')

  try {
    const body = await request.json()
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!isAuthenticated(request)) {
          throw new Error('Non autorisé — reconnectez-vous.')
        }
        if (!ALLOWED_EXT.test(pathname)) {
          throw new Error('Format non supporté. Utilisez MP4, WebM, MOV ou AVI.')
        }
        return {
          allowedContentTypes: [
            'video/mp4', 'video/webm', 'video/ogg',
            'video/quicktime', 'video/x-msvideo', 'video/avi',
          ],
          maximumSizeInBytes: MAX_SIZE,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('[Vercel Blob] Upload terminé:', blob.url)
      },
    })
    return NextResponse.json(jsonResponse)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur upload'
    console.error('[Upload] Erreur:', msg)
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}

// ── Local dev: stream file directly to disk (no RAM buffering) ────────────────
async function handleLocalUpload(request: Request): Promise<Response> {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autorisé — reconnectez-vous.' }, { status: 401 })
  }

  const url = new URL(request.url)
  const originalName = url.searchParams.get('filename') || 'video.mp4'
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10)

  if (!ALLOWED_EXT.test(originalName)) {
    return NextResponse.json({ error: 'Format non supporté. Utilisez MP4, WebM, MOV ou AVI.' }, { status: 400 })
  }
  if (contentLength > MAX_SIZE) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 500 MB).' }, { status: 400 })
  }
  if (!request.body) {
    return NextResponse.json({ error: 'Corps de la requête vide.' }, { status: 400 })
  }

  const { mkdir, unlink } = await import('fs/promises')
  const { createWriteStream } = await import('fs')
  const { pipeline } = await import('stream/promises')
  const { Readable } = await import('stream')
  const path = await import('path')

  const videosDir = path.join(process.cwd(), 'public', 'videos')
  await mkdir(videosDir, { recursive: true })

  const ext = originalName.split('.').pop()?.toLowerCase() || 'mp4'
  const base = originalName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().slice(0, 40)
  const filename = `${Date.now()}-${base}.${ext}`
  const filepath = path.join(videosDir, filename)

  try {
    const nodeReadable = Readable.fromWeb(request.body as Parameters<typeof Readable.fromWeb>[0])
    const writeStream = createWriteStream(filepath)
    await pipeline(nodeReadable, writeStream)
    return NextResponse.json({ url: `/videos/${filename}`, name: originalName, size: contentLength, filename })
  } catch (err) {
    try { await unlink(filepath) } catch { /* ignore */ }
    console.error('[Upload local] Erreur écriture:', err)
    return NextResponse.json({ error: "Erreur lors de l'enregistrement du fichier." }, { status: 500 })
  }
}

// ── Router ─────────────────────────────────────────────────────────────────────
export async function POST(request: Request): Promise<Response> {
  if (IS_VERCEL) return handleBlobUpload(request)
  return handleLocalUpload(request)
}

// ── Delete video ───────────────────────────────────────────────────────────────
export async function DELETE(request: Request): Promise<Response> {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const body = await request.json()

    if (IS_VERCEL) {
      const { url } = body
      if (url && typeof url === 'string' && url.includes('blob.vercel-storage.com')) {
        const { del } = await import('@vercel/blob')
        await del(url)
        console.log('[Vercel Blob] Vidéo supprimée:', url)
      }
      return NextResponse.json({ success: true })
    }

    // Local: delete file from disk
    const { filename } = body
    if (!filename || typeof filename !== 'string' || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Nom de fichier invalide.' }, { status: 400 })
    }
    const { unlink } = await import('fs/promises')
    const path = await import('path')
    try { await unlink(path.join(process.cwd(), 'public', 'videos', filename)) } catch { /* already gone */ }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[Upload DELETE] Erreur:', err)
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 })
  }
}
