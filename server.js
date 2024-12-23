const express = require('express');
const fs = require('fs');
const path = require('path');
var cors = require('cors');
var app = express();

app.use(cors());
const PORT = 3000;
const names = ["John Doe", "Jane Smith", "Samuel Jackson", "Lisa Wong"];

const emojiNames = ['smiley_1', 'smiley_2', 'smiley_3', 'smiley_4', 'smiley_5'];

const generateRandomImage = () => {
  return `https://picsum.photos/42/42?random=${Math.floor(Math.random() * 50)}`;
};

app.get("/test", (req, res) => {
  return res.json({success:true,message:"Hello World !!"})
})

// Route to serve dynamic leaders
app.get('/api/leaders', (req, res) => {
  const leaders = [];
  for (let i = 0; i < 4; i++) {
    leaders.push({
      name: names[i],
      imageUrl: generateRandomImage()
    });
  }
  res.json({ leaders });
});

// Route to serve emojis
app.get('/api/emojis', (req, res) => {
  const emojis = emojiNames.map((emoji, index) => ({
    name: `Smiley ${index + 1}`,
    imageUrl: `/assets/emojis/${emoji}.svg`
  }));
  res.json({ emojis });
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Route to serve the survey JSONs
app.get('/api/survey/:type', (req, res) => {
  const surveyType = req.params.type;

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
