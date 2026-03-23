const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use('/uploads', express.static('uploads'));

const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 10000;
const ADMIN_PASS = "1234";

/* ===== 임시 DB ===== */
let posts = [];

/* ===== 글 목록 ===== */
app.get('/api/posts/:board', (req, res) => {
  const board = req.params.board;
  const result = posts.filter(p => p.board === board);
  res.json(result);
});

/* ===== 글 작성 ===== */
app.post('/api/post/:board', upload.single('image'), (req, res) => {
  const board = req.params.board;

  const post = {
    id: Date.now(),
    board,
    content: req.body.content,
    image: req.file ? '/uploads/' + req.file.filename : null,
    replies: []
  };

  posts.unshift(post);
  res.json({ ok: true });
});

/* ===== 댓글 작성 ===== */
app.post('/api/reply/:id', upload.single('image'), (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).send('no');

  post.replies.push({
    id: Date.now(),
    content: req.body.content,
    image: req.file ? '/uploads/' + req.file.filename : null
  });

  res.json({ ok: true });
});

/* ===== 글 삭제 ===== */
app.delete('/api/post/:id', (req, res) => {
  if (req.body.pass !== ADMIN_PASS) {
    return res.status(403).send('wrong');
  }

  posts = posts.filter(p => p.id != req.params.id);
  res.send('ok');
});

/* ===== 댓글 삭제 ===== */
app.delete('/api/reply/:postId/:replyId', (req, res) => {
  if (req.body.pass !== ADMIN_PASS) {
    return res.status(403).send('wrong');
  }

  const post = posts.find(p => p.id == req.params.postId);
  if (!post) return res.send('no');

  post.replies = post.replies.filter(r => r.id != req.params.replyId);
  res.send('ok');
});

/* ===== 기본 페이지 ===== */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.listen(PORT, () => {
  console.log('server running on ' + PORT);
});
