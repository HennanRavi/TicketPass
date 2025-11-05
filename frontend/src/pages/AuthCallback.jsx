import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Página de callback do login com Google
 * - Lê o access_token da URL hash (modo front-only)
 * - Exibe e valida no console
 * - Redireciona para a home
 */
export default function AuthCallback() {
  const [status, setStatus] = useState("Processando login...");
  const navigate = useNavigate();

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hash.get("access_token");
    const tokenType = hash.get("token_type");
    const state = hash.get("state");

    if (!accessToken) {
      setStatus("Nenhum token recebido. Tente novamente.");
      console.warn("Nenhum access_token retornado pelo Google.");
      return;
    }

    console.log("✅ Google Access Token:", accessToken);
    console.log("Tipo:", tokenType);
    console.log("State:", state);

    // Salva temporariamente (apenas pra teste)
    localStorage.setItem("google_access_token", accessToken);

    setStatus("Login realizado com sucesso! Redirecionando...");
    setTimeout(() => navigate("/", { replace: true }), 1500);
  }, [navigate]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center text-slate-700">
      <div className="rounded-xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-base font-medium">{status}</p>
        <p className="mt-2 text-sm text-slate-500">
          Caso não redirecione automaticamente,{" "}
          <a href="/" className="text-blue-700 font-semibold hover:underline">
            clique aqui
          </a>.
        </p>
      </div>
    </div>
  );
}
