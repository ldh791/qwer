const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();

// 🔥 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// 🔥 static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../client')));

let posts = [];

// 🔥 핵심: multer 먼저!
app.post('/api/posts', upload.single('image'), (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const post = {
    id: Date.now(),
    content: req.body.content ? req.body.content : '',
    image: req.file ? '/uploads/' + req.file.filename : null
  };

  posts.unshift(post);
  res.json(post);
});

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
