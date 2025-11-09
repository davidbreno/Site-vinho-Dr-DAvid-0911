import { Calendar as CalendarIcon, Clock, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Calendar } from "./ui/calendar";
import { useState } from "react";

export function Appointments() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const appointments = [
    {
      id: 1,
      time: "09:00",
      duration: "30 min",
      patient: "Maria Santos",
      treatment: "Limpeza Dental",
      doctor: "Dr. Roberto Silva",
      status: "confirmed",
      avatar: "MS"
    },
    {
      id: 2,
      time: "10:00",
      duration: "60 min",
      patient: "João Silva",
      treatment: "Manutenção Ortodôntica",
      doctor: "Dr. Roberto Silva",
      status: "confirmed",
      avatar: "JS"
    },
    {
      id: 3,
      time: "11:30",
      duration: "45 min",
      patient: "Ana Oliveira",
      treatment: "Tratamento de Canal",
      doctor: "Dra. Juliana Costa",
      status: "pending",
      avatar: "AO"
    },
    {
      id: 4,
      time: "14:00",
      duration: "30 min",
      patient: "Pedro Costa",
      treatment: "Extração",
      doctor: "Dr. Roberto Silva",
      status: "confirmed",
      avatar: "PC"
    },
    {
      id: 5,
      time: "15:00",
      duration: "90 min",
      patient: "Julia Ferreira",
      treatment: "Clareamento Dental",
      doctor: "Dra. Juliana Costa",
      status: "pending",
      avatar: "JF"
    },
    {
      id: 6,
      time: "17:00",
      duration: "30 min",
      patient: "Carlos Mendes",
      treatment: "Consulta de Retorno",
      doctor: "Dr. Roberto Silva",
      status: "confirmed",
      avatar: "CM"
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === "confirmed") {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmado</Badge>;
    }
    return <Badge className="bg-amber-50 text-amber-800 border-amber-200">Pendente</Badge>;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary-900">Agendamentos</h1>
          <p className="text-neutral-600 mt-1">Gerenciar consultas e horários</p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700 text-neutral-50">
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="border-primary-900 shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-primary-900">Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border-0"
            />
            <div className="mt-6 space-y-3 pt-4 border-t border-neutral-300">
              <div className="flex items-center justify-between">
                <span className="text-neutral-700 text-sm">Total de consultas</span>
                <Badge className="bg-primary-600 text-neutral-50">
                  {appointments.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-700 text-sm">Confirmadas</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {appointments.filter(a => a.status === "confirmed").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-700 text-sm">Pendentes</span>
                <Badge className="bg-amber-50 text-amber-800 border-amber-200">
                  {appointments.filter(a => a.status === "pending").length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="border-primary-900 shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary-900">Consultas do Dia</CardTitle>
              <Button variant="outline" size="sm" className="border-neutral-300 text-neutral-700">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 rounded-lg border border-neutral-300 hover:border-primary-400 hover:bg-primary-50/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-center p-3 rounded-lg bg-primary-50 border border-primary-200">
                      <p className="text-primary-800">{appointment.time}</p>
                      <p className="text-xs text-primary-600 mt-1">{appointment.duration}</p>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-primary-200">
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
                        {getStatusBadge(appointment.status)}
                      </div>
                      
                      <div className="flex items-center gap-2 text-neutral-600 text-sm mt-2">
                        <CalendarIcon className="w-4 h-4 text-primary-600" />
                        <span>{appointment.doctor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}