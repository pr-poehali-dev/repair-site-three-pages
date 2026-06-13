import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import func2url from "../../backend/func2url.json";

const API_URL = func2url.portfolio;

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export default function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [adminPassword, setAdminPassword] = useState<string | null>(
    () => sessionStorage.getItem("admin_password")
  );
  const [loginOpen, setLoginOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageData, setImageData] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      const res = await fetch(`${API_URL}?action=login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("admin_password", password);
        setAdminPassword(password);
        setLoginOpen(false);
        setManageOpen(true);
        setLogin("");
        setPassword("");
        toast({ title: "Вход выполнен" });
      } else {
        toast({ title: "Неверный логин или пароль", variant: "destructive" });
      }
    } catch {
      toast({ title: "Ошибка соединения", variant: "destructive" });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAdminClick = () => {
    if (adminPassword) setManageOpen(true);
    else setLoginOpen(true);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageData(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: "Укажите название работы", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": adminPassword || "",
        },
        body: JSON.stringify({ title, description, image: imageData }),
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        setImageData("");
        setImagePreview("");
        await loadItems();
        toast({ title: "Работа добавлена" });
      } else {
        toast({ title: "Не удалось сохранить", variant: "destructive" });
      }
    } catch {
      toast({ title: "Ошибка соединения", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": adminPassword || "",
        },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await loadItems();
        toast({ title: "Работа удалена" });
      }
    } catch {
      toast({ title: "Ошибка соединения", variant: "destructive" });
    }
  };

  return (
    <section id="portfolio" style={{ background: "var(--brand-cream)" }} className="py-24">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <span className="font-body text-xs tracking-widest uppercase font-medium" style={{ color: "var(--brand-gold)" }}>
              Наши работы
            </span>
            <h2
              className="font-display font-bold mt-3 mb-5"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "var(--brand-dark)" }}
            >
              ПОРТФОЛИО
            </h2>
            <span className="gold-divider" />
          </div>
          <button
            onClick={handleAdminClick}
            className="flex items-center gap-2 px-4 py-2 font-body text-xs tracking-wider uppercase transition-colors"
            style={{ border: "1px solid rgba(74,70,64,0.25)", color: "var(--brand-stone)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--brand-gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(74,70,64,0.25)")}
          >
            <Icon name="Lock" size={14} />
            Управление
          </button>
        </div>

        {loading ? (
          <p className="font-body font-light" style={{ color: "var(--brand-stone)" }}>
            Загрузка...
          </p>
        ) : items.length === 0 ? (
          <p className="font-body font-light" style={{ color: "var(--brand-stone)" }}>
            Работы скоро появятся.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg"
                style={{ background: "var(--brand-warm-white)", border: "1px solid rgba(74,70,64,0.1)" }}
              >
                {item.image_url ? (
                  <div className="overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{ aspectRatio: "4/3", background: "rgba(184,148,58,0.08)", color: "var(--brand-gold)" }}
                  >
                    <Icon name="Image" size={40} />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display font-semibold text-lg mb-2" style={{ color: "var(--brand-dark)" }}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="font-body font-light text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--brand-stone)" }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOGIN DIALOG */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Вход для администратора</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <input
              type="text"
              placeholder="Логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 font-body text-sm outline-none border rounded-md"
              style={{ borderColor: "rgba(74,70,64,0.25)" }}
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 font-body text-sm outline-none border rounded-md"
              style={{ borderColor: "rgba(74,70,64,0.25)" }}
            />
            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="w-full py-3 font-display font-medium text-sm uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.12em" }}
            >
              {loginLoading ? "Проверка..." : "Войти"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MANAGE DIALOG */}
      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Управление портфолио</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div
              className="p-5 rounded-md space-y-4"
              style={{ background: "var(--brand-cream)", border: "1px solid rgba(74,70,64,0.12)" }}
            >
              <h4 className="font-display font-semibold text-base" style={{ color: "var(--brand-dark)" }}>
                Добавить работу
              </h4>
              <input
                type="text"
                placeholder="Название работы"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 font-body text-sm outline-none border rounded-md bg-white"
                style={{ borderColor: "rgba(74,70,64,0.25)" }}
              />
              <textarea
                rows={3}
                placeholder="Описание заказа"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 font-body text-sm outline-none border rounded-md resize-none bg-white"
                style={{ borderColor: "rgba(74,70,64,0.25)" }}
              />
              <label
                className="flex items-center gap-3 px-4 py-3 font-body text-sm cursor-pointer border rounded-md bg-white transition-colors"
                style={{ borderColor: "rgba(74,70,64,0.25)", color: "var(--brand-stone)" }}
              >
                <Icon name="Upload" size={16} />
                {imagePreview ? "Фото выбрано — заменить" : "Загрузить фото"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
              {imagePreview && (
                <img src={imagePreview} alt="preview" className="w-full max-h-48 object-cover rounded-md" />
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 font-display font-medium text-sm uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
                style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.12em" }}
              >
                {saving ? "Сохранение..." : "Добавить в портфолио"}
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-display font-semibold text-base" style={{ color: "var(--brand-dark)" }}>
                Опубликованные работы
              </h4>
              {items.length === 0 ? (
                <p className="font-body font-light text-sm" style={{ color: "var(--brand-stone)" }}>
                  Пока нет работ.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-md"
                    style={{ border: "1px solid rgba(74,70,64,0.12)" }}
                  >
                    {item.image_url && (
                      <img src={item.image_url} alt={item.title} className="w-14 h-14 object-cover rounded" />
                    )}
                    <span className="flex-1 font-body text-sm" style={{ color: "var(--brand-dark)" }}>
                      {item.title}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 transition-colors"
                      style={{ color: "var(--brand-stone)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--brand-stone)")}
                    >
                      <Icon name="Trash2" size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
