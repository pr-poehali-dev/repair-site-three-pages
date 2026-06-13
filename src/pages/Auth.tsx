import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === "foreman" ? "/foreman" : "/cabinet");
    }
  }, [user, navigate]);

  const submit = async () => {
    setError("");
    setBusy(true);
    const err =
      mode === "login"
        ? await login(email, password)
        : await register({ email, password, full_name: fullName, phone });
    setBusy(false);
    if (err) setError(err);
  };

  const inputCls = "w-full px-4 py-3 font-body text-sm outline-none border rounded-md bg-white";
  const inputStyle = { borderColor: "rgba(74,70,64,0.25)" };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--brand-cream)" }}>
      <div className="w-full max-w-md p-8 rounded-lg" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
        <button onClick={() => navigate("/")} className="flex items-center gap-2 mb-6 font-body text-xs uppercase tracking-wider" style={{ color: "var(--brand-stone)" }}>
          <Icon name="ArrowLeft" size={14} /> На главную
        </button>
        <h1 className="font-display font-bold text-2xl mb-1" style={{ color: "var(--brand-dark)" }}>
          {mode === "login" ? "Вход в кабинет" : "Регистрация заказчика"}
        </h1>
        <p className="font-body font-light text-sm mb-6" style={{ color: "var(--brand-stone)" }}>
          {mode === "login" ? "Войдите, чтобы следить за вашим объектом" : "Создайте аккаунт, чтобы видеть ход работ"}
        </p>

        <div className="space-y-3">
          {mode === "register" && (
            <>
              <input className={inputCls} style={inputStyle} placeholder="Ваше имя" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <input className={inputCls} style={inputStyle} placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </>
          )}
          <input className={inputCls} style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inputCls} style={inputStyle} type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />

          {error && <p className="font-body text-sm" style={{ color: "#c0392b" }}>{error}</p>}

          <button onClick={submit} disabled={busy} className="w-full py-3 font-display font-medium text-sm uppercase transition-opacity hover:opacity-85 disabled:opacity-50" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.12em" }}>
            {busy ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </div>

        <div className="mt-5 text-center font-body text-sm" style={{ color: "var(--brand-stone)" }}>
          {mode === "login" ? (
            <>Нет аккаунта? <button onClick={() => { setMode("register"); setError(""); }} className="underline" style={{ color: "var(--brand-gold)" }}>Регистрация</button></>
          ) : (
            <>Уже есть аккаунт? <button onClick={() => { setMode("login"); setError(""); }} className="underline" style={{ color: "var(--brand-gold)" }}>Войти</button></>
          )}
        </div>
      </div>
    </div>
  );
}
