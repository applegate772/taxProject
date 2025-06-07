const axios = require('axios');

const HOST_EMAIL = 'laxman@docwealth.io';

async function getOrganizerTranscriptsAxios(hostEmail, apiKey) {
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
    const response = await axios.post(
      'https://api.fireflies.ai/graphql',
      {
        query: query,
        variables: {
          hostEmail: hostEmail
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    return response.data.data.transcripts;
  } catch (error) {
    console.error('Error fetching transcripts:', error.response?.data || error.message);
    return null;
  }
}

module.exports = { getOrganizerTranscriptsAxios };