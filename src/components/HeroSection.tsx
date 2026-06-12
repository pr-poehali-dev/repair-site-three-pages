const HERO_IMAGE = "https://cdn.poehali.dev/projects/e2df86ec-0611-4612-98f5-9bed04d95701/files/39c661d3-0770-4d4b-a125-05aef39d4e4a.jpg";

const stats = [
  { value: "7+", label: "лет на рынке" },
  { value: "98%", label: "клиентов довольны" },
  { value: "Гос.", label: "заказы выполняем" },
  { value: "СПб", label: "и Ленинградская обл." },
];

interface HeroSectionProps {
  scrollTo: (id: string) => void;
}

export default function HeroSection({ scrollTo }: HeroSectionProps) {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center" style={{ paddingTop: "64px" }}>
        <div className="absolute inset-0" style={{ top: "64px" }}>
          <img src={HERO_IMAGE} alt="Ремонт" className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(105deg, rgba(26,24,20,0.88) 0%, rgba(26,24,20,0.70) 50%, rgba(26,24,20,0.35) 100%)",
            }}
          />
        </div>

        <div className="relative container mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 animate-fade-in"
              style={{ border: "1px solid var(--brand-gold)", background: "rgba(184,148,58,0.12)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--brand-gold)" }} />
              <span
                className="font-body text-xs tracking-widest uppercase font-light"
                style={{ color: "var(--brand-gold)" }}
              >
                Работаем с 2018 года
              </span>
            </div>

            <h1
              className="font-display font-bold text-white animate-fade-in-delay-1"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: "1.05", marginBottom: "1.5rem" }}
            >
              РЕМОНТ И
              <br />
              <span style={{ color: "var(--brand-gold)" }}>БЛАГОУСТРОЙСТВО</span>
              <br />
              ПОД КЛЮЧ
            </h1>

            <p
              className="font-body font-light text-lg mb-10 animate-fade-in-delay-2"
              style={{ color: "rgba(255,255,255,0.78)", lineHeight: "1.7", maxWidth: "520px" }}
            >
              Квартиры, офисы, инженерные системы и территории в Санкт-Петербурге и Ленинградской области. Гарантия 2 года, фиксированная цена, собственный штат мастеров.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-delay-3">
              <button
                className="px-8 py-4 font-display font-medium text-base uppercase transition-opacity hover:opacity-85"
                style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.12em" }}
                onClick={() => scrollTo("#contacts")}
              >
                Получить смету
              </button>
              <button
                className="px-8 py-4 font-display font-light text-base uppercase border transition-all"
                style={{ borderColor: "rgba(255,255,255,0.45)", color: "rgba(255,255,255,0.85)", letterSpacing: "0.12em" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--brand-gold)";
                  e.currentTarget.style.color = "var(--brand-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                }}
                onClick={() => scrollTo("#services")}
              >
                Наши услуги
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in-delay-4">
          <span className="font-body text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
            Листайте
          </span>
          <div className="w-px h-12" style={{ background: "linear-gradient(to bottom, rgba(184,148,58,0.6), transparent)" }} />
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: "var(--brand-graphite)" }}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ borderTop: "1px solid rgba(184,148,58,0.15)" }}>
            {stats.map((s, i) => (
              <div
                key={i}
                className="px-8 py-8 text-center"
                style={{ borderRight: i < 3 ? "1px solid rgba(184,148,58,0.15)" : "none" }}
              >
                <div
                  className="font-display font-bold mb-1"
                  style={{ fontSize: "2.2rem", color: "var(--brand-gold)", lineHeight: 1 }}
                >
                  {s.value}
                </div>
                <div className="font-body font-light text-sm tracking-wide" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}