import { 
  Users, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { useState, useEffect } from "react";

export function Dashboard() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const motivationalQuotes = [
    "Um sorriso é a curva que endireita tudo.",
    "Sorrir é a melhor terapia, e você é o especialista nisso.",
    "Cada paciente é uma oportunidade de transformar vidas.",
    "A excelência não é um ato, mas um hábito.",
    "Seu trabalho ilumina sorrisos todos os dias.",
    "Transformar sorrisos é transformar vidas.",
    "A dedicação de hoje é o sorriso de amanhã.",
    "Pequenos gestos de cuidado fazem grande diferença.",
    "Sua paixão pela odontologia inspira confiança.",
    "Cada dente tratado é uma história de cuidado.",
    "O sucesso é a soma de pequenos esforços repetidos.",
    "Você é a razão de muitos sorrisos felizes.",
    "A saúde bucal é o início da saúde plena.",
    "Sua expertise transforma ansiedade em tranquilidade.",
    "Fazer a diferença, um sorriso por vez.",
    "A prevenção de hoje é a saúde de amanhã.",
    "Seu conhecimento é o melhor instrumento.",
    "Profissionalismo e empatia caminham juntos.",
    "Cada consulta é uma oportunidade de excelência.",
    "O cuidado que você oferece não tem preço.",
    "Sorrisos saudáveis começam com seu trabalho.",
    "Sua dedicação é inspiradora todos os dias.",
    "A precisão e o cuidado definem sua arte.",
    "Transforme dor em alívio, medo em confiança.",
    "Você constrói autoestima através dos sorrisos.",
    "A odontologia é ciência com toque humano.",
    "Cada tratamento é um compromisso com a saúde.",
    "Seu trabalho vai além dos dentes, toca vidas.",
    "A paciência e o cuidado são suas ferramentas.",
    "Continue sendo a diferença na vida dos pacientes."
  ];

  // Atualizar frase a cada 5 minutos
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % motivationalQuotes.length);
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(quoteInterval);
  }, []);

  // Atualizar relógio a cada segundo
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const stats = [
    {
      title: "Pacientes Ativos",
      value: "1,245",
      change: "+12%",
      icon: Users,
      color: "text-primary-600"
    },
    {
      title: "Consultas Hoje",
      value: "18",
      change: "6 pendentes",
      icon: Calendar,
      color: "text-primary-600"
    },
    {
      title: "Receita Mensal",
      value: "R$ 45.890",
      change: "+8%",
      icon: DollarSign,
      color: "text-primary-600"
    },
    {
      title: "Taxa de Ocupação",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-primary-600"
    }
  ];

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
      {/* Motivational Quote & Clock Bar */}
      <div className="flex items-center justify-between gap-6 p-5 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-2xl border border-primary-200/50 shadow-sm bg-[rgba(255,250,250,0)] mt-[0px] mr-[0px] mb-[32px] ml-[823px]">
        <div className="flex-1">
          <p className="text-primary-800 italic text-center">"{motivationalQuotes[currentQuoteIndex]}"</p>
        </div>
        <div className="text-right border-l border-primary-300 pl-6">
          <p className="text-primary-900 text-2xl tabular-nums tracking-tight">{formatTime(currentTime)}</p>
          <p className="text-primary-600 text-xs mt-0.5 capitalize">{formatDate(currentTime)}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-primary-900 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-neutral-600 text-sm">{stat.title}</p>
                    <h3 className="text-primary-900 mt-2">{stat.value}</h3>
                    <p className="text-primary-600 text-sm mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-primary-50 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="border-primary-900 shadow-md">
          <CardHeader>
            <CardTitle className="text-primary-900">Receita vs Despesas</CardTitle>
            <CardDescription>Últimos 5 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8d5c4" />
                <XAxis dataKey="month" stroke="#635750" />
                <YAxis stroke="#635750" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fdfcfb', 
                    border: '1px solid #e8d5c4',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#7a2b45" 
                  strokeWidth={3}
                  name="Receita"
                  dot={{ fill: '#7a2b45', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="despesas" 
                  stroke="#b8a899" 
                  strokeWidth={3}
                  name="Despesas"
                  dot={{ fill: '#b8a899', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointments Chart */}
        <Card className="border-primary-900 shadow-md">
          <CardHeader>
            <CardTitle className="text-primary-900">Consultas na Semana</CardTitle>
            <CardDescription>Total de agendamentos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8d5c4" />
                <XAxis dataKey="day" stroke="#635750" />
                <YAxis stroke="#635750" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fdfcfb', 
                    border: '1px solid #e8d5c4',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="consultas" fill="#8b3a57" radius={[8, 8, 0, 0]} name="Consultas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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