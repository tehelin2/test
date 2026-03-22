import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body
    // Simple hardcoded auth for 4 members
    const users = {
      Emilia: 'helin2026',
      Tuomas: 'helin2026',
      Mauno: 'helin2026',
      Leevi: 'helin2026'
    }

    if (users[username] === password) {
      const token = Math.random().toString(36)
      await kv.set(`session:${token}`, username, { ex: 3600 }) // 1 hour
      res.status(200).json({ token })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}