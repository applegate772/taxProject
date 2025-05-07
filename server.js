const express = require('express');
const bodyParser = require('body-parser');
const { calculateTaxEstimate } = require('./taxes');

const app = express();
const PORT = process.env.PORT || 3000;

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
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 