const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisGet(key) {
  const res = await fetch(`${UPSTASH_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });
  const data = await res.json();
  return data.result;
}

async function redisSet(key, value) {
  const res = await fetch(`${UPSTASH_URL}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ value: JSON.stringify(value) })
  });
  return res.ok;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Check auth
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token || !(await redisGet(`session:${token}`))) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const events = JSON.parse(await redisGet('family-events') || '[]')
    res.status(200).json(events)
  } else if (req.method === 'POST') {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token || !(await redisGet(`session:${token}`))) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { member, date, title, description } = req.body
    if (!member || !date || !title) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const events = JSON.parse(await redisGet('family-events') || '[]')
    const newEvent = { id: Date.now().toString(), member, date, title, description }
    events.push(newEvent)
    await redisSet('family-events', events)
    res.status(201).json(newEvent)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}