import NavigationBar from "@/components/NavigationBar.jsx";
import Hero from "@/components/Hero.jsx";
import PricingTeaser from "@/components/home/PricingTeaser.jsx";

export default function App() {
  return (
    <>
      <NavigationBar />
      <main>
        <Hero />
        <PricingTeaser />
      </main>
    </>
  );
}
