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
    headers: { 
      Authorization: `Bearer ${UPSTASH_TOKEN}` 
      // Emme tarvitse Content-Type: application/json, 
      // koska lähetämme arvon suoraan stringinä
    },
    body: JSON.stringify(value) // Tämä tallentaa koko taulukon yhtenä stringinä
  });
  return res.ok;
}
/*
async function redisSet(key, value) {
  const res = await fetch(`${UPSTASH_URL}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ value: JSON.stringify(value) })
  });
  return res.ok;
}

*/

export default async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'DELETE') {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token || !(await redisGet(`session:${token}`))) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const events = JSON.parse(await redisGet('family-events') || '[]')
    const index = events.findIndex(e => e.id === id)
    if (index === -1) {
      return res.status(404).json({ error: 'Event not found' })
    }

    events.splice(index, 1)
    await redisSet('family-events', events)
    res.status(200).json({ message: 'Deleted' })
  } else {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}