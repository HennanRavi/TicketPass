import React, { useMemo, useState } from 'react';
import Navigation from '../../components/Navigation.jsx';
import Footer from '../../components/Footer.jsx';
import Container from '../../components/Container.jsx';
import EventCard from '../../components/EventCard.jsx';
import events from '../../mocks/events.js';

export default function EventsList() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('todas');

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return events.filter((e) => {
      const matchesText = !term || `${e.title} ${e.location} ${e.description}`.toLowerCase().includes(term);
      const matchesCat = cat === 'todas' || e.category.toLowerCase() === cat;
      return matchesText && matchesCat;
    });
  }, [q, cat]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navigation />
      <main id="conteudo" className="pt-8">
        <Container>
          <section aria-labelledby="titulo-eventos">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 id="titulo-eventos" className="text-h2 font-bold">Encontrar Eventos</h1>
                <p className="text-body">Busque por palavra-chave, local ou categoria.</p>
              </div>
              <div className="text-btn text-neutral-900">{filtered.length} resultado(s)</div>
            </header>

            <form className="mt-6 grid gap-3 sm:grid-cols-3" onSubmit={(e) => e.preventDefault()} aria-label="Filtros de busca">
              <label className="block">
                <span className="text-btn font-normal">Pesquisar</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  type="search"
                  className="mt-1 w-full rounded border bg-white px-3 py-2 shadow-card focus:outline-none focus:ring-2 focus:ring-offset-2"
                  placeholder="Ex.: tecnologia, praça central, comunidade…"
                />
              </label>
              <label className="block">
                <span className="text-btn font-normal">Categoria</span>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="mt-1 w-full rounded border bg-white px-3 py-2 shadow-card focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <option value="todas">Todas</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="cultura">Cultura</option>
                  <option value="comunidade">Comunidade</option>
                </select>
              </label>
              <div className="flex items-end">
                <button type="button" onClick={() => { setQ(''); setCat('todas'); }}
                  className="w-full rounded border px-4 py-2 font-normal bg-white hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2">
                  Limpar filtros
                </button>
              </div>
            </form>

            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Resultados de eventos">
              {filtered.map((e) => <EventCard key={e.id} event={e} />)}
            </ul>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
