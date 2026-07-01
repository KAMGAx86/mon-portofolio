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
    await writeFile(DATA_FILE, JSON.stringify(projects, null, 2), 'utf-8')
    return NextResponse.json(newProject, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
