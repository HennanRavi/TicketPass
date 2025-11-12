import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function RevenueChart({ events, tickets }) {
  // Group revenue by event
  const revenueByEvent = events.map(event => {
    const eventTickets = tickets.filter(t => t.event_id === event.id);
    const revenue = eventTickets.reduce((sum, t) => sum + (t.total_price || 0), 0);
    
    return {
      name: event.title.length > 25 ? event.title.substring(0, 25) + '...' : event.title,
      fullName: event.title,
      value: revenue
    };
  }).filter(item => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 6); // Top 6

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-1">{payload[0].payload.fullName}</p>
          <p className="text-sm text-green-600">
            Receita: <strong>R$ {payload[0].value.toFixed(2)}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry) => {
    const percent = ((entry.value / revenueByEvent.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Distribuição de Receita por Evento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {revenueByEvent.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByEvent}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByEvent.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span className="text-xs">{entry.payload.name}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>Nenhuma receita registrada ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}