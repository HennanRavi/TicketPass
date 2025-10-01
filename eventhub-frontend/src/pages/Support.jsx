import React, { useState } from 'react';
import Navigation from '../components/Navigation.jsx';
import Footer from '../components/Footer.jsx';
import Container from '../components/Container.jsx';

export default function Support() {
  const [status, setStatus] = useState(null);
  function handleSubmit(e) {
    e.preventDefault();
    setStatus('Mensagem enviada! Em breve retornaremos por e-mail.');
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navigation />
      <main id="conteudo" className="pt-8">
        <Container>
          <section aria-labelledby="titulo-suporte" className="max-w-2xl">
            <h1 id="titulo-suporte" className="text-h2 font-bold">Suporte</h1>
            <p className="mt-2 text-body">Tire dúvidas, relate problemas ou sugira melhorias.</p>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
              <label className="block">
                <span className="text-btn">Nome</span>
                <input required type="text" className="mt-1 w-full rounded border bg-white px-3 py-2 shadow-card focus:outline-none focus:ring-2 focus:ring-offset-2" />
              </label>
              <label className="block">
                <span className="text-btn">E-mail</span>
                <input required type="email" className="mt-1 w-full rounded border bg-white px-3 py-2 shadow-card focus:outline-none focus:ring-2 focus:ring-offset-2" />
              </label>
              <label className="block">
                <span className="text-btn">Assunto</span>
                <input required type="text" className="mt-1 w-full rounded border bg-white px-3 py-2 shadow-card focus:outline-none focus:ring-2 focus:ring-offset-2" />
              </label>
              <label className="block">
                <span className="text-btn">Mensagem</span>
                <textarea required rows={5} className="mt-1 w-full rounded border bg-white px-3 py-2 shadow-card focus:outline-none focus:ring-2 focus:ring-offset-2" />
              </label>
              <div className="flex items-center gap-3">
                <button type="submit" className="rounded bg-brand-green text-white px-5 py-3 text-btn focus:outline-none focus:ring-2 focus:ring-offset-2">
                  Enviar
                </button>
                {status && <span role="status" className="text-btn text-brand-green">{status}</span>}
              </div>
            </form>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
