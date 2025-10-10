// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="mt-24">
      {/* Linha grossa no topo do footer (006CBF) */}
      <div className="h-[4px] bg-[#0878cd]" />

      {/* Área de links empilhados */}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8 py-10">
        <nav className="space-y-4 text-slate-800 text-[15px]">
            <a href="/ajuda" className="block font-semibold text-[#006CBF] hover:text-[#0056a8]">
            Ajuda
            </a>
          <a href="/suporte" className="block hover:text-[#006CBF]">
            Suporte
          </a>
          <a href="/encontrar-eventos" className="block hover:text-[#006CBF]">
            Encontrar Eventos
          </a>
          <a href="/quanto-custa" className="block hover:text-[#006CBF]">
            Quanto Custa
          </a>
          <a href="/termos-de-uso" className="block hover:text-[#006CBF]">
            Termos de Uso
          </a>
          <a href="/politica-de-privacidade" className="block hover:text-[#006CBF]">
            Política de Privacidade
          </a>
        </nav>
      </div>

      {/* Faixa azul inferior mais grossa, com logo fixa à esquerda */}
        <div className="bg-[#006CBF] h-[100px] flex items-center">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8 w-full flex items-center justify-center relative">
            {/* Logo fixa à esquerda sem influenciar a altura */}
            <img
            src="/assets/brand/logo-blue.png"
            alt="EventHub"
            className="h-[100px] w-auto absolute left-5 sm:left-8 lg:left-0"
            />

            {/* Copyright centralizado */}
            <p className="text-white text-[16px] font-medium text-center w-full">
            © Copyright <span className="font-semibold">EventHub</span> — Todos os direitos reservados 2025
            </p>
          </div>
        </div>
    </footer>
  );
}
