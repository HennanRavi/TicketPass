import React from "react";
import { Link } from "react-router-dom";
import SearchWithFilters from "@/components/search/SearchWithFilters.jsx";

export default function NavbarEncontrarEventos({
  query,
  setQuery,
  uf,
  setUf,
  city,
  setCity,
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-4 px-10 sm:px-12 lg:px-20">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 h-auto">
          <img
            src="/assets/brand/logo.png"
            alt="Eventhub"
            className="h-auto max-h-[100px] w-auto object-contain"
          />
        </Link>

        {/* Campo de busca + filtros */}
        <div className="flex grow items-center justify-center max-w-3xl">
          <SearchWithFilters
            query={query}
            setQuery={setQuery}
            uf={uf}
            setUf={setUf}
            city={city}
            setCity={setCity}
          />
        </div>

        {/* Links à direita */}
        <div className="hidden md:flex items-center gap-7 text-slate-700">
          <Link to="/suporte" className="hover:text-slate-900">
            Suporte
          </Link>

          <Link to="/criar-evento" className="hover:text-slate-900">
            Criar evento
          </Link>

          {/* 🔹 Botão "Entrar" com ícone de porta e seta */}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-[2px] px-6 py-2.5 font-semibold text-white bg-[#006CBF] hover:bg-[#0057A3] shadow-sm transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 7l5 5m0 0l-5 5m5-5H9"
              />
            </svg>
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}
