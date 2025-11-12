
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Ticket, Settings, LogOut, Menu, X, User, Plus, HelpCircle, Search, Info, Shield, FileText, RefreshCw, Cookie, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationBell from "./components/notifications/NotificationBell";
import CookieBanner from "./components/cookies/CookieBanner";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      base44.auth.me().then((u) => {
        setUser(u);
        
        // Redirect to onboarding if user just registered and has no user_type
        if (!u.user_type && location.pathname !== createPageUrl("Onboarding") && location.pathname !== createPageUrl("UserSettings")) {
          navigate(createPageUrl("Onboarding"));
        }
      }).catch(() => setUser(null));
    };
    
    loadUser();
    
    // Listen for user updates (refresh when returning from settings)
    window.addEventListener('focus', loadUser);
    
    return () => {
      window.removeEventListener('focus', loadUser);
    };
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdmin = user?.role === "admin";
  const isOrganizer = user?.user_type === "organizador" || isAdmin;

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                TicketPass
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to={createPageUrl("Home")}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === createPageUrl("Home")
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Eventos
              </Link>
              <Link
                to={createPageUrl("SaibaMais")}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === createPageUrl("SaibaMais")
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Saiba Mais
              </Link>
              {user && (
                <Link
                  to={createPageUrl("MyTickets")}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    location.pathname === createPageUrl("MyTickets")
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Meus Ingressos
                </Link>
              )}
              {isOrganizer && (
                <Link
                  to={createPageUrl("OrganizerDashboard")}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    location.pathname === createPageUrl("OrganizerDashboard")
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    to={createPageUrl("ValidateTicket")}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      location.pathname === createPageUrl("ValidateTicket")
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    Validar Ingresso
                  </Link>
                  <Link
                    to={createPageUrl("CategoryManagement")}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      location.pathname === createPageUrl("CategoryManagement")
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    Categorias
                  </Link>
                  <Link
                    to={createPageUrl("AdminBankSetup")}
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      location.pathname === createPageUrl("AdminBankSetup")
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    Conta Bancária
                  </Link>
                </>
              )}
              <Link
                to={createPageUrl("Support")}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === createPageUrl("Support")
                    ? "text-blue-600"
                    : "text-gray-600"
                }`}
              >
                Suporte
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {isOrganizer && (
                <Link to={createPageUrl("CreateEvent")} className="hidden md:block">
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white h-8 text-sm">
                    Criar Evento
                  </Button>
                </Link>
              )}

              {user ? (
                <>
                  <NotificationBell userId={user.id} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                        {user.profile_image ? (
                          <img
                            src={user.profile_image}
                            alt={user.display_name || user.full_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.display_name || user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        {user.phone && (
                          <p className="text-xs text-gray-500">{user.phone}</p>
                        )}
                        {isAdmin ? (
                          <p className="text-xs text-purple-600 font-medium mt-1">👑 Administrador</p>
                        ) : isOrganizer ? (
                          <p className="text-xs text-blue-600 font-medium mt-1">👔 Organizador</p>
                        ) : (
                          <p className="text-xs text-green-600 font-medium mt-1">🎉 Participante</p>
                        )}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate(createPageUrl("UserSettings"))} className="text-sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurações
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(createPageUrl("MyTickets"))} className="text-sm">
                        <Ticket className="w-4 h-4 mr-2" />
                        Meus Ingressos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(createPageUrl("Notifications"))} className="text-sm">
                        <Info className="w-4 h-4 mr-2" />
                        Notificações
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-sm text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => base44.auth.redirectToLogin()}
                  className="h-8 text-sm"
                >
                  Entrar
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-gray-200">
              <nav className="flex flex-col gap-1">
                <Link
                  to={createPageUrl("Home")}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="w-4 h-4 inline mr-2" />
                  Eventos
                </Link>
                <Link
                  to={createPageUrl("SaibaMais")}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="w-4 h-4 inline mr-2" />
                  Saiba Mais
                </Link>
                {user && (
                  <>
                    <Link
                      to={createPageUrl("MyTickets")}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Ticket className="w-4 h-4 inline mr-2" />
                      Meus Ingressos
                    </Link>
                    <Link
                      to={createPageUrl("UserSettings")}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 inline mr-2" />
                      Configurações
                    </Link>
                    <Link
                      to={createPageUrl("Notifications")}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Info className="w-4 h-4 inline mr-2" />
                      Notificações
                    </Link>
                  </>
                )}
                {isOrganizer && (
                  <>
                    <Link
                      to={createPageUrl("OrganizerDashboard")}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={createPageUrl("CreateEvent")}
                      className="px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Criar Evento
                    </Link>
                  </>
                )}
                {isAdmin && (
                  <>
                    <Link
                      to={createPageUrl("ValidateTicket")}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Validar Ingresso
                    </Link>
                    <Link
                      to={createPageUrl("CategoryManagement")}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Categorias
                    </Link>
                    <Link
                      to={createPageUrl("AdminBankSetup")}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Landmark className="w-4 h-4 inline mr-2" />
                      Conta Bancária
                    </Link>
                  </>
                )}
                <Link
                  to={createPageUrl("Support")}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <HelpCircle className="w-4 h-4 inline mr-2" />
                  Suporte
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            {/* Logo e Descrição */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-white" />
                </div>
                <span className="text-base font-bold text-gray-900">TicketPass</span>
              </div>
              <p className="text-xs text-gray-600">
                A melhor plataforma para gerenciar e vender ingressos online.
              </p>
            </div>

            {/* Links Rápidos */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl("Home")} className="text-xs text-gray-600 hover:text-blue-600">
                    Eventos
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("SaibaMais")} className="text-xs text-gray-600 hover:text-blue-600">
                    Saiba Mais
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Support")} className="text-xs text-gray-600 hover:text-blue-600">
                    Suporte
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl("PoliticaPrivacidade")} className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1.5">
                    <Shield className="w-3 h-3" />
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("TermosUso")} className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" />
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("PoliticaReembolso")} className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1.5">
                    <RefreshCw className="w-3 h-3" />
                    Política de Reembolso
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("PoliticaCookies")} className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1.5">
                    <Cookie className="w-3 h-3" />
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contato</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:consult.dev.hr@gmail.com" 
                    className="text-xs text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    consult.dev.hr@gmail.com
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/5587991675203" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-green-600 transition-colors"
                  >
                    (87) 9 9167-5203
                  </a>
                </li>
                <li className="text-xs text-gray-600">
                  Seg - Sex: 9h às 18h
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-center text-gray-500">
              © 2025 TicketPass. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
}
