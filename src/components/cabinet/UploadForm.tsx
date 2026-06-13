import { useState } from "react";
import Icon from "@/components/ui/icon";
import { toast } from "@/components/ui/use-toast";
import { api, OBJECTS_URL, fileToBase64 } from "@/lib/api";

export default function UploadForm({ objectId, onUploaded }: { objectId: number; onUploaded: () => void }) {
  const [docType, setDocType] = useState("photo");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim() && !comment.trim() && !file) {
      toast({ title: "Добавьте файл или текст", variant: "destructive" });
      return;
    }
    setBusy(true);
    let fileData = "";
    if (file) fileData = await fileToBase64(file);
    const { ok } = await api(OBJECTS_URL, "add_document", "POST", {
      object_id: objectId,
      doc_type: docType,
      title,
      comment,
      file: fileData,
      filename: file?.name || "",
    });
    setBusy(false);
    if (ok) {
      setTitle("");
      setComment("");
      setFile(null);
      toast({ title: "Добавлено" });
      onUploaded();
    } else {
      toast({ title: "Не удалось сохранить", variant: "destructive" });
    }
  };

  const inputCls = "w-full px-3 py-2 font-body text-sm outline-none border rounded-md bg-white";
  const inputStyle = { borderColor: "rgba(74,70,64,0.25)" };

  return (
    <div className="p-4 rounded-md space-y-3" style={{ background: "var(--brand-cream)", border: "1px solid rgba(74,70,64,0.12)" }}>
      <h4 className="font-display font-semibold text-sm" style={{ color: "var(--brand-dark)" }}>Добавить материал</h4>
      <div className="flex gap-2 flex-wrap">
        {[
          { v: "photo", l: "Фотоотчёт" },
          { v: "document", l: "Документ" },
          { v: "info", l: "Информация" },
        ].map((t) => (
          <button
            key={t.v}
            onClick={() => setDocType(t.v)}
            className="px-3 py-1.5 font-body text-xs rounded-md transition-colors"
            style={docType === t.v
              ? { background: "var(--brand-gold)", color: "var(--brand-dark)" }
              : { background: "white", color: "var(--brand-stone)", border: "1px solid rgba(74,70,64,0.2)" }}
          >
            {t.l}
          </button>
        ))}
      </div>
      <input className={inputCls} style={inputStyle} placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className={inputCls + " resize-none"} style={inputStyle} rows={2} placeholder="Комментарий / сопроводительная информация" value={comment} onChange={(e) => setComment(e.target.value)} />
      <label className="flex items-center gap-2 px-3 py-2 font-body text-sm cursor-pointer border rounded-md bg-white" style={{ borderColor: "rgba(74,70,64,0.25)", color: "var(--brand-stone)" }}>
        <Icon name="Paperclip" size={15} />
        {file ? file.name : "Прикрепить файл / фото"}
        <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} accept={docType === "photo" ? "image/*" : undefined} />
      </label>
      <button onClick={submit} disabled={busy} className="w-full py-2.5 font-display font-medium text-sm uppercase transition-opacity hover:opacity-85 disabled:opacity-50" style={{ background: "var(--brand-gold)", color: "var(--brand-dark)", letterSpacing: "0.1em" }}>
        {busy ? "Отправка..." : "Отправить заказчику"}
      </button>
    </div>
  );
}
