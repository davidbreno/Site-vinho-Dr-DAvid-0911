import { useMemo, useState } from "react";
import { Search, Plus, Phone, Mail, Calendar, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";

import type { Patient } from '../types/patient';

interface PatientsProps {
  onViewPatientRecord: (patient: Patient) => void;
}

export function Patients({ onViewPatientRecord }: PatientsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: "Maria Santos",
      age: 32,
      phone: "(11) 98765-4321",
      email: "maria.santos@email.com",
      lastVisit: "05/11/2024",
      nextVisit: "15/11/2024",
      status: "active",
      avatar: "MS"
    },
    {
      id: 2,
      name: "João Silva",
      age: 45,
      phone: "(11) 97654-3210",
      email: "joao.silva@email.com",
      lastVisit: "01/11/2024",
      nextVisit: "20/11/2024",
      status: "active",
      avatar: "JS"
    },
    {
      id: 3,
      name: "Ana Oliveira",
      age: 28,
      phone: "(11) 96543-2109",
      email: "ana.oliveira@email.com",
      lastVisit: "28/10/2024",
      nextVisit: "12/11/2024",
      status: "active",
      avatar: "AO"
    },
    {
      id: 4,
      name: "Pedro Costa",
      age: 55,
      phone: "(11) 95432-1098",
      email: "pedro.costa@email.com",
      lastVisit: "15/10/2024",
      nextVisit: null,
      status: "inactive",
      avatar: "PC"
    },
    {
      id: 5,
      name: "Julia Ferreira",
      age: 38,
      phone: "(11) 94321-0987",
      email: "julia.ferreira@email.com",
      lastVisit: "08/11/2024",
      nextVisit: "22/11/2024",
      status: "active",
      avatar: "JF"
    },
    {
      id: 6,
      name: "Carlos Mendes",
      age: 42,
      phone: "(11) 93210-9876",
      email: "carlos.mendes@email.com",
      lastVisit: "03/11/2024",
      nextVisit: "18/11/2024",
      status: "active",
      avatar: "CM"
    }
  ]);

  const [openNew, setOpenNew] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    nextVisit: "",
  });

  const nextId = useMemo(() => (patients.length ? Math.max(...patients.map(p => p.id)) + 1 : 1), [patients]);

  const handleCreate = () => {
    if (!form.name) return;
    const initials = form.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]!.toUpperCase())
      .join("") || "--";
    const today = new Date();
    const newPatient: Patient = {
      id: nextId,
      name: form.name,
      age: Number(form.age) || 0,
      phone: form.phone,
      email: form.email,
      lastVisit: today.toLocaleDateString('pt-BR'),
      nextVisit: form.nextVisit || null,
      status: 'active',
      avatar: initials,
    };
    setPatients(prev => [newPatient, ...prev]);
    setOpenNew(false);
    setForm({ name: "", age: "", phone: "", email: "", nextVisit: "" });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  return (
    <div className="p-8 space-y-6 bg-[rgba(255,255,255,0.06)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary-900">Pacientes</h1>
          <p className="text-neutral-600 mt-1">Gerenciar pacientes cadastrados</p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50" onClick={() => setOpenNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Novo Paciente - Dialog */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Paciente</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Nome completo" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Idade</Label>
              <Input id="age" type="number" min={0} value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" placeholder="(11) 99999-9999" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextVisit">Próxima consulta</Label>
              <Input id="nextVisit" placeholder="dd/mm/aaaa" value={form.nextVisit} onChange={e => setForm(f => ({ ...f, nextVisit: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="today">Cadastro</Label>
              <Input id="today" disabled value={new Date().toLocaleDateString('pt-BR')} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNew(false)}>Cancelar</Button>
            <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50" onClick={handleCreate} disabled={!form.name}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search & Filters */}
      <Card className="border-primary-900 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <Input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-neutral-300 focus:border-primary-600 focus:ring-primary-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="border-primary-900 shadow-sm hover:shadow-md transition-all hover:border-primary-400">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-primary-200">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary-600 text-neutral-50">
                      {patient.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-primary-900">{patient.name}</CardTitle>
                    <p className="text-neutral-600 text-sm">{patient.age} anos</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-primary-700">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-700">
                <Phone className="w-4 h-4 text-primary-600" />
                <span className="text-sm">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-700">
                <Mail className="w-4 h-4 text-primary-600" />
                <span className="text-sm truncate">{patient.email}</span>
              </div>
              <div className="pt-3 border-t border-neutral-300 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Última consulta:</span>
                  <span className="text-primary-900">{patient.lastVisit}</span>
                </div>
                {patient.nextVisit ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Próxima consulta:</span>
                    <Badge className="bg-primary-600 text-neutral-50">
                      {patient.nextVisit}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Status:</span>
                    <Badge variant="outline" className="border-neutral-400 text-neutral-600">
                      Sem agendamento
                    </Badge>
                  </div>
                )}
              </div>
              <Button 
                className="w-full mt-4 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200" 
                onClick={() => onViewPatientRecord(patient)}
              >
                Ver Prontuário
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="text-neutral-600">Nenhum paciente encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
