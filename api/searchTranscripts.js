const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email1, email2 } = req.body;
  if (!email1 || !email2) {
    return res.status(400).json({ error: 'Missing required field: email1 or email2' });
  }

  const filePath = path.join(__dirname, '../fireflies_transcripts_month.json');
  let transcripts;
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    transcripts = JSON.parse(fileData);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to read transcripts file', details: err.message });
  }

  // If the file is an array at the root, use it directly; if it's an object with a property, try to find the array
  let transcriptArray = Array.isArray(transcripts) ? transcripts : (transcripts.transcripts || []);

  const matches = transcriptArray.filter(t =>
    t.participants &&
    t.participants.includes(email1) &&
    t.participants.includes(email2)
  ).map(t => t.id);

  res.json({ ids: matches });
}; 