import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Download, Filter, Calendar, CreditCard, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export function Billing() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [filterStatus, setFilterStatus] = useState("all");

  const transactions = [
    {
      id: 1,
      patient: "Maria Santos",
      treatment: "Ortodontia - Manutenção",
      value: "R$ 300,00",
      date: "08/11/2024",
      method: "Cartão de Crédito",
      status: "paid",
      invoice: "#001234"
    },
    {
      id: 2,
      patient: "João Silva",
      treatment: "Implante Dentário - 1ª Parcela",
      value: "R$ 700,00",
      date: "07/11/2024",
      method: "PIX",
      status: "paid",
      invoice: "#001233"
    },
    {
      id: 3,
      patient: "Ana Oliveira",
      treatment: "Clareamento",
      value: "R$ 1.200,00",
      date: "06/11/2024",
      method: "Cartão de Débito",
      status: "paid",
      invoice: "#001232"
    },
    {
      id: 4,
      patient: "Pedro Costa",
      treatment: "Tratamento de Canal",
      value: "R$ 800,00",
      date: "15/11/2024",
      method: "Boleto",
      status: "pending",
      invoice: "#001235"
    },
    {
      id: 5,
      patient: "Carlos Mendes",
      treatment: "Limpeza Dental",
      value: "R$ 150,00",
      date: "05/11/2024",
      method: "Dinheiro",
      status: "paid",
      invoice: "#001231"
    },
    {
      id: 6,
      patient: "Roberto Alves",
      treatment: "Prótese Dentária - Entrada",
      value: "R$ 500,00",
      date: "01/11/2024",
      method: "Cartão de Crédito",
      status: "overdue",
      invoice: "#001230"
    }
  ];

  const expenses = [
    {
      id: 1,
      category: "Material Odontológico",
      description: "Resinas e cimentos",
      value: "R$ 1.850,00",
      date: "05/11/2024",
      status: "paid"
    },
    {
      id: 2,
      category: "Salários",
      description: "Folha de pagamento",
      value: "R$ 12.000,00",
      date: "01/11/2024",
      status: "paid"
    },
    {
      id: 3,
      category: "Aluguel",
      description: "Aluguel da clínica",
      value: "R$ 3.500,00",
      date: "01/11/2024",
      status: "paid"
    },
    {
      id: 4,
      category: "Equipamentos",
      description: "Manutenção equipamentos",
      value: "R$ 850,00",
      date: "10/11/2024",
      status: "pending"
    },
    {
      id: 5,
      category: "Utilidades",
      description: "Água, luz, internet",
      value: "R$ 680,00",
      date: "05/11/2024",
      status: "paid"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pago</Badge>;
      case "pending":
        return <Badge className="bg-amber-50 text-amber-800 border-amber-200">Pendente</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Atrasado</Badge>;
      default:
        return null;
    }
  };

  const totalReceitas = transactions
    .filter(t => t.status === "paid")
    .reduce((acc, t) => acc + parseFloat(t.value.replace("R$ ", "").replace(".", "").replace(",", ".")), 0);

  const totalDespesas = expenses
    .filter(e => e.status === "paid")
    .reduce((acc, e) => acc + parseFloat(e.value.replace("R$ ", "").replace(".", "").replace(",", ".")), 0);

  const lucro = totalReceitas - totalDespesas;

  const exportFinancialReport = () => {
    const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          RELATÓRIO FINANCEIRO DETALHADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Clínica: DentalCare
Data: ${new Date().toLocaleDateString('pt-BR')}
Período: ${selectedPeriod === 'month' ? 'Mensal' : 'Trimestral'}

RESUMO FINANCEIRO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Receitas Totais: R$ ${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Despesas Totais: R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Lucro Líquido: R$ ${lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Margem: ${((lucro / totalReceitas) * 100).toFixed(1)}%

RECEITAS (PAGAS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${transactions.filter(t => t.status === 'paid').map(t => 
  `${t.invoice} - ${t.patient}
  ${t.treatment}
  Valor: ${t.value} | Data: ${t.date} | Método: ${t.method}`
).join('\n\n')}

DESPESAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${expenses.map(e => 
  `${e.category}
  ${e.description}
  Valor: ${e.value} | Data: ${e.date}`
).join('\n\n')}

PENDÊNCIAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${transactions.filter(t => t.status !== 'paid').map(t => 
  `${t.invoice} - ${t.patient} - ${t.value} - ${t.status === 'overdue' ? 'ATRASADO' : 'PENDENTE'}`
).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dr. Roberto Silva - CRO 12345
Clínica DentalCare
    `;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.txt`;
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
          <h1 className="text-primary-900">Financeiro</h1>
          <p className="text-neutral-600 mt-1">Gestão completa de receitas e despesas</p>
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
          <Button onClick={exportFinancialReport} className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Receitas</p>
                <h3 className="text-primary-900 mt-2">R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8% vs mês anterior
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Despesas</p>
                <h3 className="text-primary-900 mt-2">R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  Controladas
                </p>
              </div>
              <div className="p-3 rounded-xl bg-red-50">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Lucro Líquido</p>
                <h3 className="text-primary-900 mt-2">R$ {lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <p className="text-primary-600 text-sm mt-1">
                  {((lucro / totalReceitas) * 100).toFixed(1)}% margem
                </p>
              </div>
              <div className="p-3 rounded-xl bg-primary-50">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">A Receber</p>
                <h3 className="text-primary-900 mt-2">R$ 1.300,00</h3>
                <p className="text-amber-600 text-sm mt-1">
                  2 pendentes
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="income" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-neutral-200">
          <TabsTrigger value="income" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            <DollarSign className="w-4 h-4 mr-2" />
            Receitas
          </TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            <TrendingDown className="w-4 h-4 mr-2" />
            Despesas
          </TabsTrigger>
        </TabsList>

        {/* Income Tab */}
        <TabsContent value="income" className="mt-6 space-y-4">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary-900">Receitas e Pagamentos</CardTitle>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40 border-primary-300">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="paid">Pagos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="overdue">Atrasados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions
                  .filter(t => filterStatus === 'all' || t.status === filterStatus)
                  .map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-4 rounded-lg border border-neutral-300 hover:bg-primary-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-primary-900">{transaction.patient}</h4>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-neutral-600 text-sm">{transaction.treatment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary-900">{transaction.value}</p>
                        <p className="text-neutral-600 text-sm">{transaction.invoice}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-neutral-600">
                          <Calendar className="w-4 h-4" />
                          {transaction.date}
                        </div>
                        <div className="flex items-center gap-1 text-neutral-600">
                          <CreditCard className="w-4 h-4" />
                          {transaction.method}
                        </div>
                      </div>
                      {transaction.status !== 'paid' && (
                        <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
                          Confirmar Pagamento
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="mt-6 space-y-4">
          <Card className="border-primary-900 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary-900">Despesas e Custos</CardTitle>
                <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Nova Despesa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="p-4 rounded-lg border border-neutral-300 hover:bg-primary-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-primary-100 text-primary-800 border-primary-200">
                            {expense.category}
                          </Badge>
                          {getStatusBadge(expense.status)}
                        </div>
                        <p className="text-neutral-700 mt-2">{expense.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-600">{expense.value}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-neutral-600">
                        <Calendar className="w-4 h-4" />
                        {expense.date}
                      </div>
                      {expense.status !== 'paid' && (
                        <Button size="sm" variant="outline" className="border-primary-300 text-primary-700">
                          Marcar como Pago
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary-900">Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                <span className="text-neutral-700">Cartão de Crédito</span>
                <span className="text-primary-900">R$ 1.000,00 (2 trans.)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                <span className="text-neutral-700">PIX</span>
                <span className="text-primary-900">R$ 700,00 (1 trans.)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                <span className="text-neutral-700">Cartão de Débito</span>
                <span className="text-primary-900">R$ 1.200,00 (1 trans.)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                <span className="text-neutral-700">Dinheiro</span>
                <span className="text-primary-900">R$ 150,00 (1 trans.)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary-900">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                <span className="text-neutral-700">Salários</span>
                <span className="text-red-600">R$ 12.000,00</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                <span className="text-neutral-700">Aluguel</span>
                <span className="text-red-600">R$ 3.500,00</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                <span className="text-neutral-700">Material</span>
                <span className="text-red-600">R$ 1.850,00</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                <span className="text-neutral-700">Equipamentos</span>
                <span className="text-red-600">R$ 850,00</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100">
                <span className="text-neutral-700">Utilidades</span>
                <span className="text-red-600">R$ 680,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
