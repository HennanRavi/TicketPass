

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Ticket, Settings, LogOut, Menu, X, User, Plus, HelpCircle, Search, Info, Shield, FileText, RefreshCw, Cookie, Landmark, BarChart3, CheckCircle2, Moon, Sun } from "lucide-react";
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
import { usePushNotifications } from "./components/notifications/usePushNotifications";
import { useNotificationScheduler } from "./components/notifications/NotificationScheduler";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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

  // Initialize push notifications and schedulers
  usePushNotifications(user);
  useNotificationScheduler(user);

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isAdmin = user?.role === "admin";
  const isOrganizer = user?.user_type === "organizador" || isAdmin;

  const handleLogout = () => {
    base44.auth.logout();
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <style>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.95);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 20px) scale(1.05);
          }
          66% {
            transform: translate(20px, -30px) scale(0.95);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 25s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 8s ease-in-out infinite;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .text-shadow-strong {
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .text-shadow-medium {
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25), 0 3px 12px rgba(0, 0, 0, 0.15);
        }

        .text-shadow-soft {
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Dark Mode Styles */
        .dark {
          --bg-primary: #0a0a0a;
          --bg-secondary: #1a1a1a;
          --bg-tertiary: #2a2a2a;
          --text-primary: #ffffff;
          --text-secondary: #e0e0e0;
          --text-tertiary: #a0a0a0;
          --accent-primary: #9333ea;
          --accent-secondary: #a855f7;
          --accent-tertiary: #c084fc;
          --success: #fb923c;
          --success-light: #fdba74;
          --border: #3a3a3a;
        }

        .dark body {
          background: var(--bg-primary);
          color: var(--text-primary);
        }
      `}</style>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors ${
        darkMode 
          ? 'bg-gray-900/90 backdrop-blur-lg border-gray-800' 
          : 'bg-white/80 backdrop-blur-lg border-gray-200/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform ${
                darkMode ? 'bg-purple-600' : 'bg-blue-600'
              }`}>
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                TicketPass
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to={createPageUrl("Home")}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === createPageUrl("Home")
                    ? (darkMode ? 'text-purple-400' : 'text-blue-600')
                    : (darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600')
                }`}
              >
                Eventos
              </Link>
              <Link
                to={createPageUrl("SaibaMais")}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === createPageUrl("SaibaMais")
                    ? (darkMode ? 'text-purple-400' : 'text-blue-600')
                    : (darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600')
                }`}
              >
                Saiba Mais
              </Link>
              {user && (
                <Link
                  to={createPageUrl("MyTickets")}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === createPageUrl("MyTickets")
                      ? (darkMode ? 'text-purple-400' : 'text-blue-600')
                      : (darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600')
                  }`}
                >
                  Meus Ingressos
                </Link>
              )}
              {isOrganizer && (
                <Link
                  to={createPageUrl("OrganizerDashboard")}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === createPageUrl("OrganizerDashboard")
                      ? (darkMode ? 'text-purple-400' : 'text-blue-600')
                      : (darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600')
                  }`}
                >
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <>
                  <Link
                    to={createPageUrl("ValidateTicket")}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === createPageUrl("ValidateTicket")
                        ? (darkMode ? 'text-purple-400' : 'text-blue-600')
                        : (darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600')
                    }`}
                  >
                    Validar Ingresso
                  </Link>
                  <Link
                    to={createPageUrl("CategoryManagement")}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === createPageUrl("CategoryManagement")
                        ? (darkMode ? 'text-purple-400' : 'text-blue-600')
                        : (darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600')
                    }`}
                  >
                    Categorias
                  </Link>
                  <Link
                    to={createPageUrl("AdminBankSetup")}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === createPageUrl("AdminBankSetup")
                        ? (darkMode ? 'text-purple-400' : 'text-blue-600')
                        : (darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600')
                    }`}
                  >
                    Conta Bancária
                  </Link>
                </>
              )}
              <Link
                to={createPageUrl("Support")}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === createPageUrl("Support")
                    ? (darkMode ? 'text-purple-400' : 'text-blue-600')
                    : (darkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600')
                }`}
              >
                Suporte
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className={`rounded-full h-8 w-8 ${darkMode ? 'text-yellow-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {isOrganizer && (
                <Link to={createPageUrl("CreateEvent")} className="hidden md:block">
                  <Button size="sm" className={`h-8 text-sm ${
                    darkMode 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                  } text-white`}>
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
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-purple-600' : 'bg-blue-600'
                          }`}>
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={`w-52 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                      <div className="px-2 py-1.5">
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : ''}`}>{user.display_name || user.full_name}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                        {user.phone && (
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.phone}</p>
                        )}
                        {isAdmin ? (
                          <p className={`text-xs font-medium mt-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>👑 Administrador</p>
                        ) : isOrganizer ? (
                          <p className={`text-xs font-medium mt-1 ${darkMode ? 'text-purple-400' : 'text-blue-600'}`}>👔 Organizador</p>
                        ) : (
                          <p className={`text-xs font-medium mt-1 ${darkMode ? 'text-orange-400' : 'text-green-600'}`}>🎉 Participante</p>
                        )}
                      </div>
                      <DropdownMenuSeparator className={darkMode ? 'bg-gray-700' : ''} />
                      <DropdownMenuItem onClick={() => navigate(createPageUrl("UserSettings"))} className={`text-sm ${darkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`}>
                        <Settings className="w-4 h-4 mr-2" />
                        Configurações
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(createPageUrl("MyTickets"))} className={`text-sm ${darkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`}>
                        <Ticket className="w-4 h-4 mr-2" />
                        Meus Ingressos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(createPageUrl("Notifications"))} className={`text-sm ${darkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`}>
                        <Info className="w-4 h-4 mr-2" />
                        Notificações
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className={darkMode ? 'bg-gray-700' : ''} />
                      <DropdownMenuItem onClick={handleLogout} className={`text-sm text-red-600 ${darkMode ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`}>
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
                  onClick={handleLogin}
                  className={`h-8 text-sm ${darkMode ? 'border-gray-700 text-white hover:bg-gray-800' : ''}`}
                >
                  Entrar
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`md:hidden h-8 w-8 ${darkMode ? 'text-white hover:bg-gray-800' : ''}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] shadow-2xl z-[70] md:hidden animate-slide-in-right overflow-y-auto ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            {/* Menu Header */}
            <div className={`sticky top-0 text-white p-4 flex items-center justify-between border-b z-10 ${
              darkMode 
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 border-purple-500/20' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Menu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Menu</h2>
                  {user && (
                    <p className={`text-xs ${darkMode ? 'text-purple-100' : 'text-blue-100'}`}>{user.display_name || user.full_name}</p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:bg-white/20 h-10 w-10 flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Menu Content */}
            <nav className="p-4 space-y-6">
              {/* Theme Toggle Section */}
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Aparência
                </h3>
                <button
                  onClick={toggleDarkMode}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all touch-manipulation ${
                    darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-3 pointer-events-none">
                    {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
                    <span>Tema {darkMode ? 'Escuro' : 'Claro'}</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 pointer-events-none ${
                    darkMode ? 'bg-purple-600' : 'bg-blue-600'
                  } relative`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </button>
              </div>

              {/* Main Navigation */}
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Navegação
                </h3>
                <div className="space-y-2">
                  <Link
                    to={createPageUrl("Home")}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                      location.pathname === createPageUrl("Home")
                        ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm')
                        : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                    }`}
                  >
                    <Search className="w-5 h-5 flex-shrink-0" />
                    <span>Explorar Eventos</span>
                  </Link>
                  <Link
                    to={createPageUrl("SaibaMais")}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                      location.pathname === createPageUrl("SaibaMais")
                        ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm')
                        : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                    }`}
                  >
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <span>Saiba Mais</span>
                  </Link>
                  <Link
                    to={createPageUrl("Support")}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                      location.pathname === createPageUrl("Support")
                        ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm')
                        : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                    }`}
                  >
                    <HelpCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Suporte</span>
                  </Link>
                </div>
              </div>

              {/* User Section */}
              {user && (
                <div>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Minha Conta
                  </h3>
                  <div className="space-y-2">
                    <Link
                      to={createPageUrl("MyTickets")}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                        location.pathname === createPageUrl("MyTickets")
                          ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm')
                          : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                      }`}
                    >
                      <Ticket className="w-5 h-5 flex-shrink-0" />
                      <span>Meus Ingressos</span>
                    </Link>
                    <Link
                      to={createPageUrl("UserSettings")}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                        location.pathname === createPageUrl("UserSettings")
                          ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm')
                          : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                      }`}
                    >
                      <Settings className="w-5 h-5 flex-shrink-0" />
                      <span>Configurações</span>
                    </Link>
                    <Link
                      to={createPageUrl("Notifications")}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                        location.pathname === createPageUrl("Notifications")
                          ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm')
                          : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                      }`}
                    >
                      <Info className="w-5 h-5 flex-shrink-0" />
                      <span>Notificações</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Organizer Section */}
              {isOrganizer && (
                <div>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Organizador
                  </h3>
                  <div className="space-y-2">
                    <Link
                      to={createPageUrl("OrganizerDashboard")}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                        location.pathname === createPageUrl("OrganizerDashboard")
                          ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm')
                          : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                      }`}
                    >
                      <BarChart3 className="w-5 h-5 flex-shrink-0" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to={createPageUrl("CreateEvent")}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all touch-manipulation ${
                        darkMode 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                      }`}
                    >
                      <Plus className="w-5 h-5 flex-shrink-0" />
                      <span>Criar Evento</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Admin Section */}
              {isAdmin && (
                <div>
                  <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Administração
                  </h3>
                  <div className="space-y-2">
                    <Link
                      to={createPageUrl("ValidateTicket")}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                        location.pathname === createPageUrl("ValidateTicket")
                          ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-purple-50 text-purple-600 shadow-sm')
                          : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      <span>Validar Ingresso</span>
                    </Link>
                    <Link
                      to={createPageUrl("CategoryManagement")}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                        location.pathname === createPageUrl("CategoryManagement")
                          ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-purple-50 text-purple-600 shadow-sm')
                          : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                      }`}
                    >
                      <FileText className="w-5 h-5 flex-shrink-0" />
                      <span>Gerenciar Categorias</span>
                    </Link>
                    <Link
                      to={createPageUrl("AdminBankSetup")}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all touch-manipulation ${
                        location.pathname === createPageUrl("AdminBankSetup")
                          ? (darkMode ? 'bg-purple-500/20 text-purple-400 shadow-sm' : 'bg-purple-50 text-purple-600 shadow-sm')
                          : (darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50')
                      }`}
                    >
                      <Landmark className="w-5 h-5 flex-shrink-0" />
                      <span>Conta Bancária</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              {user && (
                <div className={`pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-red-600 transition-all w-full touch-manipulation ${
                      darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              )}

              {/* Login Button for non-authenticated users */}
              {!user && (
                <div className={`pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <button
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl font-medium text-white transition-all w-full shadow-lg touch-manipulation ${
                      darkMode 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    <User className="w-5 h-5 flex-shrink-0" />
                    <span>Entrar</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>{children}</main>

      {/* Footer */}
      <footer className={`border-t mt-auto ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
            {/* Logo e Descrição */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-purple-600' : 'bg-blue-600'
                }`}>
                  <Ticket className="w-4 h-4 text-white" />
                </div>
                <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>TicketPass</span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                A melhor plataforma para gerenciar e vender ingressos online.
              </p>
            </div>

            {/* Links Rápidos */}
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl("Home")} className={`text-xs transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    Eventos
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("SaibaMais")} className={`text-xs transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    Saiba Mais
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Support")} className={`text-xs transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    Suporte
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to={createPageUrl("PoliticaPrivacidade")} className={`text-xs flex items-center gap-1.5 transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    <Shield className="w-3 h-3" />
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("TermosUso")} className={`text-xs flex items-center gap-1.5 transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    <FileText className="w-3 h-3" />
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("PoliticaReembolso")} className={`text-xs flex items-center gap-1.5 transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    <RefreshCw className="w-3 h-3" />
                    Política de Reembolso
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("PoliticaCookies")} className={`text-xs flex items-center gap-1.5 transition-colors ${
                    darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600'
                  }`}>
                    <Cookie className="w-3 h-3" />
                    Política de Cookies
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contato */}
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contato</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="mailto:consult.dev.hr@gmail.com" 
                    className={`text-xs transition-colors ${
                      darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    consult.dev.hr@gmail.com
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/5587991675203" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-xs transition-colors ${
                      darkMode ? 'text-gray-400 hover:text-orange-400' : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    (87) 9 9167-5203
                  </a>
                </li>
                <li className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Seg - Sex: 9h às 18h
                </li>
              </ul>
            </div>
          </div>

          <div className={`border-t pt-6 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <p className={`text-xs text-center ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
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

