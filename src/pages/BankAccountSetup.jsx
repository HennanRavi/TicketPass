
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Landmark, 
  Save, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  CreditCard,
  Shield,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const banks = [
  { code: "001", name: "Banco do Brasil" },
  { code: "033", name: "Santander" },
  { code: "104", name: "Caixa Econômica" },
  { code: "237", name: "Bradesco" },
  { code: "341", name: "Itaú" },
  { code: "260", name: "Nu Pagamentos (Nubank)" },
  { code: "077", name: "Banco Inter" },
  { code: "290", name: "PagSeguro" },
  { code: "323", name: "Mercado Pago" },
  { code: "336", name: "C6 Bank" },
  { code: "380", name: "PicPay" },
  { code: "197", name: "Stone" },
];

export default function BankAccountSetup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    account_type: "corrente",
    bank_name: "",
    bank_code: "",
    agency: "",
    account_number: "",
    account_digit: "",
    cpf_cnpj: "",
    account_holder_name: "",
    pix_key: "",
    pix_key_type: "cpf",
  });

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin" && u.user_type !== "organizador") {
          navigate(createPageUrl("Home"));
          toast.error("Apenas organizadores podem acessar esta página");
          return;
        }
        setUser(u);
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: bankAccount, isLoading } = useQuery({
    queryKey: ["bank-account", user?.id],
    queryFn: async () => {
      const accounts = await base44.entities.BankAccount.filter({ 
        organizer_id: user.id,
        is_active: true 
      });
      if (accounts[0]) {
        setFormData({
          account_type: accounts[0].account_type,
          bank_name: accounts[0].bank_name,
          bank_code: accounts[0].bank_code,
          agency: accounts[0].agency,
          account_number: accounts[0].account_number,
          account_digit: accounts[0].account_digit,
          cpf_cnpj: accounts[0].cpf_cnpj,
          account_holder_name: accounts[0].account_holder_name,
          pix_key: accounts[0].pix_key || "",
          pix_key_type: accounts[0].pix_key_type || "cpf",
        });
      }
      return accounts[0];
    },
    enabled: !!user,
  });

  const saveBankAccountMutation = useMutation({
    mutationFn: async (data) => {
      if (bankAccount) {
        return await base44.entities.BankAccount.update(bankAccount.id, data);
      } else {
        return await base44.entities.BankAccount.create({
          ...data,
          organizer_id: user.id,
          organizer_name: user.display_name || user.full_name,
          status: "pendente",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-account"] });
      toast.success("Dados bancários salvos com sucesso!", {
        description: "Suas informações estão sendo verificadas.",
      });
      navigate(createPageUrl("OrganizerDashboard"));
    },
    onError: () => {
      toast.error("Erro ao salvar dados bancários");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!formData.bank_code || !formData.bank_name) {
      toast.error("Selecione um banco");
      return;
    }

    if (formData.agency.length < 3) {
      toast.error("Agência inválida");
      return;
    }

    if (formData.account_number.length < 4) {
      toast.error("Número da conta inválido");
      return;
    }

    // CPF/CNPJ validation (remove non-digits)
    const cpfCnpj = formData.cpf_cnpj.replace(/\D/g, "");
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      toast.error("CPF ou CNPJ inválido");
      return;
    }

    saveBankAccountMutation.mutate(formData);
  };

  const handleBankSelect = (bankCode) => {
    const bank = banks.find((b) => b.code === bankCode);
    setFormData({
      ...formData,
      bank_code: bankCode,
      bank_name: bank?.name || "",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => navigate(createPageUrl("OrganizerDashboard"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dados Bancários</h1>
          <p className="text-gray-600 dark:text-gray-400">Configure sua conta para receber pagamentos</p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-purple-900/20 dark:border-purple-800">
          <Shield className="h-4 w-4 text-blue-600 dark:text-purple-400" />
          <AlertDescription className="text-sm text-blue-900 dark:text-purple-300">
            <strong>Sistema de Retenção de Fundos:</strong> Os pagamentos ficam retidos por 7 dias 
            antes de serem transferidos para sua conta. Este período permite que participantes solicitem 
            reembolso se necessário.
          </AlertDescription>
        </Alert>

        {bankAccount && (
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-sm text-green-900 dark:text-green-300">
              <div className="flex items-center justify-between">
                <span>Você já possui dados bancários cadastrados</span>
                <Badge className={
                  bankAccount.status === "aprovado" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" 
                    : bankAccount.status === "pendente"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                }>
                  {bankAccount.status === "aprovado" ? "✓ Aprovado" : 
                   bankAccount.status === "pendente" ? "⏳ Em Análise" : 
                   "✗ Rejeitado"}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-none shadow-xl dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Landmark className="w-5 h-5" />
              Informações da Conta
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Preencha os dados da conta que receberá os pagamentos dos eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Type */}
              <div>
                <Label className="dark:text-gray-300">Tipo de Conta *</Label>
                <Select
                  value={formData.account_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, account_type: value })
                  }
                >
                  <SelectTrigger className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    <SelectItem value="corrente">Conta Corrente</SelectItem>
                    <SelectItem value="poupanca">Conta Poupança</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bank Selection */}
              <div>
                <Label className="dark:text-gray-300">Banco *</Label>
                <Select
                  value={formData.bank_code}
                  onValueChange={handleBankSelect}
                >
                  <SelectTrigger className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                    {banks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.code} - {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Agency and Account */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="agency" className="dark:text-gray-300">Agência *</Label>
                  <Input
                    id="agency"
                    value={formData.agency}
                    onChange={(e) =>
                      setFormData({ ...formData, agency: e.target.value })
                    }
                    placeholder="0001"
                    required
                    className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="account_number" className="dark:text-gray-300">Número da Conta *</Label>
                  <Input
                    id="account_number"
                    value={formData.account_number}
                    onChange={(e) =>
                      setFormData({ ...formData, account_number: e.target.value })
                    }
                    placeholder="12345678"
                    required
                    className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="account_digit" className="dark:text-gray-300">Dígito *</Label>
                  <Input
                    id="account_digit"
                    value={formData.account_digit}
                    onChange={(e) =>
                      setFormData({ ...formData, account_digit: e.target.value })
                    }
                    placeholder="9"
                    maxLength={2}
                    required
                    className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Account Holder */}
              <div>
                <Label htmlFor="account_holder_name" className="dark:text-gray-300">Nome do Titular *</Label>
                <Input
                  id="account_holder_name"
                  value={formData.account_holder_name}
                  onChange={(e) =>
                    setFormData({ ...formData, account_holder_name: e.target.value })
                  }
                  placeholder="Nome completo"
                  required
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Deve ser o mesmo nome cadastrado no banco
                </p>
              </div>

              {/* CPF/CNPJ */}
              <div>
                <Label htmlFor="cpf_cnpj" className="dark:text-gray-300">CPF ou CNPJ *</Label>
                <Input
                  id="cpf_cnpj"
                  value={formData.cpf_cnpj}
                  onChange={(e) =>
                    setFormData({ ...formData, cpf_cnpj: e.target.value })
                  }
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  required
                  className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* PIX Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600 dark:text-purple-400" />
                  Chave PIX (Opcional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="dark:text-gray-300">Tipo de Chave PIX</Label>
                    <Select
                      value={formData.pix_key_type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, pix_key_type: value })
                      }
                    >
                      <SelectTrigger className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="cnpj">CNPJ</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="telefone">Telefone</SelectItem>
                        <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pix_key" className="dark:text-gray-300">Chave PIX</Label>
                    <Input
                      id="pix_key"
                      value={formData.pix_key}
                      onChange={(e) =>
                        setFormData({ ...formData, pix_key: e.target.value })
                      }
                      placeholder="Sua chave PIX"
                      className="mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  A chave PIX facilita transferências mais rápidas
                </p>
              </div>

              {/* Important Info */}
              <Alert className="bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <AlertDescription className="text-sm text-yellow-900 dark:text-yellow-300">
                  <strong>Importante:</strong>
                  <ul className="list-disc ml-4 mt-2 space-y-1">
                    <li>Pagamentos são retidos por 7 dias após cada venda</li>
                    <li>A plataforma cobra 5% de taxa sobre cada transação</li>
                    <li>Você receberá 95% do valor de cada ingresso vendido</li>
                    <li>Reembolsos podem ser solicitados pelos participantes em até 7 dias</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(createPageUrl("OrganizerDashboard"))}
                  className="flex-1 dark:border-gray-700 dark:text-gray-300"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saveBankAccountMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 dark:from-orange-500 dark:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-700"
                >
                  {saveBankAccountMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Dados Bancários
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
