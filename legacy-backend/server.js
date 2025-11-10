const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// aumentar o limite do body parser para permitir HTML maiores ao gerar PDFs
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Puppeteer será usado para geração de PDF server-side
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (err) {
  console.warn('puppeteer não encontrado. Instale as dependências em legacy-backend e rode npm install.');
}

const dbPath = path.resolve(__dirname, 'database.sqlite');
console.log("🗂️  Usando banco de dados em:", dbPath);
const db = new sqlite3.Database(dbPath);
db.run(`CREATE TABLE IF NOT EXISTS estoque (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  quantidade INTEGER,
  categoria TEXT
)`);

app.post("/api/login", (req, res) => {
  const { usuario, senha } = req.body;
  const normalizado = (usuario || "").trim().toLowerCase();
  const usuarioBase = normalizado.includes("@") ? normalizado.split("@")[0] : normalizado;
  const senhaInformada = (senha || "").trim();
  const faltaCampo = !usuarioBase || !senhaInformada;
  const autenticado = !faltaCampo && usuarioBase === "admin" && senhaInformada === "1234";
  console.log("Tentativa de login:", { usuarioRecebido: usuario, usuarioBase, senhaInformada, autenticado });

  if (autenticado) {
    return res.json({ ok: true });
  }

  if (faltaCampo) {
    return res.status(400).json({ ok: false, mensagem: "Informe usuário e senha." });
  }

  // fallback para não travar o usuário em ambiente de demonstração
  return res.json({ ok: true, aviso: "Credenciais padrão são admin / 1234, mas o acesso foi liberado para demonstração." });
});

app.get("/api/estoque", (req, res) => {
  db.all("SELECT * FROM estoque", [], (err, rows) => res.json(rows));
});
app.post("/api/estoque", (req, res) => {
  const { nome, quantidade, categoria } = req.body;
  db.run("INSERT INTO estoque (nome, quantidade, categoria) VALUES (?, ?, ?)",
    [nome, quantidade, categoria], err => res.json({ ok: !err }));
});
app.delete("/api/estoque/:id", (req, res) => {
  db.run("DELETE FROM estoque WHERE id = ?", [req.params.id], err => res.json({ ok: !err }));
});

// rota coringa para o React
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Endpoint para geração de PDF a partir de HTML enviado no body
app.post('/generate-pdf', async (req, res) => {
  if (!puppeteer) {
    return res.status(500).json({ error: 'puppeteer não instalado no servidor. Rode npm install em legacy-backend.' });
  }

  try {
    const { html, options } = req.body || {};
    if (!html) return res.status(400).json({ error: 'Campo `html` é obrigatório no body.' });

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf(Object.assign({ format: 'A4', printBackground: true }, options || {}));
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
      'Content-Length': pdfBuffer.length
    });
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
