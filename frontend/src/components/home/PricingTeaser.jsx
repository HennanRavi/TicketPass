export default function PricingTeaser() {
  return (
    <section className="relative">
      <div className="container mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8 mt-10 md:mt-14 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-12 lg:gap-20">
          {/* ESQUERDA: PNG completo — maior */}
          <div className="relative mx-auto md:mx-0 w-full max-w-[760px]">
            <img
              src="/assets/home/payout-full.png"
              alt="Tabela de repasses e valor de venda"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* DIREITA: textos alinhados ao topo */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] leading-tight font-extrabold text-slate-900">
              Crie seu evento de graça e
              <br className="hidden sm:block" />
              pague somente quando
              <br className="hidden sm:block" />
              vender o ingresso.
            </h2>

            <p className="mt-5 text-slate-700">
              Não espere seu evento finalizar para receber!
              <br />
              Fazemos antecipação da maior parte dos valores
              <br />
              do seu evento. <span className="font-semibold">(Consulte condições)</span>
            </p>

            <div className="mt-8 inline-flex">
              <span className="rounded-[6px] bg-yellow-300/90 px-4 py-2 text-slate-900 font-semibold shadow-sm">
                taxas a partir
              </span>
            </div>

            {/* R$7,99 destacado antes do CTA */}
            <div className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
              R$7,99
            </div>

            <div className="mt-2 text-slate-800 font-semibold">
              Isso sim é o melhor custo benefício!
            </div>

            <div className="mt-8">
              <a
                href="/quanto-custa"
                className="inline-flex rounded-[6px] px-8 py-3 text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/30 transition"
              >
                Saiba mais
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
