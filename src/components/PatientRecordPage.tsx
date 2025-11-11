import { useState, useRef } from "react";
import { ArrowLeft, Download, User, Phone, Mail, Calendar, FileText, Pill, ClipboardList, Plus, Camera, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
// Odontograma removido a pedido: apagar importações e todas as referências

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
      "Paracetamol 750mg",
      "Dipirona 500mg",
      "Dipirona 1g",
      "Ibuprofeno 400mg",
      "Ibuprofeno 600mg",
      "Nimesulida 100mg",
      "Codeína 30mg"
    ],
    "Anti-inflamatórios": [
      "Dexametasona 4mg",
      "Prednisolona 20mg",
      "Meloxicam 15mg",
      "Cetoprofeno 100mg",
      "Piroxicam 20mg",
      "Naproxeno 500mg"
    ],
    "Antibióticos": [
      "Amoxicilina 500mg",
      "Amoxicilina + Clavulanato 875/125mg",
      "Azitromicina 500mg",
      "Clindamicina 300mg",
      "Metronidazol 400mg",
      "Cefalexina 500mg",
      "Doxiciclina 100mg"
    ],
    "Antifúngicos": [
      "Fluconazol 150mg",
      "Nistatina suspensão",
      "Miconazol gel"
    ],
    "Antissépticos": [
      "Clorexidina 0,12% (enxaguante)",
      "Periogard (enxaguante)",
      "Listerine (enxaguante)",
      "Clorexidina spray 0,12%"
    ],
    "Anestésicos Tópicos": [
      "Lidocaína gel 5%",
      "Benzocaína spray 10%"
    ],
    "Protensão / Adjuntos": [
      "Omeprazol 20mg",
      "Vitamina B12",
      "Ácido Fólico",
      "Complexo B",
      "Probiótico"
    ]
  } as const;

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

  // -------- Orçamento (Budget) --------
  interface BudgetItem {
    id: string;
    procedure: string;
    tooth: string;
    qty: number;
    unitPrice: number;
    discount: number; // %
    notes?: string;
  }
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [procName, setProcName] = useState("");
  const [procTooth, setProcTooth] = useState("");
  const [procQty, setProcQty] = useState(1);
  const [procPrice, setProcPrice] = useState("");
  const [procDiscount, setProcDiscount] = useState("0");
  const [procNotes, setProcNotes] = useState("");
  const idSeq = useRef(0);

  const addBudgetItem = () => {
    if(!procName || !procPrice) return;
    idSeq.current += 1;
    setBudgetItems(prev => [...prev, {
      id: String(idSeq.current),
      procedure: procName,
      tooth: procTooth,
      qty: procQty,
      unitPrice: parseFloat(procPrice.replace(',', '.')) || 0,
      discount: parseFloat(procDiscount) || 0,
      notes: procNotes || undefined
    }]);
    setProcName(""); setProcTooth(""); setProcQty(1); setProcPrice(""); setProcDiscount("0"); setProcNotes("");
  };

  const removeBudgetItem = (id: string) => setBudgetItems(prev => prev.filter(i => i.id !== id));

  const budgetSubtotal = budgetItems.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
  const budgetDiscountTotal = budgetItems.reduce((sum, i) => sum + (i.unitPrice * i.qty) * (i.discount/100), 0);
  const budgetTotal = budgetSubtotal - budgetDiscountTotal;

  // -------- Tratamentos --------
  interface TreatmentItem {
    id: string;
    description: string;
    tooth: string;
    status: 'Planejado' | 'Em andamento' | 'Concluído';
    date: string; // ISO
    notes?: string;
  }
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [tDesc, setTDesc] = useState("");
  const [tTooth, setTTooth] = useState("");
  const [tStatus, setTStatus] = useState<'Planejado' | 'Em andamento' | 'Concluído'>('Planejado');
  const [tNotes, setTNotes] = useState("");

  const addTreatment = () => {
    if(!tDesc) return;
    idSeq.current += 1;
    setTreatments(prev => [...prev, {
      id: String(idSeq.current),
      description: tDesc,
      tooth: tTooth,
      status: tStatus,
      date: new Date().toISOString(),
      notes: tNotes || undefined
    }]);
    setTDesc(""); setTTooth(""); setTStatus('Planejado'); setTNotes("");
  };
  const updateTreatmentStatus = (id: string, status: TreatmentItem['status']) => {
    setTreatments(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };
  const removeTreatment = (id: string) => setTreatments(prev => prev.filter(t => t.id !== id));

  // -------- Odontograma (seleção de dentes e estados) --------
  // Odontograma removido

  // Atestado
  const [certificateDays, setCertificateDays] = useState("1");
  const [certificateReason, setCertificateReason] = useState("");
  const [certificateCID, setCertificateCID] = useState("");

  // -------- Débitos (financeiro) --------
  interface DebitItem { id: string; date: string; name: string; amount: number; received?: boolean; }
  const [debits, setDebits] = useState<DebitItem[]>([]);
  const [newDebitOpen, setNewDebitOpen] = useState(false);
  const [debitForm, setDebitForm] = useState({ plan: 'Particular', treatment: '', region: '', value: '', dentist: 'david', notes: '' });

  // -------- Evoluções (lateral em Tratamentos) --------
  interface EvolutionItem { id: string; date: string; text: string; }
  const [evolutions, setEvolutions] = useState<EvolutionItem[]>([]);
  const [evolutionDialog, setEvolutionDialog] = useState(false);
  const [evolutionText, setEvolutionText] = useState('');

  // -------- Documentos (editores na aba) --------
  const [showPrescriptionEditor, setShowPrescriptionEditor] = useState(false);
  const [showCertificateEditor, setShowCertificateEditor] = useState(false);

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

  const exportAnamnesePDF = async () => {
    await exportPdf({
      template: 'anamnesis',
      data: getAnamnesisData(),
      filename: `anamneses_${patient.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      serverEndpoint: '/generate-pdf',
      layoutMode: 'background-text',
      logo: { path: 'logo.png' },
    });
  };

  const exportPrescriptionPDF = async () => {
    await exportPdf({
      template: 'prescription',
      data: getPrescriptionData(),
      filename: `prescricao_${patient.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      serverEndpoint: '/generate-pdf',
      layoutMode: 'background-text',
      logo: { path: 'logo.png' },
    });
  };

  const exportCertificatePDF = async () => {
    await exportPdf({
      template: 'certificate',
      data: getCertificateData(),
      filename: `atestado_${patient.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
      serverEndpoint: '/generate-pdf',
      layoutMode: 'background-text',
      logo: { path: 'logo.png' },
    });
  };

  // Removido downloadTxt: geração agora sempre via templates + fallback PDF

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
          <div class="signature-line">Dr. David Breno</div>
          <p>CRO 71476 - MG</p>
        </div>
      </body>
      </html>
    `;
  };

  // Dados para template de Receita (via servidor Handlebars)
  const getPrescriptionData = () => ({
    patientName: patient.name,
    patientAge: patient.age,
    patientPhone: patient.phone,
    currentDate: new Date().toLocaleDateString('pt-BR'),
    medications: prescriptionItems,
    observations,
    // Informações da clínica (customize aqui com seus dados)
    clinicName: 'Consultório Odontológico',
    clinicAddress: 'Montes Claros - MG',
    clinicPhone: '(38) 9 9979-0464',
    clinicEmail: 'dr.davidbreno@hotmail.com',
    clinicCnpj: '',
    clinicCro: '71476 - MG',
    // Informações do profissional (customize aqui)
    doctorName: 'Dr. David Breno',
    doctorCro: '71476 - MG',
  });

  // Dados para template de Atestado
  const getCertificateData = () => ({
    patientName: patient.name,
    patientId: '12.345.678-9', // placeholder
    patientCpf: '123.456.789-00', // placeholder
    currentDate: new Date().toLocaleDateString('pt-BR'),
    reason: certificateReason,
    reasonFormatted: certificateReason.replace(/\n/g, '<br>'),
    cid: certificateCID,
    days: certificateDays,
    // Informações da clínica (customize aqui com seus dados)
    clinicName: 'Consultório Odontológico',
    clinicAddress: 'Montes Claros - MG',
    clinicPhone: '(38) 9 9979-0464',
    clinicCity: 'Montes Claros',
    // Informações do profissional (customize aqui)
    doctorName: 'Dr. David Breno',
    doctorCro: '71476 - MG',
  });

  // Dados para template de Anamnese
  const getAnamnesisData = () => ({
    patientName: patient.name,
    patientAge: patient.age,
    patientPhone: patient.phone,
    patientEmail: patient.email,
    currentDate: new Date().toLocaleDateString('pt-BR'),
    questions: anamneseData,
    medications: [], // pode preencher se houver campo de medicamentos contínuos
    observations: '',
    observationsFormatted: '',
    // Informações da clínica (customize aqui com seus dados)
    clinicName: 'Consultório Odontológico',
    clinicAddress: 'Montes Claros - MG',
    clinicPhone: '(38) 9 9979-0464',
    clinicCity: 'Montes Claros',
    // Informações do profissional (customize aqui)
    doctorName: 'Dr. David Breno',
    doctorCro: '71476 - MG',
  });

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
            <div></div>
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

        {/* Tabs reestruturadas seguindo prints (Sobre, Orçamentos, Tratamentos, Anamnese, Imagens, Documentos, Débitos) */}
        <Tabs defaultValue="sobre" className="w-full">
          <TabsList className="flex w-full gap-2 bg-neutral-200 mb-6 p-2 rounded-lg overflow-x-auto">
            <TabsTrigger value="sobre" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50 data-[state=inactive]:bg-neutral-100"><User className="w-4 h-4"/>Sobre</TabsTrigger>
            <TabsTrigger value="orcamentos" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50 data-[state=inactive]:bg-neutral-100"><FileText className="w-4 h-4"/>Orçamentos</TabsTrigger>
            <TabsTrigger value="tratamentos" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50 data-[state=inactive]:bg-neutral-100"><ClipboardList className="w-4 h-4"/>Tratamentos</TabsTrigger>
            <TabsTrigger value="anamnese" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50 data-[state=inactive]:bg-neutral-100"><ClipboardList className="w-4 h-4"/>Anamnese</TabsTrigger>
            <TabsTrigger value="imagens" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50 data-[state=inactive]:bg-neutral-100"><Camera className="w-4 h-4"/>Imagens</TabsTrigger>
            <TabsTrigger value="documentos" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50 data-[state=inactive]:bg-neutral-100"><FileText className="w-4 h-4"/>Documentos</TabsTrigger>
            <TabsTrigger value="debitos" className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50 data-[state=inactive]:bg-neutral-100"><DollarSign className="w-4 h-4"/>Débitos</TabsTrigger>
          </TabsList>

          {/* Sobre */}
          <TabsContent value="sobre">
            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary-900">Dados do Paciente</CardTitle>
                <p className="text-neutral-600 text-sm">Resumo rápido do cadastro.</p>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label className="text-xs text-neutral-600">Nome</label><Input value={patient.name} readOnly className="bg-neutral-100"/></div>
                <div><label className="text-xs text-neutral-600">Telefone</label><Input value={patient.phone} readOnly className="bg-neutral-100"/></div>
                <div><label className="text-xs text-neutral-600">Email</label><Input value={patient.email} readOnly className="bg-neutral-100"/></div>
                <div><label className="text-xs text-neutral-600">Idade</label><Input value={`${patient.age} anos`} readOnly className="bg-neutral-100"/></div>
                <div><label className="text-xs text-neutral-600">Última consulta</label><Input value={patient.lastVisit} readOnly className="bg-neutral-100"/></div>
                <div><label className="text-xs text-neutral-600">Próxima consulta</label><Input value={patient.nextVisit ?? ''} readOnly className="bg-neutral-100"/></div>
              </CardContent>
            </Card>
          </TabsContent>

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
          <TabsContent value="__hidden_prescription" className="hidden">
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
                          <SelectItem value="1 sachê">1 sachê</SelectItem>
                          <SelectItem value="5ml">5ml</SelectItem>
                          <SelectItem value="10ml">10ml</SelectItem>
                          <SelectItem value="15ml">15ml</SelectItem>
                          <SelectItem value="20 gotas">20 gotas</SelectItem>
                          <SelectItem value="Aplicação tópica">Aplicação tópica</SelectItem>
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
                          <SelectItem value="Antes das refeições">Antes das refeições</SelectItem>
                          <SelectItem value="Após as refeições">Após as refeições</SelectItem>
                          <SelectItem value="Ao deitar">Ao deitar</SelectItem>
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
                          <SelectItem value="21 dias">21 dias</SelectItem>
                          <SelectItem value="30 dias">30 dias</SelectItem>
                          <SelectItem value="Uso conforme necessidade">Uso conforme necessidade</SelectItem>
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
          <TabsContent value="__hidden_certificate" className="hidden">
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

          {/* Budget (Orçamento) Tab */}
          <TabsContent value="orcamentos">
            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary-900">Orçamento</CardTitle>
                  <div className="flex items-center gap-2">
                    {/* Odontograma removido */}
                    <Button 
                      disabled 
                      className="bg-primary-400 hover:bg-primary-500 text-neutral-50 cursor-not-allowed"
                      title="Exportação em desenvolvimento"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar PDF
                    </Button>
                  </div>
                </div>
                <p className="text-neutral-600 text-sm">Monte o orçamento adicionando procedimentos, valores e descontos.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-6 gap-3 p-4 rounded-lg bg-neutral-100 border border-neutral-300">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs text-neutral-600">Procedimento</label>
                    <Input value={procName} onChange={e=>setProcName(e.target.value)} placeholder="Ex: Restauração" className="bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600">Dente</label>
                    <Input value={procTooth} onChange={e=>setProcTooth(e.target.value)} placeholder="Ex: 11" className="bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600">Qtd</label>
                    <Input type="number" min={1} value={procQty} onChange={e=>setProcQty(parseInt(e.target.value)||1)} className="bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600">Valor (R$)</label>
                    <Input value={procPrice} onChange={e=>setProcPrice(e.target.value)} placeholder="150" className="bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600">Desc (%)</label>
                    <Input value={procDiscount} onChange={e=>setProcDiscount(e.target.value)} placeholder="0" className="bg-white" />
                  </div>
                  <div className="md:col-span-6 space-y-1">
                    <label className="text-xs text-neutral-600">Observações</label>
                    <Textarea value={procNotes} onChange={e=>setProcNotes(e.target.value)} placeholder="Detalhes adicionais..." className="min-h-[60px] bg-white" />
                  </div>
                  <div className="md:col-span-6">
                    <Button onClick={addBudgetItem} disabled={!procName || !procPrice} className="w-full bg-primary-600 hover:bg-primary-700 text-neutral-50">Adicionar</Button>
                  </div>
                </div>

                {budgetItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-neutral-300">
                      <table className="min-w-full text-sm">
                        <thead className="bg-primary-600 text-neutral-50">
                          <tr>
                            <th className="py-2 px-3 text-left">Procedimento</th>
                            <th className="py-2 px-3">Dente</th>
                            <th className="py-2 px-3">Qtd</th>
                            <th className="py-2 px-3">Valor</th>
                            <th className="py-2 px-3">Desc%</th>
                            <th className="py-2 px-3">Total</th>
                            <th className="py-2 px-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {budgetItems.map(item => {
                            const total = item.unitPrice * item.qty * (1 - item.discount/100);
                            return (
                              <tr key={item.id} className="border-t">
                                <td className="py-2 px-3 text-neutral-800">{item.procedure}{item.notes && <span className="block text-[10px] text-neutral-500">{item.notes}</span>}</td>
                                <td className="py-2 px-3 text-center">{item.tooth || '-'}</td>
                                <td className="py-2 px-3 text-center">{item.qty}</td>
                                <td className="py-2 px-3 text-center">{item.unitPrice.toLocaleString('pt-BR',{style:'currency', currency:'BRL'})}</td>
                                <td className="py-2 px-3 text-center">{item.discount}</td>
                                <td className="py-2 px-3 text-center font-medium">{total.toLocaleString('pt-BR',{style:'currency', currency:'BRL'})}</td>
                                <td className="py-2 px-3 text-center"><Button variant="ghost" size="sm" onClick={()=>removeBudgetItem(item.id)} className="text-red-600 hover:bg-red-50">Remover</Button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 text-sm">
                      <div className="space-y-1">
                        <p><span className="text-neutral-600">Subtotal:</span> <strong>{budgetSubtotal.toLocaleString('pt-BR',{style:'currency', currency:'BRL'})}</strong></p>
                        <p><span className="text-neutral-600">Descontos:</span> <strong className="text-red-600">-{budgetDiscountTotal.toLocaleString('pt-BR',{style:'currency', currency:'BRL'})}</strong></p>
                        <p><span className="text-neutral-600">Total:</span> <strong className="text-primary-700">{budgetTotal.toLocaleString('pt-BR',{style:'currency', currency:'BRL'})}</strong></p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Treatments (Tratamentos) Tab */}
          <TabsContent value="tratamentos">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="border-primary-900 shadow-sm lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary-900">Tratamentos</CardTitle>
                    <Button 
                      disabled 
                      className="bg-primary-400 hover:bg-primary-500 text-neutral-50 cursor-not-allowed"
                      title="Exportação em desenvolvimento"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar PDF
                    </Button>
                  </div>
                  <p className="text-neutral-600 text-sm">Registre e acompanhe procedimentos (planejado, andamento, concluído).</p>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="grid md:grid-cols-5 gap-3 p-4 rounded-lg bg-neutral-100 border border-neutral-300">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs text-neutral-600">Descrição</label>
                    <Input value={tDesc} onChange={e=>setTDesc(e.target.value)} placeholder="Ex: Restauração composta" className="bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600">Dente</label>
                    <Input value={tTooth} onChange={e=>setTTooth(e.target.value)} placeholder="Ex: 26" className="bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-neutral-600">Status</label>
                    <Select value={tStatus} onValueChange={(v)=>setTStatus(v as any)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planejado">Planejado</SelectItem>
                        <SelectItem value="Em andamento">Em andamento</SelectItem>
                        <SelectItem value="Concluído">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 md:col-span-5">
                    <label className="text-xs text-neutral-600">Observações</label>
                    <Textarea value={tNotes} onChange={e=>setTNotes(e.target.value)} placeholder="Observações clínicas..." className="min-h-[60px] bg-white" />
                  </div>
                  <div className="md:col-span-5">
                    <Button onClick={addTreatment} disabled={!tDesc} className="w-full bg-primary-600 hover:bg-primary-700 text-neutral-50">Adicionar Tratamento</Button>
                  </div>
                </div>

                {treatments.length > 0 && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border border-neutral-300">
                      <table className="min-w-full text-sm">
                        <thead className="bg-primary-600 text-neutral-50">
                          <tr>
                            <th className="py-2 px-3 text-left">Descrição</th>
                            <th className="py-2 px-3">Dente</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">Data</th>
                            <th className="py-2 px-3">Obs</th>
                            <th className="py-2 px-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {treatments.map(t => (
                            <tr key={t.id} className="border-t">
                              <td className="py-2 px-3 text-neutral-800">{t.description}</td>
                              <td className="py-2 px-3 text-center">{t.tooth || '-'}</td>
                              <td className="py-2 px-3 text-center">
                                <Select value={t.status} onValueChange={(v)=>updateTreatmentStatus(t.id, v as any)}>
                                  <SelectTrigger className="h-8 text-xs bg-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Planejado">Planejado</SelectItem>
                                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                                    <SelectItem value="Concluído">Concluído</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="py-2 px-3 text-center whitespace-nowrap">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                              <td className="py-2 px-3 text-center text-[11px] max-w-[140px] truncate" title={t.notes}>{t.notes || '-'}</td>
                              <td className="py-2 px-3 text-center"><Button variant="ghost" size="sm" onClick={()=>removeTreatment(t.id)} className="text-red-600 hover:bg-red-50">Remover</Button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                </CardContent>
              </Card>
              {/* Evoluções */}
              <Card className="border-primary-900 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary-900">Evoluções</CardTitle>
                    <Button variant="outline" size="sm" onClick={()=>setEvolutionDialog(true)}><Plus className="w-4 h-4 mr-1"/>Adicionar</Button>
                  </div>
                  <p className="text-neutral-600 text-sm">Registros cronológicos de evolução clínica.</p>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[480px] overflow-auto">
                  {evolutions.length===0 && <p className="text-neutral-500 text-sm">O paciente não possui evoluções</p>}
                  {evolutions.map(ev => (
                    <div key={ev.id} className="border rounded p-3 bg-neutral-50 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-600">{new Date(ev.date).toLocaleDateString('pt-BR')} • {new Date(ev.date).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={()=>setEvolutions(prev=>prev.filter(e=>e.id!==ev.id))}>Excluir</Button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{ev.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            {/* Dialog Evolução */}
            <Dialog open={evolutionDialog} onOpenChange={setEvolutionDialog}>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Adicionar Evolução</DialogTitle>
                  <DialogDescription>Registre observações clínicas desta sessão.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <Textarea value={evolutionText} onChange={e=>setEvolutionText(e.target.value)} placeholder="Ex: Paciente retorna sem dor, área cicatrizada..." className="min-h-[160px]"/>
                </div>
                <DialogFooter>
                  <div className="flex w-full justify-between items-center gap-2">
                    <Button variant="secondary" onClick={()=>setEvolutionDialog(false)}>Fechar</Button>
                    <Button disabled={!evolutionText.trim()} onClick={()=>{ idSeq.current+=1; setEvolutions(prev=>[...prev,{id:String(idSeq.current), date:new Date().toISOString(), text:evolutionText.trim()}]); setEvolutionText(''); setEvolutionDialog(false); }}>Salvar</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          {/* Imagens */}
          <TabsContent value="imagens">
            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary-900">Imagens</CardTitle>
                  <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50"><Plus className="w-4 h-4 mr-2"/>Adicionar imagem</Button>
                </div>
                <p className="text-neutral-600 text-sm">Galeria simples para anexar fotos clínicas (placeholder).</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-video bg-neutral-100 border rounded flex items-center justify-center text-neutral-500">Sem imagem</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documentos">
            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary-900">Documentos</CardTitle>
                <p className="text-neutral-600 text-sm">Gere documentos padronizados ou personalizados.</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[{title:'Contrato'},{title:'Termo de Consentimento'},{title:'Receituário'} ,{title:'Atestados'},{title:'Personalizado'}].map((card,idx)=>{
                    const isPrescription = card.title==='Receituário';
                    const isCertificate = card.title==='Atestados';
                    return (
                      <Card key={idx} className="border-neutral-300">
                        <CardHeader><CardTitle>{card.title}</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex gap-2">
                            <Button className="flex-1 bg-primary-600 hover:bg-primary-700 text-neutral-50" onClick={() => { if(isPrescription) setShowPrescriptionEditor(true); if(isCertificate) setShowCertificateEditor(true); }}>
                              NOVO
                            </Button>
                            <Button variant="outline" className="flex-1">VER HISTÓRICO</Button>
                          </div>
                          {isPrescription && <div data-rx />}
                          {isCertificate && <div data-cert />}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {/* Editores inline */}
                {showPrescriptionEditor && (
                  <div className="mt-8" id="editor-prescricao">
                    <Card className="border-primary-900 shadow-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-primary-900">Receituário Médico</CardTitle>
                          <div className="flex gap-2">
                            <Button onClick={exportPrescriptionPDF} className="bg-primary-600 hover:bg-primary-700 text-neutral-50" disabled={prescriptionItems.length === 0}><Download className="w-4 h-4 mr-2"/>Exportar PDF</Button>
                            <Button variant="secondary" onClick={()=>setShowPrescriptionEditor(false)}>Fechar</Button>
                          </div>
                        </div>
                        <p className="text-neutral-600 text-sm">Prescreva medicamentos para o paciente</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* bloco de prescrição reutilizado */}
                        <div className="p-4 rounded-lg bg-neutral-100 border border-neutral-300 space-y-4">
                          <h4 className="text-primary-900">Adicionar Medicamento</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm text-neutral-700">Classe de Medicamento</label>
                              <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger className="border-primary-300 bg-white"><SelectValue placeholder="Selecione a classe" /></SelectTrigger>
                                <SelectContent>
                                  {Object.keys(medicationClasses).map((className) => (
                                    <SelectItem key={className} value={className}>{className}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm text-neutral-700">Medicamento</label>
                              <Select value={currentMedication} onValueChange={setCurrentMedication} disabled={!selectedClass}>
                                <SelectTrigger className="border-primary-300 bg-white"><SelectValue placeholder="Selecione o medicamento" /></SelectTrigger>
                                <SelectContent>
                                  {selectedClass && medicationClasses[selectedClass as keyof typeof medicationClasses].map((med) => (
                                    <SelectItem key={med} value={med}>{med}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm text-neutral-700">Posologia</label>
                              <Select value={dosage} onValueChange={setDosage}>
                                <SelectTrigger className="border-primary-300 bg-white"><SelectValue placeholder="Dose" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1 comprimido">1 comprimido</SelectItem>
                                  <SelectItem value="2 comprimidos">2 comprimidos</SelectItem>
                                  <SelectItem value="1 cápsula">1 cápsula</SelectItem>
                                  <SelectItem value="1 sachê">1 sachê</SelectItem>
                                  <SelectItem value="5ml">5ml</SelectItem>
                                  <SelectItem value="10ml">10ml</SelectItem>
                                  <SelectItem value="15ml">15ml</SelectItem>
                                  <SelectItem value="20 gotas">20 gotas</SelectItem>
                                  <SelectItem value="Aplicação tópica">Aplicação tópica</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm text-neutral-700">Frequência</label>
                              <Select value={frequency} onValueChange={setFrequency}>
                                <SelectTrigger className="border-primary-300 bg-white"><SelectValue placeholder="Frequência" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A cada 4 horas">A cada 4 horas</SelectItem>
                                  <SelectItem value="A cada 6 horas">A cada 6 horas</SelectItem>
                                  <SelectItem value="A cada 8 horas">A cada 8 horas</SelectItem>
                                  <SelectItem value="A cada 12 horas">A cada 12 horas</SelectItem>
                                  <SelectItem value="1x ao dia">1x ao dia</SelectItem>
                                  <SelectItem value="2x ao dia">2x ao dia</SelectItem>
                                  <SelectItem value="3x ao dia">3x ao dia</SelectItem>
                                  <SelectItem value="Antes das refeições">Antes das refeições</SelectItem>
                                  <SelectItem value="Após as refeições">Após as refeições</SelectItem>
                                  <SelectItem value="Ao deitar">Ao deitar</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm text-neutral-700">Duração</label>
                              <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger className="border-primary-300 bg-white"><SelectValue placeholder="Duração" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3 dias">3 dias</SelectItem>
                                  <SelectItem value="5 dias">5 dias</SelectItem>
                                  <SelectItem value="7 dias">7 dias</SelectItem>
                                  <SelectItem value="10 dias">10 dias</SelectItem>
                                  <SelectItem value="14 dias">14 dias</SelectItem>
                                  <SelectItem value="21 dias">21 dias</SelectItem>
                                  <SelectItem value="30 dias">30 dias</SelectItem>
                                  <SelectItem value="Uso conforme necessidade">Uso conforme necessidade</SelectItem>
                                  <SelectItem value="Uso contínuo">Uso contínuo</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button onClick={addToPrescription} className="w-full bg-primary-600 hover:bg-primary-700 text-neutral-50" disabled={!currentMedication || !dosage || !frequency || !duration}>Adicionar à Prescrição</Button>
                        </div>
                        {prescriptionItems.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-primary-900">Medicamentos Prescritos:</h4>
                            {prescriptionItems.map((item, index) => (
                              <div key={index} className="p-4 rounded-lg border border-primary-900 bg-primary-50/30">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-primary-900">{item.medication}</p>
                                    <div className="mt-2 space-y-1 text-sm text-neutral-700">
                                      <p>• Posologia: {item.dosage}</p>
                                      <p>• Frequência: {item.frequency}</p>
                                      <p>• Duração: {item.duration}</p>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => removePrescriptionItem(index)} className="text-red-600 hover:text-red-700 hover:bg-red-50">Remover</Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="space-y-2">
                          <label className="text-sm text-neutral-700">Observações Adicionais</label>
                          <Textarea value={observations} onChange={(e) => setObservations(e.target.value)} placeholder="Digite observações importantes sobre a prescrição..." className="min-h-[100px] border-primary-300 focus:border-primary-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {showCertificateEditor && (
                  <div className="mt-8" id="editor-atestado">
                    <Card className="border-primary-900 shadow-sm">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-primary-900">Atestado Médico</CardTitle>
                          <div className="flex gap-2">
                            <Button onClick={exportCertificatePDF} className="bg-primary-600 hover:bg-primary-700 text-neutral-50" disabled={!certificateDays}><Download className="w-4 h-4 mr-2"/>Exportar PDF</Button>
                            <Button variant="secondary" onClick={()=>setShowCertificateEditor(false)}>Fechar</Button>
                          </div>
                        </div>
                        <p className="text-neutral-600 text-sm">Emita atestado médico para o paciente</p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm text-neutral-700">Dias de Afastamento</label>
                            <Select value={certificateDays} onValueChange={setCertificateDays}>
                              <SelectTrigger className="border-primary-300"><SelectValue placeholder="Selecione os dias" /></SelectTrigger>
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
                            <Input value={certificateCID} onChange={(e) => setCertificateCID(e.target.value)} placeholder="Ex: K00.0" className="border-primary-300 focus:border-primary-600" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-neutral-700">Motivo do Atestado</label>
                          <Textarea value={certificateReason} onChange={(e) => setCertificateReason(e.target.value)} placeholder="Descreva o motivo do afastamento (opcional)..." className="min-h-[120px] border-primary-300 focus:border-primary-600" />
                        </div>
                        <div className="p-6 rounded-lg border-2 border-dashed border-primary-300 bg-neutral-50">
                          <h4 className="text-primary-900 mb-4 text-center">Preview do Atestado</h4>
                          <div className="space-y-3 text-neutral-800">
                            <p className="text-center"><strong>ATESTADO MÉDICO</strong></p>
                            <Separator />
                            <p className="text-sm">Atesto para os devidos fins que o(a) paciente <strong>{patient.name}</strong>, esteve sob meus cuidados profissionais em <strong>{new Date().toLocaleDateString('pt-BR')}</strong>.</p>
                            {certificateReason && (<p className="text-sm"><strong>Motivo:</strong> {certificateReason}</p>)}
                            {certificateCID && (<p className="text-sm"><strong>CID:</strong> {certificateCID}</p>)}
                            <p className="text-sm">Necessitando de afastamento de suas atividades pelo período de <strong>{certificateDays} dia(s)</strong>, a partir desta data.</p>
                            <Separator />
                            <p className="text-sm text-center mt-8">_____________________________<br/>Dr. Roberto Silva - CRO 12345<br/>Clínica DentalCare</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Editores renderizados acima quando acionados */}
          </TabsContent>

          {/* Débitos */}
          <TabsContent value="debitos">
            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary-900">Débitos</CardTitle>
                  <Dialog open={newDebitOpen} onOpenChange={setNewDebitOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700 text-neutral-50"><Plus className="w-4 h-4 mr-2"/>Novo débito</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Novo débito</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="novo">
                        <TabsList className="mb-4">
                          <TabsTrigger value="novo">Novo débito</TabsTrigger>
                          <TabsTrigger value="docs">Documentos</TabsTrigger>
                        </TabsList>
                        <TabsContent value="novo">
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-4 gap-3">
                              <div className="md:col-span-1">
                                <label className="text-xs text-neutral-600">Plano</label>
                                <Select value={debitForm.plan} onValueChange={(v)=>setDebitForm(prev=>({...prev, plan:v}))}>
                                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Particular">Particular</SelectItem>
                                    <SelectItem value="Convênio">Convênio</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-1">
                                <label className="text-xs text-neutral-600">Tratamento*</label>
                                <Input value={debitForm.treatment} onChange={e=>setDebitForm(prev=>({...prev, treatment:e.target.value}))} className="bg-white" />
                              </div>
                              <div className="md:col-span-1">
                                <label className="text-xs text-neutral-600">Dentes/Região</label>
                                <Input value={debitForm.region} onChange={e=>setDebitForm(prev=>({...prev, region:e.target.value}))} className="bg-white" />
                              </div>
                              <div className="md:col-span-1">
                                <label className="text-xs text-neutral-600">Valor*</label>
                                <Input value={debitForm.value} onChange={e=>setDebitForm(prev=>({...prev, value:e.target.value}))} className="bg-white" />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-xs text-neutral-600">Dentista*</label>
                                <Input value={debitForm.dentist} onChange={e=>setDebitForm(prev=>({...prev, dentist:e.target.value}))} className="bg-white" />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-neutral-600">Observação</label>
                              <Textarea value={debitForm.notes} onChange={e=>setDebitForm(prev=>({...prev, notes:e.target.value}))} className="bg-white min-h-[120px]" />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="secondary" onClick={()=>setNewDebitOpen(false)}>Fechar</Button>
                              <Button onClick={()=>{ idSeq.current+=1; const amount=parseFloat(debitForm.value.replace(',','.'))||0; setDebits(prev=>[...prev,{id:String(idSeq.current), date:new Date().toISOString(), name:debitForm.treatment||'Tratamento', amount}]); setNewDebitOpen(false); }}>Salvar</Button>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="docs">
                          <div className="py-10 text-center text-primary-700 font-medium">ANEXAR COMPROVANTE</div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex items-center gap-4 text-sm mt-2">
                  <div className="flex items-center gap-2"><span className="text-neutral-600">Total recebido</span> <strong>{debits.filter(d=>d.received).reduce((s,d)=>s+d.amount,0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></div>
                  <div className="flex items-center gap-2"><span className="text-neutral-600">Total a receber</span> <strong className="text-red-600">{debits.filter(d=>!d.received).reduce((s,d)=>s+d.amount,0).toLocaleString('pt-BR',{style:'currency','currency':'BRL'})}</strong></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-neutral-100"><tr><th className="text-left py-2 px-3">Data</th><th className="text-left py-2 px-3">Nome</th><th className="text-right py-2 px-3">Valor</th></tr></thead>
                    <tbody>
                      {debits.length===0 ? (
                        <tr><td colSpan={3} className="py-8 text-center text-neutral-500">Sem débitos</td></tr>
                      ) : (
                        debits.map(d=> (
                          <tr key={d.id} className="border-t">
                            <td className="py-2 px-3">{new Date(d.date).toLocaleDateString('pt-BR')}</td>
                            <td className="py-2 px-3">{d.name}</td>
                            <td className="py-2 px-3 text-right">{d.amount.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}