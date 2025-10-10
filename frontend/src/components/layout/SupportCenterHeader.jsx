export default function SupportCenterHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur supports-[backdrop-filter]:bg-white/65 border-b border-slate-200 shadow-[0_10px_28px_-14px_rgba(2,6,23,0.32)]">
      <div className="mx-auto w-full max-w-[1600px] px-10 sm:px-12 lg:px-20">
        <nav className="flex items-center justify-between h-20">
          {/* ESQUERDA: logo + divisor + título */}
          <div className="flex items-center gap-5">
            <a href="/" className="flex items-center gap-3 h-auto">
              <img
                src="/assets/brand/logo.png"
                alt="EventHub"
                className="h-auto max-h-[100px] w-auto object-contain"
              />
            </a>
            <span className="h-8 w-px bg-slate-300" />
            <span className="text-xl sm:text-2xl font-semibold text-slate-900">
              Central de Ajuda
            </span>
          </div>

          {/* DIREITA: botão verde */}
          <a
            href="/suporte/novo"
            className="rounded-[2px] px-8 py-2.5 font-semibold text-white bg-[#48A732] hover:bg-[#3E902B] shadow-sm transition"
          >
            Enviar pedido de Suporte
          </a>
        </nav>
      </div>
    </header>
  );
}
