export default function NavigationBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/65 border-b border-slate-200 shadow-[0_10px_28px_-14px_rgba(2,6,23,0.32)]">
        <div className="mx-auto w-full max-w-[1600px] px-10 sm:px-12 lg:px-20">
        <nav className="flex items-center justify-between h-20">
          {/* LOGO */}
            <a href="/" className="flex items-center gap-3 h-auto">
              <img
                src="/assets/brand/logo.png"
                alt="Eventhub"
                className="h-auto max-h-[100px] w-auto object-contain"
              />
            </a>
          {/* LINKS */}
          <div className="hidden md:flex items-center gap-7 text-slate-700">
            <a href="/suporte" className="hover:text-slate-900">Suporte</a>
            <a href="/encontrar-eventos" className="hover:text-slate-900">Encontrar eventos</a>
            <a href="/quanto-custa" className="hover:text-slate-900">Quanto custa</a>
            {/* Botão da Navigation */}
            <a
              href="/criar-evento"
              className="ml-2 rounded-[2px] px-8 py-2.5 font-semibold text-white bg-[#48A732] hover:bg-[#3E902B] shadow-sm transition"
            >
              Criar Evento
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

