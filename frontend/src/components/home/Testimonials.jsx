import { useEffect, useMemo, useRef, useState } from "react";

const defaultItems = [
  { id: 1, name: "Moisés Benício", rating: 5, text: "Experiência indiscutível, eficiência e agilidade. Transparência e suporte nota 10. Virei representante voluntário tamanha satisfação." },
  { id: 2, name: "Igor Benevi",    rating: 5, text: "Equipe incrível! Processo simples, taxas honestas e atendimento rápido. Recomendo de olhos fechados." },
  { id: 3, name: "Larissa Monteiro",rating: 5, text: "Plataforma intuitiva, relatórios claros e pagamentos no prazo. Salvou nossa produção!" },
  { id: 4, name: "Rafael Azevedo",  rating: 4, text: "Integrações ajudaram demais no marketing. Suporte sempre presente quando precisamos." },
  { id: 5, name: "Camila Farias",   rating: 5, text: "A melhor experiência que já tive vendendo ingressos. Do cadastro ao pós-evento, tudo redondo." },
];

/**
 * Testimonials com autoplay e transição suave (fade + slide).
 * Para usar dados do backend depois: <Testimonials items={arrayDoBackend} />
 * Cada item: { id, name, rating (1-5), text }
 */
export default function Testimonials({ items = defaultItems, intervalMs = 4000 }) {
  const perView = useResponsivePerView();
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState(false); // controla a classe de animação
  const timerRef = useRef(null);

  const total = items.length;

  const next = () => setIndex((i) => (i + perView) % total);
  const prev = () => setIndex((i) => (i - perView + total * 10) % total);

  // Seleciona os itens visíveis com wrap
  const visible = useMemo(() => {
    const out = [];
    for (let k = 0; k < perView; k++) out.push(items[(index + k) % total]);
    return out;
  }, [index, items, perView, total]);

  // Animação suave a cada mudança de index
  useEffect(() => {
    setAnim(true);
    const t = setTimeout(() => setAnim(false), 500); // duração do fade
    return () => clearTimeout(t);
  }, [index]);

  // Autoplay
  useEffect(() => {
    if (intervalMs <= 0) return;
    startAutoplay();
    return stopAutoplay;
  }, [perView, intervalMs]);

  const startAutoplay = () => {
    stopAutoplay();
    timerRef.current = setInterval(next, intervalMs);
  };

  const stopAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <section className="relative bg-slate-50/80">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Título */}
          <div className="md:col-span-5">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Ser a{" "}
              <span className="relative inline-block">
                <span className="relative z-10">melhor</span>
                <span className="absolute inset-x-0 bottom-1 h-3 bg-[#FFD900] -z-0"></span>
              </span>{" "}
              é
              <br />
              mais importante
              <br />
              do que ser a maior
            </h2>
          </div>

          {/* Carrossel */}
          <div className="md:col-span-7">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transform transition-all duration-500 ease-out ${
                anim ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}
              onMouseEnter={stopAutoplay}
              onMouseLeave={startAutoplay}
            >
              {visible.map((t) => (
                <TestimonialCard key={t.id} {...t} />
              ))}
            </div>

            {/* Navegação (estilo do seu print) */}
            <div className="mt-10 flex items-center gap-4">
              <button
                type="button"
                onClick={() => { prev(); startAutoplay(); }}
                aria-label="Anterior"
                className="h-11 w-11 rounded-full border border-black/15 bg-white shadow-sm hover:bg-slate-100 active:scale-[0.98] transition"
              >
                <span className="inline-block text-lg">←</span>
              </button>
              <button
                type="button"
                onClick={() => { next(); startAutoplay(); }}
                aria-label="Próximo"
                className="h-11 w-11 rounded-full border border-black/15 bg-white shadow-sm hover:bg-slate-100 active:scale-[0.98] transition"
              >
                <span className="inline-block text-lg">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ name, rating = 5, text }) {
  return (
    <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/10">
      <header className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-slate-300" />
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">{name}</h3>
          <Stars value={rating} />
        </div>
      </header>
      <p className="mt-5 text-lg leading-relaxed text-slate-700">{text}</p>
    </article>
  );
}

function Stars({ value = 5 }) {
  return (
    <div className="mt-1 text-xl">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "text-[#FFD900]" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

// Responsivo: 1 card no mobile, 2 em md+
function useResponsivePerView() {
  const [perView, setPerView] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setPerView(mq.matches ? 2 : 1);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return perView;
}
