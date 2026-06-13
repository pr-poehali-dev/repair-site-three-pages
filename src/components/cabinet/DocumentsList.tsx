import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { api, OBJECTS_URL, ObjectDoc, formatDate } from "@/lib/api";

const TYPE_LABEL: Record<string, string> = {
  document: "Документ",
  photo: "Фотоотчёт",
  info: "Информация",
};

export default function DocumentsList({ objectId, refreshKey }: { objectId: number; refreshKey?: number }) {
  const [docs, setDocs] = useState<ObjectDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api<{ documents: ObjectDoc[] }>(OBJECTS_URL, "documents", "GET", undefined, {
      object_id: String(objectId),
    }).then(({ data }) => {
      if (active) {
        setDocs(data.documents || []);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [objectId, refreshKey]);

  if (loading) return <p className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>Загрузка...</p>;
  if (docs.length === 0) return <p className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>Пока нет материалов.</p>;

  const photos = docs.filter((d) => d.doc_type === "photo");
  const others = docs.filter((d) => d.doc_type !== "photo");

  return (
    <div className="space-y-5">
      {photos.length > 0 && (
        <div>
          <h4 className="font-display font-semibold text-sm mb-3" style={{ color: "var(--brand-dark)" }}>Фотоотчёты</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((d) => (
              <a key={d.id} href={d.file_url} target="_blank" rel="noreferrer" className="block group">
                <img src={d.file_url} alt={d.title} className="w-full h-32 object-cover rounded-md" />
                {(d.title || d.comment) && (
                  <p className="font-body text-xs mt-1" style={{ color: "var(--brand-stone)" }}>{d.title || d.comment}</p>
                )}
                <p className="font-body text-[11px]" style={{ color: "var(--brand-stone)" }}>{formatDate(d.created_at)}</p>
              </a>
            ))}
          </div>
        </div>
      )}
      {others.map((d) => (
        <div key={d.id} className="flex items-start gap-3 p-3 rounded-md" style={{ border: "1px solid rgba(74,70,64,0.12)" }}>
          <Icon name={d.doc_type === "info" ? "Info" : "FileText"} size={18} style={{ color: "var(--brand-gold)" }} />
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-body font-medium text-sm" style={{ color: "var(--brand-dark)" }}>{d.title || TYPE_LABEL[d.doc_type]}</span>
              <span className="font-body text-[11px]" style={{ color: "var(--brand-stone)" }}>{formatDate(d.created_at)}</span>
            </div>
            {d.comment && <p className="font-body text-sm mt-1" style={{ color: "var(--brand-stone)" }}>{d.comment}</p>}
            {d.file_url && (
              <a href={d.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-body text-xs mt-1 underline" style={{ color: "var(--brand-gold)" }}>
                <Icon name="Download" size={12} /> Скачать файл
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
