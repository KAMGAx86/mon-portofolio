import { NextResponse } from 'next/server'
import { mkdir, unlink } from 'fs/promises'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'
import path from 'path'
import { createHmac } from 'crypto'

function isAuthenticated(request: Request): boolean {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/admin_token=([^;]+)/)
  const token = match?.[1]
  const secret = process.env.ADMIN_SECRET || 'portfolio-secret-2026'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const expected = createHmac('sha256', secret).update(password).digest('hex')
  return token === expected
}

const ALLOWED_EXT = /\.(mp4|webm|ogg|mov|avi|mkv)$/i
const MAX_SIZE = 500 * 1024 * 1024 // 500 MB

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Filename + size come as query params — file body is streamed raw
  const url = new URL(request.url)
  const originalName = url.searchParams.get('filename') || 'video.mp4'
  const contentLength = parseInt(request.headers.get('content-length') || '0', 10)

  if (!ALLOWED_EXT.test(originalName)) {
    return NextResponse.json({ error: 'Format non supporté. Utilisez MP4, WebM, MOV ou AVI.' }, { status: 400 })
  }
  if (contentLength > MAX_SIZE) {
    return NextResponse.json({ error: `Fichier trop volumineux (max 500 MB). Reçu : ${(contentLength / 1024 / 1024).toFixed(0)} MB` }, { status: 400 })
  }
  if (!request.body) {
    return NextResponse.json({ error: 'Corps de la requête vide.' }, { status: 400 })
  }

  const videosDir = path.join(process.cwd(), 'public', 'videos')
  await mkdir(videosDir, { recursive: true })

  const ext = originalName.split('.').pop()?.toLowerCase() || 'mp4'
  const baseName = originalName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().slice(0, 40)
  const filename = `${Date.now()}-${baseName}.${ext}`
  const filepath = path.join(videosDir, filename)

  try {
    // Stream directly to disk — zero full-file buffering in RAM
    const nodeReadable = Readable.fromWeb(request.body as Parameters<typeof Readable.fromWeb>[0])
    const writeStream = createWriteStream(filepath)
    await pipeline(nodeReadable, writeStream)

    return NextResponse.json({
      url: `/videos/${filename}`,
      name: originalName,
      size: contentLength,
      filename,
    })
  } catch (err) {
    // Clean up partial file on error
    try { await unlink(filepath) } catch { /* ignore */ }
    console.error('Upload stream error:', err)
    return NextResponse.json({ error: "Erreur lors de l'écriture du fichier." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const { filename } = await request.json()
    if (!filename || typeof filename !== 'string' || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Nom de fichier invalide.' }, { status: 400 })
    }
    const filepath = path.join(process.cwd(), 'public', 'videos', filename)
    try { await unlink(filepath) } catch { /* file already gone */ }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 })
  }
}
