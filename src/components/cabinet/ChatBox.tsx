import { useEffect, useRef, useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

export interface ChatMessage {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  text: string;
  created_at: string;
}

interface Props {
  fetchMessages: () => Promise<ChatMessage[]>;
  sendMessage: (text: string) => Promise<void>;
  myId: number;
  myRole: string;
  placeholder?: string;
  pollInterval?: number;
}

const ROLE_LABEL: Record<string, string> = {
  foreman: "Прораб",
  client: "Заказчик",
  manager: "Управленец",
};

const ROLE_COLOR: Record<string, string> = {
  foreman: "#b8943a",
  client: "#2d7d46",
  manager: "#5b5bd6",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return time;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) + " " + time;
}

export default function ChatBox({ fetchMessages, sendMessage, myId, myRole, placeholder = "Написать сообщение...", pollInterval = 5000 }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async (scroll = false) => {
    const msgs = await fetchMessages();
    setMessages(msgs);
    setLoading(false);
    if (scroll) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [fetchMessages]);

  useEffect(() => {
    load(true);
    const t = setInterval(() => load(false), pollInterval);
    return () => clearInterval(t);
  }, [load, pollInterval]);

  const send = async () => {
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setText("");
    await sendMessage(t);
    await load(true);
    setSending(false);
    textareaRef.current?.focus();
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const isMine = (msg: ChatMessage) => {
    if (myRole === "manager" && msg.sender_role === "manager") return true;
    return msg.sender_id === myId;
  };

  return (
    <div className="flex flex-col rounded-lg overflow-hidden" style={{ border: "1px solid rgba(74,70,64,0.15)", background: "var(--brand-warm-white)", height: "420px" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && <p className="font-body text-sm text-center" style={{ color: "var(--brand-stone)" }}>Загрузка...</p>}
        {!loading && messages.length === 0 && (
          <p className="font-body text-sm text-center mt-8" style={{ color: "var(--brand-stone)" }}>Начните переписку</p>
        )}
        {messages.map((msg) => {
          const mine = isMine(msg);
          return (
            <div key={msg.id} className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
              {!mine && (
                <span className="font-body text-[11px] mb-0.5 ml-1" style={{ color: ROLE_COLOR[msg.sender_role] || "var(--brand-stone)" }}>
                  {msg.sender_name || ROLE_LABEL[msg.sender_role] || msg.sender_role}
                </span>
              )}
              <div
                className="max-w-[75%] px-3 py-2 rounded-2xl font-body text-sm leading-relaxed whitespace-pre-wrap"
                style={mine
                  ? { background: "var(--brand-gold)", color: "var(--brand-dark)", borderBottomRightRadius: "4px" }
                  : { background: "rgba(74,70,64,0.08)", color: "var(--brand-dark)", borderBottomLeftRadius: "4px" }}
              >
                {msg.text}
              </div>
              <span className="font-body text-[10px] mt-0.5 mx-1" style={{ color: "var(--brand-stone)" }}>
                {formatTime(msg.created_at)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 p-3 border-t" style={{ borderColor: "rgba(74,70,64,0.1)" }}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className="flex-1 resize-none px-3 py-2 font-body text-sm outline-none rounded-xl"
          style={{ border: "1px solid rgba(74,70,64,0.2)", maxHeight: "96px", lineHeight: "1.4" }}
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 transition-opacity disabled:opacity-40"
          style={{ background: "var(--brand-gold)", color: "var(--brand-dark)" }}
        >
          <Icon name="Send" size={16} />
        </button>
      </div>
    </div>
  );
}
