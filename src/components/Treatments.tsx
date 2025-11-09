import { useState } from "react";
import { Plus, Search, Filter, Clock, CheckCircle, AlertCircle, Calendar, User, DollarSign, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";

export function Treatments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Novo tratamento
  const [newTreatmentPatient, setNewTreatmentPatient] = useState("");
  const [newTreatmentType, setNewTreatmentType] = useState("");
  const [newTreatmentDescription, setNewTreatmentDescription] = useState("");
  const [newTreatmentValue, setNewTreatmentValue] = useState("");
  const [newTreatmentSessions, setNewTreatmentSessions] = useState("1");

  const treatmentTypes = [
    { name: "Limpeza Dental", duration: "30-45 min", avgValue: "R$ 150" },
    { name: "Tratamento de Canal", duration: "60-90 min", avgValue: "R$ 800" },
    { name: "Ortodontia", duration: "Manutenção mensal", avgValue: "R$ 300/mês" },
    { name: "Clareamento", duration: "3-4 sessões", avgValue: "R$ 1.200" },
    { name: "Extração", duration: "30-60 min", avgValue: "R$ 200" },
    { name: "Restauração", duration: "45-60 min", avgValue: "R$ 250" },
    { name: "Implante Dentário", duration: "Múltiplas sessões", avgValue: "R$ 3.500" },
    { name: "Prótese Dentária", duration: "Múltiplas sessões", avgValue: "R$ 2.000" },
    { name: "Periodontia", duration: "45-60 min", avgValue: "R$ 300" },
    { name: "Cirurgia Oral", duration: "60-120 min", avgValue: "R$ 800" }
  ];

  const activeTreatments = [
    {
      id: 1,
      patient: "Maria Santos",
      patientAvatar: "MS",
      type: "Ortodontia",
      startDate: "15/09/2024",
      progress: 60,
      sessionsCompleted: 6,
      totalSessions: 10,
      nextSession: "15/11/2024",
      value: "R$ 3.000",
      status: "in-progress",
      description: "Correção de mordida cruzada anterior"
    },
    {
      id: 2,
      patient: "João Silva",
      patientAvatar: "JS",
      type: "Implante Dentário",
      startDate: "01/10/2024",
      progress: 40,
      sessionsCompleted: 2,
      totalSessions: 5,
      nextSession: "20/11/2024",
      value: "R$ 3.500",
      status: "in-progress",
      description: "Implante unitário elemento 36"
    },
    {
      id: 3,
      patient: "Ana Oliveira",
      patientAvatar: "AO",
      type: "Clareamento",
      startDate: "28/10/2024",
      progress: 75,
      sessionsCompleted: 3,
      totalSessions: 4,
      nextSession: "12/11/2024",
      value: "R$ 1.200",
      status: "in-progress",
      description: "Clareamento dental caseiro + consultório"
    },
    {
      id: 4,
      patient: "Pedro Costa",
      patientAvatar: "PC",
      type: "Tratamento de Canal",
      startDate: "05/11/2024",
      progress: 33,
      sessionsCompleted: 1,
      totalSessions: 3,
      nextSession: "18/11/2024",
      value: "R$ 800",
      status: "in-progress",
      description: "Canal elemento 16"
    }
  ];

  const completedTreatments = [
    {
      id: 5,
      patient: "Julia Ferreira",
      patientAvatar: "JF",
      type: "Limpeza Dental",
      startDate: "01/10/2024",
      endDate: "01/10/2024",
      sessionsCompleted: 1,
      totalSessions: 1,
      value: "R$ 150",
      status: "completed",
      description: "Limpeza e profilaxia"
    },
    {
      id: 6,
      patient: "Carlos Mendes",
      patientAvatar: "CM",
      type: "Restauração",
      startDate: "20/09/2024",
      endDate: "20/09/2024",
      sessionsCompleted: 1,
      totalSessions: 1,
      value: "R$ 250",
      status: "completed",
      description: "Restauração em resina composta elemento 26"
    }
  ];

  const pendingTreatments = [
    {
      id: 7,
      patient: "Roberto Alves",
      patientAvatar: "RA",
      type: "Prótese Dentária",
      scheduledDate: "25/11/2024",
      value: "R$ 2.000",
      status: "pending",
      description: "Prótese parcial removível superior"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Andamento</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>;
      case "pending":
        return <Badge className="bg-amber-50 text-amber-800 border-amber-200">Pendente</Badge>;
      default:
        return null;
    }
  };

  const handleAddTreatment = () => {
    // Lógica para adicionar tratamento
    console.log("Novo tratamento:", {
      patient: newTreatmentPatient,
      type: newTreatmentType,
      description: newTreatmentDescription,
      value: newTreatmentValue,
      sessions: newTreatmentSessions
    });
    setIsAddDialogOpen(false);
    // Reset form
    setNewTreatmentPatient("");
    setNewTreatmentType("");
    setNewTreatmentDescription("");
    setNewTreatmentValue("");
    setNewTreatmentSessions("1");
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary-900">Tratamentos</h1>
          <p className="text-neutral-600 mt-1">Gerenciar planos e histórico de tratamentos</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
              <Plus className="w-4 h-4 mr-2" />
              Novo Tratamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-primary-900">
            <DialogHeader>
              <DialogTitle className="text-primary-900">Iniciar Novo Tratamento</DialogTitle>
              <DialogDescription>
                Preencha as informações para iniciar um novo plano de tratamento
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-neutral-700">Paciente</label>
                  <Select value={newTreatmentPatient} onValueChange={setNewTreatmentPatient}>
                    <SelectTrigger className="border-primary-300">
                      <SelectValue placeholder="Selecione o paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maria">Maria Santos</SelectItem>
                      <SelectItem value="joao">João Silva</SelectItem>
                      <SelectItem value="ana">Ana Oliveira</SelectItem>
                      <SelectItem value="pedro">Pedro Costa</SelectItem>
                      <SelectItem value="julia">Julia Ferreira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-neutral-700">Tipo de Tratamento</label>
                  <Select value={newTreatmentType} onValueChange={setNewTreatmentType}>
                    <SelectTrigger className="border-primary-300">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {treatmentTypes.map((treatment) => (
                        <SelectItem key={treatment.name} value={treatment.name}>
                          {treatment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-neutral-700">Valor do Tratamento</label>
                  <Input
                    value={newTreatmentValue}
                    onChange={(e) => setNewTreatmentValue(e.target.value)}
                    placeholder="R$ 0,00"
                    className="border-primary-300 focus:border-primary-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-neutral-700">Número de Sessões</label>
                  <Select value={newTreatmentSessions} onValueChange={setNewTreatmentSessions}>
                    <SelectTrigger className="border-primary-300">
                      <SelectValue placeholder="Sessões" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 sessão</SelectItem>
                      <SelectItem value="2">2 sessões</SelectItem>
                      <SelectItem value="3">3 sessões</SelectItem>
                      <SelectItem value="4">4 sessões</SelectItem>
                      <SelectItem value="5">5 sessões</SelectItem>
                      <SelectItem value="10">10 sessões</SelectItem>
                      <SelectItem value="12">12 sessões</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-700">Descrição do Tratamento</label>
                <Textarea
                  value={newTreatmentDescription}
                  onChange={(e) => setNewTreatmentDescription(e.target.value)}
                  placeholder="Descreva os detalhes do tratamento..."
                  className="min-h-[100px] border-primary-300 focus:border-primary-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleAddTreatment}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-neutral-50"
                  disabled={!newTreatmentPatient || !newTreatmentType}
                >
                  Iniciar Tratamento
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="border-primary-300"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Em Andamento</p>
                <h3 className="text-primary-900 mt-2">{activeTreatments.length}</h3>
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
                <p className="text-neutral-600 text-sm">Concluídos</p>
                <h3 className="text-primary-900 mt-2">{completedTreatments.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Pendentes</p>
                <h3 className="text-primary-900 mt-2">{pendingTreatments.length}</h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-50">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Receita Mensal</p>
                <h3 className="text-primary-900 mt-2">R$ 9.900</h3>
              </div>
              <div className="p-3 rounded-xl bg-primary-50">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tratamentos Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-200">
          <TabsTrigger value="active" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            Em Andamento ({activeTreatments.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            Concluídos ({completedTreatments.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary-600 data-[state=active]:text-neutral-50">
            Pendentes ({pendingTreatments.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Treatments */}
        <TabsContent value="active" className="mt-6 space-y-4">
          {activeTreatments.map((treatment) => (
            <Card key={treatment.id} className="border-primary-900 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border-2 border-primary-200">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary-600 text-neutral-50">
                        {treatment.patientAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-primary-900">{treatment.patient}</h4>
                      <p className="text-neutral-600 text-sm">{treatment.type}</p>
                    </div>
                  </div>
                  {getStatusBadge(treatment.status)}
                </div>

                <p className="text-neutral-700 text-sm mb-4">{treatment.description}</p>

                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-neutral-600">Progresso do Tratamento</span>
                      <span className="text-primary-900">{treatment.progress}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${treatment.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      {treatment.sessionsCompleted} de {treatment.totalSessions} sessões completadas
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-600" />
                      <div>
                        <p className="text-xs text-neutral-600">Início</p>
                        <p className="text-sm text-primary-900">{treatment.startDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary-600" />
                      <div>
                        <p className="text-xs text-neutral-600">Próxima Sessão</p>
                        <p className="text-sm text-primary-900">{treatment.nextSession}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary-600" />
                      <div>
                        <p className="text-xs text-neutral-600">Valor</p>
                        <p className="text-sm text-primary-900">{treatment.value}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-primary-600 hover:bg-primary-700 text-neutral-50" size="sm">
                      Atualizar Progresso
                    </Button>
                    <Button variant="outline" size="sm" className="border-primary-300 text-primary-700">
                      <FileText className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Completed Treatments */}
        <TabsContent value="completed" className="mt-6 space-y-4">
          {completedTreatments.map((treatment) => (
            <Card key={treatment.id} className="border-primary-900 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border-2 border-primary-200">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary-600 text-neutral-50">
                        {treatment.patientAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-primary-900">{treatment.patient}</h4>
                      <p className="text-neutral-600 text-sm">{treatment.type}</p>
                    </div>
                  </div>
                  {getStatusBadge(treatment.status)}
                </div>

                <p className="text-neutral-700 text-sm mb-4">{treatment.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-600" />
                    <div>
                      <p className="text-xs text-neutral-600">Data de Conclusão</p>
                      <p className="text-sm text-primary-900">{treatment.endDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-neutral-600">Sessões</p>
                      <p className="text-sm text-primary-900">{treatment.sessionsCompleted} sessão(ões)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary-600" />
                    <div>
                      <p className="text-xs text-neutral-600">Valor</p>
                      <p className="text-sm text-primary-900">{treatment.value}</p>
                    </div>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4 border-primary-300 text-primary-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Histórico Completo
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Pending Treatments */}
        <TabsContent value="pending" className="mt-6 space-y-4">
          {pendingTreatments.map((treatment) => (
            <Card key={treatment.id} className="border-primary-900 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border-2 border-primary-200">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary-600 text-neutral-50">
                        {treatment.patientAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-primary-900">{treatment.patient}</h4>
                      <p className="text-neutral-600 text-sm">{treatment.type}</p>
                    </div>
                  </div>
                  {getStatusBadge(treatment.status)}
                </div>

                <p className="text-neutral-700 text-sm mb-4">{treatment.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-600" />
                    <div>
                      <p className="text-xs text-neutral-600">Data Agendada</p>
                      <p className="text-sm text-primary-900">{treatment.scheduledDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary-600" />
                    <div>
                      <p className="text-xs text-neutral-600">Valor Estimado</p>
                      <p className="text-sm text-primary-900">{treatment.value}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button className="flex-1 bg-primary-600 hover:bg-primary-700 text-neutral-50" size="sm">
                    Iniciar Tratamento
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary-300 text-primary-700">
                    Reagendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Treatment Types Reference */}
      <Card className="border-primary-900 shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary-900">Tipos de Tratamentos Disponíveis</CardTitle>
          <p className="text-neutral-600 text-sm">Referência rápida de procedimentos e valores médios</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {treatmentTypes.map((treatment) => (
              <div
                key={treatment.name}
                className="p-4 rounded-lg border border-neutral-300 hover:border-primary-400 hover:bg-primary-50/30 transition-all"
              >
                <h4 className="text-primary-900">{treatment.name}</h4>
                <div className="mt-2 space-y-1 text-sm">
                  <p className="text-neutral-600">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {treatment.duration}
                  </p>
                  <p className="text-primary-700">
                    <DollarSign className="w-3 h-3 inline mr-1" />
                    {treatment.avgValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}