export default function SupportWhatsApp() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-10 lg:gap-16">
          {/* ESQUERDA — imagem com stroke fina deslocada */}
          <div className="md:col-span-6">
            <div className="relative inline-block">
              <img
                src="/assets/support/whatsapp-photo.jpg"
                alt="Atendimento humanizado pelo WhatsApp"
                className="w-full max-w-[560px] h-auto rounded-3xl object-contain"
              />
              {/* stroke fina atrás, mesmo raio e tamanho, levemente deslocada */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl border-[1px] border-black/70 translate-x-3 -translate-y-3 -z-10" />
            </div>
          </div>

          {/* DIREITA — textos */}
          <div className="md:col-span-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Atendimento{" "}
              <span className="relative inline-block">
                <span className="relative z-10">humanizado</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-[#FFD900] -z-0"></span>
              </span>{" "}
              pelo WhatsApp para os organizadores de eventos
            </h2>

            <p className="mt-5 text-slate-700 max-w-xl">
              Aqui você não precisa ser um super herói para conseguir ser bem atendido.
            </p>

            <div className="mt-8">
              <a
                href="/criar-evento"
                className="inline-flex rounded-[2px] px-8 py-2.5 font-semibold text-white bg-[#006CBF] hover:brightness-95 shadow-md shadow-blue-600/20 transition"
              >
                Crie seu evento
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
