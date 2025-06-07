const express = require('express');
const bodyParser = require('body-parser');
const { calculateTaxEstimate, formatTaxEstimate } = require('../taxes');
const { calculateStateTaxes, formatStateTaxEstimate } = require('../state');
const { createMondayDoc } = require('../monday');
const firefliesHandler = require('./fireflies');

const app = express();
app.use(bodyParser.json());

const statusMap = {
  'single': 'S',
  's': 'S',
  'married filing jointly (most common)': 'MFJ',
  'mfj': 'MFJ',
  'head of household': 'HOH',
  'hoh': 'HOH',
  'married filing separately (rare)': 'MFS',
  'mfs': 'MFS'
};

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
    // Map user-friendly status to internal code
    let statusInput = String(req.body.status).trim().toLowerCase();
    console.log('Original status:', req.body.status);
    console.log('Status input after trim/lowercase:', statusInput);
    const mappedStatus = statusMap[statusInput];
    console.log('Mapped status:', mappedStatus);
    if (!mappedStatus) {
      return res.status(400).json({
        error: `Invalid status value. Accepted values are: 'Single', 'Married Filing Jointly (Most Common)', 'Head Of Household', 'Married Filing Separately (Rare)', 'S', 'MFJ', 'HOH', 'MFS'.`
      });
    }
    const input = { ...req.body, status: mappedStatus };
    console.log('Input being passed to calculateTaxEstimate:', input);
    const result = calculateTaxEstimate(input);
    const format = (req.query.format || '').toLowerCase();
    const accept = (req.get('Accept') || '').toLowerCase();
    if (format === 'text' || accept === 'text/plain') {
      const formatted = formatTaxEstimate(result);
      res.type('text/plain').send(formatted);
    } else {
      res.json(result);
    }
  } catch (err) {
    console.log('Error in /calculate route:', err.message);
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
    let statusInput = String(req.body.status).trim().toLowerCase();
    const mappedStatus = statusMap[statusInput];
    if (!mappedStatus) {
      return res.status(400).json({
        error: `Invalid status value. Accepted values are: 'Single', 'Married Filing Jointly (Most Common)', 'Head Of Household', 'Married Filing Separately (Rare)', 'S', 'MFJ', 'HOH', 'MFS'.`
      });
    }
    const input = { ...req.body, status: mappedStatus };
    let result;
    try {
      result = calculateStateTaxes(input);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
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

app.post('/api/fireflies', (req, res) => {
  firefliesHandler(req, res);
});

module.exports = app;
module.exports.handler = (req, res) => app(req, res); 


