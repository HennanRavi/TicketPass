import { Routes, Route, useLocation } from "react-router-dom";
import NavigationBar from "@/components/NavigationBar.jsx";
import SupportCenterHeader from "@/components/layout/SupportCenterHeader";
import SupportHeader from "@/components/layout/SupportHeader";
import SupportRequest from "@/pages/SupportRequest.jsx";
import Hero from "@/components/Hero.jsx";
import PricingTeaser from "@/components/home/PricingTeaser.jsx";
import Testimonials from "@/components/home/Testimonials.jsx";
import SupportWhatsApp from "@/components/home/SupportWhatsApp.jsx";
import Footer from "@/components/layout/Footer.jsx";

import SuportePage from "@/pages/Suporte.jsx"; // ← um único import, nome diferente

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

export default function App() {
  const { pathname } = useLocation();
  const isSupportLanding = pathname === "/suporte";
  const isSupportForm    = pathname === "/suporte/novo";

  return (
    <>
      {isSupportForm ? (
        <SupportCenterHeader />
      ) : isSupportLanding ? (
        <SupportHeader />
      ) : (
        <NavigationBar />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suporte" element={<SuportePage />} />
        <Route path="/suporte/novo" element={<SupportRequest />} />
      </Routes>
    </>
  );
}