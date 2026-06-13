import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import func2url from "../../../backend/func2url.json";

const API_URL = func2url.portfolio;

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export default function PortfolioManager({ managerPwd }: { managerPwd: string }) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageData, setImageData] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data.items || []);
    } catch { /* noop */ } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { const r = reader.result as string; setImageData(r); setImagePreview(r); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title.trim()) { toast({ title: "Укажите название работы", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": managerPwd },
        body: JSON.stringify({ title, description, image: imageData }),
      });
      if (res.ok) {
        setTitle(""); setDescription(""); setImageData(""); setImagePreview("");
        await load();
        toast({ title: "Работа добавлена" });
      } else { toast({ title: "Не удалось сохранить", variant: "destructive" }); }
    } catch { toast({ title: "Ошибка соединения", variant: "destructive" }); } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-Admin-Password": managerPwd },
        body: JSON.stringify({ id }),
      });
      if (res.ok) { await load(); toast({ title: "Работа удалена" }); }
    } catch { toast({ title: "Ошибка соединения", variant: "destructive" }); }
  };

  const inputCls = "w-full px-3 py-2 font-body text-sm outline-none border rounded-md bg-white";
  const inputStyle = { borderColor: "rgba(74,70,64,0.25)" };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Form */}
      <div className="p-5 rounded-lg space-y-3" style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.12)" }}>
        <h3 className="font-display font-semibold text-base" style={{ color: "var(--brand-dark)" }}>Добавить работу</h3>
        <input className={inputCls} style={inputStyle} placeholder="Название работы" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className={inputCls + " resize-none"} style={inputStyle} rows={3} placeholder="Описание заказа" value={description} onChange={(e) => setDescription(e.target.value)} />
        <label className="flex items-center gap-3 px-3 py-2 font-body text-sm cursor-pointer border rounded-md bg-white" style={{ borderColor: "rgba(74,70,64,0.25)", color: "var(--brand-stone)" }}>
          <Icon name="Upload" size={15} />
          {imagePreview ? "Фото выбрано — заменить" : "Загрузить фото"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </label>
        {imagePreview && <img src={imagePreview} alt="preview" className="w-full max-h-40 object-cover rounded-md" />}
        <button onClick={handleSave} disabled={saving} className="w-full py-2.5 font-display font-medium text-sm uppercase disabled:opacity-50" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.1em" }}>
          {saving ? "Сохранение..." : "Добавить в портфолио"}
        </button>
      </div>

      {/* List */}
      <div>
        <h3 className="font-display font-semibold text-base mb-3" style={{ color: "var(--brand-dark)" }}>Опубликованные работы</h3>
        {loading ? (
          <p className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>Загрузка...</p>
        ) : items.length === 0 ? (
          <p className="font-body text-sm" style={{ color: "var(--brand-stone)" }}>Пока нет работ.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-md" style={{ border: "1px solid rgba(74,70,64,0.12)", background: "var(--brand-warm-white)" }}>
                {item.image_url && <img src={item.image_url} alt={item.title} className="w-12 h-12 object-cover rounded flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium truncate" style={{ color: "var(--brand-dark)" }}>{item.title}</p>
                  {item.description && <p className="font-body text-xs truncate" style={{ color: "var(--brand-stone)" }}>{item.description}</p>}
                </div>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 flex-shrink-0 transition-colors" style={{ color: "var(--brand-stone)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--brand-stone)")}>
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
