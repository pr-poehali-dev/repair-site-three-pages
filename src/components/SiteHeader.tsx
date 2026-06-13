import { useState } from "react";
import Icon from "@/components/ui/icon";

const navLinks = [
  { label: "Услуги", href: "#services" },
  { label: "О компании", href: "#about" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Контакты", href: "#contacts" },
];

interface SiteHeaderProps {
  scrollTo: (id: string) => void;
}

export default function SiteHeader({ scrollTo }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = (id: string) => {
    scrollTo(id);
    setMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "var(--brand-dark)",
        borderColor: "rgba(184,148,58,0.25)",
      }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{ background: "var(--brand-gold)" }}
          >
            <span className="font-display font-bold text-sm" style={{ color: "var(--brand-dark)" }}>
              М
            </span>
          </div>
          <div className="font-display font-semibold text-white text-lg leading-none tracking-wide">
            ИП МАСАЛОВ
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => handleScroll(l.href)}
              className="font-body text-sm font-light tracking-wider uppercase transition-colors"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            className="px-5 py-2 text-sm font-body font-medium tracking-wider uppercase transition-opacity hover:opacity-85"
            style={{ background: "var(--brand-gold)", color: "var(--brand-dark)" }}
            onClick={() => handleScroll("#contacts")}
          >
            Вызвать мастера
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-5 flex flex-col gap-4"
          style={{ background: "var(--brand-graphite)", borderColor: "rgba(184,148,58,0.2)" }}
        >
          {navLinks.map((l) => (
            <button
              key={l.label}
              onClick={() => handleScroll(l.href)}
              className="text-left font-body text-sm tracking-wider uppercase"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              {l.label}
            </button>
          ))}
          <a href="tel:+79052104884" className="font-display text-white font-medium mt-2">
            +7 905 210-48-84
          </a>
        </div>
      )}
    </header>
  );
}