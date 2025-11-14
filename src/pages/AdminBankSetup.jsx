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
  ShieldCheck,
  RefreshCw,
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
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);
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
    webhook_secret: "",
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
          webhook_secret: accounts[0].webhook_secret || "",
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
        description: "O gateway PagBank está configurado com segurança aprimorada.",
      });
    },
    onError: () => {
      toast.error("Erro ao salvar configuração");
    },
  });

  const generateWebhookSecret = () => {
    // Gerar chave secreta forte (32 bytes em hex)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const secret = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    setFormData({ ...formData, webhook_secret: secret });
    toast.success("Chave secreta gerada!", {
      description: "Salve esta configuração para ativar a validação de assinatura.",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    if (!formData.webhook_secret) {
      toast.error("Gere uma chave secreta para o webhook (segurança obrigatória)");
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-purple-400"></div>
      </div>
    );
  }

  const webhookUrl = `${window.location.origin}/functions/PagBankWebhook`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-500/90 via-blue-400/80 to-white/90 dark:from-purple-900/90 dark:via-purple-800/80 dark:to-gray-900/90 backdrop-blur-3xl">
        {/* Decorative blur circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-purple-600/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/40 dark:bg-purple-900/30 rounded-full blur-3xl animate-float-reverse animate-pulse-glow"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Button
            variant="ghost"
            className="mb-6 text-white/90 hover:text-white hover:bg-white/10"
            onClick={() => navigate(createPageUrl("OrganizerDashboard"))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 dark:border-gray-700/30">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white text-shadow-strong">
                  Conta Bancária da TicketPass
                </h1>
                <p className="text-white/95 text-shadow-medium">
                  Configure a conta onde os pagamentos serão depositados
                </p>
              </div>
            </div>
            <Alert className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md border-white/30 dark:border-gray-700/30">
              <Shield className="h-4 w-4 text-white" />
              <AlertDescription className="text-sm text-white text-shadow-soft">
                <strong>💰 Conta da Plataforma:</strong> Todos os pagamentos dos eventos cairão nesta conta. 
                O dinheiro fica retido por 7 dias para garantir reembolsos e só depois é distribuído aos organizadores.
              </AlertDescription>
            </Alert>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 dark:bg-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/90 text-shadow-soft">Função Principal</p>
                  <p className="text-sm font-semibold text-white text-shadow-medium">Receber Pagamentos</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 dark:bg-orange-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/90 text-shadow-soft">Período de Retenção</p>
                  <p className="text-sm font-semibold text-white text-shadow-medium">7 Dias</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/30 dark:border-gray-700/30 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 dark:bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-white/90 text-shadow-soft">Após 7 Dias</p>
                  <p className="text-sm font-semibold text-white text-shadow-medium">Pagar Organizadores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {adminAccount && (
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-orange-900/20 dark:border-orange-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-orange-400" />
            <AlertDescription className="text-sm text-green-900 dark:text-orange-300 flex items-center justify-between flex-wrap gap-2">
              <span>Conta administradora configurada e ativa</span>
              <div className="flex gap-2">
                <Badge
                  className={
                    adminAccount.pagbank_mode === "production"
                      ? "bg-green-600 text-white dark:bg-orange-600"
                      : "bg-yellow-600 text-white"
                  }
                >
                  {adminAccount.pagbank_mode === "production" ? "🟢 Produção" : "🟡 Sandbox"}
                </Badge>
                {adminAccount.webhook_secret && (
                  <Badge className="bg-blue-600 text-white dark:bg-purple-600">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Webhook Seguro
                  </Badge>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Bank Account Info */}
          <Card className="border-none shadow-xl dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Landmark className="w-5 h-5 text-blue-600 dark:text-purple-400" />
                Dados Bancários da Conta TicketPass
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Esta é a conta principal da plataforma onde todos os pagamentos cairão inicialmente. 
                O dinheiro fica retido por 7 dias para garantir possíveis reembolsos antes de ser distribuído aos organizadores.
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
                    <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
                      <SelectItem value="corrente">Conta Corrente</SelectItem>
                      <SelectItem value="poupanca">Conta Poupança</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bank */}
                <div>
                  <Label className="dark:text-gray-300">Banco *</Label>
                  <Select value={formData.bank_code} onValueChange={handleBankSelect}>
                    <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
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
                      className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
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
                      className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
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
                      className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
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
                    className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
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
                    className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                </div>

                {/* PIX */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-purple-400" />
                    Chave PIX (Recomendado)
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Configure uma chave PIX para receber pagamentos mais rápidos dos clientes
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="dark:text-gray-300">Tipo de Chave PIX</Label>
                      <Select
                        value={formData.pix_key_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, pix_key_type: value })
                        }
                      >
                        <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
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
                        className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* PagBank Configuration */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 dark:border-orange-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Key className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Credenciais PagBank (Gateway de Pagamento)
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Configure sua conta PagBank para processar pagamentos com cartão, PIX e boleto de forma segura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode */}
              <div>
                <Label className="dark:text-gray-300">Modo de Operação *</Label>
                <Select
                  value={formData.pagbank_mode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, pagbank_mode: value })
                  }
                >
                  <SelectTrigger className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-gray-700">
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
                <Label htmlFor="pagbank_email" className="dark:text-gray-300">Email PagBank *</Label>
                <Input
                  id="pagbank_email"
                  type="email"
                  value={formData.pagbank_email}
                  onChange={(e) =>
                    setFormData({ ...formData, pagbank_email: e.target.value })
                  }
                  placeholder="seu-email@pagbank.com"
                  required
                  className="mt-2 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email da sua conta PagBank
                </p>
              </div>

              {/* PagBank Token */}
              <div>
                <Label htmlFor="pagbank_token" className="dark:text-gray-300">Token de API *</Label>
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
                    className="pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showToken ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Obtenha seu token em:{" "}
                  <a
                    href="https://pagseguro.uol.com.br/preferencias/integracoes.jhtml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    PagBank → Integrações
                  </a>
                </p>
              </div>

              {/* Webhook Secret */}
              <div className="pt-4 border-t border-orange-200 dark:border-orange-900">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="webhook_secret" className="flex items-center gap-2 dark:text-gray-300">
                    <ShieldCheck className="w-4 h-4 text-green-600 dark:text-orange-400" />
                    Chave Secreta do Webhook (HMAC) *
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={generateWebhookSecret}
                    className="h-8 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <RefreshCw className="w-3 h-3 mr-2" />
                    Gerar Nova
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="webhook_secret"
                    type={showWebhookSecret ? "text" : "password"}
                    value={formData.webhook_secret}
                    onChange={(e) =>
                      setFormData({ ...formData, webhook_secret: e.target.value })
                    }
                    placeholder="Clique em 'Gerar Nova' para criar uma chave segura"
                    required
                    className="pr-10 font-mono text-xs dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showWebhookSecret ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <Alert className="mt-3 bg-green-50 border-green-200 dark:bg-orange-900/20 dark:border-orange-800">
                  <ShieldCheck className="h-4 w-4 text-green-600 dark:text-orange-400" />
                  <AlertDescription className="text-xs text-green-900 dark:text-orange-300">
                    <strong>🔒 Segurança Aprimorada:</strong> Esta chave secreta é usada para validar que os webhooks 
                    realmente vieram do PagBank. Configure esta mesma chave no painel do PagBank em:
                    <br />
                    <code className="bg-white dark:bg-gray-900 px-1 py-0.5 rounded mt-1 inline-block">
                      Integrações → Webhooks → Assinatura HMAC
                    </code>
                  </AlertDescription>
                </Alert>
              </div>

              {/* Webhook URL */}
              <div>
                <Label className="dark:text-gray-300">URL do Webhook</Label>
                <div className="mt-2 p-3 bg-white dark:bg-gray-900 rounded-lg border border-orange-200 dark:border-orange-900">
                  <code className="text-xs text-gray-700 dark:text-gray-300 break-all">
                    {webhookUrl}
                  </code>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Configure esta URL no painel do PagBank para receber notificações de pagamento
                </p>
              </div>

              {/* Split Payment */}
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-orange-200 dark:border-orange-900">
                <input
                  type="checkbox"
                  id="split_enabled"
                  checked={formData.split_enabled}
                  onChange={(e) =>
                    setFormData({ ...formData, split_enabled: e.target.checked })
                  }
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <label htmlFor="split_enabled" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  <strong>Habilitar Split de Pagamento</strong>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Distribui automaticamente os valores entre plataforma e organizadores
                  </p>
                </label>
              </div>

              {/* Security Features */}
              <Alert className="bg-blue-50 border-blue-200 dark:bg-purple-900/20 dark:border-purple-800">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-purple-400" />
                <AlertDescription className="text-sm text-blue-900 dark:text-purple-300">
                  <strong>🛡️ Recursos de Segurança Ativos:</strong>
                  <ul className="list-disc ml-4 mt-2 space-y-1 text-xs">
                    <li>Validação de assinatura HMAC-SHA256</li>
                    <li>Verificação de IP allowlist (PagBank oficial)</li>
                    <li>Rate limiting (100 req/min por IP)</li>
                    <li>Validação de timestamp (anti-replay)</li>
                    <li>Logs detalhados de auditoria</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Instructions */}
              <Alert className="bg-orange-100 border-orange-300 dark:bg-orange-950/40 dark:border-orange-900">
                <Lock className="h-4 w-4 text-orange-700 dark:text-orange-400" />
                <AlertDescription className="text-sm text-orange-900 dark:text-orange-300">
                  <strong>📋 Como obter suas credenciais PagBank:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1.5 text-xs">
                    <li><strong>Crie uma conta:</strong> Acesse <a href="https://pagseguro.uol.com.br" target="_blank" rel="noopener noreferrer" className="underline font-semibold">pagseguro.uol.com.br</a> e crie uma conta empresarial</li>
                    <li><strong>Valide sua conta:</strong> Envie documentos e aguarde aprovação</li>
                    <li><strong>Acesse Integrações:</strong> Menu → Configurações → Integrações</li>
                    <li><strong>Copie o Token:</strong> Gere e copie seu Token de API</li>
                    <li><strong>Configure Webhook:</strong> Adicione a URL do webhook e a chave secreta</li>
                    <li className="text-yellow-900 dark:text-yellow-300 font-semibold">
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
                    <li className="text-green-900 dark:text-green-300 font-semibold">
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
              className="flex-1 dark:border-gray-700 dark:text-gray-300"
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