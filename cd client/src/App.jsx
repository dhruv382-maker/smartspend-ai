import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { supabase } from "./supabase";

axios.defaults.baseURL = "http://localhost:5000";

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
                : "linear-gradient(135deg,#4f46e5,#4338ca)",
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

// ─── Google Icon ──────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
        s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
        s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039
        l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
        c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
        c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24
        C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
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

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google"
    });

    console.log(data);
    console.log(error);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleLogin(); };

  return (
    <div style={styles.loginBg}>
      {/* Ambient orbs */}
      <div style={{ ...styles.orb, top: "8%",  left: "12%",  width: 360, height: 360, background: "radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 70%)" }} />
      <div style={{ ...styles.orb, bottom: "5%", right: "8%", width: 440, height: 440, background: "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 70%)" }} />
      <div style={styles.gridOverlay} />

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

        {/* Google Auth */}
        <button
          style={styles.btnGoogle}
          onClick={handleGoogleLogin}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.35)";
            e.currentTarget.style.background = "#fafafa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
            e.currentTarget.style.background = "#ffffff";
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div style={styles.dividerRow}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or sign in with email</span>
          <span style={styles.dividerLine} />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email address</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey}
            onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.15)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
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
            onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.15)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        <button
          style={{ ...styles.btnPrimary, opacity: loading ? 0.7 : 1, marginTop: 6 }}
          onClick={handleLogin}
          disabled={loading}
          onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(99,102,241,0.45)"; } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.35)"; }}
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
      setExpenses(res.data.expenses || []);
    } catch {
      showToast("Could not load expenses.", "error");
    }
  }, [showToast, user]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const totalSpent = Array.isArray(expenses)
    ? expenses.reduce((s, e) => s + Number(e.amount), 0)
    : 0;

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
      <div style={{ ...styles.orb, top: "-5%",  left: "-5%",  width: 520, height: 520, background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)" }} />
      <div style={{ ...styles.orb, bottom: "-5%", right: "-5%", width: 620, height: 620, background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

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
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)"; e.currentTarget.style.color = "#fca5a5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#94a3b8"; }}
          >
            <span style={{ fontSize: 13 }}>⏻</span> Sign Out
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
              <div
                key={cat.value}
                style={{ ...styles.pill, borderColor: cat.color + "44" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
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
          { id: "add",     label: "➕", text: "Add Expense" },
          { id: "history", label: "📋", text: `History (${expenses.length})` },
          { id: "ai",      label: "🤖", text: "AI Analysis" },
        ].map((tab) => (
          <button
            key={tab.id}
            style={{ ...styles.tabBtn, ...(activeTab === tab.id ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.background = "transparent"; }}
          >
            <span>{tab.label}</span>{tab.text}
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
                  onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.15)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
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
                  onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.15)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Category</label>
                <select
                  style={{ ...styles.input, cursor: "pointer" }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.15)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
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
              onMouseEnter={(e) => { if (!addLoading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(99,102,241,0.45)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.35)"; }}
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
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateX(2px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateX(0)"; }}
                    >
                      <div style={{ ...styles.expEmoji, background: meta.color + "1c", borderColor: meta.color + "44" }}>
                        {meta.emoji}
                      </div>
                      <div style={styles.expInfo}>
                        <div style={styles.expTitle}>{exp.title}</div>
                        <div style={{ ...styles.expCat, background: meta.color + "1c", color: meta.color }}>{exp.category}</div>
                      </div>
                      <div style={styles.expAmount}>₹{Number(exp.amount).toFixed(2)}</div>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(exp.id)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; }}
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
              onMouseEnter={(e) => { if (!aiLoading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(124,58,237,0.45)"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(124,58,237,0.35)"; }}
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

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
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
  @keyframes pulseSoft {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0.55; }
  }

  select option { background: #1e1b4b; color: #e2e8f0; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 4px; }

  input::placeholder { color: #475569; }
  input:focus, select:focus { outline: none; }
  button:focus-visible, input:focus-visible, select:focus-visible {
    outline: 2px solid #818cf8; outline-offset: 2px;
  }
`;

// ─── Style Objects ────────────────────────────────────────────────────────────
const styles = {
  // Toast
  toastContainer: {
    position: "fixed", top: 20, right: 20, zIndex: 9999,
    display: "flex", flexDirection: "column", gap: 10,
  },
  toast: {
    padding: "13px 20px", borderRadius: 14, color: "#fff",
    fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500,
    display: "flex", alignItems: "center", gap: 10,
    boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
    animation: "slideIn 0.35s cubic-bezier(0.16,1,0.3,1)",
    minWidth: 250,
    border: "1px solid rgba(255,255,255,0.12)",
  },

  // Shared
  orb: { position: "absolute", borderRadius: "50%", pointerEvents: "none", zIndex: 0 },
  gridOverlay: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    maskImage: "radial-gradient(ellipse at center, black 0%, transparent 75%)",
  },

  // Login
  loginBg: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "linear-gradient(135deg, #08070f 0%, #0d0a24 50%, #08070f 100%)",
    position: "relative", overflow: "hidden", fontFamily: "Inter, sans-serif",
    padding: 20,
  },
  loginCard: {
    position: "relative", zIndex: 1, width: "100%", maxWidth: 428, padding: "44px 40px",
    background: "rgba(255,255,255,0.045)", backdropFilter: "blur(28px)",
    borderRadius: 26, border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
    animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1)",
  },
  loginLogo: { display: "flex", alignItems: "center", gap: 14, marginBottom: 36 },
  logoIcon:  {
    fontSize: 34, lineHeight: 1, width: 52, height: 52, display: "flex",
    alignItems: "center", justifyContent: "center", borderRadius: 16,
    background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
    border: "1px solid rgba(99,102,241,0.3)",
  },
  logoTitle: { fontSize: 21, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.5px" },
  logoSub:   { fontSize: 12, color: "#818cf8", fontWeight: 600, letterSpacing: "0.6px", marginTop: 2 },
  loginHeading:    { fontSize: 27, fontWeight: 800, color: "#f8fafc", margin: "0 0 6px", letterSpacing: "-0.7px" },
  loginSubheading: { fontSize: 14, color: "#64748b", margin: "0 0 26px" },
  loginFootnote:   { fontSize: 12, color: "#334155", textAlign: "center", marginTop: 22 },

  // Google button
  btnGoogle: {
    width: "100%", padding: "13px 20px", borderRadius: 14,
    background: "#ffffff", color: "#1f2937", fontSize: 14.5, fontWeight: 600,
    border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)", transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
    fontFamily: "Inter, sans-serif", marginBottom: 22,
  },
  dividerRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 22 },
  dividerLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.08)" },
  dividerText: { fontSize: 11.5, color: "#475569", fontWeight: 500, whiteSpace: "nowrap", letterSpacing: "0.3px" },

  // Dashboard
  dashBg: {
    minHeight: "100vh", background: "linear-gradient(135deg, #030712 0%, #0d0a2e 50%, #030712 100%)",
    fontFamily: "Inter, sans-serif", position: "relative", overflow: "hidden",
  },
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px", height: 68,
    background: "rgba(3,7,18,0.75)", backdropFilter: "blur(24px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  navBrand: { display: "flex", alignItems: "center", gap: 10 },
  navTitle: { fontSize: 18, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.4px" },
  navAi:    { color: "#818cf8" },
  navRight: { display: "flex", alignItems: "center", gap: 18 },
  navUser:  { display: "flex", alignItems: "center", gap: 10 },
  avatar:   {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, color: "#fff",
    boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
  },
  navEmail: { fontSize: 13, color: "#94a3b8", fontWeight: 500 },

  // Summary
  summaryRow: {
    position: "relative", zIndex: 1,
    display: "flex", gap: 16, padding: "32px 32px 0",
    flexWrap: "wrap", alignItems: "flex-start",
  },
  summaryCard: {
    background: "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(139,92,246,0.14))",
    border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 22, padding: "26px 34px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 20px 50px rgba(99,102,241,0.12)",
    animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)",
    minWidth: 210,
  },
  summaryLabel:  { fontSize: 11.5, color: "#a5b4fc", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px" },
  summaryAmount: { fontSize: 42, fontWeight: 800, color: "#f8fafc", letterSpacing: "-1.6px", margin: "8px 0 4px" },
  summaryMeta:   { fontSize: 13, color: "#64748b", fontWeight: 500 },
  categoryPills: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", flex: 1 },
  pill: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "9px 15px", borderRadius: 22, fontSize: 13,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid", backdropFilter: "blur(10px)",
    animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)",
    transition: "all 0.2s ease", cursor: "default",
  },

  // Tabs
  tabBar: {
    position: "relative", zIndex: 1,
    display: "flex", gap: 6, padding: "24px 32px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  tabBtn: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "11px 20px", borderRadius: "12px 12px 0 0", border: "1px solid transparent",
    background: "transparent", color: "#64748b", fontSize: 13.5, fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s ease", fontFamily: "Inter, sans-serif",
    marginBottom: -1,
  },
  tabBtnActive: {
    background: "rgba(99,102,241,0.13)", color: "#c7d2fe",
    borderColor: "rgba(99,102,241,0.25)", borderBottomColor: "transparent",
  },
  tabContent: {
    position: "relative", zIndex: 1,
    padding: "24px 32px 48px", maxWidth: 820, margin: "0 auto",
  },

  // Card
  card: {
    background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 26,
    padding: 34, animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
  },
  cardTitle: { fontSize: 20, fontWeight: 700, color: "#f8fafc", margin: "0 0 4px", letterSpacing: "-0.4px" },
  cardSub:   { fontSize: 13.5, color: "#64748b", margin: "0 0 28px" },

  // Form
  addGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 },
  label: { fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px" },
  input: {
    padding: "12px 16px", borderRadius: 12, fontSize: 14, color: "#f1f5f9",
    background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.2s ease", fontFamily: "Inter, sans-serif",
    width: "100%",
  },

  // Buttons
  btnPrimary: {
    width: "100%", padding: "14px 24px", borderRadius: 14,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontSize: 15, fontWeight: 600, border: "none",
    cursor: "pointer", transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
    fontFamily: "Inter, sans-serif", letterSpacing: "0.2px",
    boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
  },
  btnAi: {
    padding: "14px 28px", borderRadius: 14,
    background: "linear-gradient(135deg, #7c3aed, #6366f1)",
    color: "#fff", fontSize: 15, fontWeight: 600, border: "none",
    cursor: "pointer", transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
    fontFamily: "Inter, sans-serif",
    boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
    display: "block", marginBottom: 24,
  },
  btnLogout: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "9px 16px", borderRadius: 11,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
    color: "#94a3b8", fontSize: 13, fontWeight: 600,
    cursor: "pointer", transition: "all 0.2s ease",
    fontFamily: "Inter, sans-serif",
  },
  btnInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },

  // Expense list
  expenseList: { display: "flex", flexDirection: "column", gap: 3 },
  expenseRow: {
    display: "flex", alignItems: "center", gap: 16, padding: "14px 16px",
    borderRadius: 15, transition: "all 0.2s ease", cursor: "default",
    background: "rgba(255,255,255,0.03)",
  },
  expEmoji: {
    width: 44, height: 44, borderRadius: 13, display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: 20,
    border: "1px solid", flexShrink: 0,
  },
  expInfo:  { flex: 1, minWidth: 0 },
  expTitle: { fontSize: 14.5, fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  expCat:   {
    fontSize: 11, fontWeight: 600, marginTop: 4, display: "inline-block",
    padding: "2px 9px", borderRadius: 8,
  },
  expAmount: { fontSize: 16, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.3px", flexShrink: 0 },
  deleteBtn: {
    background: "transparent", border: "none", fontSize: 15,
    cursor: "pointer", padding: "8px 10px", borderRadius: 10,
    color: "#64748b", transition: "all 0.2s ease",
  },

  // AI
  aiHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  aiBadge: {
    padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.4)",
    color: "#c4b5fd", flexShrink: 0,
  },
  aiResult: {
    background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 18, padding: 26, marginTop: 8,
    animation: "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)",
  },
  aiResultHeader: {
    display: "flex", alignItems: "center", gap: 10,
    marginBottom: 16, paddingBottom: 14,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  aiResultText: { fontSize: 14, lineHeight: 1.8 },
  aiSkeleton: { marginTop: 20, display: "flex", flexDirection: "column", gap: 11, animation: "pulseSoft 1.8s ease-in-out infinite" },
  skeletonLine: {
    height: 14, borderRadius: 8,
    background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 100%)",
    backgroundSize: "800px 100%",
    animation: "shimmer 1.4s infinite linear",
  },

  // Empty
  emptyState: { padding: "52px 0", textAlign: "center", color: "#64748b" },

  // Spinner
  spinner: {
    display: "inline-block", width: 16, height: 16, borderRadius: "50%",
    border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff",
    animation: "spin 0.7s linear infinite",
  },
};

