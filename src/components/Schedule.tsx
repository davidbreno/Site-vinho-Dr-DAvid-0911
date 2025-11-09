import { useState } from "react";
import { Clock, Plus, Edit, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";

export function Schedule() {
  const [editingDay, setEditingDay] = useState<string | null>(null);

  const weekDays = [
    { id: "monday", name: "Segunda-feira", shortName: "Seg" },
    { id: "tuesday", name: "Terça-feira", shortName: "Ter" },
    { id: "wednesday", name: "Quarta-feira", shortName: "Qua" },
    { id: "thursday", name: "Quinta-feira", shortName: "Qui" },
    { id: "friday", name: "Sexta-feira", shortName: "Sex" },
    { id: "saturday", name: "Sábado", shortName: "Sáb" },
    { id: "sunday", name: "Domingo", shortName: "Dom" }
  ];

  const [schedules, setSchedules] = useState({
    monday: { start: "08:00", end: "18:00", lunchStart: "12:00", lunchEnd: "13:00", active: true },
    tuesday: { start: "08:00", end: "18:00", lunchStart: "12:00", lunchEnd: "13:00", active: true },
    wednesday: { start: "08:00", end: "18:00", lunchStart: "12:00", lunchEnd: "13:00", active: true },
    thursday: { start: "08:00", end: "18:00", lunchStart: "12:00", lunchEnd: "13:00", active: true },
    friday: { start: "08:00", end: "18:00", lunchStart: "12:00", lunchEnd: "13:00", active: true },
    saturday: { start: "08:00", end: "13:00", lunchStart: "", lunchEnd: "", active: true },
    sunday: { start: "", end: "", lunchStart: "", lunchEnd: "", active: false }
  });

  const [appointmentDuration, setAppointmentDuration] = useState("30");
  const [bufferTime, setBufferTime] = useState("5");

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  const toggleDayActive = (dayId: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId as keyof typeof prev], active: !prev[dayId as keyof typeof prev].active }
    }));
  };

  const updateSchedule = (dayId: string, field: string, value: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId as keyof typeof prev], [field]: value }
    }));
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary-900">Horários de Atendimento</h1>
          <p className="text-neutral-600 mt-1">Configurar disponibilidade e horários da clínica</p>
        </div>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-50">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <h4 className="text-primary-900">Duração Padrão</h4>
            </div>
            <Select value={appointmentDuration} onValueChange={setAppointmentDuration}>
              <SelectTrigger className="border-primary-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-neutral-600 mt-2">Tempo padrão de cada consulta</p>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-50">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <h4 className="text-primary-900">Tempo de Intervalo</h4>
            </div>
            <Select value={bufferTime} onValueChange={setBufferTime}>
              <SelectTrigger className="border-primary-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sem intervalo</SelectItem>
                <SelectItem value="5">5 minutos</SelectItem>
                <SelectItem value="10">10 minutos</SelectItem>
                <SelectItem value="15">15 minutos</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-neutral-600 mt-2">Intervalo entre consultas</p>
          </CardContent>
        </Card>

        <Card className="border-primary-900 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-50">
                <Save className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-primary-900">Ações Rápidas</h4>
            </div>
            <Button className="w-full bg-primary-600 hover:bg-primary-700 text-neutral-50">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
            <p className="text-xs text-neutral-600 mt-2">Aplicar configurações</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Schedule */}
      <Card className="border-primary-900 shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary-900">Horários da Semana</CardTitle>
          <p className="text-neutral-600 text-sm">Configure o horário de atendimento para cada dia</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {weekDays.map((day) => {
            const schedule = schedules[day.id as keyof typeof schedules];
            const isEditing = editingDay === day.id;

            return (
              <div key={day.id} className="p-4 rounded-lg border border-neutral-300 hover:bg-primary-50/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={schedule.active ? "bg-green-100 text-green-800 border-green-200" : "bg-neutral-200 text-neutral-600 border-neutral-300"}>
                      {schedule.active ? "Ativo" : "Fechado"}
                    </Badge>
                    <h4 className="text-primary-900">{day.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingDay(isEditing ? null : day.id)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDayActive(day.id)}
                      className={schedule.active ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                    >
                      {schedule.active ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {schedule.active && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-neutral-700">Início</label>
                      {isEditing ? (
                        <Select value={schedule.start} onValueChange={(value) => updateSchedule(day.id, 'start', value)}>
                          <SelectTrigger className="border-primary-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-primary-900 p-2 rounded bg-neutral-100">{schedule.start}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-neutral-700">Fim</label>
                      {isEditing ? (
                        <Select value={schedule.end} onValueChange={(value) => updateSchedule(day.id, 'end', value)}>
                          <SelectTrigger className="border-primary-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-primary-900 p-2 rounded bg-neutral-100">{schedule.end}</p>
                      )}
                    </div>

                    {schedule.lunchStart && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs text-neutral-700">Almoço (Início)</label>
                          {isEditing ? (
                            <Select value={schedule.lunchStart} onValueChange={(value) => updateSchedule(day.id, 'lunchStart', value)}>
                              <SelectTrigger className="border-primary-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-primary-900 p-2 rounded bg-neutral-100">{schedule.lunchStart}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-neutral-700">Almoço (Fim)</label>
                          {isEditing ? (
                            <Select value={schedule.lunchEnd} onValueChange={(value) => updateSchedule(day.id, 'lunchEnd', value)}>
                              <SelectTrigger className="border-primary-300">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeSlots.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-primary-900 p-2 rounded bg-neutral-100">{schedule.lunchEnd}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quick View */}
      <Card className="border-primary-900 shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary-900">Resumo Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const schedule = schedules[day.id as keyof typeof schedules];
              return (
                <div key={day.id} className="p-4 rounded-lg border border-neutral-300 text-center">
                  <h4 className="text-primary-900 mb-2">{day.shortName}</h4>
                  {schedule.active ? (
                    <>
                      <p className="text-sm text-neutral-700">{schedule.start} - {schedule.end}</p>
                      {schedule.lunchStart && (
                        <p className="text-xs text-neutral-600 mt-1">
                          Almoço: {schedule.lunchStart}-{schedule.lunchEnd}
                        </p>
                      )}
                    </>
                  ) : (
                    <Badge variant="outline" className="border-neutral-400 text-neutral-600">Fechado</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
