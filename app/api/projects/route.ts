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

export async function GET() {
  const projects = await getProjects()
  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const projects = await getProjects()
    const newProject = { ...body, id: Date.now() }
    projects.push(newProject)
    await saveProjects(projects)
    return NextResponse.json(newProject, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
