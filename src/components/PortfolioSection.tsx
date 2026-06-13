import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const API_URL = func2url.portfolio;

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
}

export default function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="portfolio" style={{ background: "var(--brand-cream)" }} className="py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <span className="font-body text-xs tracking-widest uppercase font-medium" style={{ color: "var(--brand-gold)" }}>
            Наши работы
          </span>
          <h2
            className="font-display font-bold mt-3 mb-5"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--brand-dark)" }}
          >
            ПОРТФОЛИО
          </h2>
          <span className="gold-divider" />
        </div>

        {loading ? (
          <p className="font-body font-light" style={{ color: "var(--brand-stone)" }}>Загрузка...</p>
        ) : items.length === 0 ? (
          <p className="font-body font-light" style={{ color: "var(--brand-stone)" }}>Работы скоро появятся.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.1)" }}
              >
                {item.image_url ? (
                  <div className="overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{ aspectRatio: "4/3", background: "rgba(184,148,58,0.08)", color: "var(--brand-gold)" }}
                  >
                    <Icon name="Image" size={40} />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display font-semibold text-lg mb-2" style={{ color: "var(--brand-dark)" }}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="font-body font-light text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--brand-stone)" }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
