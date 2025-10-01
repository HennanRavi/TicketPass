import React from 'react';
import { Link } from 'react-router-dom';

/** Card com imagem 16:9 e tipografia tokenizada */
export default function EventCard({ event }) {
  return (
    <li className="group rounded-2xl border bg-white overflow-hidden shadow-card">
      <Link to={`/events/${event.id}`} className="block focus:outline-none focus:ring-2 focus:ring-offset-2">
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={event.banner}
            alt="Banner do evento"
            className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform"
          />
        </div>
        <div className="p-5">
          <h3 className="font-bold text-h2 leading-tight line-clamp-1">{event.title}</h3>
          <p className="mt-1 text-btn">{event.formattedDate} · {event.location}</p>
          {typeof event.price !== 'undefined' && (
            <div className="mt-3 text-xs inline-flex items-center gap-2">
              <span className="rounded bg-neutral-100 px-2 py-1 text-brand-blue">{event.category}</span>
              <span className="rounded bg-neutral-100 px-2 py-1">
                {event.price === 0 ? 'Gratuito' : `R$ ${event.price}`}
              </span>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}
