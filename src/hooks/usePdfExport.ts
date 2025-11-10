import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface PdfExportOptions {
  filename?: string;
  elementId?: string;
  html?: string;
  template?: string;
  data?: Record<string, any>;
  format?: 'A4' | 'Letter';
  landscape?: boolean;
  serverEndpoint?: string;
}

export function usePdfExport() {
  /**
   * Exporta PDF via servidor (Puppeteer com templates) se disponível,
   * senão fallback client-side (html2canvas + jsPDF)
   */
  const exportPdf = useCallback(async (options: PdfExportOptions) => {
    const {
      filename = 'document.pdf',
      elementId,
      html,
      template,
      data,
      format = 'A4',
      landscape = false,
      serverEndpoint = 'http://localhost:3000/generate-pdf',
    } = options;

    try {
      // Se template foi fornecido, usa servidor
      if (template && data) {
        console.log(`[usePdfExport] Tentando gerar PDF com template "${template}" no servidor...`);
        try {
          const response = await fetch(serverEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              template,
              data: {
                ...data,
                // Passa a URL base dos assets para que Puppeteer possa servir as imagens
                logoUrl: data.logoUrl || 'file:///C:/Users/Dr.%20David%20Breno/Videos/Dental%20Platform%20Dashboard%20(2)/legacy-backend/public/assets/logo.png',
              },
              options: { format, landscape },
            }),
          });

          if (response.ok) {
            console.log(`[usePdfExport] PDF gerado com template "${template}" com sucesso.`);
            const blob = await response.blob();
            downloadBlob(blob, filename);
            return;
          } else {
            const errText = await response.text();
            console.warn(`[usePdfExport] Servidor retornou erro (${response.status}):`, errText);
          }
        } catch (err) {
          console.warn('[usePdfExport] Servidor indisponível, usando fallback client-side:', err);
        }
      }

      // Se html foi fornecido, tenta servidor
      if (html) {
        console.log('[usePdfExport] Tentando gerar PDF a partir de HTML no servidor...');
        try {
          const response = await fetch(serverEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              html,
              options: { format, landscape },
            }),
          });

          if (response.ok) {
            console.log('[usePdfExport] PDF gerado a partir de HTML com sucesso.');
            const blob = await response.blob();
            downloadBlob(blob, filename);
            return;
          } else {
            console.warn('[usePdfExport] Servidor retornou erro:', response.status);
          }
        } catch (err) {
          console.warn('[usePdfExport] Servidor indisponível, usando fallback client-side:', err);
        }
      }

      // Fallback: html2canvas + jsPDF (client-side)
      console.log('[usePdfExport] Usando fallback client-side (html2canvas + jsPDF)');
      let targetElement = document.body;

      if (elementId) {
        const el = document.getElementById(elementId);
        if (!el) {
          throw new Error(`Elemento com ID "${elementId}" não encontrado.`);
        }
        targetElement = el;
      }

      // Captura canvas do elemento
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Cria PDF
      const pdf = new jsPDF({
        orientation: landscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = landscape ? 297 : 210; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let y = 10;
      let remainingHeight = imgHeight;
      const pageHeight = landscape ? 190 : 277; // mm com margem

      // Paginação automática
      while (remainingHeight > 0) {
        const heightToAdd = Math.min(remainingHeight, pageHeight);
        const sourceY = imgHeight - remainingHeight;

        // Cria um canvas parcial para cada página
        const partialCanvas = document.createElement('canvas');
        partialCanvas.width = canvas.width;
        partialCanvas.height = (heightToAdd * canvas.width) / imgWidth;

        const ctx = partialCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            (sourceY * canvas.width) / imgWidth,
            canvas.width,
            partialCanvas.height
          );
        }

        const partialImgData = partialCanvas.toDataURL('image/png');
        pdf.addImage(partialImgData, 'PNG', 10, y, imgWidth - 20, heightToAdd);

        remainingHeight -= heightToAdd;
        if (remainingHeight > 0) {
          pdf.addPage();
          y = 10;
        }
      }

      pdf.save(filename);
      console.log('[usePdfExport] PDF salvo localmente:', filename);
    } catch (err) {
      console.error('[usePdfExport] Erro ao gerar PDF:', err);
      alert(`Erro ao gerar PDF: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  return { exportPdf };
}

/**
 * Helper para baixar blob como arquivo
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
