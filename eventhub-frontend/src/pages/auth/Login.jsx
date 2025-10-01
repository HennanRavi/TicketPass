import React, { useState } from 'react';
import Navigation from '../../components/Navigation.jsx';
import Footer from '../../components/Footer.jsx';
import Container from '../../components/Container.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Login simulado para ${email}`);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navigation />
      <main id="conteudo" className="pt-8">
        <Container>
          <section aria-labelledby="titulo-login" className="max-w-md mx-auto">
            <h1 id="titulo-login" className="text-h2 font-bold">Acesse sua conta</h1>
            <p className="mt-2 text-body">Use seu e-mail e senha para entrar.</p>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
              <label className="block">
                <span className="text-btn">E-mail</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required type="email"
                  className="mt-1 w-full rounded border bg-white px-3 py-2 shadow-card focus:outline-none focus:ring-2 focus:ring-offset-2"
                  placeholder="voce@exemplo.com"
                />
              </label>
              <label className="block">
                <span className="text-btn">Senha</span>
                <div className="mt-1 flex items-stretch rounded border bg-white shadow-card focus-within:ring-2 focus-within:ring-offset-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required type={showPwd ? 'text' : 'password'}
                    className="w-full rounded-l px-3 py-2 focus:outline-none"
                    placeholder="••••••••"
                    aria-label="Senha"
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="px-3 rounded-r border-l bg-neutral-100 text-neutral-700 text-btn">
                    {showPwd ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </label>
              <button type="submit" className="rounded bg-brand-blue text-white px-5 py-3 text-btn focus:outline-none focus:ring-2 focus:ring-offset-2">
                Entrar
              </button>
              <p className="text-btn">
                Ainda não tem conta? <a href="/" className="text-brand-blue hover:underline">Cadastre-se</a>
              </p>
            </form>
          </section>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
