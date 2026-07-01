import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 })
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY
    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY manquant dans .env.local')
      return NextResponse.json({ error: 'Configuration email manquante.' }, { status: 500 })
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'tchoukakamgadavykarim@gmail.com'

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F4F4F5;font-family:'Segoe UI',system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:#18181B;padding:28px 36px;">
      <p style="color:#A1A1AA;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 8px;">Portfolio · Nouveau message</p>
      <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:700;">Message de ${name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
    </div>
    <div style="padding:32px 36px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:0 0 20px;vertical-align:top;width:80px;">
            <p style="color:#A1A1AA;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0;">Expéditeur</p>
          </td>
          <td style="padding:0 0 20px;">
            <p style="color:#18181B;font-size:15px;font-weight:600;margin:0;">${name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <p style="color:#71717A;font-size:13px;margin:4px 0 0;">${email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid #F4F4F5;margin:4px 0 24px;">
      <p style="color:#A1A1AA;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Message</p>
      <p style="color:#18181B;font-size:15px;line-height:1.75;margin:0;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    </div>
    <div style="background:#F9F9F7;padding:20px 36px;border-top:1px solid #F4F4F5;">
      <p style="color:#A1A1AA;font-size:12px;margin:0;">Répondre directement à <a href="mailto:${email}" style="color:#7C3AED;">${email}</a></p>
    </div>
  </div>
</body>
</html>`

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Portfolio Contact', email: senderEmail },
        to: [{ email: 'tchoukakamgadavykarim@gmail.com', name: 'Davy Karim' }],
        replyTo: { email, name },
        subject: `Portfolio — Message de ${name}`,
        htmlContent,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Brevo error:', err)
      return NextResponse.json({ error: "Erreur lors de l'envoi. Réessayez plus tard." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
