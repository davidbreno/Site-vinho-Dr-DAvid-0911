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

/**
 * Remove CSS problematico que html2canvas não consegue processar
 * (como cores oklab, oklch, etc que são CSS4 moderno)
 */
function cleanCssForHtml2Canvas(element: HTMLElement): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Remove cores CSS4 modernas que html2canvas não suporta
  const style = clone.getAttribute('style') || '';
  const cleanedStyle = style
    .replace(/color:\s*oklab\([^)]*\)/gi, 'color: #000')
    .replace(/background-color:\s*oklab\([^)]*\)/gi, 'background-color: #fff')
    .replace(/color:\s*oklch\([^)]*\)/gi, 'color: #000')
    .replace(/background-color:\s*oklch\([^)]*\)/gi, 'background-color: #fff');
  
  if (cleanedStyle) clone.setAttribute('style', cleanedStyle);

  // Recursivamente limpa elementos filhos
  const allElements = clone.querySelectorAll('*');
  allElements.forEach((el) => {
    const elemStyle = el.getAttribute('style') || '';
    const cleanedElemStyle = elemStyle
      .replace(/color:\s*oklab\([^)]*\)/gi, 'color: #000')
      .replace(/background-color:\s*oklab\([^)]*\)/gi, 'background-color: #fff')
      .replace(/color:\s*oklch\([^)]*\)/gi, 'color: #000')
      .replace(/background-color:\s*oklch\([^)]*\)/gi, 'background-color: #fff');
    
    if (cleanedElemStyle) el.setAttribute('style', cleanedElemStyle);
  });

  return clone;
}

/**
 * Gera HTML de fallback para templates quando servidor não responde
 * (Implementação simplificada dos templates como fallback client-side)
 */
function generateTemplateHtml(template: string, data: Record<string, any>): string {
  const baseStyles = `
    <style>
      body { font-family: Arial, sans-serif; margin: 20px; color: #333; background: white; }
      h1, h2 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
      .header { text-align: center; margin-bottom: 30px; }
      .patient-info { margin: 20px 0; }
      .patient-info p { margin: 5px 0; }
      .signature { margin-top: 50px; border-top: 1px solid #333; padding-top: 20px; }
      .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      .med-item { margin: 15px 0; padding: 10px; border-left: 3px solid #007bff; }
    </style>
  `;

  if (template === 'prescription') {
    const meds = (data.medications || [])
      .map((m: any) => `
        <div class="med-item">
          <strong>${m.medication}</strong> - ${m.dosage}<br>
          Frequência: ${m.frequency} | Duração: ${m.duration}
        </div>
      `)
      .join('');

    return `<!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyles}</head>
      <body>
        <div class="header">
          <h1>RECEITUÁRIO MÉDICO ODONTOLÓGICO</h1>
        </div>
        <div class="patient-info">
          <p><strong>Clínica:</strong> ${data.clinicName || 'Clínica'}</p>
          <p><strong>Data:</strong> ${data.currentDate}</p>
          <p><strong>PACIENTE:</strong> ${data.patientName}</p>
          <p><strong>IDADE:</strong> ${data.patientAge} anos</p>
          <p><strong>TELEFONE:</strong> ${data.patientPhone}</p>
        </div>
        <h2>PRESCRIÇÃO:</h2>
        ${meds}
        <div class="patient-info">
          <p><strong>Observações:</strong></p>
          <p>${(data.observations || '').replace(/\n/g, '<br>')}</p>
        </div>
        <div class="signature">
          <p>_____________________</p>
          <p>${data.doctorName || 'Profissional'}</p>
          <p>CRO ${data.doctorCro || '00000'}</p>
          <p>${data.clinicName || 'Clínica'}</p>
        </div>
      </body>
      </html>`;
  }

  if (template === 'certificate') {
    return `<!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyles}</head>
      <body>
        <div class="header">
          <h1>ATESTADO ODONTOLÓGICO</h1>
        </div>
        <div class="patient-info">
          <p><strong>Clínica:</strong> ${data.clinicName || 'Clínica'}</p>
          <p><strong>Data:</strong> ${data.currentDate}</p>
          <p><strong>PACIENTE:</strong> ${data.patientName}</p>
          <p><strong>CPF:</strong> ${data.patientCpf || 'N/A'}</p>
          <p><strong>CID:</strong> ${data.cid || 'N/A'}</p>
        </div>
        <div class="patient-info" style="margin-top: 30px;">
          <p><strong>MOTIVO:</strong></p>
          <p>${(data.reason || '').replace(/\n/g, '<br>')}</p>
          <p style="margin-top: 20px;"><strong>DIAS:</strong> ${data.days}</p>
        </div>
        <div class="signature">
          <p>_____________________</p>
          <p>${data.doctorName || 'Profissional'}</p>
          <p>CRO ${data.doctorCro || '00000'}</p>
          <p>${data.clinicName || 'Clínica'}</p>
        </div>
      </body>
      </html>`;
  }

  if (template === 'anamnesis') {
    const questionsHtml = (data.questions || [])
      .map((q: any) => `
        <p>
          <input type="checkbox" ${q.checked ? 'checked' : ''} disabled>
          <strong>${q.question}</strong>
          ${q.notes ? `<br><em>Notas: ${q.notes}</em>` : ''}
        </p>
      `)
      .join('');

    return `<!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8">${baseStyles}</head>
      <body>
        <div class="header">
          <h1>FICHA DE ANAMNESE</h1>
        </div>
        <div class="patient-info">
          <p><strong>Clínica:</strong> ${data.clinicName || 'Clínica'}</p>
          <p><strong>Data:</strong> ${data.currentDate}</p>
          <p><strong>PACIENTE:</strong> ${data.patientName}</p>
          <p><strong>IDADE:</strong> ${data.patientAge} anos</p>
          <p><strong>TELEFONE:</strong> ${data.patientPhone}</p>
          <p><strong>EMAIL:</strong> ${data.patientEmail || 'N/A'}</p>
        </div>
        <h2>HISTÓRICO DE SAÚDE:</h2>
        ${questionsHtml}
        <div class="signature">
          <p>_____________________</p>
          <p>${data.doctorName || 'Profissional'}</p>
          <p>CRO ${data.doctorCro || '00000'}</p>
          <p>${data.clinicName || 'Clínica'}</p>
        </div>
      </body>
      </html>`;
  }

  return `<html><body><p>Template não suportado: ${template}</p></body></html>`;
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
      serverEndpoint = '/generate-pdf',
    } = options;

    try {
      // Se template foi fornecido, usa servidor
      if (template && data) {
        console.log(`[usePdfExport] Tentando gerar PDF com template "${template}" no servidor...`);
        console.log(`[usePdfExport] DADOS ENVIADOS:`, JSON.stringify(data, null, 2));
        try {
          const payloadToSend = {
            template,
            data: {
              ...data,
              // Passa a URL base dos assets para que Puppeteer possa servir as imagens
              logoUrl: data.logoUrl || 'file:///C:/Users/Dr.%20David%20Breno/Videos/Dental%20Platform%20Dashboard%20(2)/legacy-backend/public/assets/logo.png',
            },
            options: { format, landscape },
          };
          console.log(`[usePdfExport] PAYLOAD COMPLETO:`, JSON.stringify(payloadToSend, null, 2));
          
          const response = await fetch(serverEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadToSend),
          });

          if (response.ok) {
            console.log(`[usePdfExport] PDF gerado com template "${template}" com sucesso.`);
            const blob = await response.blob();
            downloadBlob(blob, filename);
            return;
          } else {
            const errData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
            console.warn(`[usePdfExport] Servidor retornou erro (${response.status}):`, errData);
            console.warn('[usePdfExport] Vou tentar gerar template localmente como fallback...');
            // Continua para tentar fallback abaixo
          }
        } catch (err) {
          console.error('[usePdfExport] Erro ao conectar servidor:', err);
          console.error('[usePdfExport] Tentando em:', serverEndpoint);
          console.warn('[usePdfExport] Servidor indisponível, usando fallback client-side:', err);
          // Continua para tentar fallback abaixo
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

      // Se era um template, gera HTML de fallback
      if (template && data) {
        console.log('[usePdfExport] Gerando HTML de fallback para template:', template);
        const fallbackHtml = generateTemplateHtml(template, data);
        
        // Cria elemento temporário INVISÍVEL no DOM
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '0';
        tempDiv.style.top = '0';
        tempDiv.style.width = '210mm';
        tempDiv.style.height = '297mm';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.zIndex = '-9999';
        tempDiv.style.pointerEvents = 'none';
        
        // Parse HTML seguro
        const parser = new DOMParser();
        const doc = parser.parseFromString(fallbackHtml, 'text/html');
        
        // Copia body do parsed HTML para tempDiv
        while (doc.body.firstChild) {
          tempDiv.appendChild(doc.body.firstChild);
        }
        
        document.body.appendChild(tempDiv);
        targetElement = tempDiv;
      }

      if (elementId && !template) {
        const el = document.getElementById(elementId);
        if (!el) {
          throw new Error(`Elemento com ID "${elementId}" não encontrado.`);
        }
        targetElement = el;
      }

      // Aguarda um pouco para o layout ser calculado
      await new Promise(resolve => setTimeout(resolve, 100));

      // Captura canvas do elemento
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        ignoreElements: (el) => {
          // Ignora elementos problemáticos
          return el.tagName === 'SCRIPT' || el.tagName === 'STYLE';
        },
      });
      
      // Remove elemento temporário se foi criado para template
      if (template && data && targetElement.parentElement) {
        document.body.removeChild(targetElement);
      }

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
