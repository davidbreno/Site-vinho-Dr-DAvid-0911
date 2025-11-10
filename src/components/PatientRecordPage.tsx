import { useState } from "react";
import { ArrowLeft, Download, User, Phone, Mail, Calendar, FileText, Pill, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

import type { Patient } from '../types/patient';
import { usePdfExport } from '../hooks/usePdfExport';

interface PatientRecordPageProps {
  patient: Patient;
  onBack: () => void;
}

interface AnamneseQuestion {
  id: string;
  question: string;
  checked: boolean;
  notes: string;
}

export function PatientRecordPage({ patient, onBack }: PatientRecordPageProps) {
  const { exportPdf } = usePdfExport();
  
  const [anamneseData, setAnamneseData] = useState<AnamneseQuestion[]>([
    { id: "1", question: "Está em tratamento médico atualmente?", checked: false, notes: "" },
    { id: "2", question: "Está tomando algum medicamento?", checked: false, notes: "" },
    { id: "3", question: "Tem alergia a algum medicamento?", checked: false, notes: "" },
    { id: "4", question: "Já foi hospitalizado ou realizou cirurgia?", checked: false, notes: "" },
    { id: "5", question: "Tem ou teve problema cardíaco?", checked: false, notes: "" },
    { id: "6", question: "Tem diabetes?", checked: false, notes: "" },
    { id: "7", question: "Tem pressão alta ou baixa?", checked: false, notes: "" },
    { id: "8", question: "Tem ou teve hepatite ou icterícia?", checked: false, notes: "" },
    { id: "9", question: "Tem problema renal?", checked: false, notes: "" },
    { id: "10", question: "Tem problema de coagulação?", checked: false, notes: "" },
    { id: "11", question: "Está grávida ou amamentando?", checked: false, notes: "" },
    { id: "12", question: "Fuma?", checked: false, notes: "" },
    { id: "13", question: "Já teve reação alérgica a anestesia?", checked: false, notes: "" },
    { id: "14", question: "Tem dores de cabeça frequentes?", checked: false, notes: "" },
    { id: "15", question: "Sangramento excessivo após extração dentária?", checked: false, notes: "" },
  ]);

  const medicationClasses = {
    "Analgésicos": [
      "Paracetamol 500mg",
      "Dipirona 500mg",
      "Ibuprofeno 600mg",
      "Nimesulida 100mg"
    ],
    "Anti-inflamatórios": [
      "Dexametasona 4mg",
      "Prednisolona 20mg",
      "Meloxicam 15mg",
      "Cetoprofeno 100mg"
    ],
    "Antibióticos": [
      "Amoxicilina 500mg",
      "Azitromicina 500mg",
      "Clindamicina 300mg",
      "Metronidazol 400mg"
    ],
    "Antissépticos": [
      "Clorexidina 0,12% (enxaguante)",
      "Periogard (enxaguante)",
      "Listerine (enxaguante)"
    ],
    "Outros": [
      "Omeprazol 20mg",
      "Vitamina B12",
      "Ácido Fólico"
    ]
  };

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [prescriptionItems, setPrescriptionItems] = useState<{
    medication: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[]>([]);
  const [currentMedication, setCurrentMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");
  const [observations, setObservations] = useState("");

  // Atestado
  const [certificateDays, setCertificateDays] = useState("1");
  const [certificateReason, setCertificateReason] = useState("");
  const [certificateCID, setCertificateCID] = useState("");

  const handleAnamneseChange = (id: string) => {
    setAnamneseData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleNotesChange = (id: string, notes: string) => {
    setAnamneseData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  const addToPrescription = () => {
    if (currentMedication && dosage && frequency && duration) {
      setPrescriptionItems([
        ...prescriptionItems,
        {
          medication: currentMedication,
          dosage,
          frequency,
          duration
        }
      ]);
      setCurrentMedication("");
      setDosage("");
      setFrequency("");
      setDuration("");
    }
  };

  const removePrescriptionItem = (index: number) => {
    setPrescriptionItems(prev => prev.filter((_, i) => i !== index));
  };

  const exportAnamnesePDF = () => {
    const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        FICHA DE ANAMNESE ODONTOLÓGICA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clínica: DentalCare
Data: ${new Date().toLocaleDateString('pt-BR')}

DADOS DO PACIENTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nome: ${patient.name}
Idade: ${patient.age} anos
Telefone: ${patient.phone}
Email: ${patient.email}

ANAMNESE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${anamneseData.map((item, index) => 
  `${index + 1}. ${item.question}\n   [${item.checked ? 'X' : ' '}] ${item.checked ? 'SIM' : 'NÃO'}${item.checked && item.notes ? `\n   Observações: ${item.notes}` : ''}`
).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

______________________________
Dr. Roberto Silva
CRO 12345
`;
    downloadTxt(content, `anamnese_${patient.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`);
  };

  const exportPrescriptionPDF = () => {
    const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       RECEITUÁRIO MÉDICO ODONTOLÓGICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clínica: DentalCare
Data: ${new Date().toLocaleDateString('pt-BR')}

PACIENTE: ${patient.name}
IDADE: ${patient.age} anos

PRESCRIÇÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${prescriptionItems.map((item, index) => `
${index + 1}. ${item.medication}
   
   Posologia: ${item.dosage}
   Frequência: ${item.frequency}
   Duração: ${item.duration}
`).join('\n')}
${observations ? `\nOBSERVAÇÕES:\n${observations}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

______________________________
Dr. Roberto Silva
CRO 12345
Clínica DentalCare
`;
    downloadTxt(content, `prescricao_${patient.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`);
  };

  const exportCertificatePDF = () => {
    const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                ATESTADO MÉDICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clínica: DentalCare
Data: ${new Date().toLocaleDateString('pt-BR', { 
  day: '2-digit', 
  month: 'long', 
  year: 'numeric' 
})}


Atesto para os devidos fins que o(a) paciente ${patient.name}, 
portador(a) do documento de identidade, esteve sob meus 
cuidados profissionais nesta data.

${certificateReason ? `\nMotivo: ${certificateReason}` : ''}
${certificateCID ? `CID: ${certificateCID}` : ''}

Necessitando de afastamento de suas atividades pelo 
período de ${certificateDays} dia(s), a partir desta data.


Por ser verdade, firmo o presente.


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


        ______________________________
              Dr. Roberto Silva
                  CRO 12345
             Clínica DentalCare
`;
    downloadTxt(content, `atestado_${patient.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`);
  };

  const downloadTxt = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const generatePrescriptionHtml = () => {
    const prescriptionRows = prescriptionItems
      .map(item => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; text-align: left;">${item.medication}</td>
          <td style="padding: 12px; text-align: center;">${item.dosage}</td>
          <td style="padding: 12px; text-align: center;">${item.frequency}</td>
          <td style="padding: 12px; text-align: center;">${item.duration}</td>
        </tr>
      `)
      .join('');

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>Receita - ${patient.name}</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; color: #333; }
          .header { border-bottom: 3px solid #003366; margin-bottom: 30px; padding-bottom: 15px; }
          .clinic-name { font-size: 24px; font-weight: bold; color: #003366; }
          .clinic-info { font-size: 12px; color: #666; margin-top: 5px; }
          .patient-info { margin-bottom: 30px; font-size: 14px; }
          .patient-info p { margin: 5px 0; }
          .label { font-weight: bold; color: #003366; display: inline-block; width: 120px; }
          h3 { color: #003366; border-bottom: 2px solid #003366; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { background-color: #003366; color: white; padding: 12px; text-align: left; font-size: 13px; }
          td { padding: 12px; font-size: 13px; }
          .observations { background-color: #f5f5f5; padding: 15px; border-left: 4px solid #003366; margin-top: 20px; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
          .signature-line { width: 200px; display: inline-block; border-top: 1px solid #333; margin-top: 40px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="clinic-name">🦷 Clínica DentalCare</div>
          <div class="clinic-info">
            Endereço: Rua da Saúde, 123 | Tel: (11) 9999-9999<br>
            CNPJ: 12.345.678/0001-90 | CRO: 12345
          </div>
        </div>

        <div class="patient-info">
          <p><span class="label">Paciente:</span> ${patient.name}</p>
          <p><span class="label">Idade:</span> ${patient.age} anos</p>
          <p><span class="label">Data:</span> ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <h3>📋 PRESCRIÇÃO</h3>
        ${prescriptionItems.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Dosagem</th>
                <th>Frequência</th>
                <th>Duração</th>
              </tr>
            </thead>
            <tbody>
              ${prescriptionRows}
            </tbody>
          </table>
        ` : '<p style="color: #999; font-style: italic;">Nenhum medicamento prescrito</p>'}

        ${observations ? `
          <div class="observations">
            <strong>Observações:</strong><br>
            ${observations.replace(/\n/g, '<br>')}
          </div>
        ` : ''}

        <div class="footer">
          <div class="signature-line">Dr. Roberto Silva</div>
          <p>CRO 12345 | Clínica DentalCare</p>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary-800 text-neutral-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onBack}
              variant="ghost"
              className="text-neutral-50 hover:bg-primary-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Pacientes
            </Button>
            <Button
              onClick={() => {
                const prescriptionHtml = generatePrescriptionHtml();
                exportPdf({
                  html: prescriptionHtml,
                  filename: `receita_${patient.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
                  serverEndpoint: 'http://localhost:3000/generate-pdf',
                });
              }}
              variant="outline"
              className="text-neutral-50 border-neutral-50 hover:bg-primary-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar Receita
            </Button>
          </div>
          <h1 className="text-neutral-50">Prontuário do Paciente</h1>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="max-w-7xl mx-auto p-6">
        <Card className="border-primary-900 shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-600 text-neutral-50 flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Nome Completo</p>
                  <p className="text-primary-900">{patient.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Idade</p>
                  <p className="text-primary-900">{patient.age} anos</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Telefone</p>
                  <p className="text-primary-900">{patient.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Email</p>
                  <p className="text-primary-900 truncate">{patient.email}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex items-center gap-8">
              <div>
                <p className="text-neutral-600 text-sm">Última Consulta</p>
                <Badge className="mt-1 bg-primary-600 text-neutral-50">{patient.lastVisit}</Badge>
              </div>
              {patient.nextVisit && (
                <div>
                  <p className="text-neutral-600 text-sm">Próxima Consulta</p>
                  <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">{patient.nextVisit}</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="anamnese" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-neutral-200 mb-6">
            <TabsTrigger value="anamnese" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
              <FileText className="w-4 h-4 mr-2" />
              Anamnese
            </TabsTrigger>
            <TabsTrigger value="prescription" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
              <Pill className="w-4 h-4 mr-2" />
              Prescrição
            </TabsTrigger>
            <TabsTrigger value="certificate" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
              <ClipboardList className="w-4 h-4 mr-2" />
              Atestado
            </TabsTrigger>
          </TabsList>

          {/* Anamnese Tab */}
          <TabsContent value="anamnese">
            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary-900">Ficha de Anamnese</CardTitle>
                  <Button onClick={exportAnamnesePDF} className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </Button>
                </div>
                <p className="text-neutral-600 text-sm">Marque as condições que se aplicam ao paciente</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anamneseData.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-lg border border-neutral-300 hover:bg-primary-50/30 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => handleAnamneseChange(item.id)}
                          className="mt-1 border-primary-600 data-[state=checked]:bg-primary-600"
                        />
                        <label
                          htmlFor={item.id}
                          className="text-neutral-800 cursor-pointer flex-1"
                        >
                          {item.question}
                        </label>
                      </div>
                      
                      {item.checked && (
                        <div className="mt-3 ml-7">
                          <Textarea
                            value={item.notes}
                            onChange={(e) => handleNotesChange(item.id, e.target.value)}
                            placeholder="Anote detalhes sobre esta condição..."
                            className="min-h-[80px] border-primary-300 focus:border-primary-600 bg-white text-sm"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prescription Tab */}
          <TabsContent value="prescription">
            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary-900">Receituário Médico</CardTitle>
                  <Button 
                    onClick={exportPrescriptionPDF} 
                    className="bg-primary-600 hover:bg-primary-700 text-neutral-50"
                    disabled={prescriptionItems.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </Button>
                </div>
                <p className="text-neutral-600 text-sm">Prescreva medicamentos para o paciente</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Medication */}
                <div className="p-4 rounded-lg bg-neutral-100 border border-neutral-300 space-y-4">
                  <h4 className="text-primary-900">Adicionar Medicamento</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-neutral-700">Classe de Medicamento</label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="border-primary-300 bg-white">
                          <SelectValue placeholder="Selecione a classe" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(medicationClasses).map((className) => (
                            <SelectItem key={className} value={className}>
                              {className}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-neutral-700">Medicamento</label>
                      <Select 
                        value={currentMedication} 
                        onValueChange={setCurrentMedication}
                        disabled={!selectedClass}
                      >
                        <SelectTrigger className="border-primary-300 bg-white">
                          <SelectValue placeholder="Selecione o medicamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedClass && medicationClasses[selectedClass as keyof typeof medicationClasses].map((med) => (
                            <SelectItem key={med} value={med}>
                              {med}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-neutral-700">Posologia</label>
                      <Select value={dosage} onValueChange={setDosage}>
                        <SelectTrigger className="border-primary-300 bg-white">
                          <SelectValue placeholder="Dose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1 comprimido">1 comprimido</SelectItem>
                          <SelectItem value="2 comprimidos">2 comprimidos</SelectItem>
                          <SelectItem value="1 cápsula">1 cápsula</SelectItem>
                          <SelectItem value="10ml">10ml</SelectItem>
                          <SelectItem value="15ml">15ml</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-neutral-700">Frequência</label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger className="border-primary-300 bg-white">
                          <SelectValue placeholder="Frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A cada 4 horas">A cada 4 horas</SelectItem>
                          <SelectItem value="A cada 6 horas">A cada 6 horas</SelectItem>
                          <SelectItem value="A cada 8 horas">A cada 8 horas</SelectItem>
                          <SelectItem value="A cada 12 horas">A cada 12 horas</SelectItem>
                          <SelectItem value="1x ao dia">1x ao dia</SelectItem>
                          <SelectItem value="2x ao dia">2x ao dia</SelectItem>
                          <SelectItem value="3x ao dia">3x ao dia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-neutral-700">Duração</label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger className="border-primary-300 bg-white">
                          <SelectValue placeholder="Duração" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3 dias">3 dias</SelectItem>
                          <SelectItem value="5 dias">5 dias</SelectItem>
                          <SelectItem value="7 dias">7 dias</SelectItem>
                          <SelectItem value="10 dias">10 dias</SelectItem>
                          <SelectItem value="14 dias">14 dias</SelectItem>
                          <SelectItem value="Uso contínuo">Uso contínuo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={addToPrescription} 
                    className="w-full bg-primary-600 hover:bg-primary-700 text-neutral-50"
                    disabled={!currentMedication || !dosage || !frequency || !duration}
                  >
                    Adicionar à Prescrição
                  </Button>
                </div>

                {/* Prescription Items */}
                {prescriptionItems.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-primary-900">Medicamentos Prescritos:</h4>
                    {prescriptionItems.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-primary-900 bg-primary-50/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-primary-900">{item.medication}</p>
                            <div className="mt-2 space-y-1 text-sm text-neutral-700">
                              <p>• Posologia: {item.dosage}</p>
                              <p>• Frequência: {item.frequency}</p>
                              <p>• Duração: {item.duration}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePrescriptionItem(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remover
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Observations */}
                <div className="space-y-2">
                  <label className="text-sm text-neutral-700">Observações Adicionais</label>
                  <Textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Digite observações importantes sobre a prescrição..."
                    className="min-h-[100px] border-primary-300 focus:border-primary-600"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificate Tab */}
          <TabsContent value="certificate">
            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary-900">Atestado Médico</CardTitle>
                  <Button 
                    onClick={exportCertificatePDF} 
                    className="bg-primary-600 hover:bg-primary-700 text-neutral-50"
                    disabled={!certificateDays}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar PDF
                  </Button>
                </div>
                <p className="text-neutral-600 text-sm">Emita atestado médico para o paciente</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-neutral-700">Dias de Afastamento</label>
                    <Select value={certificateDays} onValueChange={setCertificateDays}>
                      <SelectTrigger className="border-primary-300">
                        <SelectValue placeholder="Selecione os dias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 dia</SelectItem>
                        <SelectItem value="2">2 dias</SelectItem>
                        <SelectItem value="3">3 dias</SelectItem>
                        <SelectItem value="5">5 dias</SelectItem>
                        <SelectItem value="7">7 dias</SelectItem>
                        <SelectItem value="10">10 dias</SelectItem>
                        <SelectItem value="15">15 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-neutral-700">CID (Opcional)</label>
                    <Input
                      value={certificateCID}
                      onChange={(e) => setCertificateCID(e.target.value)}
                      placeholder="Ex: K00.0"
                      className="border-primary-300 focus:border-primary-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-neutral-700">Motivo do Atestado</label>
                  <Textarea
                    value={certificateReason}
                    onChange={(e) => setCertificateReason(e.target.value)}
                    placeholder="Descreva o motivo do afastamento (opcional)..."
                    className="min-h-[120px] border-primary-300 focus:border-primary-600"
                  />
                </div>

                {/* Preview */}
                <div className="p-6 rounded-lg border-2 border-dashed border-primary-300 bg-neutral-50">
                  <h4 className="text-primary-900 mb-4 text-center">Preview do Atestado</h4>
                  <div className="space-y-3 text-neutral-800">
                    <p className="text-center">
                      <strong>ATESTADO MÉDICO</strong>
                    </p>
                    <Separator />
                    <p className="text-sm">
                      Atesto para os devidos fins que o(a) paciente <strong>{patient.name}</strong>, 
                      esteve sob meus cuidados profissionais em <strong>{new Date().toLocaleDateString('pt-BR')}</strong>.
                    </p>
                    {certificateReason && (
                      <p className="text-sm">
                        <strong>Motivo:</strong> {certificateReason}
                      </p>
                    )}
                    {certificateCID && (
                      <p className="text-sm">
                        <strong>CID:</strong> {certificateCID}
                      </p>
                    )}
                    <p className="text-sm">
                      Necessitando de afastamento de suas atividades pelo período de <strong>{certificateDays} dia(s)</strong>, 
                      a partir desta data.
                    </p>
                    <Separator />
                    <p className="text-sm text-center mt-8">
                      _____________________________<br />
                      Dr. Roberto Silva - CRO 12345<br />
                      Clínica DentalCare
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}