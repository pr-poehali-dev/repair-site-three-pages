import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";
import { api, OBJECTS_URL, BuildObject, STATUS_LABELS, formatDate } from "@/lib/api";
import CabinetHeader from "@/components/cabinet/CabinetHeader";
import DocumentsList from "@/components/cabinet/DocumentsList";
import UploadForm from "@/components/cabinet/UploadForm";
import ObjectEditor from "@/components/cabinet/ObjectEditor";
import RequestsPanel from "@/components/cabinet/RequestsPanel";

export default function ForemanCabinet() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"objects" | "requests">("objects");
  const [objects, setObjects] = useState<BuildObject[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editObj, setEditObj] = useState<BuildObject | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!loading && user && user.role === "client") navigate("/cabinet");
  }, [user, loading, navigate]);

  const loadObjects = () => {
    api<{ objects: BuildObject[] }>(OBJECTS_URL, "list", "GET").then(({ data }) => {
      setObjects(data.objects || []);
      setBusy(false);
    });
  };

  useEffect(() => {
    if (user?.role === "foreman") loadObjects();
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-cream)" }}>
      <CabinetHeader title="Кабинет прораба" />
      <main className="container mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          {[
            { v: "objects", l: "Объекты", icon: "Building2" },
            { v: "requests", l: "Заявки", icon: "Inbox" },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v as "objects" | "requests")}
              className="flex items-center gap-2 px-4 py-2 font-body text-sm rounded-md transition-colors"
              style={tab === t.v
                ? { background: "var(--brand-dark)", color: "var(--brand-warm-white)" }
                : { background: "var(--brand-warm-white)", color: "var(--brand-stone)", border: "1px solid rgba(74,70,64,0.15)" }}
            >
              <Icon name={t.icon} size={16} /> {t.l}
            </button>
          ))}
        </div>

        {tab === "objects" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <h1 className="font-display font-bold text-2xl" style={{ color: "var(--brand-dark)" }}>Мои объекты</h1>
              <button onClick={() => { setEditObj(null); setEditorOpen(true); }} className="flex items-center gap-2 px-4 py-2 font-display text-sm uppercase tracking-wider" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)" }}>
                <Icon name="Plus" size={16} /> Добавить объект
              </button>
            </div>

            {busy ? (
              <p className="font-body" style={{ color: "var(--brand-stone)" }}>Загрузка...</p>
            ) : objects.length === 0 ? (
              <p className="font-body" style={{ color: "var(--brand-stone)" }}>Пока нет объектов. Создайте первый.</p>
            ) : (
              <div className="space-y-4">
                {objects.map((o) => {
                  const open = openId === o.id;
                  return (
                    <div key={o.id} className="rounded-lg overflow-hidden" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
                      <div className="p-5 flex items-start justify-between gap-4">
                        <button onClick={() => setOpenId(open ? null : o.id)} className="text-left flex-1">
                          <h3 className="font-display font-semibold text-lg" style={{ color: "var(--brand-dark)" }}>{o.title}</h3>
                          {o.address && <p className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>{o.address}</p>}
                          <div className="flex flex-wrap gap-3 mt-2 font-body text-sm" style={{ color: "var(--brand-stone)" }}>
                            <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(184,148,58,0.15)", color: "var(--brand-gold)" }}>{STATUS_LABELS[o.status] || o.status}</span>
                            <span>Сдача: {formatDate(o.end_date)}</span>
                            <span>{o.client_name ? `Заказчик: ${o.client_name}` : "Заказчик не привязан"}</span>
                          </div>
                        </button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditObj(o); setEditorOpen(true); }} className="p-2" style={{ color: "var(--brand-stone)" }}><Icon name="Pencil" size={18} /></button>
                          <button onClick={() => setOpenId(open ? null : o.id)} className="p-2" style={{ color: "var(--brand-stone)" }}><Icon name={open ? "ChevronUp" : "ChevronDown"} size={20} /></button>
                        </div>
                      </div>
                      {open && (
                        <div className="px-5 pb-5 grid md:grid-cols-2 gap-5">
                          <div>
                            <h4 className="font-display font-semibold text-sm mb-3" style={{ color: "var(--brand-dark)" }}>Материалы по объекту</h4>
                            <DocumentsList objectId={o.id} refreshKey={refreshKey} />
                          </div>
                          <UploadForm objectId={o.id} onUploaded={() => setRefreshKey((k) => k + 1)} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === "requests" && (
          <>
            <h1 className="font-display font-bold text-2xl mb-5" style={{ color: "var(--brand-dark)" }}>Заявки с сайта</h1>
            <RequestsPanel />
          </>
        )}
      </main>

      <ObjectEditor open={editorOpen} onOpenChange={setEditorOpen} edit={editObj} onSaved={loadObjects} />
    </div>
  );
}
