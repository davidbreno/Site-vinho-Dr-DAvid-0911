const express = require("express");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");

const app = express();
const PORT = 3000;

// CORS configurado para permitir requisições do frontend em desenvolvimento
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));

// aumentar o limite do body parser para permitir HTML maiores ao gerar PDFs
app.use(bodyParser.json({ limit: '10mb' }));
// Frontend roda em Vite (porta separada), não precisa servir aqui
// app.use(express.static(path.join(__dirname, "../frontend/build")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Puppeteer será usado para geração de PDF server-side
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch (err) {
  console.warn('puppeteer não encontrado. Instale as dependências em legacy-backend e rode npm install.');
}

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  console.log('✅ Health check recebido');
  res.json({ status: 'ok', message: 'Servidor rodando' });
});

// Helper para formatar observações (quebra de linha em <br>)
Handlebars.registerHelper('observationsFormatted', function(obs) {
  if (!obs) return '';
  return obs.replace(/\n/g, '<br>').replace(/\r/g, '');
});

// Helper para formatar motivo (similar)
Handlebars.registerHelper('reasonFormatted', function(reason) {
  if (!reason) return '';
  return reason.replace(/\n/g, '<br>').replace(/\r/g, '');
});

// Função auxiliar para renderizar template Handlebars
function renderTemplate(templateName, data) {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template não encontrado: ${templateName}`);
  }
  const templateContent = fs.readFileSync(templatePath, 'utf-8');
  const template = Handlebars.compile(templateContent);
  return template(data);
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

// ===== ENDPOINT DE GERAÇÃO DE PDF =====
// Suporta dois modos:
// 1. template + data: { template: 'prescription', data: {...} }
// 2. html direto: { html: '<html>...</html>' }
app.post('/generate-pdf', async (req, res) => {
  console.log('📥 Requisição POST /generate-pdf recebida');
  console.log('Body:', JSON.stringify(req.body).substring(0, 200));
  
  if (!puppeteer) {
    return res.status(500).json({ error: 'puppeteer não instalado. Rode npm install em legacy-backend com PUPPETEER_SKIP_DOWNLOAD desligado ou use Chrome local.' });
  }

  try {
    const { template, data, html, options } = req.body || {};
    let htmlToRender = html;

    // Se enviou template + data, renderiza o template com Handlebars
    if (template && data) {
      try {
        console.log(`🎨 Renderizando template: ${template}`);
        htmlToRender = renderTemplate(template, data);
        console.log(`✅ Template renderizado com sucesso`);
      } catch (err) {
        return res.status(400).json({ error: `Erro ao renderizar template: ${err.message}` });
      }
    }

    if (!htmlToRender) {
      return res.status(400).json({ error: 'Envie `html` ou `template` + `data` no body.' });
    }

    // Renderiza HTML em PDF usando Puppeteer
    const launchConfig = {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      headless: 'new'
    };

    // Se PUPPETEER_SKIP_DOWNLOAD está ativado, tenta usar Chrome do sistema
    if (process.env.PUPPETEER_SKIP_DOWNLOAD === 'true') {
      // Caminho comum do Chrome em Windows
      const possibleChromes = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.CHROME_PATH // fallback para env var customizada
      ];
      
      let chromeFound = null;
      for (const chromePath of possibleChromes) {
        if (chromePath && fs.existsSync(chromePath)) {
          chromeFound = chromePath;
          break;
        }
      }

      if (chromeFound) {
        launchConfig.executablePath = chromeFound;
      } else {
        return res.status(500).json({ 
          error: 'Chromium não encontrado. Instale Google Chrome ou remova PUPPETEER_SKIP_DOWNLOAD para download automático.',
          hint: 'Instale Google Chrome e defina a env var: set CHROME_PATH=C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        });
      }
    }

    const browser = await puppeteer.launch(launchConfig);
    const page = await browser.newPage();
    await page.setContent(htmlToRender, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf(
      Object.assign(
        { format: 'A4', printBackground: true, margin: { top: '0.5cm', bottom: '0.5cm', left: '0.5cm', right: '0.5cm' } },
        options || {}
      )
    );
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
      'Content-Length': pdfBuffer.length
    });
    return res.send(pdfBuffer);
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    console.error('Stack:', err.stack);
    return res.status(500).json({ error: err.message, stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined });
  }
});

// rota coringa para o React (deve vir por último)
// Comentada porque o frontend roda em uma porta separada (Vite)
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
// });

// Rota 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado. Use POST /generate-pdf para gerar PDFs.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📄 Templates disponíveis: prescription, certificate, anamnesis`);
  console.log(`✨ POST /generate-pdf aceita: { template: 'name', data: {...} } ou { html: '<html>...</html>' }`);
});
