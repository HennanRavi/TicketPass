import NavigationBar from "@/components/NavigationBar.jsx";
import Hero from "@/components/Hero.jsx";
import PricingTeaser from "@/components/home/PricingTeaser.jsx";
import Testimonials from "@/components/home/Testimonials";

export default function App() {
  return (
    <>
      <NavigationBar />
      <main>
        <Hero />
        <PricingTeaser />
        <Testimonials />
      </main>
    </>
  );
}
