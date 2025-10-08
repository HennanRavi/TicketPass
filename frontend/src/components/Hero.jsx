export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Base branca para leitura */}
      <div className="absolute inset-0 -z-40 bg-white" />

      {/* === GRADIENTE DIAMOND SUAVE (mais área branca e 50% mais transparente) === */}
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_100%_80%_at_center,_white_0%,_white_20%,_rgba(113,165,211,0.3)_70%,_rgba(113,165,211,0.4)_100%)]" />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-y-14 gap-x-16 md:grid-cols-2 pt-20 md:pt-28 pb-48 md:pb-56">

          {/* ESQUERDA: textos */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] font-extrabold tracking-tight text-slate-900">
              Muito além da venda
              <br />
              de ingressos online
            </h1>

            <p className="mt-6 text-lg text-slate-700 font-bold">
              Temos taxas menores e o melhor atendimento!
            </p>

            <p className="mt-3 max-w-xl text-slate-600">
              Venda mais com nossas várias ferramentas de marketing e tenha muito
              menos trabalho para gerenciar seu evento e vender ingressos online
            </p>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="/criar-evento"
                className="rounded-[2px] px-8 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/30 transition"
              >
                Crie seu evento
              </a>
              <a
                href="/saiba-mais"
                className="rounded-[2px] px-8 py-3 font-medium text-slate-800 border border-black/20 hover:bg-slate-50 transition"
              >
                Saiba mais
              </a>
            </div>
          </div>
            {/* === BLOCO DA MÍDIA (foto + gráfico) === */}
            <div className="relative ml-auto w-[82%] max-w-[560px]">
              {/* FOTO — Homem com café */}
              <div className="relative inline-block">
                <img
                  src="/assets/hero/hero-photo.jpg"
                  alt="Profissional no notebook"
                  className="w-full h-auto rounded-3xl object-contain"
                />
                {/* stroke fina da imagem */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl border-[0.75px] border-black/70 translate-x-4 -translate-y-4 -z-10" />
              </div>

              {/* GRÁFICO — com sombra leve e stroke descolada */}
              <div className="absolute -bottom-8 -left-8 md:-bottom-10 md:-left-10 z-40 drop-shadow-md">
                <div className="relative inline-block w-[190px] md:w-[200px]">
                  <img
                    src="/assets/hero/chart.png"
                    alt="Gráfico de desempenho"
                    className="w-full h-auto rounded-2xl object-contain shadow-md shadow-black/20"
                  />
                  {/* stroke fina, mais afastada */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl border-[0.75px] border-black/70 -translate-x-4 translate-y-4 -z-10" />

                  {/* badge 32% — com sombra suave */}
                  <span className="absolute top-1/2 -translate-y-1/2 -right-3 z-50 rounded-[6px] bg-white/95 ring-1 ring-emerald-500/40 shadow-lg shadow-black/20 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                    ↑ 32%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
