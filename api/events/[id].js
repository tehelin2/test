import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'DELETE') {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token || !(await kv.get(`session:${token}`))) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const events = await kv.get('family-events') || []
    const index = events.findIndex(e => e.id === id)
    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' })
    }

    events.splice(index, 1)
    await kv.set('family-events', events)
    res.status(200).json({ message: 'Deleted' })
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}