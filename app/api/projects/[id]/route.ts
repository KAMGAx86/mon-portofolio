import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { createHmac } from 'crypto'

const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json')

async function getProjects() {
  try {
    const data = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function isAuthenticated(request: Request): boolean {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/admin_token=([^;]+)/)
  const token = match?.[1]
  const secret = process.env.ADMIN_SECRET || 'portfolio-secret-2026'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const expected = createHmac('sha256', secret).update(password).digest('hex')
  return token === expected
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const { id: idStr } = await params
    const body = await request.json()
    const projects = await getProjects()
    const id = Number(idStr)
    const index = projects.findIndex((p: { id: number }) => p.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }
    projects[index] = { ...projects[index], ...body, id }
    await writeFile(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8')
    return NextResponse.json(projects[index])
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const { id: idStr } = await params
    const projects = await getProjects()
    const id = Number(idStr)
    const filtered = projects.filter((p: { id: number }) => p.id !== id)
    await writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
