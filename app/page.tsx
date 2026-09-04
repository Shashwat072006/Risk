import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import RiskMatrix from "@/components/RiskMatrix";
import Positioning from "@/components/Positioning";
import Process from "@/components/Process";
import AbstractTransition from "@/components/AbstractTransition";
import RiskOrbWrapper from "@/components/RiskOrbWrapper";
import UseCases from "@/components/UseCases";
import RiskLab from "@/components/RiskLab";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Services />
      <RiskMatrix />
      <Positioning />
      <Process />
      <AbstractTransition />
      <RiskOrbWrapper />
      <UseCases />
      <RiskLab />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
