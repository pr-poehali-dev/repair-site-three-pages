import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { api, REQUESTS_URL, formatDate } from "@/lib/api";

export interface Req {
  id: number;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
  taken_by: string | null;
  assigned_foreman_name?: string;
}

const STATUS: Record<string, { label: string; color: string }> = {
  new: { label: "Новая", color: "#b8943a" },
  in_work: { label: "В работе", color: "#2d7d46" },
  closed: { label: "Закрыта", color: "#7a756c" },
};

export default function RequestsPanel({ onCreateObject }: { onCreateObject?: (req: Req) => void }) {
  const [items, setItems] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api<{ requests: Req[] }>(REQUESTS_URL, "list", "GET").then(({ data }) => {
      setItems(data.requests || []);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const act = async (id: number, action: "take" | "close") => {
    const { ok } = await api(REQUESTS_URL, action, "POST", { id });
    if (ok) {
      toast({ title: action === "take" ? "Заявка взята в работу" : "Заявка закрыта" });
      load();
    }
  };

  if (loading) return <p className="font-body" style={{ color: "var(--brand-stone)" }}>Загрузка...</p>;
  if (items.length === 0) return (
    <div className="p-6 rounded-lg text-center" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
      <Icon name="Inbox" size={32} className="mx-auto mb-2" style={{ color: "var(--brand-stone)" }} />
      <p className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>Вам пока не назначено заявок.</p>
      <p className="font-body text-xs mt-1" style={{ color: "var(--brand-stone)", opacity: 0.7 }}>Управленец назначит заявку — она появится здесь.</p>
    </div>
  );

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
            {r.message && (
              <p className="font-body text-sm mt-2 p-3 rounded-md" style={{ background: "var(--brand-cream)", color: "var(--brand-stone)" }}>{r.message}</p>
            )}
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <span className="font-body text-[11px]" style={{ color: "var(--brand-stone)" }}>
                {formatDate(r.created_at)}
                {r.status === "in_work" && (
                  <span className="ml-2 inline-flex items-center gap-1" style={{ color: "#2d7d46" }}>
                    <Icon name="CheckCircle" size={11} /> Назначено управленцем
                  </span>
                )}
              </span>
              <div className="flex gap-2">
                {onCreateObject && r.status !== "closed" && (
                  <button onClick={() => onCreateObject(r)} className="flex items-center gap-1 px-3 py-1.5 font-body text-xs rounded-md" style={{ background: "var(--brand-dark)", color: "var(--brand-warm-white)" }}>
                    <Icon name="Plus" size={13} /> Создать объект
                  </button>
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