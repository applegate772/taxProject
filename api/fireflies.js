const axios = require('axios');

module.exports = async (req, res) => {
  console.log('Fireflies function invoked, method:', req.method);
  console.log('Request body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, email1, email2 } = req.body;
  console.log('Extracted params:', { apiKey: apiKey ? 'present' : 'missing', email1, email2 });
  
  if (!apiKey || !email1 || !email2) {
    return res.status(400).json({ error: 'Missing required field: apiKey, email1, or email2' });
  }

  const query = `
    query GetOrganizerTranscripts($hostEmail: String!) {
      transcripts(host_email: $hostEmail) {
        id
        title
        date
        host_email
        organizer_email
        participants
      }
    }
  `;

  try {
    console.log('Making request to Fireflies API');
    const response = await axios.post(
      'https://api.fireflies.ai/graphql',
      {
        query: query,
        variables: {
          hostEmail: email1
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log('Fireflies API response received');
    const transcripts = response.data.data.transcripts || [];
    const bothPresent = transcripts.filter(t =>
      t.participants.includes(email1) &&
      t.participants.includes(email2)
    );

    const result = bothPresent.map(transcript => ({
      id: transcript.id,
      date: new Date(parseInt(transcript.date)).toLocaleString(),
      participants: transcript.participants
    }));

    console.log('Returning result with', result.length, 'transcripts');
    res.json({ transcripts: result });
  } catch (error) {
    console.error('Error in fireflies function:', error);
    console.error('Error response data:', error.response?.data);
    res.status(500).json({ error: 'Failed to fetch transcripts', details: error.response?.data || error.message });
  }
}; 