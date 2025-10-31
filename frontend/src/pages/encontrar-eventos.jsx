import React, { useMemo, useState } from "react";
import NavbarEncontrarEventos from "@/components/layout/NavbarEncontrarEventos.jsx";
import Footer from "@/components/layout/Footer.jsx";
import EventCard from "@/components/events/EventCard.jsx";
import OrganizadoresPromo from "@/components/home/OrganizadoresPromo.jsx";

export default function EncontrarEventosPage(props) {
  const [localQuery, setLocalQuery] = useState("");
  const [localUf, setLocalUf] = useState("");
  const [localCity, setLocalCity] = useState("");
  const [showAll, setShowAll] = useState(false);

  const query = props?.query ?? localQuery;
  const setQuery = props?.setQuery ?? setLocalQuery;
  const uf = props?.uf ?? localUf;
  const setUf = props?.setUf ?? setLocalUf;
  const city = props?.city ?? localCity;
  const setCity = props?.setCity ?? setLocalCity;

  const INITIAL_EVENTS = [
    {
      id: 1,
      title: "Cena Local | A Metamorfose",
      date: "2025-09-05T19:30:00",
      venue: "Teatro Virgínia Tamanini",
      city: "Arcoverde",
      state: "PE",
      image:
        "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Entre Xotes e Baiões",
      date: "2025-09-06T20:30:00",
      venue: "Clube dos Saudosistas",
      city: "Piracicaba",
      state: "SP",
      image:
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Samba ZN 360",
      date: "2025-09-07T15:00:00",
      venue: "Zeene",
      city: "Rio de Janeiro",
      state: "RJ",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Festival de Jazz do Sertão",
      date: "2025-09-12T21:00:00",
      venue: "Praça Central",
      city: "Arcoverde",
      state: "PE",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 5,
      title: "Mostra de Teatro Universitário",
      date: "2025-09-14T18:00:00",
      venue: "Teatro Municipal",
      city: "Recife",
      state: "PE",
      image:
        "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 6,
      title: "Virada Cultural Paulista",
      date: "2025-09-20T22:00:00",
      venue: "Centro Histórico",
      city: "São Paulo",
      state: "SP",
      image:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 7,
      title: "Rock no Maracanã",
      date: "2025-09-21T20:00:00",
      venue: "Maracanã",
      city: "Rio de Janeiro",
      state: "RJ",
      image:
        "https://images.unsplash.com/photo-1444824775686-4185f172c44b?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 8,
      title: "Forró da Praça",
      date: "2025-09-27T19:00:00",
      venue: "Coreto da Praça",
      city: "Caruaru",
      state: "PE",
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 9,
      title: "Mostra de Cinema Independente",
      date: "2025-10-01T19:00:00",
      venue: "Cine Centro",
      city: "Campinas",
      state: "SP",
      image:
        "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 10,
      title: "ExpoNordeste 2025",
      date: "2025-10-05T10:00:00",
      venue: "Centro de Convenções",
      city: "Fortaleza",
      state: "CE",
      image:
        "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 11,
      title: "Festival Gastronômico de Salvador",
      date: "2025-10-10T11:00:00",
      venue: "Parque da Cidade",
      city: "Salvador",
      state: "BA",
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 12,
      title: "Semana do Design 2025",
      date: "2025-10-15T09:00:00",
      venue: "Museu da Imagem e do Som",
      city: "São Paulo",
      state: "SP",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 13,
      title: "Feira Literária de Arcoverde",
      date: "2025-10-18T09:00:00",
      venue: "Praça da Bandeira",
      city: "Arcoverde",
      state: "PE",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1400&auto=format&fit=crop",
    },
    {
      id: 14,
      title: "Maratona do Sol 2025",
      date: "2025-10-25T06:00:00",
      venue: "Orla de Boa Viagem",
      city: "Recife",
      state: "PE",
      image:
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1400&auto=format&fit=crop",
    },
  ];

  const filtered = useMemo(() => {
    return INITIAL_EVENTS.filter((e) => {
      const q = (query || "").trim().toLowerCase();
      const matchQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q);
      const matchUf = !uf || e.state === uf;
      const matchCity = !city || e.city === city;
      return matchQuery && matchUf && matchCity;
    });
  }, [query, uf, city]);

  const visibleEvents = showAll ? filtered : filtered.slice(0, 6);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarEncontrarEventos
        query={query}
        setQuery={setQuery}
        uf={uf}
        setUf={setUf}
        city={city}
        setCity={setCity}
      />

      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-slate-900">
          Escolha sua experiência
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.length > 0 ? (
            visibleEvents.map((ev) => <EventCard key={ev.id} event={ev} />)
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              Nenhum evento encontrado para os filtros atuais.
            </div>
          )}
        </div>

        {/* Botão "Ver mais eventos" */}
        {filtered.length > 6 && (
        <div className="mt-10 flex justify-center">
            <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:border-slate-400 active:scale-[0.98]"
            >
            {showAll ? "Ver menos" : "Ver mais eventos"}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-300 ${
                showAll ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            </button>
        </div>
        )}

        <OrganizadoresPromo />
      </main>

      <Footer />
    </div>
  );
}
