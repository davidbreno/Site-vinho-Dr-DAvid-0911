import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

type RevenueDatum = { month: string; receita: number; despesas: number };
type AppointmentsDatum = { day: string; consultas: number };

interface ChartsSectionProps {
  revenueData: RevenueDatum[];
  appointmentsData: AppointmentsDatum[];
}

export default function ChartsSection({ revenueData, appointmentsData }: ChartsSectionProps) {
  return (
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
              <Tooltip contentStyle={{ backgroundColor: '#fdfcfb', border: '1px solid #e8d5c4', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="receita" stroke="#7a2b45" strokeWidth={3} name="Receita" dot={{ fill: '#7a2b45', r: 4 }} />
              <Line type="monotone" dataKey="despesas" stroke="#b8a899" strokeWidth={3} name="Despesas" dot={{ fill: '#b8a899', r: 4 }} />
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
              <Tooltip contentStyle={{ backgroundColor: '#fdfcfb', border: '1px solid #e8d5c4', borderRadius: '8px' }} />
              <Bar dataKey="consultas" fill="#8b3a57" radius={[8, 8, 0, 0]} name="Consultas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
