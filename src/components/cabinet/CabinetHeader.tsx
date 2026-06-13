import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useAuth } from "@/context/AuthContext";

export default function CabinetHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30" style={{ background: "var(--brand-dark)" }}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="font-display font-bold text-lg" style={{ color: "var(--brand-warm-white)" }}>
          {title}
        </button>
        <div className="flex items-center gap-4">
          {user && (
            <span className="font-body text-sm hidden sm:inline" style={{ color: "rgba(255,255,255,0.75)" }}>
              {user.full_name || user.email}
            </span>
          )}
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="flex items-center gap-2 font-body text-xs uppercase tracking-wider"
            style={{ color: "var(--brand-gold)" }}
          >
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
