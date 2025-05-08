const express = require('express');
const bodyParser = require('body-parser');
const { calculateTaxEstimate, formatTaxEstimate } = require('../taxes');

const app = express();
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

module.exports = app;
module.exports.handler = (req, res) => app(req, res); 