import { useState } from "react";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { api, REQUESTS_URL } from "@/lib/api";

const navLinks = [
  { label: "Услуги", href: "#services" },
  { label: "О компании", href: "#about" },
  { label: "Преимущества", href: "#advantages" },
  { label: "Портфолио", href: "#portfolio" },
  { label: "Контакты", href: "#contacts" },
];

interface ContactsFooterProps {
  scrollTo: (id: string) => void;
}

export default function ContactsFooter({ scrollTo }: ContactsFooterProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [workType, setWorkType] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const submitRequest = async () => {
    if (!name.trim() || !phone.trim()) {
      toast({ title: "Укажите имя и телефон", variant: "destructive" });
      return;
    }
    setBusy(true);
    const message = [workType, comment].filter(Boolean).join(". ");
    const { ok } = await api(REQUESTS_URL, "create", "POST", { name, phone, message });
    setBusy(false);
    if (ok) {
      toast({ title: "Заявка отправлена!", description: "Прораб свяжется с вами в ближайшее время." });
      setName(""); setPhone(""); setWorkType(""); setComment("");
    } else {
      toast({ title: "Не удалось отправить заявку", variant: "destructive" });
    }
  };

  return (
    <>
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
            Смета в подарок при заключении договора. Бесплатный выезд замерщика. Без обязательств.
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
                  { icon: "Phone", label: "Телефон", value: "+7 905 210-48-84", sub: "Санкт-Петербург и ЛО" },
                  { icon: "Mail", label: "Email", value: "masalovn@inbox.ru", sub: "Ответим за 2 часа" },
                  { icon: "MapPin", label: "Офис", value: "просп. Обуховской Обороны, 86К", sub: "Пн–Пт 9:00–19:00" },
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
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 font-body text-sm outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,148,58,0.2)", color: "white" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(184,148,58,0.2)")}
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 font-body text-sm outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,148,58,0.2)", color: "white" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(184,148,58,0.2)")}
                />
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
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
                  <option>Другие строительные работы</option>
                </select>
                <textarea
                  rows={3}
                  placeholder="Комментарий (необязательно)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 font-body text-sm outline-none transition-all resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(184,148,58,0.2)", color: "white" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(184,148,58,0.2)")}
                />
                <button
                  onClick={submitRequest}
                  disabled={busy}
                  className="w-full py-4 font-display font-medium text-sm uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.14em" }}
                >
                  {busy ? "Отправка..." : "Отправить заявку"}
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
    </>
  );
}