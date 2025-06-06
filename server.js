const express = require('express');
const bodyParser = require('body-parser');
const { calculateTaxEstimate, formatTaxEstimate } = require('./taxes');
const { calculateStateTaxes, formatStateTaxEstimate } = require('./state');
const { createMondayDoc } = require('./monday');

const app = express();
const PORT = process.env.PORT || process.argv[2] || 3003;

app.use(bodyParser.json());

app.post('/calculate', (req, res) => {
  try {
    const requiredFields = [
      'status', 'quarter', 'qGross', 'qExp',
      'w2SCorpYTD', 'w2OtherYTD', 'withYTD', 'otherInc'
    ];
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    const result = calculateTaxEstimate(req.body);
    const format = (req.query.format || '').toLowerCase();
    const accept = (req.get('Accept') || '').toLowerCase();
    if (format === 'text' || accept === 'text/plain') {
      const formatted = formatTaxEstimate(result);
      res.type('text/plain').send(formatted);
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/calculate-state', (req, res) => {
  try {
    const requiredFields = [
      'state', 'status', 'quarter', 'qGross', 'qExp',
      'w2SCorpYTD', 'w2OtherYTD', 'withYTD', 'otherInc'
    ];
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    const result = calculateStateTaxes(req.body);
    const format = (req.query.format || '').toLowerCase();
    const accept = (req.get('Accept') || '').toLowerCase();
    if (format === 'text' || accept === 'text/plain') {
      const formatted = formatStateTaxEstimate(result);
      res.type('text/plain').send(formatted);
    } else {
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/create-monday-doc', async (req, res) => {
  const { accessToken, itemId, columnId, clientContent } = req.body;
  if (!accessToken || !itemId || !columnId || !clientContent) {
    return res.status(400).json({ error: 'Missing required field: accessToken, itemId, columnId, or clientContent' });
  }
  try {
    const docId = await createMondayDoc(accessToken, itemId, columnId, clientContent);
    res.json({ success: true, docId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 

