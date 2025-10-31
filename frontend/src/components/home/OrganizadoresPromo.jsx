import React from "react";

/**
 * Layout final com stroke igual ao Hero:
 * - stroke preta translúcida border-black/70
 * - translate-x/translate-y para deslocamento
 * - mesma proporção e offset visual do Hero
 * - imagem sem cortes (object-contain)
 */
export default function OrganizadoresPromo() {
  return (
    <section className="mt-16">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#EAF1FB] via-[#DDE8FB] to-[#D0E1FA] p-6 sm:p-8 lg:p-10">
        {/* brilho radial central no fundo */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-80 [background:radial-gradient(700px_420px_at_35%_45%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.6)_35%,rgba(255,255,255,0)_70%)]" />

        {/* conteúdo */}
        <div className="relative z-10 mx-auto grid max-w-[1400px] items-center gap-10 md:grid-cols-2">
          {/* Coluna de texto */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
              EventHub para{" "}
              <span className="rounded-sm bg-yellow-200 px-1">organizadores</span>
              <br />
              de eventos
            </h2>

            <p className="mt-4 max-w-[680px] text-lg text-slate-700">
              O <strong>EventHub</strong> é extremamente simples de usar.
              <br className="hidden sm:block" />
              Crie seu evento em menos de{" "}
              <span className="rounded-sm bg-yellow-200 px-1">1 minuto</span> e
              aproveite nossos diferenciais!
            </p>

            {/* Bullets */}
            <ul className="mt-6 space-y-4 text-slate-800">
              {[
                "Taxas menores",
                "Mais ferramentas de marketing para ampliar suas vendas",
                "Antecipação de valores dos eventos",
                "Atendimento personalizado",
                "Check-out seguro com altas taxas de aprovação",
              ].map((txt) => (
                <li key={txt} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0A5CD6] text-[#0A5CD6]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="text-base">{txt}</span>
                </li>
              ))}
            </ul>

            {/* Botões */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/criar-evento"
                className="rounded-[10px] bg-[#0A5CD6] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#084db3]"
              >
                Crie seu evento
              </a>
              <a
                href="/contato"
                className="rounded-[10px] border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Falar com consultor
              </a>
            </div>
          </div>

          {/* Coluna da imagem com stroke padrão Hero */}
          <div className="order-1 md:order-2 relative flex items-center justify-center">
            <div className="relative inline-block">
              {/* imagem */}
              <img
                src="/assets/images/organizadores.png"
                alt="Organizadoras vendo configurações de evento em um tablet"
                className="w-full h-auto max-w-[560px] rounded-[22px] object-contain"
              />
              {/* stroke preta fina (padrão Hero) */}
              <div className="pointer-events-none absolute inset-0 rounded-[22px] border-[0.75px] border-black/70 translate-x-4 -translate-y-4 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
