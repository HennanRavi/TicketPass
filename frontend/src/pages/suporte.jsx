import FooterSimple from "../components/layout/FooterSimple.jsx";

export default function Suporte() {
  return (
    <div className="bg-white">
      {/* área central entre header e footer */}
      <section
        className="grid place-items-center px-5 sm:px-6 lg:px-8"
        style={{ minHeight: "calc(100vh - 80px - 90px)" }}
      >
        {/* CARD azul com sombra e bordas arredondadas */}
        <div
          className="
            w-full max-w-[1100px]
            bg-[#006CBF]
            rounded-[48px]
            px-10 sm:px-16 py-12
            text-white
            relative
            shadow-[8px_12px_0_0_rgba(0,0,0,0.16)]
          "
        >
          <h1 className="text-[34px] sm:text-[40px] font-semibold leading-snug max-w-[760px]">
            Conte com a nossa{" "}
            <span className="relative inline-block">
              <span className="relative z-10">ajuda</span>
              {/* taja preta sólida atrás da palavra */}
              <span className="absolute inset-x-0 bottom-1 h-3 bg-black -z-0" />
            </span>
            <br />
            para resolução de
            <br />
            problemas.
          </h1>
          <div className="mt-12 flex justify-center">
            <a
              href="/suporte/novo"
              className="bg-white text-black font-semibold px-8 py-3 rounded-[8px] shadow hover:bg-slate-50 transition"
            >
              Enviar pedido
            </a>
          </div>
        </div>
      </section>

      <FooterSimple />
    </div>
  );
}
