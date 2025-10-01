import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Container from './Container.jsx';

/** Navbar com 88px de altura e espaçamentos conforme Figma */
export default function Navigation() {
  const navClass = ({ isActive }) =>
    [
      'px-4 py-2 rounded text-btn transition-colors',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      isActive
        ? 'bg-brand-blue text-white'
        : 'text-neutral-900 hover:bg-neutral-100',
    ].join(' ');

  return (
    <header className="sticky top-0 z-50 bg-neutral-50/90 backdrop-blur border-b">
      <Container>
        <nav
          className="h-[88px] flex items-center justify-between"
          aria-label="Principal"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          >
            <span className="h-10 w-10 rounded bg-brand-blue inline-flex items-center justify-center text-white font-bold">
              EH
            </span>
            <span className="text-h2 font-bold leading-none">EventHub</span>
          </Link>

          <ul className="flex items-center gap-2">
            <li><NavLink to="/" className={navClass}>Home</NavLink></li>
            <li><NavLink to="/events" className={navClass}>Encontrar Eventos</NavLink></li>
            <li><NavLink to="/support" className={navClass}>Suporte</NavLink></li>
            <li><NavLink to="/login" className={navClass}>Login</NavLink></li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
