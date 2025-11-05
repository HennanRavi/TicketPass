import React from "react";

/**
 * Botão “Entrar com Google”:
 * - Visual consistente com o EventHub (borda clara, hover sutil)
 * - Usa VITE_GOOGLE_CLIENT_ID para abrir o OAuth do Google
 * - Ajuste o REDIRECT_URI conforme sua rota de callback
 */
export default function GoogleButton() {
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const REDIRECT_URI = `${window.location.origin}/auth/callback`; // ajuste se preferir
  const SCOPE = encodeURIComponent("openid email profile");
  const STATE = Math.random().toString(36).slice(2);
  const PROMPT = "select_account";

  const handleClick = () => {
    if (!CLIENT_ID) {
      alert("Defina VITE_GOOGLE_CLIENT_ID no seu .env.local para usar o login com Google.");
      return;
    }
    const authUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=token` + // troque por "code" se for usar backend
      `&scope=${SCOPE}` +
      `&state=${STATE}` +
      `&prompt=${PROMPT}`;

    window.open(authUrl, "_self");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex w-1/2 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:shadow-sm"
    >
      {/* Ícone do Google */}
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.8 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.7 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.2 18.9 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C33.7 6.1 29.1 4 24 4 16 4 9.2 8.6 6.3 14.7z"/>
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.3-5.2l-6.1-5c-2 1.4-4.6 2.2-7.2 2.2-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.1 39.4 16 44 24 44z"/>
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.7-5.8 6.5-11.3 6.5-6.6 0-12-5.4-12-12 0-1 0-2 .2-3l-6.6-4.8C3.6 17.3 3 20.6 3 24c0 11.1 8.9 20 20 20s20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      </svg>
      Entrar com Google
    </button>
  );
}
