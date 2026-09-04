import Header from "@/components/Header";
import HeroWorld from "@/components/HeroWorld";
import EditorialStatement from "@/components/EditorialStatement";
import RiskMarquee from "@/components/RiskMarquee";
import ProtectSection from "@/components/ProtectSection";
import RiskCollage from "@/components/RiskCollage";
import RiskEngine from "@/components/RiskEngine";
import RiskLayerCards from "@/components/RiskLayerCards";
import RiskLab from "@/components/RiskLab";
import TransactionProfile from "@/components/TransactionProfile";
import HeroWorldFinal from "@/components/HeroWorldFinal";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      {/* Grain overlay — spec §28 */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* §05  Header */}
      <Header />

      {/* §06–09  Hero World (layered parallax collage) */}
      <HeroWorld />

      {/* §10  Editorial statement */}
      <EditorialStatement />

      {/* §11  Giant risk signal marquee */}
      <RiskMarquee />

      {/* §12  Protect every transaction */}
      <ProtectSection />

      {/* §13–14  Risk intelligence collage (interactive SVG) */}
      <RiskCollage />

      {/* §15–16  Meet the Risk Engine + 4 cards */}
      <RiskEngine />

      {/* §17  Signals / Models / Decisions layer cards */}
      <RiskLayerCards />

      {/* §19–20  Risk Lab (split editorial) */}
      <RiskLab />

      {/* §21  Transaction Profile */}
      <TransactionProfile />

      {/* §22  Hero return */}
      <HeroWorldFinal />

      {/* Footer */}
      <Footer />
    </main>
  );
}
