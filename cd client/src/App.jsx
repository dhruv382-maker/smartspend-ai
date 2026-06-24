import { useState } from "react";
import axios from "axios";

const BASE = "https://smartspend-backend-bsgp.onrender.com";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0F1629;
    color: #E2E8F0;
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  .app-shell {
    min-height: 100vh;
    background: linear-gradient(135deg, #0F1629 0%, #161D35 50%, #0F1629 100%);
    padding: 24px 16px 48px;
  }

  .header {
    text-align: center;
    margin-bottom: 32px;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(108,99,255,0.15);
    border: 1px solid rgba(108,99,255,0.3);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 11px;
    font-weight: 600;
    color: #6C63FF;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .header h1 {
    font-size: 32px;
    font-weight: 700;
    background: linear-gradient(135deg, #E2E8F0 0%, #6C63FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }

  .header p {
    color: #64748B;
    font-size: 14px;
    margin-top: 6px;
  }

  .main-grid {
    max-width: 480px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .card {
    background: rgba(26,35,64,0.8);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    padding: 24px;
    backdrop-filter: blur(12px);
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(108,99,255,0.5), transparent);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .card-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
  }

  .icon-purple { background: rgba(108,99,255,0.2); }
  .icon-green  { background: rgba(34,197,94,0.15); }
  .icon-blue   { background: rgba(56,189,248,0.15); }
  .icon-pink   { background: rgba(236,72,153,0.15); }

  .card-header h2 {
    font-size: 15px;
    font-weight: 600;
    color: #E2E8F0;
  }

  .card-header p {
    font-size: 12px;
    color: #64748B;
    margin-top: 1px;
  }

  .form-group {
    margin-bottom: 14px;
  }

  .form-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #64748B;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .form-input {
    width: 100%;
    background: rgba(15,22,41,0.6);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 11px 14px;
    color: #E2E8F0;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .form-input::placeholder { color: #334155; }

  .form-input:focus {
    border-color: rgba(108,99,255,0.5);
    box-shadow: 0 0 0 3px rgba(108,99,255,0.1);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .btn {
    width: 100%;
    padding: 13px;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 4px;
  }

  .btn:active { transform: scale(0.98); }

  .btn-primary {
    background: linear-gradient(135deg, #6C63FF, #8B5CF6);
    color: #fff;
    box-shadow: 0 4px 15px rgba(108,99,255,0.3);
  }

  .btn-primary:hover {
    box-shadow: 0 6px 20px rgba(108,99,255,0.45);
    filter: brightness(1.05);
  }

  .btn-secondary {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #94A3B8;
  }

  .btn-secondary:hover {
    background: rgba(255,255,255,0.08);
    color: #E2E8F0;
  }

  .btn-ai {
    background: linear-gradient(135deg, #0EA5E9, #6C63FF);
    color: #fff;
    box-shadow: 0 4px 15px rgba(14,165,233,0.25);
  }

  .btn-ai:hover {
    box-shadow: 0 6px 20px rgba(14,165,233,0.4);
    filter: brightness(1.05);
  }

  .btn-sm {
    width: auto;
    padding: 5px 10px;
    font-size: 11px;
    border-radius: 8px;
    margin-top: 0;
    background: rgba(239,68,68,0.15);
    border: 1px solid rgba(239,68,68,0.25);
    color: #EF4444;
  }

  .btn-sm:hover {
    background: rgba(239,68,68,0.25);
  }

  .expense-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .expense-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(15,22,41,0.5);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 14px;
    padding: 14px;
    animation: slideIn 0.25s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .expense-emoji {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: rgba(108,99,255,0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .expense-info { flex: 1; min-width: 0; }

  .expense-title {
    font-size: 14px;
    font-weight: 500;
    color: #E2E8F0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .expense-category {
    font-size: 11px;
    color: #64748B;
    margin-top: 2px;
    text-transform: capitalize;
  }

  .expense-amount {
    font-size: 15px;
    font-weight: 700;
    color: #22C55E;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .empty-state {
    text-align: center;
    padding: 32px 16px;
    color: #334155;
  }

  .empty-state .emoji { font-size: 36px; margin-bottom: 10px; }
  .empty-state p { font-size: 13px; }

  .analysis-box {
    background: rgba(15,22,41,0.5);
    border: 1px solid rgba(108,99,255,0.15);
    border-radius: 14px;
    padding: 16px;
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.7;
    color: #94A3B8;
    white-space: pre-wrap;
  }

  .analysis-box p { color: #94A3B8; }

  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: #1A2340;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 12px 20px;
    font-size: 13px;
    font-weight: 500;
    color: #E2E8F0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: toastIn 0.3s ease;
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(16px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .toast.success { border-color: rgba(34,197,94,0.3); }
  .toast.error   { border-color: rgba(239,68,68,0.3); }

  .divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 4px 0 16px;
  }

  .section-actions {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
  }

  .section-actions .btn { margin-top: 0; }

  .loading-dots::after {
    content: '...';
    animation: dots 1s steps(3, end) infinite;
  }

  @keyframes dots {
    0%, 33% { content: '.'; }
    66%      { content: '..'; }
    100%     { content: '...'; }
  }
`;

const CATEGORY_EMOJI = {
  food: "🍔", transport: "🚌", shopping: "🛍️",
  entertainment: "🎮", health: "💊", education: "📚",
  utilities: "💡", other: "💰",
};

function getCategoryEmoji(cat = "") {
  const key = cat.toLowerCase();
  return CATEGORY_EMOJI[key] || "💰";
}

let toastTimer = null;

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    if (toastTimer) clearTimeout(toastTimer);
    setToast({ msg, type });
    toastTimer = setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BASE}/login`, { email, password });
      showToast("✓ " + res.data.message, "success");
    } catch {
      showToast("✕ Login failed. Check your credentials.", "error");
    }
  };

  const handleExpense = async () => {
    if (!title || !amount || !category) {
      showToast("✕ Fill in all fields first.", "error");
      return;
    }
    try {
      await axios.post(`${BASE}/add-expense`, {
        user_id: 1, title, amount, category,
      });
      showToast("✓ Expense added!", "success");
      getExpenses();
    } catch {
      showToast("✕ Could not add expense.", "error");
    }
  };

  const getExpenses = async () => {
    try {
      const res = await axios.get(`${BASE}/expenses/1`);
      setExpenses(res.data.expenses);
    } catch {
      showToast("✕ Could not fetch expenses.", "error");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${BASE}/expense/${id}`);
      showToast("✓ Expense removed.", "success");
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch {
      showToast("✕ Delete failed.", "error");
    }
  };

  const analyzeExpenses = async () => {
    setAnalyzing(true);
    setAnalysis("");
    try {
      const res = await axios.get(`${BASE}/analyze/1`);
      setAnalysis(res.data.analysis);
    } catch {
      showToast("✕ AI analysis failed.", "error");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-shell">
        {/* HEADER */}
        <div className="header">
          <div className="header-badge">✦ AI Powered</div>
          <h1>SmartSpend AI</h1>
          <p>Track smarter, spend wiser</p>
        </div>

        <div className="main-grid">

          {/* LOGIN CARD */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon icon-purple">🔐</div>
              <div>
                <h2>Sign In</h2>
                <p>Access your account</p>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleLogin}>
              Sign In →
            </button>
          </div>

          {/* ADD EXPENSE CARD */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon icon-green">➕</div>
              <div>
                <h2>Add Expense</h2>
                <p>Log a new transaction</p>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                placeholder="e.g. Lunch at café"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  className="form-input"
                  placeholder="0.00"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  placeholder="e.g. Food"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleExpense}>
              Add Expense
            </button>
          </div>

          {/* EXPENSE HISTORY CARD */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon icon-blue">📋</div>
              <div>
                <h2>Expense History</h2>
                <p>{expenses.length} transaction{expenses.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={getExpenses}>
              ↻ Refresh
            </button>
            <div style={{ marginTop: "16px" }}>
              {expenses.length === 0 ? (
                <div className="empty-state">
                  <div className="emoji">🧾</div>
                  <p>No expenses yet.<br />Add one above to get started.</p>
                </div>
              ) : (
                <div className="expense-list">
                  {expenses.map((item) => (
                    <div className="expense-item" key={item.id}>
                      <div className="expense-emoji">
                        {getCategoryEmoji(item.category)}
                      </div>
                      <div className="expense-info">
                        <div className="expense-title">{item.title}</div>
                        <div className="expense-category">{item.category}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="expense-amount">₹{item.amount}</div>
                        <button
                          className="btn btn-sm"
                          onClick={() => deleteExpense(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI ANALYSIS CARD */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon icon-pink">✦</div>
              <div>
                <h2>AI Insights</h2>
                <p>Smart spending analysis</p>
              </div>
            </div>
            <button className="btn btn-ai" onClick={analyzeExpenses} disabled={analyzing}>
              {analyzing ? (
                <span className="loading-dots">Analyzing</span>
              ) : (
                "✦ Analyze My Spending"
              )}
            </button>
            {(analysis || analyzing) && (
              <div className="analysis-box">
                {analyzing ? (
                  <span style={{ color: "#64748B" }}>
                    <span className="loading-dots">Generating insights</span>
                  </span>
                ) : (
                  analysis
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </>
  );
}
