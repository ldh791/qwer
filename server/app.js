const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

let posts = [];

// API
app.get('/api/posts', (req, res) => res.json(posts));

app.post('/api/posts', (req, res) => {
  const post = {
    id: Date.now(),
    content: req.body.content || ''
  };
  posts.unshift(post);
  res.json(post);
});

// 🔥 프론트 연결 핵심
app.use(express.static(path.join(__dirname, '../client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));