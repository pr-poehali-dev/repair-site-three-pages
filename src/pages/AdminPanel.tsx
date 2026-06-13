import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { api, AUTH_URL, formatDate } from "@/lib/api";

interface Foreman {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState(sessionStorage.getItem("admin_pwd") || "");
  const [authed, setAuthed] = useState(!!sessionStorage.getItem("admin_pwd"));
  const [loginPwd, setLoginPwd] = useState("");
  const [foremen, setForemen] = useState<Foreman[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [busy, setBusy] = useState(false);

  const loadForemen = async (password: string) => {
    const { data } = await api<{ foremen: Foreman[] }>(AUTH_URL, "foremen", "GET", undefined, { admin_password: password });
    setForemen(data.foremen || []);
  };

  const login = async () => {
    const { ok } = await api(AUTH_URL, "admin_login", "POST", { password: loginPwd });
    if (ok) {
      sessionStorage.setItem("admin_pwd", loginPwd);
      setPwd(loginPwd);
      setAuthed(true);
      loadForemen(loginPwd);
    } else {
      toast({ title: "Неверный пароль", variant: "destructive" });
    }
  };

  const addForeman = async () => {
    if (!email.trim() || !newPwd.trim()) {
      toast({ title: "Укажите email и пароль", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { ok, data } = await api<{ error?: string }>(AUTH_URL, "register_foreman", "POST", {
      admin_password: pwd,
      email,
      password: newPwd,
      full_name: name,
      phone,
    });
    setBusy(false);
    if (ok) {
      toast({ title: "Прораб добавлен" });
      setEmail(""); setName(""); setPhone(""); setNewPwd("");
      loadForemen(pwd);
    } else {
      toast({ title: data.error || "Ошибка", variant: "destructive" });
    }
  };

  const inputCls = "w-full px-3 py-2.5 font-body text-sm outline-none border rounded-md bg-white";
  const inputStyle = { borderColor: "rgba(74,70,64,0.25)" };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--brand-cream)" }}>
        <div className="w-full max-w-sm p-8 rounded-lg" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
          <h1 className="font-display font-bold text-xl mb-4" style={{ color: "var(--brand-dark)" }}>Панель администратора</h1>
          <input type="password" className={inputCls} style={inputStyle} placeholder="Пароль администратора" value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
          <button onClick={login} className="w-full mt-3 py-2.5 font-display text-sm uppercase tracking-wider" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)" }}>Войти</button>
          <button onClick={() => navigate("/")} className="w-full mt-3 font-body text-xs" style={{ color: "var(--brand-stone)" }}>На главную</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-cream)" }}>
      <header style={{ background: "var(--brand-dark)" }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display font-bold text-lg" style={{ color: "var(--brand-warm-white)" }}>Администратор</span>
          <button onClick={() => { sessionStorage.removeItem("admin_pwd"); setAuthed(false); navigate("/"); }} className="font-body text-xs uppercase tracking-wider" style={{ color: "var(--brand-gold)" }}>Выйти</button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg h-fit" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
          <h2 className="font-display font-semibold text-lg mb-4" style={{ color: "var(--brand-dark)" }}>Зарегистрировать прораба</h2>
          <div className="space-y-3">
            <input className={inputCls} style={inputStyle} placeholder="Имя прораба" value={name} onChange={(e) => setName(e.target.value)} />
            <input className={inputCls} style={inputStyle} placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className={inputCls} style={inputStyle} type="email" placeholder="Email (логин)" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={inputCls} style={inputStyle} placeholder="Пароль" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
            <button onClick={addForeman} disabled={busy} className="w-full py-2.5 font-display text-sm uppercase tracking-wider disabled:opacity-50" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)" }}>
              <Icon name="UserPlus" size={15} className="inline mr-1" /> {busy ? "Добавление..." : "Добавить"}
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold text-lg mb-4" style={{ color: "var(--brand-dark)" }}>Прорабы</h2>
          {foremen.length === 0 ? (
            <p className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>Пока нет прорабов.</p>
          ) : (
            <div className="space-y-2">
              {foremen.map((f) => (
                <div key={f.id} className="p-3 rounded-md" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
                  <span className="font-display font-medium" style={{ color: "var(--brand-dark)" }}>{f.full_name || f.email}</span>
                  <div className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>{f.email} · {f.phone || "без телефона"}</div>
                  <div className="font-body text-[11px]" style={{ color: "var(--brand-stone)" }}>Добавлен {formatDate(f.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
