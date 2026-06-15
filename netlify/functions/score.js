exports.handler = async (event) => {
  const { matchDate, live } = event.queryStringParameters || {};

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
      url = `https://free-api-live-football-data.p.rapidapi.com/football-get-matches-by-date?date=${matchDate}`;
    } else {
      return { statusCode: 400, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'params manquants' }) };
    }

    const res = await fetch(url, { headers });
    const data = await res.json();

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 500, headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: err.message }) };
  }
};
