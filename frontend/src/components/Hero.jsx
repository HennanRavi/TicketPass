export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Base branca para leitura */}
      <div className="absolute inset-0 -z-40 bg-white" />

      {/* “focos” azuis com blur para dividir o hero do restante da página */}
      <div className="pointer-events-none absolute inset-0 -z-30">
        {/* foco esquerdo */}
        <div className="absolute -left-20 top-[20%] h-[700px] w-[700px] rounded-full
                        bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.40),transparent_60%)]
                        blur-2xl" />
        {/* foco direito */}
        <div className="absolute -right-24 top-[25%] h-[700px] w-[700px] rounded-full
                        bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.35),transparent_62%)]
                        blur-2xl" />
        {/* foco extra inferior */}
        <div className="absolute left-1/3 bottom-0 h-[600px] w-[600px] translate-y-1/2 rounded-full
                        bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.22),transparent_65%)]
                        blur-3xl" />
      </div>

      <div className="container mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-y-14 gap-x-16 md:grid-cols-2 pt-16 md:pt-24 pb-28 md:pb-32">
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
                className="rounded-[6px] px-8 py-3 text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/30 transition"
              >
                Crie seu evento
              </a>
              <a
                href="/saiba-mais"
                className="rounded-[6px] px-8 py-3 text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
              >
                Saiba mais
              </a>
            </div>
          </div>

          {/* DIREITA: mídia + mockups + gráfico */}
          <div className="relative mx-auto md:mx-0 w-full max-w-[600px]">
            {/* CARD DA FOTO */}
            <div className="relative rounded-3xl ring-1 ring-black/10 bg-white shadow-xl overflow-hidden">
              <img
                src="/assets/hero/hero-photo.jpg"
                alt="Criador de evento usando o notebook"
                className="w-full h-[380px] md:h-[440px] object-cover"
              />
            </div>

            {/* MOCKUP PRETO (FOTO) — topo-direita */}
            <div className="absolute -top-6 -right-6 w-[84%] h-[88%] rounded-xl border-2 border-black/80 -z-10" />

            {/* CARTÃO DO GRÁFICO (PNG) — menor e mais baixo/esquerda */}
            <div className="absolute -bottom-8 -left-10 md:-bottom-10 md:-left-12">
              {/* MOCKUP PRETO (GRÁFICO) — base-esquerda, square */}
              <div className="absolute -bottom-5 -left-5 w-[260px] h-[170px] rounded-md border-2 border-black/80 -z-10" />
              <div className="relative rounded-md bg-white ring-1 ring-black/10 shadow-xl overflow-hidden">
                <img
                  src="/assets/hero/chart.png"
                  alt="Gráfico de desempenho"
                  className="w-[250px] h-auto object-contain"
                />

                {/* BADGE 32% — meio-direita do gráfico */}
                <span className="absolute top-1/2 -translate-y-1/2 -right-3 rounded-[6px] bg-white ring-1 ring-emerald-500/40 shadow px-3 py-1.5 text-sm font-semibold text-emerald-600">
                  ↑ 32%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* transição para próximo bloco */}
      <div className="h-12 w-full bg-gradient-to-b from-transparent to-white/95" />
    </section>
  );
}
