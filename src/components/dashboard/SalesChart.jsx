import React from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function SalesChart({ events, tickets }) {
  // Group sales by date
  const salesByDate = tickets.reduce((acc, ticket) => {
    const date = new Date(ticket.purchase_date).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
    
    if (!acc[date]) {
      acc[date] = {
        date,
        ingressos: 0,
        receita: 0
      };
    }
    
    acc[date].ingressos += ticket.quantity || 1;
    acc[date].receita += ticket.total_price || 0;
    
    return acc;
  }, {});

  const chartData = Object.values(salesByDate).sort((a, b) => {
    const [dayA, monthA] = a.date.split('/');
    const [dayB, monthB] = b.date.split('/');
    return new Date(2025, monthA - 1, dayA) - new Date(2025, monthB - 1, dayB);
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.date}</p>
          <p className="text-sm text-blue-600">
            Ingressos: <strong>{payload[0].value}</strong>
          </p>
          <p className="text-sm text-green-600">
            Receita: <strong>R$ {payload[1].value.toFixed(2)}</strong>
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
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Vendas ao Longo do Tempo
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#888"
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: 12 }}
                stroke="#3b82f6"
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
                stroke="#10b981"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="ingressos" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Ingressos Vendidos"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="receita" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Receita (R$)"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>Nenhuma venda registrada ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}