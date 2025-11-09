import { useState } from "react";
import { Search, Plus, Phone, Mail, Calendar, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

interface PatientsProps {
  onViewPatientRecord: (patient: any) => void;
}

export function Patients({ onViewPatientRecord }: PatientsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
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
  ];

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
        <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
          <Plus className="w-4 h-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

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
