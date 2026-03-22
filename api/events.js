import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Check auth
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token || !(await kv.get(`session:${token}`))) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const events = await kv.get('family-events') || []
    res.status(200).json(events)
  } else if (req.method === 'POST') {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token || !(await kv.get(`session:${token}`))) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { member, date, title, description } = req.body
    if (!member || !date || !title) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const events = await kv.get('family-events') || []
    const newEvent = { id: Date.now().toString(), member, date, title, description }
    events.push(newEvent)
    await kv.set('family-events', events)
    res.status(201).json(newEvent)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}