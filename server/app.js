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

/* 게시판 목록 */
app.get('/api/posts/:board', (req, res) => {
  const board = req.params.board;
  res.json(posts.filter(p => p.board === board));
});

/* 글 작성 */
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

/* 댓글 */
app.post('/api/reply/:id', upload.single('image'), (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.send('no');

  post.replies.push({
    id: Date.now(),
    content: req.body.content || '',
    image: req.file ? '/uploads/' + req.file.filename : null
  });

  res.json({ ok: true });
});

/* 글 삭제 */
app.delete('/api/post/:id', (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.send('no');
  posts = posts.filter(p => p.id != req.params.id);
  res.send('ok');
});

/* 댓글 삭제 */
app.delete('/api/reply/:postId/:replyId', (req, res) => {
  if (req.body.pass !== ADMIN_PASS) return res.send('no');

  const post = posts.find(p => p.id == req.params.postId);
  if (!post) return res.send('no');

  post.replies = post.replies.filter(r => r.id != req.params.replyId);
  res.send('ok');
});

/* 🔥 핵심: /b /g 라우팅 */
app.get('/:board', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

/* 기본 */
app.get('/', (req, res) => {
  res.redirect('/b');
});

app.listen(PORT, () => {
  console.log('server running on ' + PORT);
});
