import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Landmark,
  Save,
  ArrowLeft,
  Shield,
  CreditCard,
  Key,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  DollarSign,
  Users,
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

export default function AdminBankSetup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [showToken, setShowToken] = useState(false);
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
    pagbank_email: "",
    pagbank_token: "",
    pagbank_mode: "sandbox",
    split_enabled: true,
  });

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin") {
          navigate(createPageUrl("Home"));
          toast.error("Apenas administradores podem acessar esta página");
          return;
        }
        setUser(u);
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  const { data: adminAccount, isLoading } = useQuery({
    queryKey: ["admin-bank-account"],
    queryFn: async () => {
      const accounts = await base44.entities.AdminBankAccount.filter({ is_active: true });
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
          pagbank_email: accounts[0].pagbank_email || "",
          pagbank_token: accounts[0].pagbank_token || "",
          pagbank_mode: accounts[0].pagbank_mode || "sandbox",
          split_enabled: accounts[0].split_enabled !== false,
        });
      }
      return accounts[0];
    },
    enabled: !!user,
  });

  const saveAccountMutation = useMutation({
    mutationFn: async (data) => {
      if (adminAccount) {
        return await base44.entities.AdminBankAccount.update(adminAccount.id, data);
      } else {
        return await base44.entities.AdminBankAccount.create({
          ...data,
          is_active: true,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bank-account"] });
      toast.success("Configuração salva com sucesso!", {
        description: "O gateway PagBank está configurado.",
      });
    },
    onError: () => {
      toast.error("Erro ao salvar configuração");
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

    const cpfCnpj = formData.cpf_cnpj.replace(/\D/g, "");
    if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
      toast.error("CPF ou CNPJ inválido");
      return;
    }

    if (!formData.pagbank_email || !formData.pagbank_token) {
      toast.error("Configure as credenciais do PagBank");
      return;
    }

    saveAccountMutation.mutate(formData);
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
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(createPageUrl("OrganizerDashboard"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Conta Bancária da TicketPass
              </h1>
              <p className="text-gray-600">
                Configure a conta onde os pagamentos serão depositados
              </p>
            </div>
          </div>
          <Alert className="bg-purple-50 border-purple-200">
            <Shield className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-sm text-purple-900">
              <strong>💰 Conta da Plataforma:</strong> Todos os pagamentos dos eventos cairão nesta conta. 
              O dinheiro fica retido por 7 dias para garantir reembolsos e só depois é distribuído aos organizadores.
            </AlertDescription>
          </Alert>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Função Principal</p>
                  <p className="text-sm font-semibold text-gray-900">Receber Pagamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Período de Retenção</p>
                  <p className="text-sm font-semibold text-gray-900">7 Dias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Após 7 Dias</p>
                  <p className="text-sm font-semibold text-gray-900">Pagar Organizadores</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {adminAccount && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-900 flex items-center justify-between">
              <span>Conta administradora configurada e ativa</span>
              <Badge
                className={
                  adminAccount.pagbank_mode === "production"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-600 text-white"
                }
              >
                {adminAccount.pagbank_mode === "production" ? "🟢 Produção" : "🟡 Sandbox"}
              </Badge>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Bank Account Info */}
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-600" />
                Dados Bancários da Conta TicketPass
              </CardTitle>
              <CardDescription>
                Esta é a conta principal da plataforma onde todos os pagamentos cairão inicialmente. 
                O dinheiro fica retido por 7 dias para garantir possíveis reembolsos antes de ser distribuído aos organizadores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Type */}
                <div>
                  <Label>Tipo de Conta *</Label>
                  <Select
                    value={formData.account_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, account_type: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corrente">Conta Corrente</SelectItem>
                      <SelectItem value="poupanca">Conta Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bank */}
                <div>
                  <Label>Banco *</Label>
                  <Select value={formData.bank_code} onValueChange={handleBankSelect}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
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
                    <Label htmlFor="agency">Agência *</Label>
                    <Input
                      id="agency"
                      value={formData.agency}
                      onChange={(e) =>
                        setFormData({ ...formData, agency: e.target.value })
                      }
                      placeholder="0001"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account_number">Número da Conta *</Label>
                    <Input
                      id="account_number"
                      value={formData.account_number}
                      onChange={(e) =>
                        setFormData({ ...formData, account_number: e.target.value })
                      }
                      placeholder="12345678"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="account_digit">Dígito *</Label>
                    <Input
                      id="account_digit"
                      value={formData.account_digit}
                      onChange={(e) =>
                        setFormData({ ...formData, account_digit: e.target.value })
                      }
                      placeholder="9"
                      maxLength={2}
                      required
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Account Holder */}
                <div>
                  <Label htmlFor="account_holder_name">Nome do Titular *</Label>
                  <Input
                    id="account_holder_name"
                    value={formData.account_holder_name}
                    onChange={(e) =>
                      setFormData({ ...formData, account_holder_name: e.target.value })
                    }
                    placeholder="Nome completo"
                    required
                    className="mt-2"
                  />
                </div>

                {/* CPF/CNPJ */}
                <div>
                  <Label htmlFor="cpf_cnpj">CPF ou CNPJ *</Label>
                  <Input
                    id="cpf_cnpj"
                    value={formData.cpf_cnpj}
                    onChange={(e) =>
                      setFormData({ ...formData, cpf_cnpj: e.target.value })
                    }
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    required
                    className="mt-2"
                  />
                </div>

                {/* PIX */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Chave PIX (Recomendado)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure uma chave PIX para receber pagamentos mais rápidos dos clientes
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Chave PIX</Label>
                      <Select
                        value={formData.pix_key_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, pix_key_type: value })
                        }
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpf">CPF</SelectItem>
                          <SelectItem value="cnpj">CNPJ</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="telefone">Telefone</SelectItem>
                          <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="pix_key">Chave PIX</Label>
                      <Input
                        id="pix_key"
                        value={formData.pix_key}
                        onChange={(e) =>
                          setFormData({ ...formData, pix_key: e.target.value })
                        }
                        placeholder="Sua chave PIX"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* PagBank Configuration */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-orange-600" />
                Credenciais PagBank (Gateway de Pagamento)
              </CardTitle>
              <CardDescription>
                Configure sua conta PagBank para processar pagamentos com cartão, PIX e boleto de forma segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode */}
              <div>
                <Label>Modo de Operação *</Label>
                <Select
                  value={formData.pagbank_mode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, pagbank_mode: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox">
                      🟡 Sandbox (Testes) - Use para desenvolvimento
                    </SelectItem>
                    <SelectItem value="production">
                      🟢 Produção - Pagamentos reais
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* PagBank Email */}
              <div>
                <Label htmlFor="pagbank_email">Email PagBank *</Label>
                <Input
                  id="pagbank_email"
                  type="email"
                  value={formData.pagbank_email}
                  onChange={(e) =>
                    setFormData({ ...formData, pagbank_email: e.target.value })
                  }
                  placeholder="seu-email@pagbank.com"
                  required
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email da sua conta PagBank
                </p>
              </div>

              {/* PagBank Token */}
              <div>
                <Label htmlFor="pagbank_token">Token de API *</Label>
                <div className="relative mt-2">
                  <Input
                    id="pagbank_token"
                    type={showToken ? "text" : "password"}
                    value={formData.pagbank_token}
                    onChange={(e) =>
                      setFormData({ ...formData, pagbank_token: e.target.value })
                    }
                    placeholder="Seu token de API"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showToken ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Obtenha seu token em:{" "}
                  <a
                    href="https://pagseguro.uol.com.br/preferencias/integracoes.jhtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:underline"
                  >
                    PagBank → Integrações
                  </a>
                </p>
              </div>

              {/* Split Payment */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-orange-200">
                <input
                  type="checkbox"
                  id="split_enabled"
                  checked={formData.split_enabled}
                  onChange={(e) =>
                    setFormData({ ...formData, split_enabled: e.target.checked })
                  }
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="split_enabled" className="text-sm text-gray-700 cursor-pointer">
                  <strong>Habilitar Split de Pagamento</strong>
                  <p className="text-xs text-gray-500 mt-1">
                    Distribui automaticamente os valores entre plataforma e organizadores
                  </p>
                </label>
              </div>

              {/* Instructions */}
              <Alert className="bg-orange-100 border-orange-300">
                <Lock className="h-4 w-4 text-orange-700" />
                <AlertDescription className="text-sm text-orange-900">
                  <strong>📋 Como obter suas credenciais PagBank:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1.5">
                    <li><strong>Crie uma conta:</strong> Acesse <a href="https://pagseguro.uol.com.br" target="_blank" rel="noopener noreferrer" className="underline font-semibold">pagseguro.uol.com.br</a> e crie uma conta empresarial</li>
                    <li><strong>Valide sua conta:</strong> Envie documentos e aguarde aprovação</li>
                    <li><strong>Acesse Integrações:</strong> Menu → Configurações → Integrações</li>
                    <li><strong>Copie o Token:</strong> Gere e copie seu Token de API</li>
                    <li className="text-yellow-900 font-semibold">
                      <strong>🟡 Para Testes:</strong> Use o modo Sandbox com token de teste em{" "}
                      <a
                        href="https://sandbox.pagseguro.uol.com.br"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        sandbox.pagseguro.uol.com.br
                      </a>
                    </li>
                    <li className="text-green-900 font-semibold">
                      <strong>🟢 Para Produção:</strong> Use o token real e mude para modo Produção
                    </li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(createPageUrl("OrganizerDashboard"))}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saveAccountMutation.isPending}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              {saveAccountMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configuração
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}