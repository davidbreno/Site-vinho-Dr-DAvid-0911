import { useState } from "react";
import { Calendar, Download, TrendingUp, Users, DollarSign, Clock, FileText, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

export function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const monthlyRevenue = [
    { month: "Jan", receita: 35000, despesas: 20000, lucro: 15000 },
    { month: "Fev", receita: 38000, despesas: 22000, lucro: 16000 },
    { month: "Mar", receita: 42000, despesas: 21000, lucro: 21000 },
    { month: "Abr", receita: 41000, despesas: 23000, lucro: 18000 },
    { month: "Mai", receita: 45890, despesas: 24000, lucro: 21890 },
    { month: "Jun", receita: 48000, despesas: 25000, lucro: 23000 },
  ];

  const treatmentsByType = [
    { name: "Limpeza", value: 35, color: "#8b3a57" },
    { name: "Ortodontia", value: 20, color: "#a85f7a" },
    { name: "Canal", value: 15, color: "#c4869d" },
    { name: "Clareamento", value: 12, color: "#dab0bf" },
    { name: "Outros", value: 18, color: "#e8d5c4" }
  ];

  const patientGrowth = [
    { month: "Jan", pacientes: 120 },
    { month: "Fev", pacientes: 145 },
    { month: "Mar", pacientes: 167 },
    { month: "Abr", pacientes: 189 },
    { month: "Mai", pacientes: 210 },
    { month: "Jun", pacientes: 245 },
  ];

  const appointmentStats = [
    { dia: "Seg", realizadas: 15, canceladas: 2 },
    { dia: "Ter", realizadas: 22, canceladas: 1 },
    { dia: "Qua", realizadas: 18, canceladas: 3 },
    { dia: "Qui", realizadas: 25, canceladas: 2 },
    { dia: "Sex", realizadas: 20, canceladas: 1 },
    { dia: "Sáb", realizadas: 8, canceladas: 0 },
  ];

  const topTreatments = [
    { treatment: "Limpeza Dental", count: 145, revenue: "R$ 21.750" },
    { treatment: "Ortodontia", count: 32, revenue: "R$ 9.600" },
    { treatment: "Tratamento de Canal", count: 28, revenue: "R$ 22.400" },
    { treatment: "Clareamento", count: 24, revenue: "R$ 28.800" },
    { treatment: "Restauração", count: 56, revenue: "R$ 14.000" }
  ];

  const exportReport = (type: string) => {
    const date = new Date().toLocaleDateString('pt-BR');
    const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              RELATÓRIO ${type.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clínica: DentalCare
Data de Emissão: ${date}
Período: ${selectedPeriod === 'month' ? 'Mensal' : selectedPeriod === 'quarter' ? 'Trimestral' : 'Anual'}

${type === 'financeiro' ? `
RESUMO FINANCEIRO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Receita Total: R$ 45.890,00
Despesas Total: R$ 24.000,00
Lucro Líquido: R$ 21.890,00
Margem de Lucro: 47.7%

RECEITAS POR MÊS:
${monthlyRevenue.map(m => `${m.month}: R$ ${m.receita.toLocaleString('pt-BR')}`).join('\n')}
` : ''}

${type === 'pacientes' ? `
RESUMO DE PACIENTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total de Pacientes: 245
Novos Pacientes: 35
Taxa de Crescimento: 16.8%

CRESCIMENTO MENSAL:
${patientGrowth.map(p => `${p.month}: ${p.pacientes} pacientes`).join('\n')}
` : ''}

${type === 'tratamentos' ? `
TRATAMENTOS MAIS REALIZADOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${topTreatments.map((t, i) => `${i + 1}. ${t.treatment}\n   Quantidade: ${t.count} | Receita: ${t.revenue}`).join('\n\n')}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dr. Roberto Silva - CRO 12345
Clínica DentalCare
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${type}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary-900">Relatórios</h1>
          <p className="text-neutral-600 mt-1">Análise e estatísticas da clínica</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 border-primary-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semanal</SelectItem>
              <SelectItem value="month">Mensal</SelectItem>
              <SelectItem value="quarter">Trimestral</SelectItem>
              <SelectItem value="year">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Receita Total</p>
                <h3 className="text-primary-900 mt-2">R$ 45.890</h3>
                <p className="text-green-600 text-sm mt-1">+8% vs mês anterior</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Total Pacientes</p>
                <h3 className="text-primary-900 mt-2">245</h3>
                <p className="text-green-600 text-sm mt-1">+35 novos</p>
              </div>
              <div className="p-3 rounded-xl bg-primary-50">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Consultas Realizadas</p>
                <h3 className="text-primary-900 mt-2">108</h3>
                <p className="text-neutral-600 text-sm mt-1">Este mês</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Taxa de Ocupação</p>
                <h3 className="text-primary-900 mt-2">87%</h3>
                <p className="text-green-600 text-sm mt-1">+5% vs mês anterior</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50">
                <BarChart3 className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-neutral-200">
          <TabsTrigger value="financial" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="patients" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            Pacientes
          </TabsTrigger>
          <TabsTrigger value="treatments" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            Tratamentos
          </TabsTrigger>
          <TabsTrigger value="appointments" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            Consultas
          </TabsTrigger>
        </TabsList>

        {/* Financial Report */}
        <TabsContent value="financial" className="mt-6 space-y-6">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary-900">Análise Financeira</CardTitle>
                <Button onClick={() => exportReport('financeiro')} className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyRevenue}>
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
                  <Line type="monotone" dataKey="receita" stroke="#7a2b45" strokeWidth={3} name="Receita" />
                  <Line type="monotone" dataKey="despesas" stroke="#c4869d" strokeWidth={3} name="Despesas" />
                  <Line type="monotone" dataKey="lucro" stroke="#2d9f5a" strokeWidth={3} name="Lucro" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patients Report */}
        <TabsContent value="patients" className="mt-6 space-y-6">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary-900">Crescimento de Pacientes</CardTitle>
                <Button onClick={() => exportReport('pacientes')} className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={patientGrowth}>
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
                  <Bar dataKey="pacientes" fill="#8b3a57" radius={[8, 8, 0, 0]} name="Pacientes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Treatments Report */}
        <TabsContent value="treatments" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary-900">Distribuição de Tratamentos</CardTitle>
                  <Button onClick={() => exportReport('tratamentos')} className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={treatmentsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {treatmentsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-primary-900 shadow-sm">
              <CardHeader>
                <CardTitle className="text-primary-900">Top Tratamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topTreatments.map((treatment, index) => (
                    <div key={index} className="p-4 rounded-lg border border-neutral-300 hover:bg-primary-50/30 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-primary-900">{treatment.treatment}</h4>
                        <Badge className="bg-primary-600 text-neutral-50">{treatment.count}</Badge>
                      </div>
                      <p className="text-neutral-600 text-sm">Receita: {treatment.revenue}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Report */}
        <TabsContent value="appointments" className="mt-6 space-y-6">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary-900">Estatísticas de Consultas</CardTitle>
                <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={appointmentStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8d5c4" />
                  <XAxis dataKey="dia" stroke="#635750" />
                  <YAxis stroke="#635750" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fdfcfb', 
                      border: '1px solid #e8d5c4',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="realizadas" fill="#2d9f5a" radius={[8, 8, 0, 0]} name="Realizadas" />
                  <Bar dataKey="canceladas" fill="#ef4444" radius={[8, 8, 0, 0]} name="Canceladas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}