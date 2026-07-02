import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

export interface Project {
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

const IS_VERCEL = process.env.VERCEL === '1'
const BLOB_KEY = 'portfolio/projects.json'
const DATA_FILE = path.join(process.cwd(), 'data', 'projects.json')

export async function getProjects(): Promise<Project[]> {
  if (IS_VERCEL) {
    const { list } = await import('@vercel/blob')
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length === 0) return []
    // Always use the most recently uploaded version
    const latest = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    )[0]
    const res = await fetch(latest.url, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Lecture du blob échouée (HTTP ${res.status})`)
    return await res.json()
  }
  try {
    const raw = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export async function saveProjects(projects: Project[]): Promise<void> {
  if (IS_VERCEL) {
    const { put, del, list } = await import('@vercel/blob')
    // Remove all existing versions to avoid conflicts
    const { blobs } = await list({ prefix: BLOB_KEY })
    if (blobs.length > 0) {
      await del(blobs.map(b => b.url))
    }
    await put(BLOB_KEY, JSON.stringify(projects), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    })
  } else {
    await mkdir(path.dirname(DATA_FILE), { recursive: true })
    await writeFile(DATA_FILE, JSON.stringify(projects, null, 2))
  }
}
