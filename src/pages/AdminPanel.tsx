import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { api, AUTH_URL, formatDate } from "@/lib/api";
import PortfolioManager from "@/components/cabinet/PortfolioManager";
import RequestsPanelManager from "@/components/cabinet/RequestsPanelManager";
import TeamChat from "@/components/cabinet/TeamChat";

interface Foreman {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
}

type Tab = "foremen" | "portfolio" | "requests" | "team_chat";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [pwd] = useState(sessionStorage.getItem("admin_pwd") || "");
  const [mgrLogin] = useState(sessionStorage.getItem("admin_login") || "");
  const [authed, setAuthed] = useState(!!sessionStorage.getItem("admin_pwd") && !!sessionStorage.getItem("admin_login"));
  const [loginVal, setLoginVal] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [tab, setTab] = useState<Tab>("foremen");
  const [foremen, setForemen] = useState<Foreman[]>([]);
  const [foremensLoaded, setForemensLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [busy, setBusy] = useState(false);

  const loadForemen = async (l: string, p: string) => {
    const { data } = await api<{ foremen: Foreman[] }>(AUTH_URL, "foremen", "GET", undefined, { admin_login: l, admin_password: p });
    setForemen(data.foremen || []);
    setForemensLoaded(true);
  };

  const login = async () => {
    if (!loginVal.trim() || !loginPwd.trim()) {
      toast({ title: "Введите логин и пароль", variant: "destructive" });
      return;
    }
    const { ok } = await api(AUTH_URL, "admin_login", "POST", { login: loginVal, password: loginPwd });
    if (ok) {
      sessionStorage.setItem("admin_pwd", loginPwd);
      sessionStorage.setItem("admin_login", loginVal);
      setAuthed(true);
      loadForemen(loginVal, loginPwd);
    } else {
      toast({ title: "Неверный логин или пароль", variant: "destructive" });
    }
  };

  const addForeman = async () => {
    if (!email.trim() || !newPwd.trim()) { toast({ title: "Укажите email и пароль", variant: "destructive" }); return; }
    setBusy(true);
    const { ok, data } = await api<{ error?: string }>(AUTH_URL, "register_foreman", "POST", {
      admin_login: mgrLogin,
      admin_password: pwd,
      email, password: newPwd, full_name: name, phone,
    });
    setBusy(false);
    if (ok) {
      toast({ title: "Прораб добавлен" });
      setEmail(""); setName(""); setPhone(""); setNewPwd("");
      loadForemen(mgrLogin, pwd);
    } else {
      toast({ title: data.error || "Ошибка", variant: "destructive" });
    }
  };

  const handleTabChange = (t: Tab) => {
    setTab(t);
    if (t === "foremen" && !foremensLoaded) loadForemen(mgrLogin, pwd);
  };

  const inputCls = "w-full px-3 py-2.5 font-body text-sm outline-none border rounded-md bg-white";
  const inputStyle = { borderColor: "rgba(74,70,64,0.25)" };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--brand-cream)" }}>
        <div className="w-full max-w-sm p-8 rounded-lg space-y-3" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
          <h1 className="font-display font-bold text-xl mb-1" style={{ color: "var(--brand-dark)" }}>Кабинет управленца</h1>
          <p className="font-body text-sm pb-2" style={{ color: "var(--brand-stone)" }}>Введите логин и пароль</p>
          <input
            type="text" className={inputCls} style={inputStyle}
            placeholder="Логин" value={loginVal}
            onChange={(e) => setLoginVal(e.target.value)}
          />
          <input
            type="password" className={inputCls} style={inputStyle}
            placeholder="Пароль" value={loginPwd}
            onChange={(e) => setLoginPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          <button onClick={login} className="w-full py-2.5 font-display text-sm uppercase tracking-wider" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)" }}>Войти</button>
          <button onClick={() => navigate("/login")} className="w-full py-2 font-body text-xs" style={{ color: "var(--brand-stone)" }}>← Назад</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-cream)" }}>
      <header style={{ background: "var(--brand-dark)" }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <span className="font-display font-bold text-lg" style={{ color: "var(--brand-warm-white)" }}>Управленец</span>
          <button
            onClick={() => { sessionStorage.removeItem("admin_pwd"); setAuthed(false); navigate("/"); }}
            className="flex items-center gap-2 font-body text-xs uppercase tracking-wider"
            style={{ color: "var(--brand-gold)" }}
          >
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {([
            { v: "foremen", l: "Прорабы", icon: "HardHat" },
            { v: "requests", l: "Заявки", icon: "Inbox" },
            { v: "team_chat", l: "Командный чат", icon: "MessageSquare" },
            { v: "portfolio", l: "Портфолио", icon: "Image" },
          ] as { v: Tab; l: string; icon: string }[]).map((t) => (
            <button
              key={t.v}
              onClick={() => handleTabChange(t.v)}
              className="flex items-center gap-2 px-4 py-2 font-body text-sm rounded-md transition-colors"
              style={tab === t.v
                ? { background: "var(--brand-dark)", color: "var(--brand-warm-white)" }
                : { background: "var(--brand-warm-white)", color: "var(--brand-stone)", border: "1px solid rgba(74,70,64,0.15)" }}
            >
              <Icon name={t.icon} size={16} /> {t.l}
            </button>
          ))}
        </div>

        {/* FOREMEN TAB */}
        {tab === "foremen" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg h-fit" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
              <h2 className="font-display font-semibold text-lg mb-4" style={{ color: "var(--brand-dark)" }}>Зарегистрировать прораба</h2>
              <div className="space-y-3">
                <input className={inputCls} style={inputStyle} placeholder="Имя прораба" value={name} onChange={(e) => setName(e.target.value)} />
                <input className={inputCls} style={inputStyle} placeholder="Телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <input className={inputCls} style={inputStyle} type="email" placeholder="Email (логин)" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className={inputCls} style={inputStyle} placeholder="Пароль" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
                <button onClick={addForeman} disabled={busy} className="w-full py-2.5 font-display text-sm uppercase tracking-wider disabled:opacity-50" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)" }}>
                  <Icon name="UserPlus" size={15} className="inline mr-1" /> {busy ? "Добавление..." : "Добавить прораба"}
                </button>
              </div>
            </div>

            <div>
              <h2 className="font-display font-semibold text-lg mb-4" style={{ color: "var(--brand-dark)" }}>Список прорабов</h2>
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
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {tab === "portfolio" && (
          <>
            <h2 className="font-display font-semibold text-xl mb-6" style={{ color: "var(--brand-dark)" }}>Управление портфолио</h2>
            <PortfolioManager managerPwd={pwd} />
          </>
        )}

        {/* REQUESTS TAB */}
        {tab === "requests" && (
          <>
            <h2 className="font-display font-semibold text-xl mb-6" style={{ color: "var(--brand-dark)" }}>Заявки с сайта</h2>
            <RequestsPanelManager />
          </>
        )}

        {/* TEAM CHAT TAB */}
        {tab === "team_chat" && (
          <>
            <h2 className="font-display font-semibold text-xl mb-2" style={{ color: "var(--brand-dark)" }}>Командный чат</h2>
            <p className="font-body text-sm mb-5" style={{ color: "var(--brand-stone)" }}>Общение с прорабами команды</p>
            <div className="max-w-2xl">
              <TeamChat myId={0} myRole="manager" isManager />
            </div>
          </>
        )}
      </main>
    </div>
  );
}