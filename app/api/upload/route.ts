import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
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

const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/avi']
const ALLOWED_EXT = /\.(mp4|webm|ogg|mov|avi|mkv)$/i
const MAX_SIZE = 500 * 1024 * 1024 // 500 MB

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('video') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `Fichier trop volumineux (max 500 MB). Taille reçue : ${(file.size / 1024 / 1024).toFixed(1)} MB` }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.test(file.name)) {
      return NextResponse.json({ error: 'Format non supporté. Utilisez MP4, WebM, MOV ou AVI.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const videosDir = path.join(process.cwd(), 'public', 'videos')
    await mkdir(videosDir, { recursive: true })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4'
    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase().slice(0, 40)
    const filename = `${Date.now()}-${baseName}.${ext}`
    const filepath = path.join(videosDir, filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({
      url: `/videos/${filename}`,
      name: file.name,
      size: file.size,
      filename,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: "Erreur lors de l'enregistrement du fichier." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { filename } = await request.json()
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Nom de fichier invalide.' }, { status: 400 })
    }

    const filepath = path.join(process.cwd(), 'public', 'videos', filename)
    if (existsSync(filepath)) {
      await unlink(filepath)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Delete error:', err)
    return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 })
  }
}
