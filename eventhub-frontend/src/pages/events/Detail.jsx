import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation.jsx';
import Footer from '../../components/Footer.jsx';
import Container from '../../components/Container.jsx';
import events from '../../mocks/events.js';

export default function EventDetail() {
  const { id } = useParams();
  const event = events.find((e) => e.id === id);
  const navigate = useNavigate();

  if (!event) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <Navigation />
        <main id="conteudo" className="pt-8">
          <Container>
            <section>
              <p className="text-body">Evento não encontrado.</p>
              <button onClick={() => navigate(-1)} className="mt-4 rounded border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2">Voltar</button>
            </section>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navigation />
      <main id="conteudo" className="pt-8">
        <Container>
          <article aria-labelledby="titulo-evento" className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border bg-white shadow-card">
              <img src={event.banner} alt="Banner do evento" className="w-full h-64 object-cover" />
              <div className="p-6">
                <h1 id="titulo-evento" className="text-h2 font-bold">{event.title}</h1>
                <p className="mt-2 text-body">{event.description}</p>
              </div>
            </div>
            <aside className="rounded-2xl border bg-white p-6 h-max shadow-card">
              <dl className="text-btn">
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-neutral-700">Data</dt>
                  <dd className="font-bold">{event.formattedDate}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-neutral-700">Local</dt>
                  <dd className="font-bold">{event.location}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-neutral-700">Categoria</dt>
                  <dd className="font-bold">{event.category}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-neutral-700">Ingresso</dt>
                  <dd className="font-bold">{event.price === 0 ? 'Gratuito' : `R$ ${event.price}`}</dd>
                </div>
              </dl>
              <button
                className="mt-4 w-full rounded bg-brand-blue text-white px-4 py-3 font-normal focus:outline-none focus:ring-2 focus:ring-offset-2"
                onClick={() => alert('Inscrição simulada (próxima entrega liga com backend)')}
                aria-label="Inscrever-se neste evento"
              >
                Inscrever-se
              </button>
            </aside>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
