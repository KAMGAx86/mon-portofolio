import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

function generateToken(password: string): string {
  const secret = process.env.ADMIN_SECRET || 'portfolio-secret-2026'
  return createHmac('sha256', secret).update(password).digest('hex')
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    const token = generateToken(ADMIN_PASSWORD)
    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_token', '', { maxAge: 0, path: '/' })
  return response
}

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || ''
  const match = cookie.match(/admin_token=([^;]+)/)
  const token = match?.[1]
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
  const expectedToken = generateToken(ADMIN_PASSWORD)
  return NextResponse.json({ authenticated: token === expectedToken })
}
