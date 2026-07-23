'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 8080;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const CONTENT_PATH = path.join(DATA_DIR, 'content.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const SEED_PATH = path.join(__dirname, 'seed', 'content.json');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@a-mart.art';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH
  || '$2a$10$Ed0lc15PRE3Sg/5BTjZWWelpZKRfg1CQdDzFWYYo5H9xyaZMtbhJu'; // Marcela26@
const SESSION_SECRET = process.env.SESSION_SECRET || 'koralmarea-dev-secret-change-me';

if (!process.env.DATA_DIR) {
  console.warn('[warn] DATA_DIR not set — using local ./data. On Railway, attach a volume mounted at this path or content edits will be lost on redeploy.');
}
if (!process.env.SESSION_SECRET || !process.env.ADMIN_PASSWORD_HASH) {
  console.warn('[warn] Using built-in default SESSION_SECRET/ADMIN_PASSWORD_HASH. Set your own via Railway environment variables for production use.');
}

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(CONTENT_PATH)) {
  fs.copyFileSync(SEED_PATH, CONTENT_PATH);
}

function readContent() {
  return JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'));
}
function writeContent(data) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2));
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, crypto.randomBytes(16).toString('hex') + ext);
    }
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(path.extname(file.originalname).toLowerCase());
    cb(ok ? null : new Error('Formato de imagen no soportado'), ok);
  }
});

const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8
  }
}));

function requireAuth(req, res, next) {
  if (req.session && req.session.admin) return next();
  res.status(401).json({ error: 'No autenticado' });
}

// ---------- auth ----------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });
  if (email.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase()) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  if (!bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  req.session.admin = { email: ADMIN_EMAIL };
  res.json({ ok: true });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/session', (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.admin) });
});

// ---------- public content ----------
app.get('/api/content', (req, res) => {
  res.json(readContent());
});

// ---------- admin content management ----------
app.put('/api/admin/services', requireAuth, (req, res) => {
  const data = readContent();
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Se esperaba un arreglo' });
  data.services = req.body;
  writeContent(data);
  res.json({ ok: true });
});

app.put('/api/admin/skills', requireAuth, (req, res) => {
  const data = readContent();
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Se esperaba un arreglo' });
  data.skills = req.body;
  writeContent(data);
  res.json({ ok: true });
});

app.put('/api/admin/stats', requireAuth, (req, res) => {
  const data = readContent();
  if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Se esperaba un arreglo' });
  data.stats = req.body;
  writeContent(data);
  res.json({ ok: true });
});

app.put('/api/admin/whatsapp', requireAuth, (req, res) => {
  const data = readContent();
  const { number, message } = req.body || {};
  data.whatsapp = { number: number || '', message: message || '' };
  writeContent(data);
  res.json({ ok: true });
});

app.put('/api/admin/contact', requireAuth, (req, res) => {
  const data = readContent();
  const { email, phone, social } = req.body || {};
  data.contact = { email: email || '', phone: phone || '', social: social || '' };
  writeContent(data);
  res.json({ ok: true });
});

// portfolio CRUD
app.post('/api/admin/portfolio', requireAuth, (req, res) => {
  const data = readContent();
  const item = req.body || {};
  item.id = crypto.randomBytes(6).toString('hex');
  data.portfolio.push(item);
  writeContent(data);
  res.json(item);
});

app.put('/api/admin/portfolio/:id', requireAuth, (req, res) => {
  const data = readContent();
  const idx = data.portfolio.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  data.portfolio[idx] = { ...data.portfolio[idx], ...req.body, id: req.params.id };
  writeContent(data);
  res.json(data.portfolio[idx]);
});

app.delete('/api/admin/portfolio/:id', requireAuth, (req, res) => {
  const data = readContent();
  const idx = data.portfolio.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  data.portfolio.splice(idx, 1);
  writeContent(data);
  res.json({ ok: true });
});

app.post('/api/admin/portfolio/:id/reorder', requireAuth, (req, res) => {
  const data = readContent();
  const { direction } = req.body || {};
  const idx = data.portfolio.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'No encontrado' });
  const swapWith = direction === 'up' ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= data.portfolio.length) return res.json({ ok: true });
  [data.portfolio[idx], data.portfolio[swapWith]] = [data.portfolio[swapWith], data.portfolio[idx]];
  writeContent(data);
  res.json({ ok: true });
});

app.post('/api/admin/upload', requireAuth, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Falta el archivo' });
    res.json({ url: '/uploads/' + req.file.filename });
  });
});

// ---------- static ----------
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '30d' }));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'index.html')));
app.get('/admin/*', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'index.html')));
app.use(express.static(path.join(__dirname, 'site')));

app.listen(PORT, () => {
  console.log(`Koral&Marea site listening on port ${PORT}`);
});
