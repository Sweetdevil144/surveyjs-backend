const express = require('express');
const fs = require('fs');
const path = require('path');
var cors = require('cors');
var app = express();

app.use(cors());
const PORT = 3000;

app.get('/api/survey/:type', (req, res) => {
  const surveyType = req.params.type; // Get the type from the URL params

  let filePath;
  switch (surveyType) {
    case 'self':
      filePath = path.join(__dirname, 'assets/self.json');
      break;
    case 'individual':
      filePath = path.join(__dirname, 'assets/individual.json');
      break;
    case 'team':
      filePath = path.join(__dirname, 'assets/team.json');
      break;
    case 'peer':
      filePath = path.join(__dirname, 'assets/peer.json');
      break;
    default:
      return res.status(404).json({ error: 'Survey type not found' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the JSON file:', err);
      return res.status(500).json({ error: 'Failed to read the JSON file' });
    }

    res.json(JSON.parse(data));
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
