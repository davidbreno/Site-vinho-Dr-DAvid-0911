// Ajuste aqui as posições e tamanhos dos textos e da logo em porcentagem da página.
// Dica: ative debugGrid enviando { debugGrid: true } no body do /generate-pdf para ver linhas a cada 10%.
// Exemplo de override rápido no request: { coords: { certificate: { doctorName: { x: 0.28, y: 0.80 } } } }

const { rgb } = require('pdf-lib');

module.exports = {
  positions: {
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
  }
};
