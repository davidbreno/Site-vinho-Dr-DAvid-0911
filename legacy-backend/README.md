# Legacy Backend - Servidor de Geração de PDFs

Este servidor Express fornece um endpoint para gerar PDFs a partir de templates ou HTML puro, usando Puppeteer (Chromium headless).

## 📁 Estrutura de Diretórios

```
legacy-backend/
├── server.js                 # Servidor principal
├── package.json             # Dependências
├── database.sqlite          # Banco de dados SQLite
├── templates/               # Templates HTML (Handlebars)
│   ├── prescription.html    # Template de receita
│   ├── certificate.html     # Template de atestado
│   └── anamnesis.html       # Template de anamnese
└── public/                  # Assets públicos
    ├── assets/              # Logos, imagens, etc.
    │   ├── logo.png         # Logo da clínica (opcional)
    │   └── header.jpg       # Cabeçalho personalizado (opcional)
    └── fonts/               # Fontes custom
        └── custom-font.ttf  # Fonte personalizada (opcional)
```

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
cd legacy-backend

# Com download automático do Chromium (requer internet e espaço):
npm install

# OU, para usar Chrome/Chromium local do sistema (sem download):
set PUPPETEER_SKIP_DOWNLOAD=true
npm install
```

### 2. Rodar o Servidor

```bash
npm start
# ou
node server.js
```

O servidor escuta em `http://localhost:3000`.

### 3. Endpoints

#### POST `/generate-pdf`

Aceita dois modos de operação:

**Modo 1: Template + Dados (Recomendado)**

```bash
curl -X POST http://localhost:3000/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "template": "prescription",
    "data": {
      "patientName": "João Silva",
      "patientAge": 35,
      "patientPhone": "(11) 98765-4321",
      "currentDate": "10/11/2025",
      "medications": [
        {
          "medication": "Amoxicilina",
          "dosage": "500mg",
          "frequency": "A cada 8 horas",
          "duration": "7 dias"
        }
      ],
      "observations": "Tomar com alimentos.\nEvitar álcool durante o tratamento."
    }
  }' > receita.pdf
```

Templates disponíveis:
- `prescription` - Receita farmacêutica
- `certificate` - Atestado odontológico
- `anamnesis` - Ficha de anamnese

**Modo 2: HTML Puro**

```bash
curl -X POST http://localhost:3000/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<html><body><h1>Meu PDF</h1></body></html>"
  }' > documento.pdf
```

### 4. Variáveis de Template (Handlebars)

#### `prescription.html`
- `{{patientName}}` - Nome do paciente
- `{{patientAge}}` - Idade
- `{{patientPhone}}` - Telefone
- `{{currentDate}}` - Data da consulta
- `{{#each medications}}` - Loop de medicamentos
  - `{{this.medication}}` - Nome do medicamento
  - `{{this.dosage}}` - Dosagem
  - `{{this.frequency}}` - Frequência
  - `{{this.duration}}` - Duração
- `{{observations}}` - Observações
- `{{{observationsFormatted}}}` - Observações com quebras de linha renderizadas

#### `certificate.html`
- `{{patientName}}` - Nome do paciente
- `{{patientId}}` - RG do paciente
- `{{patientCpf}}` - CPF do paciente
- `{{currentDate}}` - Data do atestado
- `{{reason}}` - Motivo do afastamento
- `{{{reasonFormatted}}}` - Motivo com quebras de linha
- `{{cid}}` - Código CID (ex: K00.0)
- `{{days}}` - Número de dias de afastamento

#### `anamnesis.html`
- `{{patientName}}` - Nome
- `{{patientAge}}` - Idade
- `{{patientPhone}}` - Telefone
- `{{patientEmail}}` - Email
- `{{currentDate}}` - Data da consulta
- `{{#each questions}}` - Loop de perguntas da anamnese
  - `{{this.question}}` - Pergunta
  - `{{this.checked}}` - Se foi marcada (true/false)
  - `{{this.notes}}` - Observações da pergunta
- `{{#each medications}}` - Medicamentos contínuos
  - `{{this.name}}` - Nome do medicamento
  - `{{this.dosage}}` - Dosagem
  - `{{this.frequency}}` - Frequência

## 🎨 Personalizar Templates

### Adicionar Logo

1. Coloque o arquivo da logo em: `public/assets/logo.png`
2. Edite `templates/prescription.html` (ou outro template) e substitua:
```html
<div class="logo">📋</div>
```
por:
```html
<img src="file:///absolute/path/to/logo.png" alt="Logo" style="width: 80px; height: 80px;">
```
**Nota:** Use caminho absoluto (`file:///C:/Users/...`) ou URL.

### Adicionar Cabeçalho Personalizado

Crie um arquivo `templates/header.html` com seu design customizado e inclua nos templates:

```html
<div id="header">
  <img src="file:///absolute/path/to/header.jpg" alt="Cabeçalho" style="width: 100%; margin-bottom: 20px;">
</div>
```

### Usar Fontes Custom

1. Coloque a fonte em: `public/fonts/myfont.ttf`
2. Edite o CSS no template:
```css
@font-face {
  font-family: 'MyFont';
  src: url('file:///C:/Users/.../legacy-backend/public/fonts/myfont.ttf') format('truetype');
}
body {
  font-family: 'MyFont', Arial, sans-serif;
}
```

## 🔧 Configurações do Puppeteer

### Usar Chrome Instalado no Sistema

Se não quiser baixar Chromium, configure a variável de ambiente antes de instalar:

```bash
set PUPPETEER_SKIP_DOWNLOAD=true
npm install
```

Depois, edite `server.js` e aponte para o Chrome:

```javascript
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  headless: 'new'
});
```

### Opções de PDF

Customize o formato do PDF no endpoint:

```json
{
  "template": "prescription",
  "data": {...},
  "options": {
    "format": "A4",           // Tamanho: A4, Letter, etc.
    "landscape": false,        // Paisagem ou retrato
    "printBackground": true,   // Imprimir fundo (cores)
    "margin": {
      "top": "1cm",
      "bottom": "1cm",
      "left": "1cm",
      "right": "1cm"
    }
  }
}
```

## 📝 Exemplos de Uso (Frontend)

Veja `src/hooks/usePdfExport.ts` no projeto principal para um hook React que integra automaticamente:

```typescript
const { exportPdf } = usePdfExport();

exportPdf({
  template: 'prescription',
  data: {
    patientName: 'João Silva',
    patientAge: 35,
    patientPhone: '(11) 98765-4321',
    currentDate: new Date().toLocaleDateString('pt-BR'),
    medications: [...]
  },
  filename: 'receita_joao_silva.pdf',
  serverEndpoint: 'http://localhost:3000/generate-pdf'
});
```

## ❌ Troubleshooting

### Puppeteer não consegue baixar Chromium

Use `PUPPETEER_SKIP_DOWNLOAD=true` ou aponte para Chrome local (veja acima).

### Erro: "Templates não encontrado"

Verifique se o arquivo existe em `templates/` com o nome correto (sem `.html`).

### PDF vazio ou incompleto

- Aumente o tempo de espera: `waitUntil: 'networkidle2'` em `server.js`
- Verifique se o HTML está bem-formado
- Teste diretamente com `{ html: '<html>...</html>' }`

### Não consegue usar imagens/fontes

Use caminhos absolutos com `file:///` (Windows: `file:///C:/Users/...`, Linux: `file:///home/...`)

## 📦 Dependências

- `express` - Framework web
- `puppeteer` - Navegador headless
- `handlebars` - Template engine
- `cors` - CORS support
- `body-parser` - JSON parsing
- `sqlite3` - Banco de dados

## 📄 Licença

Uso interno. Atribua aos desenvolvedores conforme necessário.
