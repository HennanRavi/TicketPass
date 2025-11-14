import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, AlertCircle, Eye, EyeOff, Ticket, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function LoginModal({ open, onOpenChange, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register form
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
    setError("");
    setShowPassword(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validações básicas
      if (!loginEmail || !loginPassword) {
        setError("Por favor, preencha todos os campos");
        setIsLoading(false);
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginEmail)) {
        setError("Por favor, insira um email válido");
        setIsLoading(false);
        return;
      }

      // Como o Base44 usa autenticação própria, vamos redirecionar
      // mas de forma mais suave
      toast.info("Redirecionando para login seguro...");
      
      // Salvar dados para depois do login
      sessionStorage.setItem('loginIntent', 'purchase');
      sessionStorage.setItem('returnUrl', window.location.href);
      
      // Pequeno delay para o usuário ver o toast
      setTimeout(() => {
        base44.auth.redirectToLogin(window.location.href);
      }, 500);
      
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.message || "Erro ao fazer login. Tente novamente.");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validações
      if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
        setError("Por favor, preencha todos os campos");
        setIsLoading(false);
        return;
      }

      if (registerName.length < 3) {
        setError("Nome deve ter pelo menos 3 caracteres");
        setIsLoading(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(registerEmail)) {
        setError("Por favor, insira um email válido");
        setIsLoading(false);
        return;
      }

      if (registerPassword.length < 6) {
        setError("Senha deve ter pelo menos 6 caracteres");
        setIsLoading(false);
        return;
      }

      if (registerPassword !== registerConfirmPassword) {
        setError("As senhas não coincidem");
        setIsLoading(false);
        return;
      }

      toast.info("Redirecionando para criar sua conta...");
      
      // Salvar dados para depois do registro
      sessionStorage.setItem('loginIntent', 'purchase');
      sessionStorage.setItem('returnUrl', window.location.href);
      
      setTimeout(() => {
        base44.auth.redirectToLogin(window.location.href);
      }, 500);

    } catch (err) {
      console.error("Erro no registro:", err);
      setError(err.message || "Erro ao criar conta. Tente novamente.");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForms();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Ticket className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl font-bold">
            {activeTab === "login" ? "Bem-vindo de Volta!" : "Criar Sua Conta"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === "login" 
              ? "Entre para comprar seus ingressos" 
              : "Crie sua conta gratuitamente"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive" className="animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Criar Conta</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10 h-11"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-11 text-base font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Ou</span>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-blue-600 hover:underline font-semibold"
                    disabled={isLoading}
                  >
                    Criar agora
                  </button>
                </p>
              </form>
            </TabsContent>

            {/* REGISTER TAB */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Benefits */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-green-900">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Compre ingressos rapidamente</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-900">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Acesse seus ingressos sempre</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-900">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Organize seus próprios eventos</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="João Silva"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="pl-10 h-11"
                      disabled={isLoading}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10 h-11"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="register-confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite a senha novamente"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="pl-10 h-11"
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-11 text-base font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "Criar Conta Grátis"
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-blue-600 hover:underline font-semibold"
                    disabled={isLoading}
                  >
                    Fazer login
                  </button>
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Ao continuar, você concorda com nossos{" "}
              <a href={"/TermosUso"} target="_blank" className="text-blue-600 hover:underline">
                Termos de Uso
              </a>{" "}
              e{" "}
              <a href={"/PoliticaPrivacidade"} target="_blank" className="text-blue-600 hover:underline">
                Política de Privacidade
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}