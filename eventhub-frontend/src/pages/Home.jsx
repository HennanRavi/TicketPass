import React from 'react';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import Container from '../components/Container.jsx';
import EventCard from '../components/EventCard.jsx';
import Button from '../components/Button.jsx';
import events from '../mocks/events.js';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navigation />

      <main id="conteudo">
        <Container>
          {/* HERO */}
          <section className="hero-blur grid items-center lg:grid-cols-2 gap-12 pt-14 pb-16">
            <div>
              <h1 className="text-h1 font-bold leading-[1.08] tracking-[-0.02em]">
                Muito além da venda de ingressos online
              </h1>
              <p className="mt-4 text-body">
                Organize seu evento na melhor plataforma de eventos da região!
              </p>
              <p className="font-normal">
                Venda mais com nossas várias ferramentas de criação e tenha muito
                menos trabalho para gerenciar seu evento e vender ingressos online
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  onClick={() => (window.location.href = '/events')}
                >
                  Encontrar Eventos
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/login')}
                >
                  Entrar / Cadastrar
                </Button>
              </div>
            </div>

            <figure className="rounded-2xl overflow-hidden border shadow-card">
              <img
                src="/images/hero-man-coffee.png"
                alt="Pessoa usando notebook em cafeteria"
                className="w-full h-full object-cover"
              />
            </figure>
          </section>

          {/* BENEFÍCIOS */}
          <section className="mt-14">
            <h2 className="text-h2 font-bold">Por que usar o EventHub?</h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { t: 'Criação simplificada', d: 'Cadastre eventos em minutos e gerencie tudo num só lugar.' },
                { t: 'Divulgação eficiente', d: 'Liste seu evento e permita que a comunidade encontre você.' },
                { t: 'Inscrição prática', d: 'Inscrições gratuitas ou pagas com controle de vagas.' },
              ].map((b) => (
                <li key={b.t} className="rounded-2xl border bg-white p-6 shadow-card">
                  <h3 className="text-h2 font-bold leading-tight">{b.t}</h3>
                  <p className="text-body mt-2">{b.d}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* BLOCO DE IMAGENS */}
          <section className="mt-14 rounded-2xl p-6 bg-neutral-100">
            <div className="grid gap-4 md:grid-cols-2">
              <figure className="rounded-2xl overflow-hidden border shadow-card">
                <img src="/images/chart.png" alt="Gráfico de engajamento" />
              </figure>
              <figure className="rounded-2xl overflow-hidden border shadow-card">
                <img src="/images/woman-phone.png" alt="Pessoa usando celular" />
              </figure>
              <figure className="md:col-span-2 rounded-2xl overflow-hidden border shadow-card">
                <img src="/images/teamwork.png" alt="Pessoas colaborando" className="w-full" />
              </figure>
            </div>
          </section>

          {/* PRÓXIMOS EVENTOS */}
          <section className="mt-14 mb-16">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-h2 font-bold">Próximos eventos</h2>
              <a href="/events" className="text-btn text-brand-blue hover:underline">
                Ver todos
              </a>
            </div>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </ul>
          </section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
