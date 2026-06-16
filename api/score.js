export default async function handler(req, res) {
  const { matchDate, live } = req.query;
  const API_KEY = 'c1804dae38204ce590d4b11d5eb02a75';

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // Football-data.org : CDM 2026 = compétition WC, code WC
    // Endpoint matchs par date
    const headers = { 'X-Auth-Token': API_KEY };

    let url;
    if (live === '1') {
      // Matchs en cours aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      url = `https://api.football-data.org/v4/matches?competitions=WC&dateFrom=${today}&dateTo=${today}&status=IN_PLAY,PAUSED,HALFTIME`;
    } else if (matchDate) {
      const d = matchDate.replace(/-/g, '-');
      url = `https://api.football-data.org/v4/matches?competitions=WC&dateFrom=${d}&dateTo=${d}`;
    } else {
      return res.status(400).json({ error: 'params manquants' });
    }

    const r = await fetch(url, { headers });

    if (!r.ok) {
      const err = await r.text();
      return res.status(r.status).json({ error: err });
    }

    const data = await r.json();

    // Normaliser la réponse au même format qu'avant
    // football-data retourne data.matches[]
    // On le convertit en {status:"success", response:{matches:[]}}
    const matches = (data.matches || []).map(m => ({
      id: m.id,
      home: {
        name: m.homeTeam.name,
        score: m.score?.fullTime?.home ?? m.score?.halfTime?.home ?? null
      },
      away: {
        name: m.awayTeam.name,
        score: m.score?.fullTime?.away ?? m.score?.halfTime?.away ?? null
      },
      status: {
        finished: m.status === 'FINISHED',
        started: ['IN_PLAY','PAUSED','HALFTIME','FINISHED'].includes(m.status),
        cancelled: m.status === 'CANCELLED',
        reason: { short: m.status === 'FINISHED' ? 'FT' : m.status }
      }
    }));

    return res.status(200).json({
      status: 'success',
      response: { matches }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
