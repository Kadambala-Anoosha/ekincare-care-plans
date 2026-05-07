module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, concern } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!phone || !/^\+91\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/call_requests`, {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
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
      console.error('Supabase error:', response.status, await response.text());
      return res.status(500).json({ error: 'Failed to save' });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Handler exception:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};
