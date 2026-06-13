import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { api, REQUESTS_URL, managerHeaders, formatDate } from "@/lib/api";

interface Req {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  taken_by: string | null;
}

const STATUS: Record<string, { label: string; color: string }> = {
  new: { label: "Новая", color: "#b8943a" },
  in_work: { label: "В работе", color: "#2d7d46" },
  closed: { label: "Закрыта", color: "#7a756c" },
};

export default function RequestsPanelManager() {
  const [items, setItems] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const qs = new URLSearchParams({ action: "list" }).toString();
    try {
      const res = await fetch(`${REQUESTS_URL}?${qs}`, {
        headers: managerHeaders(),
      });
      const data = await res.json();
      setItems(data.requests || []);
    } catch { /* noop */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const act = async (id: number, action: "take" | "close") => {
    await fetch(`${REQUESTS_URL}?action=${action}`, {
      method: "POST",
      headers: managerHeaders(),
      body: JSON.stringify({ id }),
    });
    toast({ title: action === "take" ? "Заявка взята в работу" : "Заявка закрыта" });
    load();
  };

  if (loading) return <p className="font-body" style={{ color: "var(--brand-stone)" }}>Загрузка...</p>;
  if (items.length === 0) return <p className="font-body" style={{ color: "var(--brand-stone)" }}>Новых заявок нет.</p>;

  return (
    <div className="space-y-3">
      {items.map((r) => {
        const st = STATUS[r.status] || STATUS.new;
        return (
          <div key={r.id} className="p-4 rounded-lg" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-display font-semibold" style={{ color: "var(--brand-dark)" }}>{r.name || "Без имени"}</span>
                <div className="flex flex-wrap gap-3 mt-1 font-body text-sm" style={{ color: "var(--brand-stone)" }}>
                  {r.phone && <a href={`tel:${r.phone}`} className="flex items-center gap-1"><Icon name="Phone" size={13} />{r.phone}</a>}
                  {r.email && <a href={`mailto:${r.email}`} className="flex items-center gap-1"><Icon name="Mail" size={13} />{r.email}</a>}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap" style={{ background: st.color + "22", color: st.color }}>{st.label}</span>
            </div>
            {r.message && <p className="font-body text-sm mt-2" style={{ color: "var(--brand-stone)" }}>{r.message}</p>}
            <div className="flex items-center justify-between mt-3">
              <span className="font-body text-[11px]" style={{ color: "var(--brand-stone)" }}>
                {formatDate(r.created_at)}{r.taken_by ? ` · ${r.taken_by}` : ""}
              </span>
              <div className="flex gap-2">
                {r.status === "new" && (
                  <button onClick={() => act(r.id, "take")} className="px-3 py-1.5 font-body text-xs rounded-md" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)" }}>Взять в работу</button>
                )}
                {r.status !== "closed" && (
                  <button onClick={() => act(r.id, "close")} className="px-3 py-1.5 font-body text-xs rounded-md" style={{ border: "1px solid rgba(74,70,64,0.25)", color: "var(--brand-stone)" }}>Закрыть</button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
