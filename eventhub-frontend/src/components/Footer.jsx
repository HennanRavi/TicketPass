import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container.jsx';

/**
 * Footer no padrão Figma:
 * - Linha azul no topo
 * - Bloco branco com coluna "Ajuda"
 * - Faixa azul inferior com logo (esquerda) e copyright (centro)
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16">
      {/* Linha azul no topo */}
      <div className="h-[3px] w-full bg-brand-blue" aria-hidden="true" />

      {/* Bloco branco com coluna de links */}
      <div className="bg-white">
        <Container>
          <div className="py-8">
            <nav aria-label="Ajuda">
              <h2 className="text-h2 font-bold text-brand-blue mb-4">Ajuda</h2>
              <ul className="space-y-4 text-body">
                <li>
                  <Link to="/support" className="hover:underline">
                    Suporte
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="hover:underline">
                    Encontrar Eventos
                  </Link>
                </li>
                <li>
                  {/* Ajuste a rota quando existir a página de preços */}
                  <Link to="/pricing" className="hover:underline">
                    Quanto Custa
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:underline">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:underline">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </Container>
      </div>

      {/* Faixa azul com logo + copyright */}
      <div className="bg-brand-blue text-white">
        <Container>
          <div className="flex items-center justify-between gap-4 py-6">
            {/* Logo simples (texto + check estilizado) */}
            <div className="flex items-center gap-2">
              <span className="text-h2 font-bold leading-none">EventHub</span>
              {/* "check" decorativo opcional */}
              <svg
                className="w-6 h-6 opacity-80"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 13l4 4L20 5"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Copyright centralizado visualmente (container já cuida do espaçamento) */}
            <p className="mx-auto text-btn text-center flex-1">
              © Copyright EventHub - Todos os direitos reservados {year}
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
