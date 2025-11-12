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
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(createPageUrl("OrganizerDashboard"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dados Bancários</h1>
          <p className="text-gray-600">Configure sua conta para receber pagamentos</p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            <strong>Sistema de Retenção de Fundos:</strong> Os pagamentos ficam retidos por 7 dias 
            antes de serem transferidos para sua conta. Este período permite que participantes solicitem 
            reembolso se necessário.
          </AlertDescription>
        </Alert>

        {bankAccount && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-900">
              <div className="flex items-center justify-between">
                <span>Você já possui dados bancários cadastrados</span>
                <Badge className={
                  bankAccount.status === "aprovado" 
                    ? "bg-green-100 text-green-700" 
                    : bankAccount.status === "pendente"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }>
                  {bankAccount.status === "aprovado" ? "✓ Aprovado" : 
                   bankAccount.status === "pendente" ? "⏳ Em Análise" : 
                   "✗ Rejeitado"}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="w-5 h-5" />
              Informações da Conta
            </CardTitle>
            <CardDescription>
              Preencha os dados da conta que receberá os pagamentos dos eventos
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

              {/* Bank Selection */}
              <div>
                <Label>Banco *</Label>
                <Select
                  value={formData.bank_code}
                  onValueChange={handleBankSelect}
                >
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
                <p className="text-xs text-gray-500 mt-1">
                  Deve ser o mesmo nome cadastrado no banco
                </p>
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

              {/* PIX Section */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Chave PIX (Opcional)
                </h3>
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
                <p className="text-xs text-gray-500 mt-2">
                  A chave PIX facilita transferências mais rápidas
                </p>
              </div>

              {/* Important Info */}
              <Alert className="bg-yellow-50 border-yellow-200">
                <Clock className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm text-yellow-900">
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
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={saveBankAccountMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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