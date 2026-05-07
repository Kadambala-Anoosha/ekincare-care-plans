module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, concern } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!phone || !/^\+91\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Valid 10-digit phone number required' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(`${supabaseUrl}/rest/v1/call_requests`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      name: name.trim(),
      phone_number: phone,
      program_type: concern || 'general',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Supabase error:', response.status, errorText);
    return res.status(500).json({ error: 'Failed to save' });
  }

  return res.status(200).json({ ok: true });
};
