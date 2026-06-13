import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { api, OBJECTS_URL, BuildObject, STATUS_LABELS, formatDate } from "@/lib/api";
import CabinetHeader from "@/components/cabinet/CabinetHeader";
import DocumentsList from "@/components/cabinet/DocumentsList";
import ObjectChat from "@/components/cabinet/ObjectChat";

type ObjectTab = "docs" | "chat";

export default function ClientCabinet() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [objects, setObjects] = useState<BuildObject[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [objectTab, setObjectTab] = useState<Record<number, ObjectTab>>({});
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!loading && user && user.role === "foreman") navigate("/foreman");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.role === "client") {
      api<{ objects: BuildObject[] }>(OBJECTS_URL, "list", "GET").then(({ data }) => {
        setObjects(data.objects || []);
        setBusy(false);
      });
    }
  }, [user]);

  if (loading || !user) return null;

  const getObjTab = (id: number): ObjectTab => objectTab[id] || "docs";
  const setObjTab = (id: number, t: ObjectTab) => setObjectTab((prev) => ({ ...prev, [id]: t }));

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-cream)" }}>
      <CabinetHeader title="Личный кабинет" />
      <main className="container mx-auto px-6 py-10">
        <h1 className="font-display font-bold text-2xl mb-2" style={{ color: "var(--brand-dark)" }}>Мои объекты</h1>
        <p className="font-body font-light text-sm mb-8" style={{ color: "var(--brand-stone)" }}>
          Сроки работ, документы, фотоотчёты и чат с прорабом по вашим объектам.
        </p>

        {busy ? (
          <p className="font-body" style={{ color: "var(--brand-stone)" }}>Загрузка...</p>
        ) : objects.length === 0 ? (
          <div className="p-8 rounded-lg text-center" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
            <Icon name="Building2" size={40} style={{ color: "var(--brand-gold)" }} className="mx-auto mb-3" />
            <p className="font-body" style={{ color: "var(--brand-stone)" }}>
              Пока к вам не привязан ни один объект. Прораб добавит его после оформления.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {objects.map((o) => {
              const open = openId === o.id;
              const ot = getObjTab(o.id);
              return (
                <div key={o.id} className="rounded-lg overflow-hidden" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
                  {/* Header */}
                  <button onClick={() => setOpenId(open ? null : o.id)} className="w-full text-left p-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display font-semibold text-lg" style={{ color: "var(--brand-dark)" }}>{o.title}</h3>
                      {o.address && <p className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>{o.address}</p>}
                      <div className="flex flex-wrap gap-4 mt-3 font-body text-sm" style={{ color: "var(--brand-stone)" }}>
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(184,148,58,0.15)", color: "var(--brand-gold)" }}>
                          {STATUS_LABELS[o.status] || o.status}
                        </span>
                        <span><Icon name="Calendar" size={13} className="inline mr-1" />Начало: {formatDate(o.start_date)}</span>
                        <span><Icon name="Flag" size={13} className="inline mr-1" />Сдача: {formatDate(o.end_date)}</span>
                        {o.foreman_name && <span><Icon name="HardHat" size={13} className="inline mr-1" />Прораб: {o.foreman_name}</span>}
                      </div>
                    </div>
                    <Icon name={open ? "ChevronUp" : "ChevronDown"} size={20} style={{ color: "var(--brand-stone)" }} />
                  </button>

                  {/* Body */}
                  {open && (
                    <div className="px-5 pb-5">
                      {o.description && <p className="font-body text-sm mb-4" style={{ color: "var(--brand-stone)" }}>{o.description}</p>}

                      {/* Object sub-tabs */}
                      <div className="flex gap-2 mb-4">
                        {([
                          { v: "docs", l: "Документы и фото", icon: "FileText" },
                          { v: "chat", l: "Чат с прорабом", icon: "MessageCircle" },
                        ] as { v: ObjectTab; l: string; icon: string }[]).map((t) => (
                          <button
                            key={t.v}
                            onClick={() => setObjTab(o.id, t.v)}
                            className="flex items-center gap-1.5 px-3 py-1.5 font-body text-xs rounded-md transition-colors"
                            style={ot === t.v
                              ? { background: "var(--brand-gold)", color: "var(--brand-dark)" }
                              : { background: "var(--brand-cream)", color: "var(--brand-stone)", border: "1px solid rgba(74,70,64,0.15)" }}
                          >
                            <Icon name={t.icon} size={13} /> {t.l}
                          </button>
                        ))}
                      </div>

                      {ot === "docs" && <DocumentsList objectId={o.id} />}
                      {ot === "chat" && (
                        <ObjectChat objectId={o.id} myId={user.id} myRole="client" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
