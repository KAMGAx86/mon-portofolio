/**
 * Storage abstraction — automatic switch between:
 *   Local dev  → data/projects.json  (filesystem)
 *   Vercel     → Vercel Blob  (projects.json in blob store)
 */

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
    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!res.ok) return []
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
    const { put } = await import('@vercel/blob')
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
