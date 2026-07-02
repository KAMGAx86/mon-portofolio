import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { getProjects, saveProjects } from '@/app/lib/storage'

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
    const index = projects.findIndex(p => p.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Projet non trouvé' }, { status: 404 })
    }
    projects[index] = { ...projects[index], ...body, id }
    await saveProjects(projects)
    return NextResponse.json(projects[index])
  } catch (err) {
    console.error('[PUT /api/projects/:id] Erreur:', err)
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: `Erreur lors de la mise à jour : ${msg}` }, { status: 500 })
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
    const filtered = projects.filter(p => p.id !== id)
    await saveProjects(filtered)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/projects/:id] Erreur:', err)
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    return NextResponse.json({ error: `Erreur lors de la suppression : ${msg}` }, { status: 500 })
  }
}
