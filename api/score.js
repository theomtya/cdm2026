export default async function handler(req, res) {
  const { matchDate, live } = req.query;

  const RAPID_KEY = '3527d4b49dmsh3656d1c0b82001ap1be5adjsn437cb8a38f48';
  const HOST = 'free-api-live-football-data.p.rapidapi.com';

  const headers = {
    'Content-Type': 'application/json',
    'x-rapidapi-host': HOST,
    'x-rapidapi-key': RAPID_KEY,
  };

  try {
    let url;
    if (live === '1') {
      url = 'https://free-api-live-football-data.p.rapidapi.com/football-current-live';
    } else if (matchDate) {
      const dateFormatted = matchDate.replace(/-/g, '');
      url = `https://free-api-live-football-data.p.rapidapi.com/football-get-matches-by-date?date=${dateFormatted}`;
    } else {
      return res.status(400).json({ error: 'params manquants' });
    }

    const response = await fetch(url, { headers });
    const data = await response.json();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', live === '1' ? 'no-cache' : 's-maxage=60');
    return res.status(200).json(data);

  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: err.message });
  }
}
