import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/e2df86ec-0611-4612-98f5-9bed04d95701/files/39c661d3-0770-4d4b-a125-05aef39d4e4a.jpg";

const services = [
  {
    icon: "Building2",
    title: "Ремонт квартир",
    desc: "Косметический, капитальный и дизайнерский ремонт под ключ. Чистовая и черновая отделка.",
    tag: "Жилая недвижимость",
  },
  {
    icon: "Briefcase",
    title: "Ремонт офисов",
    desc: "Офисные помещения, торговые площади, рестораны. Работаем без остановки бизнеса.",
    tag: "Коммерция",
  },
  {
    icon: "Droplets",
    title: "Сантехника",
    desc: "Монтаж, замена и ремонт сантехники любой сложности. Гарантия на все виды работ.",
    tag: "Сантехника",
  },
  {
    icon: "Wrench",
    title: "Инженерная сантехника",
    desc: "Проектирование и монтаж систем водоснабжения, канализации, отопления.",
    tag: "Инженерия",
  },
  {
    icon: "Trees",
    title: "Благоустройство",
    desc: "Landscaping, мощение, озеленение, малые архитектурные формы для вашей территории.",
    tag: "Территория",
  },
];

const stats = [
  { value: "7+", label: "лет на рынке" },
  { value: "2 400", label: "объектов сдано" },
  { value: "98%", label: "клиентов довольны" },
  { value: "6", label: "городов присутствия" },
];

const advantages = [
  {
    icon: "ShieldCheck",
    title: "Гарантия 2 года",
    desc: "Даём письменную гарантию на все виды выполненных работ без исключений.",
  },
  {
    icon: "Clock",
    title: "Точно в срок",
    desc: "Фиксируем сроки в договоре. Штраф за каждый день просрочки — ваша защита.",
  },
  {
    icon: "Users",
    title: "Собственный штат",
    desc: "Только штатные мастера без субподрядчиков — полный контроль качества.",
  },
];

const navLinks = [
  { label: "Услуги", href: "#services" },
  { label: "О компании", href: "#about" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Контакты", href: "#contacts" },
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-warm-white)" }}>
      {/* HEADER */}
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
            <div>
              <div className="font-display font-semibold text-white text-lg leading-none tracking-wide">
                ИП МАСАЛОВ
              </div>
              <div
                className="font-body font-light tracking-widest uppercase"
                style={{ color: "var(--brand-gold)", fontSize: "9px" }}
              >
                ремонт и благоустройство
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href)}
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
            <a
              href="tel:+78001234567"
              className="font-display text-white text-base font-medium tracking-wide hover:opacity-80 transition-opacity"
            >
              8 800 123-45-67
            </a>
            <button
              className="px-5 py-2 text-sm font-body font-medium tracking-wider uppercase transition-opacity hover:opacity-85"
              style={{ background: "var(--brand-gold)", color: "var(--brand-dark)" }}
              onClick={() => scrollTo("#contacts")}
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
                onClick={() => scrollTo(l.href)}
                className="text-left font-body text-sm tracking-wider uppercase"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {l.label}
              </button>
            ))}
            <a href="tel:+78001234567" className="font-display text-white font-medium mt-2">
              8 800 123-45-67
            </a>
          </div>
        )}
      </header>

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
              Квартиры, офисы, инженерные системы и территории. Гарантия 3 года,
              фиксированная цена, собственный штат мастеров.
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

      {/* SERVICES */}
      <section id="services" style={{ background: "var(--brand-cream)" }} className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <span className="font-body text-xs tracking-widest uppercase font-medium" style={{ color: "var(--brand-gold)" }}>
              Что мы делаем
            </span>
            <h2
              className="font-display font-bold mt-3 mb-5"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--brand-dark)" }}
            >
              ВИДЫ РАБОТ
            </h2>
            <span className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(74,70,64,0.12)" }}>
            {services.map((s, i) => (
              <div
                key={i}
                className="service-card group relative p-8 cursor-default transition-all duration-300 hover:shadow-lg"
                style={{ background: "var(--brand-warm-white)" }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-1 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: "var(--brand-gold)" }}
                />
                <div
                  className="inline-flex items-center justify-center w-12 h-12 mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "rgba(184,148,58,0.1)", color: "var(--brand-gold)" }}
                >
                  <Icon name={s.icon} size={22} />
                </div>
                <div
                  className="font-body text-xs tracking-widest uppercase mb-3 font-medium"
                  style={{ color: "var(--brand-stone)" }}
                >
                  {s.tag}
                </div>
                <h3 className="font-display font-semibold text-xl mb-3" style={{ color: "var(--brand-dark)" }}>
                  {s.title}
                </h3>
                <p className="font-body font-light text-sm leading-relaxed" style={{ color: "var(--brand-stone)" }}>
                  {s.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                  <span className="font-body text-xs tracking-wider uppercase font-medium" style={{ color: "var(--brand-gold)" }}>
                    Подробнее
                  </span>
                  <Icon name="ArrowRight" size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: "var(--brand-dark)" }} className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-body text-xs tracking-widest uppercase font-medium" style={{ color: "var(--brand-gold)" }}>
                О компании
              </span>
              <h2
                className="font-display font-bold mt-3 mb-5 text-white"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
              >
                НАДЁЖНЫЙ ПАРТНЁР
                <br />
                ДЛЯ ВАШЕГО ОБЪЕКТА
              </h2>
              <span className="gold-divider mb-8 block" />
              <p className="font-body font-light text-base leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.65)" }}>
                С 2018 года мы выполняем полный цикл строительно-отделочных работ: от
                разработки дизайн-проекта до финальной уборки объекта. За эти годы
                сдали более 2 400 объектов в Москве и регионах.
              </p>
              <p className="font-body font-light text-base leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.65)" }}>
                Работаем с частными заказчиками, застройщиками и корпоративными
                клиентами. Наш принцип — никаких субподрядчиков. Все мастера в
                штате, все материалы от проверенных производителей.
              </p>
              <button
                className="px-8 py-4 font-display font-medium text-sm uppercase transition-opacity hover:opacity-85"
                style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.12em" }}
                onClick={() => scrollTo("#contacts")}
              >
                Обсудить проект
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "01", title: "Замер и консультация", desc: "Выезжаем бесплатно в день обращения" },
                { num: "02", title: "Согласование работ", desc: "Обсуждаем объём и материалы под ваши задачи" },
                { num: "03", title: "Договор и фиксация цены", desc: "Цена и сроки прописаны в договоре" },
                { num: "04", title: "Сдача объекта", desc: "Принимаете работу по чек-листу" },
              ].map((step, i) => (
                <div
                  key={i}
                  className="p-6 border"
                  style={{ borderColor: "rgba(184,148,58,0.2)", background: "rgba(184,148,58,0.04)" }}
                >
                  <div className="font-display font-bold text-3xl mb-3" style={{ color: "rgba(184,148,58,0.25)" }}>
                    {step.num}
                  </div>
                  <div className="font-display font-semibold text-sm mb-2 text-white" style={{ letterSpacing: "0.03em" }}>
                    {step.title}
                  </div>
                  <p className="font-body font-light text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" style={{ background: "var(--brand-warm-white)" }} className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-body text-xs tracking-widest uppercase font-medium" style={{ color: "var(--brand-gold)" }}>
              Почему выбирают нас
            </span>
            <h2
              className="font-display font-bold mt-3"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--brand-dark)" }}
            >
              НАШИ ПРЕИМУЩЕСТВА
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((a, i) => (
              <div key={i} className="group text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ border: "2px solid var(--brand-gold)", color: "var(--brand-gold)" }}
                >
                  <Icon name={a.icon} size={26} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-3" style={{ color: "var(--brand-dark)" }}>
                  {a.title}
                </h3>
                <p className="font-body font-light text-sm leading-relaxed" style={{ color: "var(--brand-stone)" }}>
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: "var(--brand-gold)" }} className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2
            className="font-display font-bold mb-4"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", color: "var(--brand-dark)" }}
          >
            ГОТОВЫ ОБСУДИТЬ ВАШ ПРОЕКТ?
          </h2>
          <p
            className="font-body font-light text-base mb-8"
            style={{ color: "rgba(26,24,20,0.72)", maxWidth: "500px", margin: "0 auto 2rem" }}
          >
            Бесплатный выезд замерщика и смета за 24 часа. Без обязательств.
          </p>
          <button
            className="px-10 py-4 font-display font-semibold text-base uppercase transition-all hover:opacity-90"
            style={{ background: "var(--brand-dark)", color: "var(--brand-gold)", letterSpacing: "0.14em" }}
            onClick={() => scrollTo("#contacts")}
          >
            Заказать звонок
          </button>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" style={{ background: "var(--brand-graphite)" }} className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <span className="font-body text-xs tracking-widest uppercase font-medium" style={{ color: "var(--brand-gold)" }}>
                Контакты
              </span>
              <h2
                className="font-display font-bold mt-3 mb-8 text-white"
                style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
              >
                СВЯЖИТЕСЬ С НАМИ
              </h2>

              <div className="space-y-6">
                {[
                  { icon: "Phone", label: "Телефон", value: "8 800 123-45-67", sub: "Бесплатно по России" },
                  { icon: "Mail", label: "Email", value: "info@stroygrupp.ru", sub: "Ответим за 2 часа" },
                  { icon: "MapPin", label: "Офис", value: "Москва, ул. Строительная, 15", sub: "Пн–Пт 9:00–19:00" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-10 h-10 flex items-center justify-center mt-1"
                      style={{ border: "1px solid rgba(184,148,58,0.35)", color: "var(--brand-gold)" }}
                    >
                      <Icon name={c.icon} size={16} />
                    </div>
                    <div>
                      <div
                        className="font-body text-xs tracking-widest uppercase mb-1"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        {c.label}
                      </div>
                      <div className="font-display font-medium text-white text-base">{c.value}</div>
                      <div className="font-body text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {c.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="p-8"
              style={{ background: "rgba(184,148,58,0.06)", border: "1px solid rgba(184,148,58,0.18)" }}
            >
              <h3 className="font-display font-semibold text-xl mb-2 text-white">Оставьте заявку</h3>
              <p className="font-body font-light text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
                Перезвоним в течение 30 минут
              </p>

              <div className="space-y-4">
                {[
                  { type: "text", placeholder: "Ваше имя" },
                  { type: "tel", placeholder: "Телефон" },
                ].map((f, i) => (
                  <input
                    key={i}
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 font-body text-sm outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,148,58,0.2)", color: "white" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(184,148,58,0.2)")}
                  />
                ))}
                <select
                  className="w-full px-4 py-3 font-body text-sm outline-none transition-all appearance-none"
                  style={{ background: "rgba(30,28,24,0.9)", border: "1px solid rgba(184,148,58,0.2)", color: "rgba(255,255,255,0.6)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(184,148,58,0.2)")}
                >
                  <option value="">Вид работ</option>
                  <option>Ремонт квартиры</option>
                  <option>Ремонт офиса</option>
                  <option>Сантехника</option>
                  <option>Инженерные системы</option>
                  <option>Благоустройство</option>
                </select>
                <textarea
                  rows={3}
                  placeholder="Комментарий (необязательно)"
                  className="w-full px-4 py-3 font-body text-sm outline-none transition-all resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,148,58,0.2)", color: "white" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(184,148,58,0.2)")}
                />
                <button
                  className="w-full py-4 font-display font-medium text-sm uppercase transition-opacity hover:opacity-85"
                  style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.14em" }}
                >
                  Отправить заявку
                </button>
                <p className="font-body text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{ background: "var(--brand-dark)", borderTop: "1px solid rgba(184,148,58,0.15)" }}
        className="py-8"
      >
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 flex items-center justify-center"
              style={{ background: "var(--brand-gold)" }}
            >
              <span className="font-display font-bold text-xs" style={{ color: "var(--brand-dark)" }}>М</span>
            </div>
            <span className="font-display text-sm font-medium text-white tracking-wide">ИП МАСАЛОВ</span>
          </div>
          <p className="font-body text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2018–2026 ИП Масалов. Все права защищены.
          </p>
          <div className="flex gap-6">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href)}
                className="font-body text-xs tracking-wider uppercase transition-colors"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand-gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}