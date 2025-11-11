require('dotenv').config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configurado para permitir requisições do frontend em desenvolvimento
const defaultOrigins = ['http://localhost:3000','http://localhost:5173','http://localhost:5174','http://127.0.0.1:5173','http://127.0.0.1:5174'];
const envOrigins = (process.env.FRONTEND_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const allowedOrigins = envOrigins.length ? envOrigins : defaultOrigins;
app.use(cors({
  origin: (origin, callback) => {
    // permite chamadas sem origin (ex.: curl/postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // permitir IPs locais na rede: http://192.168.x.x:5173
    const ipLocalDev = /^http:\/\/192\.168\.[0-9.]+:5173$/;
    if (ipLocalDev.test(origin)) return callback(null, true);
    return callback(new Error(`CORS bloqueado para origem: ${origin}`));
  },
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

// ===== HEALTH & ROOT =====
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="pt-BR"><head><meta charset="utf-8" />
  <title>Backend Dental</title>
  <style>body{font-family:system-ui,Arial,sans-serif;padding:40px;background:#f9f7f5;color:#392f28}code{background:#eee;padding:2px 4px;border-radius:4px}a{color:#7a2b45}</style></head>
  <body>
    <h1>✅ Backend ativo</h1>
    <p>Use <code>POST /generate-pdf</code> com <code>{ template, data }</code> ou <code>{ html }</code> para gerar PDFs.</p>
    <p>Health JSON: <a href="/health">/health</a></p>
    <p>Estoque: <a href="/api/estoque">/api/estoque</a></p>
  </body></html>`);
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor rodando', timestamp: new Date().toISOString() });
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

const dbPath = path.resolve(__dirname, process.env.DB_PATH || 'database.sqlite');
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
  // Em produção, retornar 401 quando credenciais inválidas
  return res.status(401).json({ ok: false, mensagem: "Credenciais inválidas." });
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
  console.log('📦 DADOS RECEBIDOS:', JSON.stringify(req.body, null, 2).substring(0, 500));
  console.log('=====================================');
  
  const layoutMode = (req.body && (req.body.layoutMode || req.body.backgroundMode)) || 'overlay-html'; // 'overlay-html' | 'background-text'
  console.log('🎨 layoutMode =', layoutMode);

  try {
    const { template, data, html, options } = req.body || {};
    let htmlToRender = html;

    // Se enviou template + data, renderiza o template com Handlebars
    if (template && data) {
      try {
        console.log(`🎨 Renderizando template: ${template}`);
        console.log(`   Paciente: ${data.patientName || 'SEM NOME'}`);
        console.log(`   Dados completos:`, JSON.stringify(data, null, 2).substring(0, 300));
        htmlToRender = renderTemplate(template, data);
        console.log(`✅ Template renderizado com sucesso`);
      } catch (err) {
        return res.status(400).json({ error: `Erro ao renderizar template: ${err.message}` });
      }
    }

    // Ramo alternativo: escrever texto diretamente sobre o PDF modelo (sem Puppeteer)
    if (template && data && layoutMode === 'background-text') {
      try {
        const layoutPath = path.join(__dirname, 'public', 'assets', 'arte para documentos.pdf');
        if (!fs.existsSync(layoutPath)) {
          return res.status(400).json({ error: 'Arquivo de layout não encontrado em public/assets/arte para documentos.pdf' });
        }

    const layoutBytes = fs.readFileSync(layoutPath);
    // Carrega PDF de layout e copia a primeira página para manter fidelidade exata (copyPages > embedPdf)
    const layoutDoc = await PDFDocument.load(layoutBytes);
    const doc = await PDFDocument.create();
    const [layoutPage] = await doc.copyPages(layoutDoc, [0]);
    doc.addPage(layoutPage);
    const page = doc.getPage(0);
    console.log(`🧩 Layout carregado (copyPages): ${page.getWidth()}x${page.getHeight()} px`);

    const w = page.getWidth();
    const h = page.getHeight();
        const px = (p) => p * w; // percentual -> px
        const py = (p) => p * h;

        // ===== Utilidades para calibração e layout =====
        const debugGrid = !!(req.body && req.body.debugGrid);
        function drawGrid(step = 0.1) {
          const gray = rgb(0.8, 0.8, 0.8);
          const small = 8;
          for (let p = 0; p <= 1.00001; p += step) {
            // linhas verticais
            page.drawLine({ start: { x: px(p), y: 0 }, end: { x: px(p), y: h }, color: gray, opacity: 0.3, thickness: 0.5 });
            // linhas horizontais
            page.drawLine({ start: { x: 0, y: py(p) }, end: { x: w, y: py(p) }, color: gray, opacity: 0.3, thickness: 0.5 });
          }
          const fontDbg = fontBold || font;
          for (let p = 0; p <= 1.00001; p += step) {
            const label = (p * 100).toFixed(0) + '%';
            page.drawText(label, { x: px(p) + 2, y: h - 10, size: small, font: fontDbg, color: gray });
            page.drawText(label, { x: 2, y: py(p) + 2, size: small, font: fontDbg, color: gray });
          }
        }

        // (Opcional) Cobrir bloco do layout antigo – só se vier coords.doctorBlock explicitamente
        const coords = req.body && req.body.coords ? req.body.coords : {};
        if (coords.doctorBlock) {
          const { x, y, width, height } = coords.doctorBlock;
          page.drawRectangle({ x: px(x), y: py(y), width: px(width), height: py(height), color: rgb(1,1,1), fillColor: rgb(1,1,1) });
          console.log('🧼 Cobertura aplicada em doctorBlock', coords.doctorBlock);
        }

        const font = await doc.embedFont(StandardFonts.Helvetica);
        const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

        function write(text, xPct, yPct, size = 12, color = rgb(0,0,0), bold = false) {
          if (!text) return;
          page.drawText(String(text), { x: px(xPct), y: py(yPct), size, font: bold ? fontBold : font, color });
        }

        // ====== Suporte a LOGO (identidade visual) ======
        async function drawLogoIfAvailable() {
          try {
            const logoCfg = (req.body && req.body.logo) || {};
            let logoBytes = null;
            // 1) dataUrl (base64) tem prioridade
            if (logoCfg.dataUrl && typeof logoCfg.dataUrl === 'string') {
              const match = logoCfg.dataUrl.match(/^data:(image\/(png|jpeg|jpg));base64,(.*)$/i);
              if (match) {
                logoBytes = Buffer.from(match[3], 'base64');
              }
            }
            // 2) caminho relativo ao assets
            if (!logoBytes && logoCfg.path && typeof logoCfg.path === 'string') {
              const safeName = path.basename(logoCfg.path); // evita path traversal
              const tryPath = path.join(__dirname, 'public', 'assets', safeName);
              if (fs.existsSync(tryPath)) {
                logoBytes = fs.readFileSync(tryPath);
              }
            }
            // 3) fallback: public/assets/logo.png
            if (!logoBytes) {
              const defaultLogo = path.join(__dirname, 'public', 'assets', 'logo.png');
              if (fs.existsSync(defaultLogo)) {
                logoBytes = fs.readFileSync(defaultLogo);
              }
            }
            if (!logoBytes) return; // sem logo, sai silenciosamente

            // Detecta tipo e incorpora
            let img;
            if (logoBytes[0] === 0x89 && logoBytes[1] === 0x50) {
              // PNG
              img = await doc.embedPng(logoBytes);
            } else {
              // Tenta como JPEG
              img = await doc.embedJpg(logoBytes);
            }

            const pos = (coords && coords.logo) ? coords.logo : { x: 0.08, y: 0.90, width: 0.18 };
            const targetW = pos.width ? px(pos.width) : img.width;
            const scale = targetW / img.width;
            const targetH = (pos.height ? py(pos.height) : img.height * scale);
            const x = px(pos.x || 0);
            const y = py(pos.y || 0);
            page.drawImage(img, { x, y, width: targetW, height: targetH });
            console.log('🖼️  Logo desenhada em', pos);
          } catch (e) {
            console.warn('⚠️  Falha ao desenhar logo:', e.message);
          }
        }

        // Mapa de posições pode ser extraído para layoutConfig.js para facilitar edição sem tocar na lógica.
        // Se existir legacy-backend/layoutConfig.js com module.exports = { positions: {...} } será usado.
        let positions;
        const externalConfigPath = path.join(__dirname, 'layoutConfig.js');
        if (fs.existsSync(externalConfigPath)) {
          try {
            const loaded = require(externalConfigPath);
            if (loaded && loaded.positions) {
              positions = loaded.positions;
              console.log('📐 Usando posições de layoutConfig.js');
            }
          } catch (e) {
            console.warn('⚠️  Falha ao carregar layoutConfig.js, usando posições padrão. Motivo:', e.message);
          }
        }
        if (!positions) {
          positions = {
            certificate: {
              city: { x: 0.78, y: 0.90, size: 12, color: rgb(0.25,0.25,0.25) },
              date: { x: 0.78, y: 0.875, size: 11, color: rgb(0.35,0.35,0.35) },
              doctorName: { x: 0.30, y: 0.78, size: 14, color: rgb(0.00,0.24,0.48), bold: true },
              doctorTitle: { x: 0.34, y: 0.765, size: 10, color: rgb(0.35,0.35,0.35) },
              doctorCro: { x: 0.36, y: 0.745, size: 10, color: rgb(0.35,0.35,0.35) },
              body: { x: 0.14, y: 0.62, width: 0.72, size: 11, lineGap: 0.025 },
              footer: { x: 0.22, y: 0.12, size: 10, color: rgb(0.45,0.45,0.45) }
            },
            prescription: {
              title: { x: 0.45, y: 0.88, size: 16, color: rgb(0,0.24,0.48), bold: true },
              list: { x: 0.12, y: 0.80, width: 0.76, size: 11, lineGap: 0.028, blockGap: 0.01 },
              doctorName: { x: 0.30, y: 0.20, size: 12, color: rgb(0,0.24,0.48), bold: true },
              doctorCro: { x: 0.34, y: 0.185, size: 10, color: rgb(0.35,0.35,0.35) }
            },
            anamnesis: {
              title: { x: 0.44, y: 0.90, size: 16, color: rgb(0,0.24,0.48), bold: true },
              patientName: { x: 0.12, y: 0.84, size: 11 },
              patientAge: { x: 0.12, y: 0.815, size: 11 },
              patientPhone: { x: 0.12, y: 0.79, size: 11 }
            }
          };
          console.log('📐 Usando posições padrão embutidas');
        }

        function getPos(tpl, key) {
          const base = positions[tpl] && positions[tpl][key] ? positions[tpl][key] : null;
          const overrides = (coords && coords[tpl] && coords[tpl][key]) ? coords[tpl][key] : null;
          return Object.assign({}, base || {}, overrides || {});
        }

        if (template === 'certificate') {
          await drawLogoIfAvailable();
          // Cabeçalho à direita
          const pCity = getPos('certificate','city');
          write(data.clinicCity || 'Cidade', pCity.x, pCity.y, pCity.size, pCity.color, pCity.bold);

          const pDate = getPos('certificate','date');
          write(data.currentDate || '', pDate.x, pDate.y, pDate.size, pDate.color, pDate.bold);

          // Bloco do profissional (centro superior)
          const pDoc = getPos('certificate','doctorName');
          write(data.doctorName || '', pDoc.x, pDoc.y, pDoc.size, pDoc.color, pDoc.bold);

          const pTitle = getPos('certificate','doctorTitle');
          write('Cirurgiã Dentista', pTitle.x, pTitle.y, pTitle.size, pTitle.color, pTitle.bold);

          const pCro = getPos('certificate','doctorCro');
          write(`CRO: ${data.doctorCro || ''}`, pCro.x, pCro.y, pCro.size, pCro.color, pCro.bold);

          // Texto principal (ajuste fino conforme layout)
          // Função simples para quebra de linha por largura aproximada
          function wrapText(text, maxWidthPct, size){
            if(!text) return [];
            const maxWidth = px(maxWidthPct);
            const words = String(text).split(/\s+/);
            let line = '';
            const lines = [];
            for(const w of words){
              const test = line ? line + ' ' + w : w;
              const width = font.widthOfTextAtSize(test, size);
              if(width > maxWidth && line){
                lines.push(line);
                line = w;
              } else {
                line = test;
              }
            }
            if(line) lines.push(line);
            return lines;
          }

          const pBody = getPos('certificate','body');
          let y = pBody.y;
          const att = `Atesto para os devidos fins que o(a) paciente ${data.patientName || ''}, portador(a) do RG ${data.patientId || ''} e CPF ${data.patientCpf || ''}, esteve sob meus cuidados profissionais em ${data.currentDate || ''}.`;
          wrapText(att, pBody.width, pBody.size).forEach(l=>{ write(l, pBody.x, y, pBody.size); y -= (pBody.lineGap || 0.025); });
          if (data.reason) { wrapText(`Motivo: ${data.reason}`, pBody.width, pBody.size).forEach(l=>{ write(l, pBody.x, y, pBody.size); y -= (pBody.lineGap || 0.025); }); }
          if (data.cid) { wrapText(`Diagnóstico (CID): ${data.cid}`, pBody.width, pBody.size).forEach(l=>{ write(l, pBody.x, y, pBody.size); y -= (pBody.lineGap || 0.025); }); }
          wrapText(`Afastamento por ${data.days || 1} dia(s).`, pBody.width, pBody.size).forEach(l=>{ write(l, pBody.x, y, pBody.size); y -= (pBody.lineGap || 0.025); });

          // Rodapé
          const footer = `${data.clinicName || ''} • ${data.clinicAddress || ''} • ${data.clinicPhone || ''}`;
          const pFooter = getPos('certificate','footer');
          write(footer, pFooter.x, pFooter.y, pFooter.size, pFooter.color, pFooter.bold);
        } else if (template === 'prescription') {
          await drawLogoIfAvailable();
          // Implementação com lista de medicamentos formatada
          const pTitle = getPos('prescription','title');
          write('RECEITA', pTitle.x, pTitle.y, pTitle.size, pTitle.color, pTitle.bold);
          const pList = getPos('prescription','list');
          let yList = pList.y;
          const meds = Array.isArray(data.medications) ? data.medications : [];
          meds.forEach((m) => {
            let line;
            if (m && typeof m === 'object') {
              const name = m.medication || m.name || '';
              const dosage = m.dosage ? ` ${m.dosage}` : '';
              const freq = m.frequency ? ` • ${m.frequency}` : '';
              const dur = m.duration ? ` • ${m.duration}` : '';
              line = `${name}${dosage}${freq}${dur}`;
            } else {
              line = String(m);
            }
            // Quebra por largura
            wrapText(line, pList.width, pList.size).forEach(l=>{ write(l, pList.x, yList, pList.size); yList -= (pList.lineGap || 0.028); });
            yList -= (pList.blockGap || 0.01);
          });
          const pDoc = getPos('prescription','doctorName');
          write(data.doctorName || '', pDoc.x, pDoc.y, pDoc.size, pDoc.color, pDoc.bold);
          const pCro = getPos('prescription','doctorCro');
          write(`CRO: ${data.doctorCro || ''}`, pCro.x, pCro.y, pCro.size, pCro.color, pCro.bold);
        } else if (template === 'anamnesis') {
          await drawLogoIfAvailable();
          const pTitle = getPos('anamnesis','title');
          write('ANAMNESE', pTitle.x, pTitle.y, pTitle.size, pTitle.color, pTitle.bold);
          const pName = getPos('anamnesis','patientName');
          write(`Paciente: ${data.patientName || ''}`, pName.x, pName.y, pName.size);
          const pAge = getPos('anamnesis','patientAge');
          write(`Idade: ${data.patientAge || ''}`, pAge.x, pAge.y, pAge.size);
          const pPhone = getPos('anamnesis','patientPhone');
          write(`Telefone: ${data.patientPhone || ''}`, pPhone.x, pPhone.y, pPhone.size);
        }

        if (debugGrid) {
          drawGrid(0.1);
        }

        const out = await doc.save();
        const outFilename = (req.body && req.body.filename && String(req.body.filename).trim()) || 'document.pdf';
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${outFilename}"`,
          'Content-Length': out.length
        });
        return res.send(Buffer.from(out));
      } catch (e) {
        console.error('Erro no modo background-text:', e);
        return res.status(500).json({ error: e.message });
      }
    }

    if (!puppeteer) {
      return res.status(500).json({ error: 'puppeteer não instalado. Rode npm install em legacy-backend com PUPPETEER_SKIP_DOWNLOAD desligado ou use Chrome local.' });
    }

    if (!htmlToRender) {
      return res.status(400).json({ error: 'Envie `html` ou `template` + `data` no body.' });
    }

    // Renderiza HTML em PDF usando Puppeteer
    const launchConfig = {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
      headless: 'new'
    };

    // Tenta usar Chrome do sistema quando disponível (robustez mesmo se o download do Chromium foi pulado)
    const possibleChromes = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH // fallback para env var customizada
    ];
    for (const chromePath of possibleChromes) {
      if (chromePath && fs.existsSync(chromePath)) {
        launchConfig.executablePath = chromePath;
        console.log('🔎 Usando Chrome do sistema em:', chromePath);
        break;
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

    // Se existir um PDF de layout base, mescla como background
    let finalBuffer = pdfBuffer;
    try {
      const backgroundPref = (req.body && req.body.background) || 'auto'; // 'auto' | 'none' | 'force'
      const layoutPath = path.join(__dirname, 'public', 'assets', 'arte para documentos.pdf');
      const hasLayout = fs.existsSync(layoutPath);

      if (backgroundPref !== 'none' && hasLayout) {
        const layoutBytes = fs.readFileSync(layoutPath);

        // Carrega PDFs e monta novo PDF com o layout como plano de fundo
        const mergedDoc = await PDFDocument.create();

        // Embarca a primeira página do layout
        const [bgEmbedded] = await mergedDoc.embedPdf(layoutBytes, [0]);
        const bgW = bgEmbedded.width;
        const bgH = bgEmbedded.height;

        // Embarca todas as páginas do PDF gerado pelo Puppeteer
        // Nota: embedPdf retorna páginas como XObjects que podemos desenhar
        const pageCountDoc = (await PDFDocument.load(pdfBuffer)).getPageCount();
        const indices = Array.from({ length: pageCountDoc }, (_, i) => i);
        const contentEmbeds = await mergedDoc.embedPdf(pdfBuffer, indices);

        for (let i = 0; i < contentEmbeds.length; i++) {
          const contentEmbedded = contentEmbeds[i];
          // Tamanho final da página: usa o tamanho do layout, se disponível, senão o do conteúdo
          const pageWidth = bgW || contentEmbedded.width;
          const pageHeight = bgH || contentEmbedded.height;
          const page = mergedDoc.addPage([pageWidth, pageHeight]);

          // Desenha background primeiro (cobre toda a página)
          page.drawPage(bgEmbedded, { x: 0, y: 0, width: pageWidth, height: pageHeight });
          // Desenha o conteúdo por cima, ajustado para ocupar a página inteira
          page.drawPage(contentEmbedded, { x: 0, y: 0, width: pageWidth, height: pageHeight });
        }

        const mergedBytes = await mergedDoc.save();
        finalBuffer = Buffer.from(mergedBytes);
      }
    } catch (mergeErr) {
      console.warn('⚠️  Falha ao aplicar layout de fundo. Enviando PDF original. Motivo:', mergeErr.message);
    }

    const outFilename = (req.body && req.body.filename && String(req.body.filename).trim()) || 'document.pdf';
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outFilename}"`,
      'Content-Length': finalBuffer.length
    });
    return res.send(finalBuffer);
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
