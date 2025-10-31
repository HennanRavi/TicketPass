import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// 🔹 Navbars e Headers
import NavigationBar from "@/components/NavigationBar.jsx";
import NavbarEncontrarEventos from "@/components/layout/NavbarEncontrarEventos.jsx";
import SupportCenterHeader from "@/components/layout/SupportCenterHeader.jsx";
import SupportHeader from "@/components/layout/SupportHeader.jsx";

// 🔹 Páginas
import Hero from "@/components/Hero.jsx";
import PricingTeaser from "@/components/home/PricingTeaser.jsx";
import Testimonials from "@/components/home/Testimonials.jsx";
import SupportWhatsApp from "@/components/home/SupportWhatsApp.jsx";
import Footer from "@/components/layout/Footer.jsx";
import EncontrarEventosPage from "@/pages/encontrar-eventos.jsx";
import SupportRequest from "@/pages/SupportRequest.jsx";
import SuportePage from "@/pages/Suporte.jsx";

// 🔹 Outros componentes
import EventCard from "@/components/events/EventCard.jsx";

// =========================================
// HOME PAGE COMPONENT
// =========================================
function Home() {
  return (
    <>
      <Hero />
      <PricingTeaser />
      <Testimonials />
      <SupportWhatsApp />
      <Footer />
    </>
  );
}

// =========================================
// APP PRINCIPAL
// =========================================
export default function App() {
  const { pathname } = useLocation();

  // Estados da busca (usados apenas na página /encontrar-eventos)
  const [query, setQuery] = useState("");
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");

  // Identificadores de rota
  const isSupportLanding = pathname === "/suporte";
  const isSupportForm = pathname === "/suporte/novo";
  const isFindEvents = pathname === "/encontrar-eventos";

  return (
    <>
      {/* ========== HEADER DINÂMICO ========== */}
      {isSupportForm ? (
        <SupportCenterHeader />
      ) : isSupportLanding ? (
        <SupportHeader />
      ) : isFindEvents ? (
        // 👉 não renderiza nada aqui, pois a própria página já traz NavbarEncontrarEventos
        null
      ) : (
        <NavigationBar />
      )}

      {/* ========== ROTAS ========== */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suporte" element={<SuportePage />} />
        <Route path="/suporte/novo" element={<SupportRequest />} />
        <Route
          path="/encontrar-eventos"
          element={
            <EncontrarEventosPage
              query={query}
              setQuery={setQuery}
              uf={uf}
              setUf={setUf}
              city={city}
              setCity={setCity}
            />
          }
        />
      </Routes>
    </>
  );
}
