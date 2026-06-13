import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { api, OBJECTS_URL, BuildObject } from "@/lib/api";

interface ClientOpt {
  id: number;
  full_name: string;
  email: string;
}

export default function ObjectEditor({
  open,
  onOpenChange,
  edit,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  edit: BuildObject | null;
  onSaved: () => void;
}) {
  const [clients, setClients] = useState<ClientOpt[]>([]);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [clientId, setClientId] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      api<{ clients: ClientOpt[] }>(OBJECTS_URL, "clients", "GET").then(({ data }) => setClients(data.clients || []));
      setTitle(edit?.title || "");
      setAddress(edit?.address || "");
      setDescription(edit?.description || "");
      setStatus(edit?.status || "in_progress");
      setStartDate(edit?.start_date || "");
      setEndDate(edit?.end_date || "");
      setClientId(edit?.client_id ? String(edit.client_id) : "");
    }
  }, [open, edit]);

  const submit = async () => {
    if (!title.trim()) {
      toast({ title: "Укажите название объекта", variant: "destructive" });
      return;
    }
    setBusy(true);
    const payload = {
      id: edit?.id,
      title,
      address,
      description,
      status,
      start_date: startDate,
      end_date: endDate,
      client_id: clientId || null,
    };
    const { ok } = await api(OBJECTS_URL, edit ? "update_object" : "create_object", "POST", payload);
    setBusy(false);
    if (ok) {
      toast({ title: edit ? "Объект обновлён" : "Объект создан" });
      onOpenChange(false);
      onSaved();
    } else {
      toast({ title: "Ошибка сохранения", variant: "destructive" });
    }
  };

  const inputCls = "w-full px-3 py-2 font-body text-sm outline-none border rounded-md bg-white";
  const inputStyle = { borderColor: "rgba(74,70,64,0.25)" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{edit ? "Редактировать объект" : "Новый объект"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <input className={inputCls} style={inputStyle} placeholder="Название объекта" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className={inputCls} style={inputStyle} placeholder="Адрес" value={address} onChange={(e) => setAddress(e.target.value)} />
          <textarea className={inputCls + " resize-none"} style={inputStyle} rows={2} placeholder="Описание работ" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs" style={{ color: "var(--brand-stone)" }}>Начало</label>
              <input type="date" className={inputCls} style={inputStyle} value={startDate || ""} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="font-body text-xs" style={{ color: "var(--brand-stone)" }}>Срок сдачи</label>
              <input type="date" className={inputCls} style={inputStyle} value={endDate || ""} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="font-body text-xs" style={{ color: "var(--brand-stone)" }}>Статус</label>
            <select className={inputCls} style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="planned">Запланирован</option>
              <option value="in_progress">В работе</option>
              <option value="paused">Приостановлен</option>
              <option value="done">Завершён</option>
            </select>
          </div>
          <div>
            <label className="font-body text-xs" style={{ color: "var(--brand-stone)" }}>Заказчик</label>
            <select className={inputCls} style={inputStyle} value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">— не привязан —</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name || c.email} ({c.email})</option>
              ))}
            </select>
          </div>
          <button onClick={submit} disabled={busy} className="w-full py-2.5 font-display font-medium text-sm uppercase transition-opacity hover:opacity-85 disabled:opacity-50" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.1em" }}>
            <Icon name="Save" size={15} className="inline mr-1" />
            {busy ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
