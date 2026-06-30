import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// ─── Category config ────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "Food",          emoji: "🍔", color: "#f97316" },
  { value: "Transport",     emoji: "🚗", color: "#3b82f6" },
  { value: "Shopping",      emoji: "🛍️", color: "#a855f7" },
  { value: "Education",     emoji: "📚", color: "#06b6d4" },
  { value: "Entertainment", emoji: "🎬", color: "#ec4899" },
  { value: "Health",        emoji: "💊", color: "#10b981" },
  { value: "Other",         emoji: "📦", color: "#6b7280" },
];

const getCategoryMeta = (val) =>
  CATEGORIES.find((c) => c.value === val) || CATEGORIES[6];

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={styles.toastContainer}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.toast,
            background:
              t.type === "success"
                ? "linear-gradient(135deg,#0d9460,#059669)"
                : t.type === "error"
                ? "linear-gradient(135deg,#dc2626,#b91c1c)"
                : "linear-gradient(135deg,#2563eb,#1d4ed8)",
          }}
        >
          <span style={{ fontSize: 16 }}>
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return onLogin(null, "Please fill in all fields.");
    setLoading(true);
    try {
      const res = await axios.post("/login", { email, password });
      onLogin(res.data, null);
    } catch (err) {
      onLogin(null, err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div style={styles.loginBg}>
      {/* Ambient orbs */}
      <div style={{ ...styles.orb, top: "10%",  left: "15%",  width: 300, height: 300, background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)" }} />
      <div style={{ ...styles.orb, bottom: "10%", right: "10%", width: 400, height: 400, background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />

      <div style={styles.loginCard}>
        {/* Logo */}
        <div style={styles.loginLogo}>
          <div style={styles.logoIcon}>💸</div>
          <div>
            <div style={styles.logoTitle}>SmartSpend</div>
            <div style={styles.logoSub}>AI-Powered Finance</div>
          </div>
        </div>

        <h2 style={styles.loginHeading}>Welcome back</h2>
        <p style={styles.loginSubheading}>Sign in to your account to continue</p>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKey}
            onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
            onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
          />
        </div>

        <button
          style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={loading}
          onMouseEnter={(e) => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
        >
          {loading ? (
            <span style={styles.btnInner}><Spinner /> Logging in…</span>
          ) : (
            "Sign In →"
          )}
        </button>

        <p style={styles.loginFootnote}>
          Demo: use your registered Supabase credentials
        </p>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, showToast, onLogout }) {
  const [expenses,  setExpenses]  = useState([]);
  const [title,     setTitle]     = useState("");
  const [amount,    setAmount]    = useState("");
  const [category,  setCategory]  = useState("Food");
  const [addLoading,  setAddLoading]  = useState(false);
  const [aiLoading,   setAiLoading]   = useState(false);
  const [aiResult,    setAiResult]    = useState("");
  const [activeTab,   setActiveTab]   = useState("add"); // "add" | "history" | "ai"

  const fetchExpenses = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`/expenses/${user.id}`);
      setExpenses(res.data);
    } catch {
      showToast("Could not load expenses.", "error");
    }
  }, [showToast, user]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);

  const handleAdd = async () => {
    if (!title.trim() || !amount) return showToast("Fill in all expense fields.", "error");
    setAddLoading(true);
    try {
      await axios.post("/add-expense", { title, amount: Number(amount), category, user_id: user.id });
      setTitle(""); setAmount(""); setCategory("Food");
      showToast("Expense added!", "success");
      fetchExpenses();
    } catch {
      showToast("Failed to add expense.", "error");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/delete-expense/${id}`);
      showToast("Expense removed.", "info");
      fetchExpenses();
    } catch {
      showToast("Could not delete expense.", "error");
    }
  };

  const handleAnalyze = async () => {
    if (!expenses.length) return showToast("Add some expenses first!", "error");
    setAiLoading(true); setAiResult("");
    try {
      const res = await axios.get(`/analyze/${user.id}`);
      setAiResult(res.data.analysis || res.data);
      showToast("Analysis complete!", "success");
    } catch {
      showToast("AI analysis failed.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={styles.dashBg}>
      {/* Ambient */}
      <div style={{ ...styles.orb, top: "-5%",  left: "-5%",  width: 500, height: 500, background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)" }} />
      <div style={{ ...styles.orb, bottom: "-5%", right: "-5%", width: 600, height: 600, background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

      {/* Top Nav */}
      <nav style={styles.nav}>
        <div style={styles.navBrand}>
          <span style={{ fontSize: 22 }}>💸</span>
          <span style={styles.navTitle}>SmartSpend <span style={styles.navAi}>AI</span></span>
        </div>
        <div style={styles.navRight}>
          <div style={styles.navUser}>
            <div style={styles.avatar}>{(user?.email?.[0] || "U").toUpperCase()}</div>
            <span style={styles.navEmail}>{user?.email || "User"}</span>
          </div>
          <button
            style={styles.btnLogout}
            onClick={onLogout}
            onMouseEnter={(e) => (e.target.style.background = "rgba(239,68,68,0.15)")}
            onMouseLeave={(e) => (e.target.style.background = "rgba(255,255,255,0.05)")}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Summary Card */}
      <div style={styles.summaryRow}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Spent</div>
          <div style={styles.summaryAmount}>₹{totalSpent.toFixed(2)}</div>
          <div style={styles.summaryMeta}>{expenses.length} transaction{expenses.length !== 1 ? "s" : ""}</div>
        </div>

        {/* Category breakdown pills */}
        <div style={styles.categoryPills}>
          {CATEGORIES.slice(0, 6).map((cat) => {
            const count = expenses.filter((e) => e.category === cat.value).length;
            const total = expenses.filter((e) => e.category === cat.value).reduce((s, e) => s + Number(e.amount), 0);
            if (!count) return null;
            return (
              <div key={cat.value} style={{ ...styles.pill, borderColor: cat.color + "44" }}>
                <span>{cat.emoji}</span>
                <span style={{ color: "#e2e8f0", fontSize: 12 }}>{cat.value}</span>
                <span style={{ color: cat.color, fontWeight: 600, fontSize: 13 }}>₹{total.toFixed(0)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab Bar */}
      <div style={styles.tabBar}>
        {[
          { id: "add",     label: "➕  Add Expense" },
          { id: "history", label: `📋  History (${expenses.length})` },
          { id: "ai",      label: "🤖  AI Analysis" },
        ].map((tab) => (
          <button
            key={tab.id}
            style={{ ...styles.tabBtn, ...(activeTab === tab.id ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>

        {/* ── Add Expense ── */}
        {activeTab === "add" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>New Expense</h3>
            <p style={styles.cardSub}>Record what you spent today</p>

            <div style={styles.addGrid}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Expense Title</label>
                <input
                  style={styles.input}
                  placeholder="e.g. Lunch at Domino's"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Amount (₹)</label>
                <input
                  style={styles.input}
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Category</label>
                <select
                  style={{ ...styles.input, cursor: "pointer" }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.emoji}  {c.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              style={{ ...styles.btnPrimary, opacity: addLoading ? 0.7 : 1, marginTop: 8 }}
              onClick={handleAdd}
              disabled={addLoading}
              onMouseEnter={(e) => { if (!addLoading) e.target.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
            >
              {addLoading ? <span style={styles.btnInner}><Spinner /> Adding…</span> : "Add Expense →"}
            </button>
          </div>
        )}

        {/* ── History ── */}
        {activeTab === "history" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Expense History</h3>
            <p style={styles.cardSub}>All your recorded transactions</p>

            {expenses.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: 48 }}>🧾</div>
                <div style={{ color: "#94a3b8", marginTop: 12 }}>No expenses yet — add your first one!</div>
              </div>
            ) : (
              <div style={styles.expenseList}>
                {[...expenses].reverse().map((exp) => {
                  const meta = getCategoryMeta(exp.category);
                  return (
                    <div key={exp.id} style={styles.expenseRow}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    >
                      <div style={{ ...styles.expEmoji, background: meta.color + "22", borderColor: meta.color + "44" }}>
                        {meta.emoji}
                      </div>
                      <div style={styles.expInfo}>
                        <div style={styles.expTitle}>{exp.title}</div>
                        <div style={{ ...styles.expCat, color: meta.color }}>{exp.category}</div>
                      </div>
                      <div style={styles.expAmount}>₹{Number(exp.amount).toFixed(2)}</div>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(exp.id)}
                        onMouseEnter={(e) => { e.target.style.background = "rgba(239,68,68,0.2)"; e.target.style.color = "#f87171"; }}
                        onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#64748b"; }}
                      >
                        🗑
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── AI Analysis ── */}
        {activeTab === "ai" && (
          <div style={styles.card}>
            <div style={styles.aiHeader}>
              <div>
                <h3 style={styles.cardTitle}>AI Spending Analysis</h3>
                <p style={styles.cardSub}>Gemini-powered insights on your spending habits</p>
              </div>
              <div style={styles.aiBadge}>✨ Gemini AI</div>
            </div>

            <button
              style={{ ...styles.btnAi, opacity: aiLoading ? 0.7 : 1 }}
              onClick={handleAnalyze}
              disabled={aiLoading}
              onMouseEnter={(e) => { if (!aiLoading) e.target.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}
            >
              {aiLoading
                ? <span style={styles.btnInner}><Spinner /> Analyzing your data…</span>
                : "🤖 Analyze My Spending"}
            </button>

            {aiLoading && (
              <div style={styles.aiSkeleton}>
                {[100, 75, 88, 60].map((w, i) => (
                  <div key={i} style={{ ...styles.skeletonLine, width: `${w}%`, animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}

            {aiResult && !aiLoading && (
              <div style={styles.aiResult}>
                <div style={styles.aiResultHeader}>
                  <span style={{ fontSize: 20 }}>🤖</span>
                  <span style={{ color: "#a78bfa", fontWeight: 600, fontSize: 14 }}>Gemini's Analysis</span>
                </div>
                <div style={styles.aiResultText}>
                  {String(aiResult).split("\n").map((line, i) => (
                    <p key={i} style={{ margin: "6px 0", color: line.startsWith("*") || line.startsWith("-") ? "#c4b5fd" : "#cbd5e1" }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {!aiResult && !aiLoading && (
              <div style={styles.emptyState}>
                <div style={{ fontSize: 48 }}>🔮</div>
                <div style={{ color: "#94a3b8", marginTop: 12 }}>Click Analyze to get AI insights on your spending patterns</div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{keyframes}</style>
    </div>
  );
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
function Spinner() {
  return <span style={styles.spinner} />;
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
  const [user,   setUser]   = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const handleLogin = (userData, error) => {
    if (error) { showToast(error, "error"); return; }
    setUser(userData.user);
    showToast("Welcome back! 👋", "success");
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <Toast toasts={toasts} />
      {!user
        ? <LoginPage  onLogin={handleLogin} />
        : <Dashboard  user={user} showToast={showToast} onLogout={handleLogout} />
      }
    </>
  );
}

// ─── Keyframe CSS ─────────────────────────────────────────────────────────────
const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Inter', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(40px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  select option { background: #1e1b4b; color: #e2e8f0; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 4px; }

  input::placeholder { color: #475569; }
  input:focus, select:focus { outline: none; }
`;

// ─── Style Objects ────────────────────────────────────────────────────────────
const styles = {
  // Toast
  toastContainer: {
    position: "fixed", top: 20, right: 20, zIndex: 9999,
    display: "flex", flexDirection: "column", gap: 10,
    animation: "slideIn 0.3s ease",
  },
  toast: {
    padding: "12px 18px", borderRadius: 12, color: "#fff",
    fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500,
    display: "flex", alignItems: "center", gap: 10,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    animation: "slideIn 0.3s ease",
    minWidth: 240,
  },

  // Shared
  orb: { position: "absolute", borderRadius: "50%", pointerEvents: "none", zIndex: 0 },

  // Login
  loginBg: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #0a0a1a 0%, #0f0a2e 50%, #0a0a1a 100%)",
    position: "relative", overflow: "hidden", fontFamily: "Inter, sans-serif",
  },
  loginCard: {
    position: "relative", zIndex: 1, width: "100%", maxWidth: 420, padding: "44px 40px",
    background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)",
    borderRadius: 24, border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
    animation: "fadeUp 0.5s ease",
  },
  loginLogo: { display: "flex", alignItems: "center", gap: 14, marginBottom: 36 },
  logoIcon:  { fontSize: 40, lineHeight: 1 },
  logoTitle: { fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.5px" },
  logoSub:   { fontSize: 12, color: "#6366f1", fontWeight: 500, letterSpacing: "0.5px" },
  loginHeading:    { fontSize: 26, fontWeight: 700, color: "#f8fafc", margin: "0 0 6px", letterSpacing: "-0.5px" },
  loginSubheading: { fontSize: 14, color: "#64748b", margin: "0 0 28px" },
  loginFootnote:   { fontSize: 12, color: "#334155", textAlign: "center", marginTop: 20 },

  // Dashboard
  dashBg: {
    minHeight: "100vh", background: "linear-gradient(135deg, #030712 0%, #0d0a2e 50%, #030712 100%)",
    fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden",
  },
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: 64,
    background: "rgba(3,7,18,0.8)", backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  navBrand: { display: "flex", alignItems: "center", gap: 10 },
  navTitle: { fontSize: 18, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" },
  navAi:    { color: "#6366f1" },
  navRight: { display: "flex", alignItems: "center", gap: 16 },
  navUser:  { display: "flex", alignItems: "center", gap: 10 },
  avatar:   {
    width: 32, height: 32, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, color: "#fff",
  },
  navEmail: { fontSize: 13, color: "#94a3b8" },

  // Summary
  summaryRow: {
    position: "relative", zIndex: 1,
    display: "flex", gap: 16, padding: "28px 32px 0",
    flexWrap: "wrap", alignItems: "flex-start",
  },
  summaryCard: {
    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 20, padding: "24px 32px",
    backdropFilter: "blur(16px)",
    animation: "fadeUp 0.4s ease",
    minWidth: 200,
  },
  summaryLabel:  { fontSize: 12, color: "#818cf8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" },
  summaryAmount: { fontSize: 40, fontWeight: 800, color: "#f8fafc", letterSpacing: "-1.5px", margin: "6px 0 4px" },
  summaryMeta:   { fontSize: 13, color: "#64748b" },
  categoryPills: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", flex: 1 },
  pill: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 14px", borderRadius: 20, fontSize: 13,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid", backdropFilter: "blur(8px)",
    animation: "fadeUp 0.4s ease",
  },

  // Tabs
  tabBar: {
    position: "relative", zIndex: 1,
    display: "flex", gap: 4, padding: "20px 32px 0",
  },
  tabBtn: {
    padding: "10px 20px", borderRadius: 12, border: "1px solid transparent",
    background: "transparent", color: "#64748b", fontSize: 14, fontWeight: 500,
    cursor: "pointer", transition: "all 0.2s", fontFamily: "Inter, sans-serif",
  },
  tabBtnActive: {
    background: "rgba(99,102,241,0.15)", color: "#a5b4fc",
    borderColor: "rgba(99,102,241,0.3)",
  },
  tabContent: {
    position: "relative", zIndex: 1,
    padding: "16px 32px 40px", maxWidth: 820, margin: "0 auto",
  },

  // Card
  card: {
    background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24,
    padding: 32, animation: "fadeUp 0.35s ease",
  },
  cardTitle: { fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: "0 0 4px", letterSpacing: "-0.3px" },
  cardSub:   { fontSize: 14, color: "#64748b", margin: "0 0 28px" },

  // Form
  addGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: {
    padding: "12px 16px", borderRadius: 12, fontSize: 14, color: "#f1f5f9",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
    transition: "border-color 0.2s", fontFamily: "Inter, sans-serif",
    width: "100%",
  },

  // Buttons
  btnPrimary: {
    width: "100%", padding: "14px 24px", borderRadius: 14,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontSize: 15, fontWeight: 600, border: "none",
    cursor: "pointer", transition: "all 0.2s",
    fontFamily: "Inter, sans-serif", letterSpacing: "0.2px",
    boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
  },
  btnAi: {
    padding: "14px 28px", borderRadius: 14,
    background: "linear-gradient(135deg, #7c3aed, #6366f1)",
    color: "#fff", fontSize: 15, fontWeight: 600, border: "none",
    cursor: "pointer", transition: "all 0.2s",
    fontFamily: "Inter, sans-serif",
    boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
    display: "block", marginBottom: 24,
  },
  btnLogout: {
    padding: "8px 16px", borderRadius: 10,
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#94a3b8", fontSize: 13, fontWeight: 500,
    cursor: "pointer", transition: "all 0.2s",
    fontFamily: "Inter, sans-serif",
  },
  btnInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },

  // Expense list
  expenseList: { display: "flex", flexDirection: "column", gap: 2 },
  expenseRow: {
    display: "flex", alignItems: "center", gap: 16, padding: "14px 16px",
    borderRadius: 14, transition: "background 0.2s", cursor: "default",
    background: "rgba(255,255,255,0.03)",
  },
  expEmoji: {
    width: 44, height: 44, borderRadius: 12, display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 20,
    border: "1px solid", flexShrink: 0,
  },
  expInfo:  { flex: 1, minWidth: 0 },
  expTitle: { fontSize: 14, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  expCat:   { fontSize: 12, fontWeight: 500, marginTop: 2 },
  expAmount: { fontSize: 16, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.3px", flexShrink: 0 },
  deleteBtn: {
    background: "transparent", border: "none", fontSize: 16,
    cursor: "pointer", padding: "6px 8px", borderRadius: 8,
    color: "#64748b", transition: "all 0.2s",
  },

  // AI
  aiHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  aiBadge: {
    padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)",
    color: "#c4b5fd", flexShrink: 0,
  },
  aiResult: {
    background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 16, padding: 24, marginTop: 8,
    animation: "fadeUp 0.4s ease",
  },
  aiResultHeader: {
    display: "flex", alignItems: "center", gap: 10,
    marginBottom: 16, paddingBottom: 12,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  aiResultText: { fontSize: 14, lineHeight: 1.8 },
  aiSkeleton: { marginTop: 20, display: "flex", flexDirection: "column", gap: 10 },
  skeletonLine: {
    height: 14, borderRadius: 8,
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
    backgroundSize: "800px 100%",
    animation: "shimmer 1.4s infinite",
  },

  // Empty
  emptyState: { padding: "48px 0", textAlign: "center", color: "#64748b" },

  // Spinner
  spinner: {
    display: "inline-block", width: 16, height: 16, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff",
    animation: "spin 0.7s linear infinite",
  },
};


