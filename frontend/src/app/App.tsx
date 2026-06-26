import { useState, useEffect } from "react";
import {
  Plus, Eye, EyeOff, ArrowDownLeft, ArrowUpRight, ChevronRight,
  Bell, Shield, Download, LogOut, Moon, Check,
  TrendingUp, TrendingDown, Wallet, CreditCard, Smartphone,
  Camera, Settings, Home, ArrowLeft, Tag, BarChart3, User,
  ArrowLeftRight, X, Search, Filter
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type Screen = "login" | "dashboard" | "newTransaction" | "categories" | "addCategory" | "reports" | "profile";
type TransactionType = "expense" | "income";

interface Transaction {
  id: number; title: string; category: string;
  date: string; amount: number; type: TransactionType; icon: string;
}
interface Category {
  id: number; name: string; icon: string;
  color: string; budget: number; spent: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const initialTransactions: Transaction[] = [
  { id: 1, title: "iFood - Almoço", category: "Alimentação", date: "Hoje, 12:34", amount: 47.90, type: "expense", icon: "🍔" },
  { id: 2, title: "Salário", category: "Trabalho", date: "Hoje, 09:00", amount: 5800.00, type: "income", icon: "💼" },
  { id: 3, title: "Uber", category: "Transporte", date: "Ontem, 18:22", amount: 23.50, type: "expense", icon: "⛽" },
  { id: 4, title: "Netflix", category: "Entretenimento", date: "Ontem, 00:00", amount: 39.90, type: "expense", icon: "🎮" },
  { id: 5, title: "Mercado Livre", category: "Compras", date: "25 jun, 14:10", amount: 189.99, type: "expense", icon: "🛒" },
  { id: 6, title: "Freelance Design", category: "Trabalho", date: "24 jun, 11:00", amount: 1200.00, type: "income", icon: "💼" },
  { id: 7, title: "Conta de Luz", category: "Contas", date: "23 jun, 08:00", amount: 134.60, type: "expense", icon: "💡" },
  { id: 8, title: "Farmácia", category: "Saúde", date: "22 jun, 16:45", amount: 78.30, type: "expense", icon: "🏥" },
  { id: 9, title: "Spotify", category: "Entretenimento", date: "21 jun, 00:00", amount: 21.90, type: "expense", icon: "🎮" },
  { id: 10, title: "Academia", category: "Saúde", date: "20 jun, 07:00", amount: 89.90, type: "expense", icon: "🏥" },
  { id: 11, title: "Aluguel", category: "Moradia", date: "01 jun, 08:00", amount: 1800.00, type: "expense", icon: "🏠" },
  { id: 12, title: "Consultoria", category: "Trabalho", date: "15 jun, 10:00", amount: 2500.00, type: "income", icon: "💼" },
];

const initialCategories: Category[] = [
  { id: 1, name: "Alimentação", icon: "🍔", color: "#F59E0B", budget: 800, spent: 420 },
  { id: 2, name: "Transporte", icon: "⛽", color: "#3B82F6", budget: 400, spent: 215 },
  { id: 3, name: "Compras", icon: "🛒", color: "#EC4899", budget: 600, spent: 380 },
  { id: 4, name: "Moradia", icon: "🏠", color: "#10B981", budget: 1800, spent: 1800 },
  { id: 5, name: "Contas", icon: "💡", color: "#8B5CF6", budget: 500, spent: 289 },
  { id: 6, name: "Entretenimento", icon: "🎮", color: "#EF4444", budget: 300, spent: 160 },
  { id: 7, name: "Saúde", icon: "🏥", color: "#06B6D4", budget: 400, spent: 178 },
  { id: 8, name: "Viagem", icon: "✈️", color: "#F97316", budget: 1000, spent: 0 },
  { id: 9, name: "Educação", icon: "📚", color: "#A855F7", budget: 500, spent: 299 },
  { id: 10, name: "Trabalho", icon: "💼", color: "#6B7280", budget: 200, spent: 89 },
];

const pieData = [
  { name: "Alimentação", value: 420, color: "#F59E0B" },
  { name: "Transporte", value: 215, color: "#3B82F6" },
  { name: "Compras", value: 380, color: "#EC4899" },
  { name: "Moradia", value: 1800, color: "#10B981" },
  { name: "Contas", value: 289, color: "#8B5CF6" },
  { name: "Outros", value: 627, color: "#6B7280" },
];

const barData = [
  { mes: "Jan", receitas: 5800, despesas: 3200 },
  { mes: "Fev", receitas: 6200, despesas: 3800 },
  { mes: "Mar", receitas: 5500, despesas: 4100 },
  { mes: "Abr", receitas: 7000, despesas: 3600 },
  { mes: "Mai", receitas: 6800, despesas: 3900 },
  { mes: "Jun", receitas: 7000, despesas: 3731 },
];

const weekData = [
  { dia: "Seg", valor: 145 },
  { dia: "Ter", valor: 320 },
  { dia: "Qua", valor: 89 },
  { dia: "Qui", valor: 560 },
  { dia: "Sex", valor: 234 },
  { dia: "Sáb", valor: 478 },
  { dia: "Dom", valor: 120 },
];

const allCategoryIcons = ["🍔","⛽","🛒","🏠","💡","🎮","🏥","✈️","📚","💼","💰","🎵","🐾","👕","📱","🏋️","🎨","🍕","☕","🎁"];
const categoryColors = ["#7C3AED","#10B981","#F59E0B","#EF4444","#3B82F6","#EC4899","#06B6D4","#F97316","#A855F7","#6B7280"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isDesktop;
};

// ─── Shared sub-components ────────────────────────────────────────────────────
function TransactionItem({ t, compact }: { t: Transaction; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? "py-2.5" : "py-3"}`}>
      <div className={`${compact ? "w-9 h-9" : "w-10 h-10"} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}
        style={{ background: "rgba(255,255,255,0.06)" }}>
        {t.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium text-sm truncate">{t.title}</div>
        <div className="text-muted-foreground text-xs">{t.date} · {t.category}</div>
      </div>
      <div className={`text-sm font-bold flex-shrink-0 ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
        {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
      </div>
    </div>
  );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", icon: Home, label: "Início" },
  { id: "categories", icon: Tag, label: "Categorias" },
  { id: "reports", icon: BarChart3, label: "Relatórios" },
  { id: "profile", icon: User, label: "Perfil" },
];

function Sidebar({ active, onNav, onNewTx }: { active: string; onNav: (s: Screen) => void; onNewTx: () => void }) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-full py-6 px-4"
      style={{ background: "#131316", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
          <Wallet size={18} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>WalletView</span>
      </div>

      {/* New Transaction */}
      <button onClick={onNewTx}
        className="flex items-center gap-2 w-full py-3 px-4 rounded-xl mb-6 font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-98"
        style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>
        <Plus size={16} />
        Nova Transação
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ id, icon: Icon, label }) => {
          const active_ = active === id;
          return (
            <button key={id} onClick={() => onNav(id as Screen)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active_ ? "rgba(124,58,237,0.15)" : "transparent",
                color: active_ ? "#A78BFA" : "#71717A",
                borderLeft: active_ ? "2px solid #7C3AED" : "2px solid transparent"
              }}>
              <Icon size={18} strokeWidth={active_ ? 2.5 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="flex items-center gap-3 px-2 pt-4 mt-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
          <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&auto=format" alt="David" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-xs font-semibold truncate">David Almeida</div>
          <div className="text-muted-foreground text-xs truncate">Premium</div>
        </div>
        <button className="text-muted-foreground hover:text-white transition-colors">
          <Settings size={15} />
        </button>
      </div>
    </aside>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────
function BottomNav({ active, onNav }: { active: string; onNav: (s: Screen) => void }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-around py-2 px-2"
      style={{ background: "#131316", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      {navItems.map(({ id, icon: Icon, label }) => {
        const isActive = active === id;
        return (
          <button key={id} onClick={() => onNav(id as Screen)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all"
            style={{ color: isActive ? "#8B5CF6" : "#71717A" }}>
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Page header (desktop) ────────────────────────────────────────────────────
function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-white text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl ${className}`}
      style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.06)" }}>
      {children}
    </div>
  );
}

// ─── Balance Card ─────────────────────────────────────────────────────────────
function BalanceCard({ showBalance, onToggle, isDesktop }: { showBalance: boolean; onToggle: () => void; isDesktop: boolean }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden p-6 ${isDesktop ? "mb-0" : "mb-5"}`}
      style={{
        background: "linear-gradient(135deg,#7C3AED 0%,#5B21B6 60%,#4C1D95 100%)",
        boxShadow: "0 20px 60px rgba(124,58,237,0.35)"
      }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle at 80% 20%,#fff 0%,transparent 50%),radial-gradient(circle at 20% 80%,#a78bfa 0%,transparent 50%)"
      }} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1">
          <span className="text-purple-200 text-sm font-medium">Saldo Total</span>
          <button onClick={onToggle} className="text-purple-200 hover:text-white transition-colors">
            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="text-3xl font-bold text-white mb-5" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {showBalance ? fmt(3268.81) : "R$ •••••"}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                <ArrowDownLeft size={10} className="text-emerald-400" />
              </div>
              <span className="text-purple-200 text-xs">Receitas</span>
            </div>
            <div className="text-white font-bold text-sm">{showBalance ? "R$ 7.000,00" : "•••"}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-full bg-red-400/20 flex items-center justify-center">
                <ArrowUpRight size={10} className="text-red-400" />
              </div>
              <span className="text-purple-200 text-xs">Despesas</span>
            </div>
            <div className="text-white font-bold text-sm">{showBalance ? "R$ 3.731,19" : "•••"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

// LOGIN
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("david@exemplo.com.br");
  const [password, setPassword] = useState("senha123");
  const [showPw, setShowPw] = useState(false);
  const isDesktop = useIsDesktop();

  return (
    <div className="h-full w-full flex" style={{ background: "#0F0F12" }}>
      {/* Left panel – only desktop */}
      {isDesktop && (
        <div className="hidden md:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
          style={{ background: "linear-gradient(160deg,#1a0533 0%,#0F0F12 100%)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-25"
              style={{ background: "radial-gradient(circle,#7C3AED,transparent)" }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15"
              style={{ background: "radial-gradient(circle,#8B5CF6,transparent)" }} />
            {Array.from({ length: 6 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => (
                <div key={`${r}-${c}`} className="absolute w-1 h-1 rounded-full opacity-20"
                  style={{ background: "#8B5CF6", top: `${r * 16 + 5}%`, left: `${c * 28 + 5}%` }} />
              ))
            )}
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)" }}>
              <Wallet size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>WalletView</span>
          </div>
          <div className="relative z-10">
            <div className="text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Suas finanças,<br />
              <span style={{ color: "#A78BFA" }}>sob controle.</span>
            </div>
            <p className="text-purple-200 text-lg leading-relaxed">
              Registre gastos, visualize tendências e tome decisões financeiras mais inteligentes.
            </p>
          </div>
          <div className="relative z-10 flex gap-6">
            {[["248", "Transações"], ["10", "Categorias"], ["8", "Meses"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-white font-bold text-2xl">{n}</div>
                <div className="text-purple-300 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right panel – form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 relative overflow-hidden">
        {!isDesktop && (
          <>
            <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle,#7C3AED,transparent)" }} />
            <div className="absolute -bottom-40 -left-20 w-72 h-72 rounded-full opacity-15 pointer-events-none"
              style={{ background: "radial-gradient(circle,#8B5CF6,transparent)" }} />
          </>
        )}
        <div className="w-full max-w-sm relative z-10">
          {!isDesktop && (
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}>
                <Wallet size={22} className="text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>WalletView</div>
                <div className="text-muted-foreground text-xs">Finanças pessoais</div>
              </div>
            </div>
          )}
          <h2 className="text-white text-3xl font-bold mb-1">Bem-vindo de volta 👋</h2>
          <p className="text-muted-foreground text-sm mb-8">Entre na sua conta para continuar</p>

          <div className="space-y-4">
            <div>
              <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">E-mail</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-4 text-white text-sm outline-none border focus:border-purple-500 transition-colors"
                style={{ background: "#18181B", borderColor: "rgba(255,255,255,0.08)" }} />
            </div>
            <div>
              <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Senha</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl px-4 py-4 text-white text-sm outline-none border focus:border-purple-500 transition-colors pr-12"
                  style={{ background: "#18181B", borderColor: "rgba(255,255,255,0.08)" }} />
                <button onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button className="text-purple-400 text-sm font-medium w-full text-right">Esqueceu a senha?</button>
            <button onClick={onLogin}
              className="w-full py-4 rounded-xl text-white font-bold text-base transition-all hover:opacity-90 active:scale-98"
              style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}>
              Entrar
            </button>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-muted-foreground text-xs">ou</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>
            <button className="w-full py-4 rounded-xl text-purple-400 font-bold text-sm border transition-all"
              style={{ borderColor: "rgba(124,58,237,0.4)", background: "rgba(124,58,237,0.08)" }}>
              Criar nova conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// DASHBOARD
function DashboardScreen({ onNav, onNewTx, transactions }: {
  onNav: (s: Screen) => void; onNewTx: () => void; transactions: Transaction[];
}) {
  const [showBalance, setShowBalance] = useState(true);
  const isDesktop = useIsDesktop();

  const categoryCards = [
    { name: "Alimentação", icon: "🍔", spent: 420, budget: 800, color: "#F59E0B" },
    { name: "Transporte", icon: "⛽", spent: 215, budget: 400, color: "#3B82F6" },
    { name: "Compras", icon: "🛒", spent: 380, budget: 600, color: "#EC4899" },
    { name: "Contas", icon: "💡", spent: 289, budget: 500, color: "#8B5CF6" },
    { name: "Entretenimento", icon: "🎮", spent: 160, budget: 300, color: "#EF4444" },
    { name: "Saúde", icon: "🏥", spent: 178, budget: 400, color: "#06B6D4" },
  ];

  const content = isDesktop ? (
    <div className="flex-1 overflow-y-auto p-8">
      <PageHeader
        title="Bom dia, David 👋"
        subtitle="Aqui está o resumo das suas finanças de junho"
        action={
          <button onClick={onNewTx}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", boxShadow: "0 6px 20px rgba(124,58,237,0.35)" }}>
            <Plus size={16} /> Nova Transação
          </button>
        }
      />

      {/* Top row */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-1">
          <BalanceCard showBalance={showBalance} onToggle={() => setShowBalance(!showBalance)} isDesktop={true} />
        </div>
        <div className="col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: "Receitas", value: "R$ 7.000,00", icon: ArrowDownLeft, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
            { label: "Despesas", value: "R$ 3.731,19", icon: ArrowUpRight, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
            { label: "Economia", value: "R$ 3.268,81", icon: TrendingUp, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="p-5 flex flex-col justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div className="text-muted-foreground text-xs mb-1">{label}</div>
                <div className="text-white font-bold text-lg">{showBalance ? value : "•••"}</div>
              </div>
            </Card>
          ))}
          {/* Mini bar chart */}
          <Card className="col-span-3 p-4">
            <div className="text-white font-semibold text-sm mb-3">Tendência semanal de gastos</div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={weekData} barCategoryGap="35%">
                <XAxis dataKey="dia" tick={{ fill: "#71717A", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "#27272A", border: "none", borderRadius: 10, color: "#fff", fontSize: 11 }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  formatter={(v: number) => [`R$ ${v}`, "Gastos"]}
                />
                <Bar dataKey="valor" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-5 gap-5">
        {/* Transactions */}
        <Card className="col-span-3">
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-white font-semibold">Transações Recentes</span>
            <button onClick={() => onNav("categories")} className="text-purple-400 text-sm font-medium">Ver todas</button>
          </div>
          <div className="divide-y px-5" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            {transactions.slice(0, 8).map(t => <TransactionItem key={t.id} t={t} compact />)}
          </div>
        </Card>

        {/* Categories */}
        <Card className="col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold">Categorias</span>
            <button onClick={() => onNav("categories")} className="text-purple-400 text-sm">Ver todas</button>
          </div>
          <div className="space-y-3">
            {categoryCards.map(cat => {
              const pct = Math.min((cat.spent / cat.budget) * 100, 100);
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-white text-xs font-medium">{cat.name}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">R$ {cat.spent}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 90 ? "#EF4444" : cat.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  ) : (
    /* MOBILE */
    <div className="flex-1 overflow-y-auto px-4 pt-10 pb-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-muted-foreground text-sm">Bom dia,</p>
          <h1 className="text-white text-2xl font-bold">David 👋</h1>
        </div>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center relative"
          style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Bell size={18} className="text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500" />
        </button>
      </div>
      <BalanceCard showBalance={showBalance} onToggle={() => setShowBalance(!showBalance)} isDesktop={false} />

      <div className="rounded-2xl p-4 mb-5 flex items-center gap-3"
        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
          <TrendingUp size={16} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="text-emerald-400 font-semibold text-sm">Economia do mês</div>
          <div className="text-white font-bold">R$ 3.268,81 <span className="text-emerald-400 text-xs font-normal">+12%</span></div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-base">Categorias</h2>
          <button onClick={() => onNav("categories")} className="text-purple-400 text-sm font-medium">Ver todas</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categoryCards.map(cat => (
            <button key={cat.name}
              className="rounded-2xl p-3 flex flex-col items-center gap-2 transition-all active:scale-95"
              style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${cat.color}20` }}>{cat.icon}</div>
              <div className="text-center">
                <div className="text-white text-xs font-medium leading-tight">{cat.name}</div>
                <div className="text-muted-foreground text-xs">R$ {cat.spent}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-base">Transações Recentes</h2>
          <button className="text-purple-400 text-sm font-medium">Ver todas</button>
        </div>
        <Card className="divide-y px-4" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {transactions.slice(0, 6).map(t => <TransactionItem key={t.id} t={t} />)}
        </Card>
      </div>
    </div>
  );

  return content;
}

// NEW TRANSACTION
function NewTransactionScreen({ onBack, onSave, isModal }: {
  onBack: () => void; onSave: (t: Transaction) => void; isModal?: boolean;
}) {
  const [type, setType] = useState<TransactionType>("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Alimentação");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [payment, setPayment] = useState("Pix");
  const [notes, setNotes] = useState("");

  const categories = ["Alimentação","Transporte","Compras","Moradia","Contas","Entretenimento","Saúde","Viagem","Educação","Trabalho"];
  const payments = ["Pix","Cartão de Débito","Cartão de Crédito","Dinheiro","Transferência"];
  const catIcon: Record<string, string> = {
    Alimentação:"🍔",Transporte:"⛽",Compras:"🛒",Moradia:"🏠",
    Contas:"💡",Entretenimento:"🎮",Saúde:"🏥",Viagem:"✈️",Educação:"📚",Trabalho:"💼"
  };

  const handleSave = () => {
    if (!title || !amount) return;
    onSave({ id: Date.now(), title, category, date: "Hoje, agora", amount: parseFloat(amount.replace(",",".")), type, icon: catIcon[category] || "💰" });
    onBack();
  };

  const inner = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#27272A", border: "1px solid rgba(255,255,255,0.08)" }}>
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-xl">Nova Transação</h1>
      </div>

      <div className="flex rounded-2xl p-1 mb-5" style={{ background: "#27272A" }}>
        {(["expense","income"] as TransactionType[]).map(t => (
          <button key={t} onClick={() => setType(t)}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: type===t?(t==="expense"?"#EF4444":"#10B981"):"transparent", color: type===t?"#fff":"#71717A" }}>
            {t==="expense"?"💸 Despesa":"💰 Receita"}
          </button>
        ))}
      </div>

      <div className="text-center mb-6">
        <div className="text-muted-foreground text-xs mb-1">Valor</div>
        <div className="text-white text-5xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          R$ {amount || "0,00"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <div>
          <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Título</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm outline-none border focus:border-purple-500 transition-colors"
            style={{ background: "#27272A", borderColor: "rgba(255,255,255,0.08)" }} placeholder="Ex: Almoço no restaurante" />
        </div>
        <div>
          <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Valor (R$)</label>
          <input value={amount} onChange={e => setAmount(e.target.value)} type="number"
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm outline-none border focus:border-purple-500 transition-colors"
            style={{ background: "#27272A", borderColor: "rgba(255,255,255,0.08)" }} placeholder="0,00" />
        </div>
        <div>
          <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Categoria</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className="py-2.5 px-2 rounded-xl text-xs font-medium transition-all"
                style={{ background: category===c?"rgba(124,58,237,0.2)":"#27272A", border:`1px solid ${category===c?"#7C3AED":"rgba(255,255,255,0.08)"}`, color: category===c?"#A78BFA":"#71717A" }}>
                {catIcon[c]} {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Data</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 text-white text-sm outline-none border focus:border-purple-500 transition-colors"
              style={{ background: "#27272A", borderColor: "rgba(255,255,255,0.08)", colorScheme: "dark" }} />
          </div>
          <div>
            <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Pagamento</label>
            <select value={payment} onChange={e => setPayment(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 text-white text-sm outline-none border focus:border-purple-500 transition-colors"
              style={{ background: "#27272A", borderColor: "rgba(255,255,255,0.08)", colorScheme: "dark" }}>
              {payments.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Observações</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm outline-none border focus:border-purple-500 transition-colors resize-none"
            style={{ background: "#27272A", borderColor: "rgba(255,255,255,0.08)", fontFamily: "Inter,sans-serif" }}
            placeholder="Observação opcional..." />
        </div>
      </div>

      <button onClick={handleSave}
        className="w-full py-4 rounded-2xl text-white font-bold text-base mt-4 transition-all hover:opacity-90 active:scale-98"
        style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}>
        Salvar Transação
      </button>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
        <div className="w-full max-w-lg max-h-[90vh] rounded-3xl p-7 flex flex-col overflow-hidden"
          style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-10 pb-4" style={{ background: "#0F0F12" }}>
      {inner}
    </div>
  );
}

// CATEGORIES
function CategoriesScreen({ categories, onNav, onAdd, isDesktop }: {
  categories: Category[]; onNav: (s: Screen) => void; onAdd: () => void; isDesktop: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:p-8 pt-10 md:pt-0 pb-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Categorias</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{categories.length} categorias ativas</p>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}>
          <Plus size={15} /> Nova Categoria
        </button>
      </div>

      <div className={`grid gap-4 ${isDesktop ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {categories.map(cat => {
          const pct = Math.min((cat.spent / cat.budget) * 100, 100);
          return (
            <Card key={cat.id} className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${cat.color}20` }}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{cat.name}</div>
                  <div className="text-muted-foreground text-xs">{fmt(cat.spent)} / {fmt(cat.budget)}</div>
                </div>
                <div className="text-sm font-bold" style={{ color: pct>=90?"#EF4444":pct>=70?"#F59E0B":"#10B981" }}>
                  {Math.round(pct)}%
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: pct>=90?"#EF4444":cat.color }} />
              </div>
              {pct >= 90 && (
                <p className="text-red-400 text-xs mt-2 font-medium">⚠️ Orçamento quase esgotado</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ADD CATEGORY
function AddCategoryScreen({ onBack, onSave, isModal }: {
  onBack: () => void; onSave: (c: Category) => void; isModal?: boolean;
}) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("🍔");
  const [color, setColor] = useState("#7C3AED");
  const [budget, setBudget] = useState("");

  const handleSave = () => {
    if (!name) return;
    onSave({ id: Date.now(), name, icon, color, budget: parseFloat(budget||"0"), spent: 0 });
    onBack();
  };

  const inner = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-5">
        <button onClick={onBack}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#27272A", border: "1px solid rgba(255,255,255,0.08)" }}>
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white font-bold text-xl">Nova Categoria</h1>
      </div>

      {/* Preview */}
      <div className="rounded-2xl p-4 flex items-center gap-4 mb-5"
        style={{ background: "#27272A", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: `${color}20` }}>{icon}</div>
        <div>
          <div className="text-white font-bold text-lg">{name || "Nome da categoria"}</div>
          <div className="text-muted-foreground text-sm">Orçamento: {budget ? fmt(parseFloat(budget)) : "R$ 0,00"}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        <div>
          <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Nome</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm outline-none border focus:border-purple-500 transition-colors"
            style={{ background: "#27272A", borderColor: "rgba(255,255,255,0.08)" }} placeholder="Ex: Saúde e Bem-estar" />
        </div>
        <div>
          <label className="text-muted-foreground text-xs uppercase tracking-wider mb-2 block">Orçamento Mensal (R$)</label>
          <input value={budget} onChange={e => setBudget(e.target.value)} type="number"
            className="w-full rounded-xl px-4 py-3.5 text-white text-sm outline-none border focus:border-purple-500 transition-colors"
            style={{ background: "#27272A", borderColor: "rgba(255,255,255,0.08)" }} placeholder="500,00" />
        </div>
        <div>
          <label className="text-muted-foreground text-xs uppercase tracking-wider mb-3 block">Ícone</label>
          <div className="grid grid-cols-10 gap-2">
            {allCategoryIcons.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)}
                className="aspect-square rounded-xl flex items-center justify-center text-xl transition-all"
                style={{ background: icon===ic?"rgba(124,58,237,0.2)":"#27272A", border:`1px solid ${icon===ic?"#7C3AED":"rgba(255,255,255,0.06)"}` }}>
                {ic}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-muted-foreground text-xs uppercase tracking-wider mb-3 block">Cor</label>
          <div className="grid grid-cols-10 gap-2">
            {categoryColors.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className="aspect-square rounded-xl flex items-center justify-center transition-all"
                style={{ background: c, border:`3px solid ${color===c?"#fff":"transparent"}` }}>
                {color===c && <Check size={14} className="text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={handleSave}
        className="w-full py-4 rounded-2xl text-white font-bold text-base mt-4 transition-all hover:opacity-90"
        style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}>
        Salvar Categoria
      </button>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
        <div className="w-full max-w-lg max-h-[90vh] rounded-3xl p-7 flex flex-col overflow-hidden"
          style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col px-4 pt-10 pb-4" style={{ background: "#0F0F12" }}>
      {inner}
    </div>
  );
}

// REPORTS
function ReportsScreen({ onNav, isDesktop }: { onNav: (s: Screen) => void; isDesktop: boolean }) {
  const [period, setPeriod] = useState<"week"|"month"|"year">("month");
  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:p-8 pt-10 md:pt-0 pb-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Análise de junho 2025</p>
        </div>
        <div className="flex rounded-xl overflow-hidden" style={{ background: "#18181B" }}>
          {(["week","month","year"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-4 py-2 text-xs font-semibold transition-all"
              style={{ background: period===p?"#7C3AED":"transparent", color: period===p?"#fff":"#71717A" }}>
              {p==="week"?"Semana":p==="month"?"Mês":"Ano"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className={`grid gap-4 mb-6 ${isDesktop ? "grid-cols-4" : "grid-cols-2"}`}>
        {[
          { label: "Receitas", value: "R$ 7.000", icon: TrendingUp, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
          { label: "Despesas", value: "R$ 3.731", icon: TrendingDown, color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
          { label: "Maior categoria", value: "Moradia", icon: TrendingUp, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
          { label: "Economizado", value: "R$ 3.269", icon: Wallet, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="p-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div className="text-muted-foreground text-xs mb-1">{label}</div>
            <div className="text-white font-bold">{value}</div>
          </Card>
        ))}
      </div>

      <div className={`grid gap-5 ${isDesktop ? "grid-cols-2" : "grid-cols-1"}`}>
        {/* Pie */}
        <Card className="p-5">
          <h3 className="text-white font-semibold mb-4">Gastos por Categoria</h3>
          <div className={`flex ${isDesktop ? "flex-col" : "items-center gap-4"}`}>
            <ResponsiveContainer width="100%" height={isDesktop ? 200 : 160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={isDesktop?55:45} outerRadius={isDesktop?85:70}
                  dataKey="value" strokeWidth={2} stroke="#18181B">
                  {pieData.map((_, i) => <Cell key={i} fill={pieData[i].color} />)}
                </Pie>
                <Tooltip contentStyle={{ background:"#27272A",border:"none",borderRadius:10,color:"#fff",fontSize:12 }}
                  formatter={(v: number, name) => [`R$ ${v.toLocaleString("pt-BR")}`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className={`${isDesktop ? "grid grid-cols-2 gap-2 mt-2" : "flex-1 space-y-2"}`}>
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-medium truncate">{d.name}</div>
                    <div className="text-muted-foreground text-xs">{Math.round((d.value/total)*100)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Bar */}
        <Card className="p-5">
          <h3 className="text-white font-semibold mb-4">Receitas vs Despesas</h3>
          <ResponsiveContainer width="100%" height={isDesktop ? 200 : 180}>
            <BarChart data={barData} barCategoryGap="30%">
              <XAxis dataKey="mes" tick={{ fill:"#71717A",fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background:"#27272A",border:"none",borderRadius:12,color:"#fff",fontSize:12 }}
                cursor={{ fill:"rgba(255,255,255,0.04)" }}
                formatter={(v: number) => [`R$ ${v.toLocaleString("pt-BR")}`,""]} />
              <Bar dataKey="receitas" fill="#10B981" radius={[5,5,0,0]} name="Receitas" />
              <Bar dataKey="despesas" fill="#7C3AED" radius={[5,5,0,0]} name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="text-xs text-muted-foreground">Receitas</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-600" /><span className="text-xs text-muted-foreground">Despesas</span></div>
          </div>
        </Card>

        {/* Line */}
        <Card className={`p-5 ${isDesktop ? "col-span-2" : ""}`}>
          <h3 className="text-white font-semibold mb-4">Tendência de Gastos — Semana Atual</h3>
          <ResponsiveContainer width="100%" height={isDesktop ? 160 : 140}>
            <LineChart data={weekData}>
              <XAxis dataKey="dia" tick={{ fill:"#71717A",fontSize:11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <Tooltip contentStyle={{ background:"#27272A",border:"none",borderRadius:12,color:"#fff",fontSize:12 }}
                formatter={(v: number) => [`R$ ${v}`,"Gastos"]} />
              <Line type="monotone" dataKey="valor" stroke="#8B5CF6" strokeWidth={2.5}
                dot={{ fill:"#8B5CF6",r:4,strokeWidth:0 }} activeDot={{ r:6,fill:"#7C3AED" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// PROFILE
function ProfileScreen({ onLogout, onNav }: { onLogout: () => void; onNav: (s: Screen) => void }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const isDesktop = useIsDesktop();

  return (
    <div className="flex-1 overflow-y-auto px-4 md:p-8 pt-10 md:pt-0 pb-4">
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">Perfil</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Gerencie sua conta e preferências</p>
      </div>

      <div className={`grid gap-6 ${isDesktop ? "grid-cols-3" : "grid-cols-1"}`}>
        {/* Left col */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format" alt="David" className="w-full h-full object-cover" />
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Camera size={10} className="text-white" />
                </button>
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-lg">David Almeida</div>
                <div className="text-muted-foreground text-sm">david@exemplo.com.br</div>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)" }}>
                  <span className="text-purple-400 text-xs font-medium">✦ Premium</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            {[["248","Transações"],["10","Categorias"],["8","Meses"]].map(([n, l]) => (
              <Card key={l} className="p-3 text-center">
                <div className="text-white font-bold text-xl">{n}</div>
                <div className="text-muted-foreground text-xs">{l}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right col (settings) */}
        <div className={`space-y-4 ${isDesktop ? "col-span-2" : ""}`}>
          <Card>
            {[
              { icon: Bell, label: "Notificações", desc: "Alertas de gastos e lembretes", toggle: true, state: notifications, onToggle: () => setNotifications(!notifications) },
              { icon: Moon, label: "Modo Escuro", desc: "Interface escura", toggle: true, state: darkMode, onToggle: () => setDarkMode(!darkMode) },
              { icon: Shield, label: "Segurança e Privacidade", desc: "Senha, biometria e 2FA", toggle: false },
              { icon: Download, label: "Exportar Dados", desc: "CSV, PDF ou Excel", toggle: false },
              { icon: Settings, label: "Configurações", desc: "Moeda, idioma e preferências", toggle: false },
            ].map(({ icon: Icon, label, desc, toggle, state, onToggle }, i, arr) => (
              <button key={label} onClick={onToggle}
                className="w-full flex items-center gap-3 px-4 py-4 transition-colors hover:bg-white/4 text-left"
                style={{ borderBottom: i < arr.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.15)" }}>
                  <Icon size={17} className="text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm font-medium">{label}</div>
                  <div className="text-muted-foreground text-xs">{desc}</div>
                </div>
                {toggle ? (
                  <div className="w-11 h-6 rounded-full relative transition-colors flex-shrink-0"
                    style={{ background: state ? "#7C3AED" : "#3F3F46" }}>
                    <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
                      style={{ left: state ? "calc(100% - 1.375rem)" : "0.125rem", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                  </div>
                ) : <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />}
              </button>
            ))}
          </Card>

          <button onClick={onLogout}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <LogOut size={16} className="text-red-400" />
            <span className="text-red-400 font-semibold text-sm">Sair da conta</span>
          </button>
          <p className="text-center text-muted-foreground text-xs">WalletView v2.4.1 · Feito com 💜 no Brasil</p>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [showModal, setShowModal] = useState<"newTransaction" | "addCategory" | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const isDesktop = useIsDesktop();

  const nav = (s: Screen) => setScreen(s);

  const handleSaveTx = (t: Transaction) => setTransactions(prev => [t, ...prev]);
  const handleSaveCat = (c: Category) => setCategories(prev => [...prev, c]);

  const handleNewTx = () => {
    if (isDesktop) setShowModal("newTransaction");
    else setScreen("newTransaction");
  };
  const handleAddCat = () => {
    if (isDesktop) setShowModal("addCategory");
    else setScreen("addCategory");
  };

  if (screen === "login") {
    return (
      <div className="size-full" style={{ background: "#0F0F12" }}>
        <LoginScreen onLogin={() => setScreen("dashboard")} />
      </div>
    );
  }

  // Mobile-only full-screen overrides
  if (!isDesktop) {
    if (screen === "newTransaction") return (
      <div className="size-full flex flex-col" style={{ background: "#0F0F12" }}>
        <NewTransactionScreen onBack={() => setScreen("dashboard")} onSave={handleSaveTx} />
      </div>
    );
    if (screen === "addCategory") return (
      <div className="size-full flex flex-col" style={{ background: "#0F0F12" }}>
        <AddCategoryScreen onBack={() => setScreen("categories")} onSave={handleSaveCat} />
      </div>
    );
  }

  const activeScreen = (screen === "newTransaction" || screen === "addCategory") ? "dashboard" : screen;

  return (
    <div className="size-full flex" style={{ background: "#0F0F12" }}>
      {/* Desktop sidebar */}
      {isDesktop && (
        <Sidebar active={activeScreen} onNav={nav} onNewTx={handleNewTx} />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop top bar */}
        {isDesktop && (
          <header className="flex-shrink-0 flex items-center justify-between px-8 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#0F0F12" }}>
            <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 w-72"
              style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Search size={15} className="text-muted-foreground flex-shrink-0" />
              <input className="bg-transparent text-white text-sm outline-none flex-1" placeholder="Buscar transações..." />
            </div>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-xl flex items-center justify-center relative"
                style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Bell size={16} className="text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-7 h-7 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=56&h=56&fit=crop&auto=format" alt="David" className="w-full h-full object-cover" />
                </div>
                <span className="text-white text-sm font-medium">David</span>
              </div>
            </div>
          </header>
        )}

        {/* Screen content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeScreen === "dashboard" && (
            <DashboardScreen onNav={nav} onNewTx={handleNewTx} transactions={transactions} />
          )}
          {activeScreen === "categories" && (
            <CategoriesScreen categories={categories} onNav={nav} onAdd={handleAddCat} isDesktop={isDesktop} />
          )}
          {activeScreen === "reports" && <ReportsScreen onNav={nav} isDesktop={isDesktop} />}
          {activeScreen === "profile" && <ProfileScreen onLogout={() => setScreen("login")} onNav={nav} />}
        </div>

        {/* Mobile bottom nav + FAB */}
        {!isDesktop && (
          <>
            <BottomNav active={activeScreen} onNav={nav} />
            <button onClick={handleNewTx}
              className="fixed bottom-20 right-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg z-40 transition-transform active:scale-95"
              style={{ background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", boxShadow: "0 8px 24px rgba(124,58,237,0.5)" }}>
              <Plus size={24} className="text-white" />
            </button>
          </>
        )}
      </div>

      {/* Desktop modals */}
      {isDesktop && showModal === "newTransaction" && (
        <NewTransactionScreen onBack={() => setShowModal(null)} onSave={handleSaveTx} isModal />
      )}
      {isDesktop && showModal === "addCategory" && (
        <AddCategoryScreen onBack={() => setShowModal(null)} onSave={handleSaveCat} isModal />
      )}
    </div>
  );
}
