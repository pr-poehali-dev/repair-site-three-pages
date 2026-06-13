import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

type Section = "choose" | "foreman" | "manager" | "register";

export default function Auth() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [section, setSection] = useState<Section>("choose");

  // Foreman / client login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Manager login state
  const [mgrLogin, setMgrLogin] = useState("");
  const [mgrPwd, setMgrPwd] = useState("");
  const [mgrError, setMgrError] = useState("");
  const [mgrBusy, setMgrBusy] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === "foreman" ? "/foreman" : "/cabinet");
  }, [user, navigate]);

  const reset = (s: Section) => {
    setSection(s);
    setError(""); setMgrError("");
    setEmail(""); setPassword(""); setFullName(""); setPhone("");
    setMgrLogin(""); setMgrPwd("");
  };

  const submitLogin = async () => {
    setError(""); setBusy(true);
    const err = await login(email, password);
    setBusy(false);
    if (err) setError(err);
  };

  const submitRegister = async () => {
    setError(""); setBusy(true);
    const err = await register({ email, password, full_name: fullName, phone });
    setBusy(false);
    if (err) setError(err);
  };

  const submitManager = async () => {
    if (!mgrLogin.trim() || !mgrPwd.trim()) {
      setMgrError("Введите логин и пароль");
      return;
    }
    setMgrError(""); setMgrBusy(true);
    const { api, AUTH_URL } = await import("@/lib/api");
    const { ok } = await api(AUTH_URL, "admin_login", "POST", { login: mgrLogin, password: mgrPwd });
    setMgrBusy(false);
    if (ok) {
      sessionStorage.setItem("admin_pwd", mgrPwd);
      sessionStorage.setItem("admin_login", mgrLogin);
      navigate("/admin");
    } else {
      setMgrError("Неверный логин или пароль");
    }
  };

  const inputCls = "w-full px-4 py-3 font-body text-sm outline-none border rounded-md bg-white";
  const inputStyle = { borderColor: "rgba(74,70,64,0.25)" };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--brand-cream)" }}>
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/")} className="p-2 rounded-full" style={{ color: "var(--brand-stone)" }}>
            <Icon name="ArrowLeft" size={18} />
          </button>
          <span className="font-display font-bold text-xl" style={{ color: "var(--brand-dark)" }}>
            {section === "choose" && "Личный кабинет"}
            {section === "foreman" && "Вход для прораба"}
            {section === "manager" && "Вход для управленца"}
            {section === "register" && "Регистрация клиента"}
          </span>
        </div>

        {/* CHOOSE */}
        {section === "choose" && (
          <div className="space-y-3">
            <button
              onClick={() => reset("foreman")}
              className="w-full flex items-center justify-between px-6 py-5 rounded-lg transition-all group"
              style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(74,70,64,0.12)")}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: "rgba(184,148,58,0.12)" }}>
                  <Icon name="HardHat" size={20} style={{ color: "var(--brand-gold)" }} />
                </div>
                <div className="text-left">
                  <div className="font-display font-semibold" style={{ color: "var(--brand-dark)" }}>Прораб</div>
                  <div className="font-body text-xs" style={{ color: "var(--brand-stone)" }}>Вход в рабочий кабинет</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={18} style={{ color: "var(--brand-stone)" }} />
            </button>

            <button
              onClick={() => reset("manager")}
              className="w-full flex items-center justify-between px-6 py-5 rounded-lg transition-all"
              style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(74,70,64,0.12)")}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: "rgba(184,148,58,0.12)" }}>
                  <Icon name="ShieldCheck" size={20} style={{ color: "var(--brand-gold)" }} />
                </div>
                <div className="text-left">
                  <div className="font-display font-semibold" style={{ color: "var(--brand-dark)" }}>Управленец</div>
                  <div className="font-body text-xs" style={{ color: "var(--brand-stone)" }}>Панель управления</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={18} style={{ color: "var(--brand-stone)" }} />
            </button>

            <button
              onClick={() => reset("register")}
              className="w-full flex items-center justify-between px-6 py-5 rounded-lg transition-all"
              style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(74,70,64,0.12)")}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ background: "rgba(184,148,58,0.12)" }}>
                  <Icon name="UserPlus" size={20} style={{ color: "var(--brand-gold)" }} />
                </div>
                <div className="text-left">
                  <div className="font-display font-semibold" style={{ color: "var(--brand-dark)" }}>Регистрация клиента</div>
                  <div className="font-body text-xs" style={{ color: "var(--brand-stone)" }}>Создать аккаунт заказчика</div>
                </div>
              </div>
              <Icon name="ChevronRight" size={18} style={{ color: "var(--brand-stone)" }} />
            </button>
          </div>
        )}

        {/* FOREMAN LOGIN */}
        {section === "foreman" && (
          <div className="p-8 rounded-lg space-y-3" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
            <p className="font-body text-sm mb-4" style={{ color: "var(--brand-stone)" }}>Введите данные, которые вам выдал управленец</p>
            <input className={inputCls} style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={inputCls} style={inputStyle} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitLogin()} />
            {error && <p className="font-body text-sm" style={{ color: "#c0392b" }}>{error}</p>}
            <button onClick={submitLogin} disabled={busy} className="w-full py-3 font-display font-medium text-sm uppercase disabled:opacity-50" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.12em" }}>
              {busy ? "Вход..." : "Войти"}
            </button>
            <button onClick={() => reset("choose")} className="w-full py-2 font-body text-xs" style={{ color: "var(--brand-stone)" }}>← Назад</button>
          </div>
        )}

        {/* MANAGER LOGIN */}
        {section === "manager" && (
          <div className="p-8 rounded-lg space-y-3" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
            <p className="font-body text-sm mb-2" style={{ color: "var(--brand-stone)" }}>Введите логин и пароль управленца</p>
            <input
              className={inputCls} style={inputStyle}
              type="text" placeholder="Логин"
              value={mgrLogin} onChange={(e) => setMgrLogin(e.target.value)}
            />
            <input
              className={inputCls} style={inputStyle}
              type="password" placeholder="Пароль"
              value={mgrPwd} onChange={(e) => setMgrPwd(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitManager()}
            />
            {mgrError && <p className="font-body text-sm" style={{ color: "#c0392b" }}>{mgrError}</p>}
            <button onClick={submitManager} disabled={mgrBusy} className="w-full py-3 font-display font-medium text-sm uppercase disabled:opacity-50" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.12em" }}>
              {mgrBusy ? "Проверка..." : "Войти"}
            </button>
            <button onClick={() => reset("choose")} className="w-full py-2 font-body text-xs" style={{ color: "var(--brand-stone)" }}>← Назад</button>
          </div>
        )}

        {/* CLIENT REGISTER */}
        {section === "register" && (
          <div className="p-8 rounded-lg space-y-3" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
            <p className="font-body text-sm mb-4" style={{ color: "var(--brand-stone)" }}>Создайте аккаунт, чтобы следить за ходом работ на вашем объекте</p>
            <input className={inputCls} style={inputStyle} placeholder="Ваше имя" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input className={inputCls} style={inputStyle} placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className={inputCls} style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={inputCls} style={inputStyle} type="password" placeholder="Придумайте пароль" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitRegister()} />
            {error && <p className="font-body text-sm" style={{ color: "#c0392b" }}>{error}</p>}
            <button onClick={submitRegister} disabled={busy} className="w-full py-3 font-display font-medium text-sm uppercase disabled:opacity-50" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.12em" }}>
              {busy ? "Регистрация..." : "Зарегистрироваться"}
            </button>
            <p className="font-body text-xs text-center" style={{ color: "var(--brand-stone)" }}>
              Уже есть аккаунт?{" "}
              <button onClick={() => { reset("foreman"); }} className="underline" style={{ color: "var(--brand-gold)" }}>Войти</button>
            </p>
            <button onClick={() => reset("choose")} className="w-full py-2 font-body text-xs" style={{ color: "var(--brand-stone)" }}>← Назад</button>
          </div>
        )}
      </div>
    </div>
  );
}