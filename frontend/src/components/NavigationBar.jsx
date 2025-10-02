export default function NavigationBar() {
  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/65 border-b border-slate-200 shadow-[0_10px_28px_-14px_rgba(2,6,23,0.32)]">
      <div className="container mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-3">
            <img src="/assets/brand/logo.svg" alt="Eventhub" className="h-10 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-7 text-slate-700">
            <a href="/ajuda" className="hover:text-slate-900">Ajuda</a>
            <a href="/encontrar-eventos" className="hover:text-slate-900">Encontrar eventos</a>
            <a href="/quanto-custa" className="hover:text-slate-900">Quanto custa</a>
            <a href="/falar-com-consultor" className="hover:text-slate-900">Falar com consultor</a>

            <a
              href="/criar-evento"
              className="ml-2 rounded-[6px] px-8 py-3 text-white bg-emerald-500 hover:bg-emerald-600 shadow-sm"
            >
              Criar Evento
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
