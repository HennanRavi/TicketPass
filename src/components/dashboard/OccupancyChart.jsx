import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function OccupancyChart({ events }) {
  const chartData = events
    .map(event => ({
      name: event.title.length > 20 ? event.title.substring(0, 20) + '...' : event.title,
      fullName: event.title,
      ocupacao: ((event.tickets_sold || 0) / event.capacity * 100).toFixed(1),
      vendidos: event.tickets_sold || 0,
      capacidade: event.capacity
    }))
    .sort((a, b) => b.ocupacao - a.ocupacao)
    .slice(0, 8); // Top 8 events

  const getColor = (value) => {
    if (value >= 80) return "#ef4444"; // red
    if (value >= 60) return "#f59e0b"; // orange
    if (value >= 40) return "#3b82f6"; // blue
    return "#10b981"; // green
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{data.fullName}</p>
          <p className="text-sm text-gray-600">
            Taxa de Ocupação: <strong className="text-blue-600">{data.ocupacao}%</strong>
          </p>
          <p className="text-sm text-gray-600">
            Vendidos: <strong>{data.vendidos}</strong> / {data.capacidade}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-none shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          Taxa de Ocupação por Evento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="#888"
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={150}
                tick={{ fontSize: 11 }}
                stroke="#888"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ocupacao" name="Ocupação (%)" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(parseFloat(entry.ocupacao))} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>Nenhum evento criado ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}