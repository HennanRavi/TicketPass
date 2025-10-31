import React, { useMemo } from "react";

export const UF_CITIES = {
  PE: ["Arcoverde", "Recife", "Caruaru", "Petrolina"],
  SP: ["São Paulo", "Campinas", "Piracicaba", "Santos"],
  RJ: ["Rio de Janeiro", "Niterói", "Petrópolis", "Volta Redonda"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
  CE: ["Fortaleza", "Juazeiro do Norte", "Sobral"],
};

export default function SearchWithFilters({
  query,
  setQuery,
  uf,
  setUf,
  city,
  setCity,
}) {
  const cities = useMemo(() => (uf ? UF_CITIES[uf] ?? [] : []), [uf]);

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      {/* Busca */}
      <div className="relative w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar eventos por nome ou local"
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-[#006CBF] focus:ring-2 focus:ring-[#006CBF]/20"
        />
      </div>

      {/* UF */}
      <select
        value={uf}
        onChange={(e) => {
          setUf(e.target.value);
          setCity("");
        }}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#006CBF] focus:ring-2 focus:ring-[#006CBF]/20 sm:w-44"
      >
        <option value="">Estado (UF)</option>
        {Object.keys(UF_CITIES).map((sigla) => (
          <option key={sigla} value={sigla}>
            {sigla}
          </option>
        ))}
      </select>

      {/* Cidade */}
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={!uf}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#006CBF] focus:ring-2 focus:ring-[#006CBF]/20 disabled:cursor-not-allowed disabled:bg-slate-50 sm:w-64"
      >
        <option value="">Cidade</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
