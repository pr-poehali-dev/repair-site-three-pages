import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import ServicesAboutAdvantages from "@/components/ServicesAboutAdvantages";
import PortfolioSection from "@/components/PortfolioSection";
import ContactsFooter from "@/components/ContactsFooter";

export default function Index() {
  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-warm-white)" }}>
      <SiteHeader scrollTo={scrollTo} />
      <HeroSection scrollTo={scrollTo} />
      <ServicesAboutAdvantages scrollTo={scrollTo} />
      <PortfolioSection />
      <ContactsFooter scrollTo={scrollTo} />
    </div>
  );
}