import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { REQUESTS_URL, managerHeaders, formatDate } from "@/lib/api";

interface Req {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  taken_by: string | null;
  assigned_foreman_id: number | null;
  assigned_foreman_name: string;
}

interface Foreman {
  id: number;
  full_name: string;
  email: string;
}

const STATUS: Record<string, { label: string; color: string }> = {
  new: { label: "Новая", color: "#b8943a" },
  in_work: { label: "В работе", color: "#2d7d46" },
  closed: { label: "Закрыта", color: "#7a756c" },
};

export default function RequestsPanelManager() {
  const [items, setItems] = useState<Req[]>([]);
  const [foremen, setForemen] = useState<Foreman[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<number | null>(null);

  const load = async () => {
    const [reqRes, fRes] = await Promise.all([
      fetch(`${REQUESTS_URL}?action=list`, { headers: managerHeaders() }),
      fetch(`${REQUESTS_URL}?action=foremen`, { headers: managerHeaders() }),
    ]);
    const reqData = await reqRes.json();
    const fData = await fRes.json();
    setItems(reqData.requests || []);
    setForemen(fData.foremen || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const assign = async (rid: number, foreman_id: number | null) => {
    setAssigning(rid);
    await fetch(`${REQUESTS_URL}?action=assign`, {
      method: "POST",
      headers: managerHeaders(),
      body: JSON.stringify({ id: rid, foreman_id }),
    });
    toast({ title: foreman_id ? "Прораб назначен" : "Прораб снят" });
    await load();
    setAssigning(null);
  };

  const close = async (rid: number) => {
    await fetch(`${REQUESTS_URL}?action=close`, {
      method: "POST",
      headers: managerHeaders(),
      body: JSON.stringify({ id: rid }),
    });
    toast({ title: "Заявка закрыта" });
    load();
  };

  if (loading) return <p className="font-body" style={{ color: "var(--brand-stone)" }}>Загрузка...</p>;
  if (items.length === 0) return <p className="font-body" style={{ color: "var(--brand-stone)" }}>Заявок пока нет.</p>;

  const active = items.filter((r) => r.status !== "closed");
  const closed = items.filter((r) => r.status === "closed");

  return (
    <div className="space-y-6">
      {active.length === 0 && <p className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>Активных заявок нет.</p>}

      {active.map((r) => {
        const st = STATUS[r.status] || STATUS.new;
        return (
          <div key={r.id} className="p-5 rounded-lg" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="font-display font-semibold text-lg" style={{ color: "var(--brand-dark)" }}>{r.name || "Без имени"}</span>
                <div className="flex flex-wrap gap-3 mt-1 font-body text-sm" style={{ color: "var(--brand-stone)" }}>
                  {r.phone && (
                    <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:underline">
                      <Icon name="Phone" size={13} />{r.phone}
                    </a>
                  )}
                  {r.email && (
                    <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:underline">
                      <Icon name="Mail" size={13} />{r.email}
                    </a>
                  )}
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0"
                style={{ background: st.color + "22", color: st.color }}>
                {st.label}
              </span>
            </div>

            {/* Message */}
            {r.message && (
              <p className="font-body text-sm mb-4 p-3 rounded-md" style={{ background: "var(--brand-cream)", color: "var(--brand-stone)" }}>
                {r.message}
              </p>
            )}

            {/* Assign foreman */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Icon name="HardHat" size={16} style={{ color: "var(--brand-gold)", flexShrink: 0 }} />
                <select
                  value={r.assigned_foreman_id ?? ""}
                  disabled={assigning === r.id}
                  onChange={(e) => assign(r.id, e.target.value ? Number(e.target.value) : null)}
                  className="flex-1 px-3 py-2 font-body text-sm outline-none border rounded-md"
                  style={{ borderColor: r.assigned_foreman_id ? "var(--brand-gold)" : "rgba(74,70,64,0.25)", background: "white" }}
                >
                  <option value="">— Назначить прораба —</option>
                  {foremen.map((f) => (
                    <option key={f.id} value={f.id}>{f.full_name}</option>
                  ))}
                </select>
                {assigning === r.id && (
                  <span className="font-body text-xs" style={{ color: "var(--brand-stone)" }}>...</span>
                )}
              </div>

              {r.status !== "closed" && (
                <button onClick={() => close(r.id)}
                  className="px-3 py-2 font-body text-xs rounded-md flex-shrink-0"
                  style={{ border: "1px solid rgba(74,70,64,0.25)", color: "var(--brand-stone)" }}>
                  Закрыть
                </button>
              )}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-3 font-body text-[11px]" style={{ color: "var(--brand-stone)" }}>
              <span>{formatDate(r.created_at)}</span>
              {r.assigned_foreman_name && (
                <span className="flex items-center gap-1">
                  <Icon name="CheckCircle" size={11} style={{ color: "#2d7d46" }} />
                  Назначен: {r.assigned_foreman_name}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Closed */}
      {closed.length > 0 && (
        <details className="mt-4">
          <summary className="font-body text-sm cursor-pointer" style={{ color: "var(--brand-stone)" }}>
            Закрытые заявки ({closed.length})
          </summary>
          <div className="space-y-2 mt-3">
            {closed.map((r) => (
              <div key={r.id} className="p-3 rounded-md flex items-center justify-between gap-3"
                style={{ border: "1px solid rgba(74,70,64,0.08)", background: "var(--brand-warm-white)", opacity: 0.7 }}>
                <div>
                  <span className="font-body text-sm font-medium" style={{ color: "var(--brand-dark)" }}>{r.name}</span>
                  {r.phone && <span className="font-body text-xs ml-2" style={{ color: "var(--brand-stone)" }}>{r.phone}</span>}
                  {r.assigned_foreman_name && <span className="font-body text-xs ml-2" style={{ color: "var(--brand-stone)" }}>· {r.assigned_foreman_name}</span>}
                </div>
                <span className="font-body text-[11px]" style={{ color: "var(--brand-stone)" }}>{formatDate(r.created_at)}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
