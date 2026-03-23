const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '../client')));

const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 10000;
const ADMIN_PASS = "1234";

let posts = [];

/* API */
app.get('/api/posts/:board', (req, res) => {
  res.json(posts.filter(p => p.board === req.params.board));
});

app.post('/api/post/:board', upload.single('image'), (req, res) => {
  const post = {
    id: Date.now(),
    board: req.params.board,
    content: req.body.content || '',
    image: req.file ? '/uploads/' + req.file.filename : null,
    replies: []
  };
  posts.unshift(post);
  res.json({ ok: true });
});

/* PAGES */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/:board', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/board.html'));
});

app.listen(PORT, () => console.log('server running ' + PORT));
