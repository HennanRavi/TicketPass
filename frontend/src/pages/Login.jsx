import React from "react";
import NavigationBar from "@/components/NavigationBar.jsx";

export default function Login() {
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      alert("Defina VITE_GOOGLE_CLIENT_ID no seu .env.local para usar o login com Google.");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = "openid email profile";
    const responseType = "token";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_100%_80%_at_center,_#EEF3F8_0%,_white_60%,_white_100%)]">
      {/* 🔹 Navbar fixa no topo */}
      <NavigationBar />

      {/* 🔹 Conteúdo central */}
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-lg shadow-black/5 p-8 text-center">
          {/* Logo EventHub */}
          <div className="mb-4 flex justify-center">
            <img
              src="/assets/brand/logo.png"
              alt="EventHub"
              className="h-auto max-h-[100px] w-auto object-contain"
            />
          </div>

          <h1 className="mt-2 mb-6 text-2xl font-semibold text-slate-900">
            Seja bem-vindo
          </h1>

          {/* Botões sociais */}
          <div className="flex justify-center gap-3">
            {/* Botão Google */}
            <button
              onClick={handleGoogleLogin}
              className="flex w-1/2 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:shadow-sm hover:border-slate-300 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.7-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.7 1.1 7.9 2.9l5.7-5.7A19.9 19.9 0 0 0 24 4a20 20 0 1 0 19.6 16.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12c3 0 5.7 1.1 7.9 2.9l5.7-5.7A19.9 19.9 0 0 0 24 4a20 20 0 0 0-17.7 10.7z"/>
                <path fill="#4CAF50" d="M24 44a19.9 19.9 0 0 0 13.7-5.3L32.4 33a12 12 0 0 1-17.6-6.2l-6.6 5.1A20 20 0 0 0 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.4l6.9 5.7C41.4 35.4 44 30.2 44 24c0-1.2-.1-2.4-.4-3.5z"/>
              </svg>
              Google
            </button>

            {/* Botão Facebook */}
            <button
              className="flex w-1/2 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:shadow-sm hover:border-slate-300 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4">
                <path fill="#1877F2" d="M24 4a20 20 0 1 0 0 40A20 20 0 0 0 24 4z"/>
                <path fill="#fff" d="M26.5 17h3.5v-4h-3.5c-3.1 0-5.5 2.4-5.5 5.5V22h-3v4h3v9h4v-9h3.2l.8-4H24v-3.5c0-.8.7-1.5 1.5-1.5z"/>
              </svg>
              Facebook
            </button>
          </div>

          {/* Linha divisória */}
          <div className="my-6 flex items-center">
            <span className="flex-1 h-px bg-slate-200"></span>
            <span className="mx-3 text-sm text-slate-500">Ou entre com</span>
            <span className="flex-1 h-px bg-slate-200"></span>
          </div>

          {/* Campo de e-mail */}
          <form className="space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Começar agora
            </button>
          </form>

          {/* Termos */}
          <p className="mt-5 text-xs text-slate-500 leading-relaxed">
            Ao continuar, você concorda com nossos{" "}
            <a href="#" className="font-semibold text-blue-700 hover:underline">
              Termos de uso
            </a>{" "}
            e{" "}
            <a href="#" className="font-semibold text-blue-700 hover:underline">
              Política de Privacidade
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
