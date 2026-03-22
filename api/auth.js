const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;


/*
async function redisSetEx(key, value, ex) {
  const res = await fetch(`${UPSTASH_URL}/setex/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ value, ex })
  });
  return res.ok;
}
*/

async function redisSetEx(key, value, ex) {
  // Upstash REST API:ssa syntaksi on /setex/key/seconds/value
  const res = await fetch(`${UPSTASH_URL}/setex/${key}/${ex}`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${UPSTASH_TOKEN}` 
    },
    body: JSON.stringify(value) // Lähetetään vain itse arvo (username)
  });
  return res.ok;
}

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
      await redisSetEx(`session:${token}`, username, 3600) // 1 hour
      res.status(200).json({ token })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}