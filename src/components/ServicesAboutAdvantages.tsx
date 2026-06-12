import Icon from "@/components/ui/icon";

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

interface ServicesAboutAdvantagesProps {
  scrollTo: (id: string) => void;
}

export default function ServicesAboutAdvantages({ scrollTo }: ServicesAboutAdvantagesProps) {
  return (
    <>
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
    </>
  );
}
