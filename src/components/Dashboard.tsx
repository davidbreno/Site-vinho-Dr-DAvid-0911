import { Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState, useEffect, Suspense, lazy } from "react";
const ChartsSection = lazy(() => import('./ChartsSection'));

// Frases motivacionais (pode expandir depois)
const motivationalQuotes = [
  "Sorrir também é um tratamento.",
  "Cada paciente é único.",
  "Odontologia com propósito.",
  "Pequenos cuidados, grandes resultados.",
  "Excelência em cada detalhe."
];

function formatTime(d: Date) {
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(d: Date) {
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

export function Dashboard() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Rotação da frase a cada 12s e atualização do relógio a cada minuto
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length);
    }, 12000);
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => { clearInterval(quoteTimer); clearInterval(clockTimer); };
  }, []);

  const revenueData = [
    { month: "Jan", receita: 35000, despesas: 20000 },
    { month: "Fev", receita: 38000, despesas: 22000 },
    { month: "Mar", receita: 42000, despesas: 21000 },
    { month: "Abr", receita: 41000, despesas: 23000 },
    { month: "Mai", receita: 45890, despesas: 24000 },
  ];

  const appointmentsData = [
    { day: "Seg", consultas: 15 },
    { day: "Ter", consultas: 22 },
    { day: "Qua", consultas: 18 },
    { day: "Qui", consultas: 25 },
    { day: "Sex", consultas: 20 },
    { day: "Sáb", consultas: 8 },
  ];

  const todayAppointments = [
    {
      id: 1,
      patient: "Maria Santos",
      time: "09:00",
      treatment: "Limpeza",
      status: "completed",
      avatar: "MS"
    },
    {
      id: 2,
      patient: "João Silva",
      time: "10:30",
      treatment: "Ortodontia",
      status: "in-progress",
      avatar: "JS"
    },
    {
      id: 3,
      patient: "Ana Oliveira",
      time: "14:00",
      treatment: "Canal",
      status: "pending",
      avatar: "AO"
    },
    {
      id: 4,
      patient: "Pedro Costa",
      time: "15:30",
      treatment: "Extração",
      status: "pending",
      avatar: "PC"
    },
    {
      id: 5,
      patient: "Julia Ferreira",
      time: "17:00",
      treatment: "Clareamento",
      status: "pending",
      avatar: "JF"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: "Concluído", variant: "default" as const, className: "bg-green-100 text-green-800 border-green-200" },
      "in-progress": { label: "Em Andamento", variant: "secondary" as const, className: "bg-blue-100 text-blue-800 border-blue-200" },
      pending: { label: "Pendente", variant: "outline" as const, className: "bg-amber-50 text-amber-800 border-amber-200" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Barra de Hora e Frase Motivacional */}
      <div className="flex items-center justify-between gap-6 px-8 py-2 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-2xl border border-primary-200/50 shadow-sm w-[98vw] max-w-[1800px] mx-auto mt-8">
        <div className="flex-1">
          <p className="text-primary-800 italic text-center text-base">"{motivationalQuotes[currentQuoteIndex]}"</p>
        </div>
        <div className="text-right border-l border-primary-300 pl-6">
          <p className="text-primary-900 text-2xl tabular-nums tracking-tight">{formatTime(currentTime)}</p>
          <p className="text-primary-600 text-xs mt-0.5 capitalize">{formatDate(currentTime)}</p>
        </div>
      </div>
      {/* Charts (lazy) */}
      <Suspense fallback={<div className="text-center text-sm text-neutral-500">Carregando gráficos...</div>}>
        <ChartsSection revenueData={revenueData} appointmentsData={appointmentsData} />
      </Suspense>

      {/* Today's Appointments */}
      <Card className="border-primary-900 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary-900">Consultas de Hoje</CardTitle>
              <CardDescription>Agendamentos para hoje, 9 de Novembro</CardDescription>
            </div>
            <Badge className="bg-primary-600 text-neutral-50">
              {todayAppointments.length} consultas
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div 
                key={appointment.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-neutral-300 hover:border-primary-400 hover:bg-primary-50/30 transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-12 h-12 border-2 border-primary-200">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary-600 text-neutral-50">
                      {appointment.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-primary-900">{appointment.patient}</p>
                    <p className="text-neutral-600 text-sm">{appointment.treatment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{appointment.time}</span>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}