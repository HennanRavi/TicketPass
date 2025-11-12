import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FinancialDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin" && u.user_type !== "organizador") {
          navigate(createPageUrl("Home"));
          return;
        }
        setUser(u);
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: bankAccount } = useQuery({
    queryKey: ["bank-account", user?.id],
    queryFn: async () => {
      const accounts = await base44.entities.BankAccount.filter({
        organizer_id: user.id,
        is_active: true,
      });
      return accounts[0];
    },
    enabled: !!user,
  });

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: () => base44.entities.Transaction.filter({ organizer_id: user.id }, "-transaction_date"),
    enabled: !!user,
    initialData: [],
  });

  const retainedTransactions = transactions.filter((t) => t.status === "retido");
  const releasedTransactions = transactions.filter((t) => t.status === "liberado");
  const processedTransactions = transactions.filter((t) => t.status === "processado");

  const totalRetained = retainedTransactions.reduce((sum, t) => sum + t.net_amount, 0);
  const totalReleased = releasedTransactions.reduce((sum, t) => sum + t.net_amount, 0);
  const totalProcessed = processedTransactions.reduce((sum, t) => sum + t.net_amount, 0);
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.type === "venda" ? t.net_amount : 0), 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("OrganizerDashboard"))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Financeiro</h1>
            <p className="text-gray-600">Gerencie seus recebimentos e transações</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl("BankAccountSetup"))}
            variant="outline"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Dados Bancários
          </Button>
        </div>

        {/* Bank Account Status */}
        {!bankAccount ? (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-900 flex items-center justify-between">
              <span>Você precisa cadastrar seus dados bancários para receber pagamentos</span>
              <Button
                size="sm"
                onClick={() => navigate(createPageUrl("BankAccountSetup"))}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Cadastrar Agora
              </Button>
            </AlertDescription>
          </Alert>
        ) : bankAccount.status !== "aprovado" ? (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              Seus dados bancários estão em análise. Você será notificado quando forem aprovados.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-900">
              <div className="flex items-center justify-between">
                <span>Dados bancários aprovados - {bankAccount.bank_name} | Ag: {bankAccount.agency} | Conta: {bankAccount.account_number}-{bankAccount.account_digit}</span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                R$ {totalRevenue.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Receita Total</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                R$ {totalRetained.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Em Retenção (7 dias)</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                R$ {totalReleased.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Liberado para Saque</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                R$ {totalProcessed.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Já Transferido</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">Todas ({transactions.length})</TabsTrigger>
                <TabsTrigger value="retained">Em Retenção ({retainedTransactions.length})</TabsTrigger>
                <TabsTrigger value="released">Liberadas ({releasedTransactions.length})</TabsTrigger>
                <TabsTrigger value="processed">Transferidas ({processedTransactions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <TransactionTable transactions={transactions} />
              </TabsContent>
              <TabsContent value="retained">
                <TransactionTable transactions={retainedTransactions} />
              </TabsContent>
              <TabsContent value="released">
                <TransactionTable transactions={releasedTransactions} />
              </TabsContent>
              <TabsContent value="processed">
                <TransactionTable transactions={processedTransactions} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TransactionTable({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Nenhuma transação encontrada
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead>Comprador</TableHead>
            <TableHead>Valor Bruto</TableHead>
            <TableHead>Taxa (5%)</TableHead>
            <TableHead>Valor Líquido</TableHead>
            <TableHead>Liberação</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-sm">
                {format(new Date(transaction.transaction_date), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell className="font-medium">{transaction.event_title}</TableCell>
              <TableCell className="text-sm">{transaction.buyer_name}</TableCell>
              <TableCell className="font-semibold">
                R$ {transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-red-600 text-sm">
                -R$ {transaction.platform_fee.toFixed(2)}
              </TableCell>
              <TableCell className="font-bold text-green-600">
                R$ {transaction.net_amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(transaction.release_date), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    transaction.status === "processado"
                      ? "bg-green-100 text-green-700"
                      : transaction.status === "liberado"
                      ? "bg-blue-100 text-blue-700"
                      : transaction.status === "retido"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {transaction.status === "retido" && "🔒 Retido"}
                  {transaction.status === "liberado" && "✓ Liberado"}
                  {transaction.status === "processado" && "✓ Transferido"}
                  {transaction.status === "reembolsado" && "↩ Reembolsado"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}