import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Shield,
  ShieldCheck,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Code,
  Eye,
  Server,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SecurityDocs() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        if (u.role !== "admin") {
          navigate(createPageUrl("Home"));
          return;
        }
        setUser(u);
      })
      .catch(() => {
        base44.auth.redirectToLogin(window.location.href);
      });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(createPageUrl("AdminBankSetup"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Documentação de Segurança
              </h1>
              <p className="text-gray-600">
                Entenda as medidas de segurança implementadas no webhook
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="hmac">Validação HMAC</TabsTrigger>
            <TabsTrigger value="ip">IP Allowlist</TabsTrigger>
            <TabsTrigger value="other">Outras Medidas</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  Camadas de Segurança
                </CardTitle>
                <CardDescription>
                  O webhook possui múltiplas camadas de proteção
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Validação HMAC-SHA256
                          </h3>
                          <p className="text-sm text-gray-600">
                            Verifica que a notificação realmente veio do PagBank usando criptografia
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Server className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            IP Allowlist
                          </h3>
                          <p className="text-sm text-gray-600">
                            Aceita apenas requisições dos servidores oficiais do PagBank
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Rate Limiting
                          </h3>
                          <p className="text-sm text-gray-600">
                            Limita 100 requisições por minuto por IP para evitar ataques
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Timestamp Validation
                          </h3>
                          <p className="text-sm text-gray-600">
                            Rejeita notificações com mais de 5 minutos (anti-replay)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="bg-green-50 border-green-200">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-sm text-green-900">
                    <strong>✓ Status de Segurança:</strong> Todas as medidas de segurança estão ativas e funcionando.
                    O webhook está protegido contra ataques comuns como replay, MITM, e DDoS.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Flow Diagram */}
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle>Fluxo de Validação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { step: "1", title: "PagBank envia notificação", icon: Server, color: "blue" },
                    { step: "2", title: "Verificar IP de origem", icon: Eye, color: "purple" },
                    { step: "3", title: "Verificar rate limit", icon: AlertTriangle, color: "orange" },
                    { step: "4", title: "Validar assinatura HMAC", icon: Lock, color: "green" },
                    { step: "5", title: "Validar timestamp", icon: CheckCircle2, color: "cyan" },
                    { step: "6", title: "Processar pagamento", icon: Code, color: "indigo" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className={`w-10 h-10 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 text-${item.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.step}</Badge>
                            <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          </div>
                        </div>
                        {idx < 5 && (
                          <div className="h-8 w-px bg-gray-300 ml-5"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HMAC */}
          <TabsContent value="hmac" className="space-y-6">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  Validação de Assinatura HMAC
                </CardTitle>
                <CardDescription>
                  Como funciona a validação criptográfica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Key className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-900">
                    <strong>HMAC-SHA256:</strong> É um método de autenticação de mensagem que usa uma chave secreta 
                    compartilhada para verificar integridade e autenticidade.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Como Funciona:</h3>
                  <ol className="list-decimal ml-5 space-y-2 text-sm text-gray-700">
                    <li>
                      <strong>Chave Secreta:</strong> Você gera uma chave secreta única (64 caracteres hex)
                    </li>
                    <li>
                      <strong>Configuração:</strong> Esta chave é configurada tanto no seu sistema quanto no PagBank
                    </li>
                    <li>
                      <strong>PagBank Envia:</strong> Ao enviar notificação, PagBank calcula HMAC do payload usando a chave
                    </li>
                    <li>
                      <strong>Header:</strong> A assinatura é enviada no header <code>x-pagseguro-signature</code>
                    </li>
                    <li>
                      <strong>Validação:</strong> Seu webhook recalcula o HMAC e compara com o recebido
                    </li>
                    <li>
                      <strong>Resultado:</strong> Se as assinaturas não coincidirem, a requisição é rejeitada
                    </li>
                  </ol>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400">
{`// Exemplo de validação HMAC
const crypto = require('crypto');

function validateHMAC(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
    
  return signature === expectedSignature;
}

// Uso no webhook
const isValid = validateHMAC(
  request.body,
  request.headers['x-pagseguro-signature'],
  webhookSecret
);`}
                  </pre>
                </div>

                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-sm text-yellow-900">
                    <strong>⚠️ Importante:</strong> A chave secreta deve ter no mínimo 32 caracteres e ser 
                    mantida em sigilo absoluto. Se comprometida, gere uma nova imediatamente.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* IP Allowlist */}
          <TabsContent value="ip" className="space-y-6">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-600" />
                  IP Allowlist do PagBank
                </CardTitle>
                <CardDescription>
                  Lista de IPs oficiais permitidos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-purple-50 border-purple-200">
                  <Server className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-sm text-purple-900">
                    <strong>IP Allowlist:</strong> Apenas requisições vindas dos IPs oficiais do PagBank são aceitas.
                    Qualquer outro IP é bloqueado automaticamente.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">IPs de Produção:</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <code className="text-xs text-gray-700">186.202.167.0/24</code><br />
                      <code className="text-xs text-gray-700">186.202.168.0/24</code><br />
                      <code className="text-xs text-gray-700">200.221.0.0/20</code><br />
                      <code className="text-xs text-gray-700">201.73.192.0/20</code>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">IPs de Sandbox:</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <code className="text-xs text-gray-700">177.72.179.0/24</code><br />
                      <code className="text-xs text-gray-700">177.72.180.0/24</code>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Testes Locais:</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                      <code className="text-xs text-gray-700">127.0.0.1</code><br />
                      <code className="text-xs text-gray-700">::1</code><br />
                      <code className="text-xs text-gray-700">localhost</code>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs text-green-400">
{`// Exemplo de verificação de IP
function isIPInCIDR(ip, cidr) {
  const [range, bits] = cidr.split('/');
  const mask = -1 << (32 - parseInt(bits));
  
  const ipNum = ipToNumber(ip);
  const rangeNum = ipToNumber(range);
  
  return (ipNum & mask) === (rangeNum & mask);
}

// No webhook
const requestIP = request.headers['x-forwarded-for'] || request.ip;
if (!isIPAllowed(requestIP)) {
  return { statusCode: 403, body: 'Forbidden' };
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Measures */}
          <TabsContent value="other" className="space-y-6">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  Outras Medidas de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rate Limiting */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    Rate Limiting
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Limita o número de requisições por IP para evitar ataques de negação de serviço (DDoS).
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-700">
                      • Limite: <strong>100 requisições por minuto</strong> por IP<br />
                      • Janela: <strong>60 segundos</strong><br />
                      • Resposta: <code>429 Too Many Requests</code>
                    </p>
                  </div>
                </div>

                {/* Timestamp Validation */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Validação de Timestamp
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Previne replay attacks verificando que a notificação não é muito antiga.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-700">
                      • Janela máxima: <strong>5 minutos</strong><br />
                      • Verifica: <code>created_at</code> ou <code>timestamp</code><br />
                      • Ação: Rejeita se timestamp for muito antigo ou futuro
                    </p>
                  </div>
                </div>

                {/* Timing Safe Comparison */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    Comparação Segura (Timing-Safe)
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Compara assinaturas de forma segura para evitar timing attacks.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <pre className="text-xs text-green-400">
{`function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}`}
                    </pre>
                  </div>
                </div>

                {/* Logging */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-600" />
                    Logs de Auditoria
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Todos os eventos são logados para auditoria e detecção de anomalias.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-700">
                      • IP de origem registrado<br />
                      • Resultado de validações<br />
                      • Tempo de processamento<br />
                      • Erros detalhados
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}