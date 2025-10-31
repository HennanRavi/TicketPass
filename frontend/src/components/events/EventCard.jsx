import React from "react";

export default function EventCard({ event }) {
  const dateObj = new Date(event.date);
  const day = dateObj.getDate().toString();
  const month = dateObj
    .toLocaleDateString("pt-BR", { month: "short" })
    .toUpperCase();
  const weekday = dateObj.toLocaleDateString("pt-BR", { weekday: "long" });
  const time = dateObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <a
      href={`/eventos/${event.id}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Imagem/banner */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* Área inferior: coluna de data + infos */}
      <div className="grid grid-cols-[64px_1fr] items-start gap-0">
        {/* Coluna da data */}
        <div className="flex h-full flex-col items-center justify-center border-r border-slate-200 bg-slate-50/60 py-5">
          <span className="text-xs font-semibold tracking-wide text-blue-600">
            {month}
          </span>
          <span className="mt-1 text-2xl font-bold leading-none text-slate-900">
            {day}
          </span>
        </div>

        {/* Informações */}
        <div className="p-5">
          <div className="text-[15px] font-semibold tracking-wide text-slate-900">
            {event.title.toUpperCase()}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {event.venue.toUpperCase()} – {event.city}
          </div>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            {/* ícone relógio */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="capitalize">
              {weekday}, {time}h
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
