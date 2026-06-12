import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

// --- SVG Icons (Professional & Clean) ---
const DashboardIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>);
const QuizzesIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>);
const LogoutIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>);
const SettingsIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>);
const UsersIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const ClipboardIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>);
const StarIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const ChevronLeftIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>);
const SyncIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>);
const PlusIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
const BellIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>);

export default function AdminPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, quizzes

  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [reattempts, setReattempts] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [quizzesPage, setQuizzesPage] = useState(1);
  const [resultsPage, setResultsPage] = useState(1);
  const [reattemptsPage, setReattemptsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  
  const [quizzesMeta, setQuizzesMeta] = useState({});
  const [resultsMeta, setResultsMeta] = useState({});
  const [reattemptsMeta, setReattemptsMeta] = useState({});
  const [usersMeta, setUsersMeta] = useState({});

  // Unified Quiz Builder State
  const [editingQuiz, setEditingQuiz] = useState(null); // null means list view. {} means new. { _id, title, ... } means editing existing.
  const [quizQuestions, setQuizQuestions] = useState([]); // Questions for the currently editing quiz

  const [questionData, setQuestionData] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "Medium",
    questionCategory: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewingResult, setViewingResult] = useState(null);

  const [searchQuiz, setSearchQuiz] = useState("");
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    fetchData();
  }, [quizzesPage, resultsPage, reattemptsPage, usersPage, searchQuiz, searchUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, resultsRes, reattemptsRes, usersRes] = await Promise.all([
        api.get(`/admin/quizzes?page=${quizzesPage}&limit=10&search=${encodeURIComponent(searchQuiz)}`),
        api.get(`/admin/results?page=${resultsPage}&limit=10`),
        api.get(`/admin/reattempts?page=${reattemptsPage}&limit=10`),
        api.get(`/admin/users?page=${usersPage}&limit=10&search=${encodeURIComponent(searchUser)}`)
      ]);
      setQuizzes(quizzesRes.data.data);
      setQuizzesMeta(quizzesRes.data.pagination || {});
      setResults(resultsRes.data.data);
      setResultsMeta(resultsRes.data.pagination || {});
      setReattempts(reattemptsRes.data.data);
      setReattemptsMeta(reattemptsRes.data.pagination || {});
      setUsers(usersRes.data.data || []);
      setUsersMeta(usersRes.data.pagination || {});
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionsForQuiz = async (quizId) => {
    if (!quizId) return;
    try {
      const res = await api.get(`/admin/questions/${quizId}`);
      setQuizQuestions(res.data.data);
    } catch (err) {
      setError("Failed to fetch questions");
    }
  };

  const handleSaveQuizSettings = async (e) => {
    e.preventDefault();
    if (!editingQuiz.title) return;
    try {
      setLoading(true);
      if (!editingQuiz._id) {
        const res = await api.post(`/admin/quizzes`, {
          head: editingQuiz.head,
          category: editingQuiz.category,
          title: editingQuiz.title,
          timeLimit: editingQuiz.timeLimit || 5
        });
        setEditingQuiz(res.data.data);
        setSuccess("Quiz created! Now add questions below.");
        fetchData();
      } else {
        setSuccess("Quiz settings updated!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save quiz");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleToggleStatus = async () => {
    if (!editingQuiz || !editingQuiz._id) return;
    try {
      setLoading(true);
      const newStatus = editingQuiz.status === "Closed" ? "Open" : "Closed";
      const res = await api.put(`/admin/quizzes/${editingQuiz._id}/status`, { status: newStatus });
      setEditingQuiz(res.data.data);
      setSuccess(`Quiz is now ${newStatus}`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleReattemptAction = async (id, status) => {
    try {
      setLoading(true);
      await api.put(`/admin/reattempts/${id}/status`, { status });
      setSuccess(`Request ${status} successfully!`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update request");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (type, id) => {
    if(!window.confirm(`Are you sure you want to delete this ${type}? This action cannot be undone.`)) return;
    try {
      setLoading(true);
      await api.delete(`/admin/${type}/${id}`);
      setSuccess(`${type} deleted successfully!`);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to delete ${type}`);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!editingQuiz._id) {
      setError("Please save the quiz settings first before adding questions.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (editingQuiz.status === "Closed") {
      setError("Cannot add questions to a closed quiz.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!questionData.questionText) return;

    const filteredOptions = questionData.options.filter(o => o.trim() !== "");

    if (!questionData.correctAnswer) return;
    if (filteredOptions.length < 2) {
      setError("Please provide at least two valid options.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!filteredOptions.includes(questionData.correctAnswer)) {
      setError("Correct answer must match one of the options exactly.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      setLoading(true);
      await api.post(`/admin/questions`, {
        ...questionData,
        quizId: editingQuiz._id,
        options: filteredOptions
      });
      setQuestionData({
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        difficulty: "Medium",
        questionCategory: questionData.questionCategory
      });
      setSuccess("Question added and saved automatically!");
      fetchQuestionsForQuiz(editingQuiz._id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const openBuilderForNew = () => {
    setEditingQuiz({ head: "", category: "", title: "", timeLimit: 5 });
    setQuizQuestions([]);
  };

  const openBuilderForExisting = (quiz) => {
    setEditingQuiz(quiz);
    fetchQuestionsForQuiz(quiz._id);
  };

  const closeBuilder = () => {
    setEditingQuiz(null);
    setQuizQuestions([]);
    fetchData();
  };

  const inputStyle = {
    width: "100%", padding: "10px 14px",
    borderRadius: 6, border: "1px solid #cbd5e1",
    background: "#fff", color: "#0f172a",
    fontSize: 14, outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "'Poppins', sans-serif"
  };

  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 600,
    color: "#475569", marginBottom: 6
  };

  const menuItems = [
    { id: "dashboard", icon: <DashboardIcon />, label: "Dashboard" },
    { id: "quizzes", icon: <QuizzesIcon />, label: "Manage Quizzes" },
    { id: "reattempts", icon: <BellIcon />, label: "Requests" },
    { id: "users", icon: <UsersIcon />, label: "Manage Users" }
  ];

  const renderPagination = (meta, setPage) => {
    if (!meta || !meta.pages || meta.pages <= 1) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, paddingBottom: 24 }}>
        <button onClick={() => setPage(Math.max(1, meta.page - 1))} disabled={meta.page === 1} className="btn-secondary" style={{ padding: '6px 12px' }}>Previous</button>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 500, color: '#475569' }}>Page {meta.page} of {meta.pages}</span>
        <button onClick={() => setPage(Math.min(meta.pages, meta.page + 1))} disabled={meta.page === meta.pages} className="btn-secondary" style={{ padding: '6px 12px' }}>Next</button>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      fontFamily: "'Poppins', sans-serif",
      background: "#f8fafc",
      display: "flex",
      color: "#0f172a"
    }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .sidebar-link {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 16px; margin: 4px 12px;
          border-radius: 6px; border: none;
          color: #475569; font-weight: 500; font-size: 14px;
          text-decoration: none; cursor: pointer; transition: all 0.2s;
          background: transparent; width: calc(100% - 24px); text-align: left;
        }
        .sidebar-link:hover { background: #f1f5f9; color: #0f172a; }
        .sidebar-link.active {
          background: #ecfdf5; color: #10b981; font-weight: 600;
        }
        .btn-primary {
          background: #10b981; color: #fff; border: none; border-radius: 6px;
          padding: 8px 16px; font-weight: 500; font-size: 14px; cursor: pointer; transition: background 0.2s, opacity 0.2s;
          display: flex; align-items: center; gap: 8px; justify-content: center;
        }
        .btn-primary:hover:not(:disabled) { background: #059669; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-secondary {
          background: #fff; color: #334155; border: 1px solid #cbd5e1; border-radius: 6px;
          padding: 8px 16px; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover { background: #f8fafc; border-color: #94a3b8; }
        input:focus, select:focus, textarea:focus { border-color: #10b981 !important; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
        .table-cell { padding: 14px 16px; font-size: 14px; border-bottom: 1px solid #e2e8f0; }
        .table-header { padding: 12px 16px; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; background: #f8fafc; text-align: left; }
        
        /* Custom Scrollbar for sleekness */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>

      {/* --- SIDEBAR --- */}
      <aside style={{ width: 260, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "center", borderBottom: "1px solid #e2e8f0" }}>
          <img src="/logo.png" alt="Logo" style={{ height: 32, width: "auto", objectFit: "contain", display: "block" }} />
        </div>

        <div style={{ flex: 1, padding: "16px 0" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", padding: "0 24px", marginBottom: 8 }}>MENU</div>
          {menuItems.map(item => (
            <button key={item.id} className={`sidebar-link ${activeTab === item.id ? "active" : ""}`} onClick={() => { setActiveTab(item.id); setViewingResult(null); setEditingQuiz(null); }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px 0", borderTop: "1px solid #e2e8f0" }}>
          <button onClick={handleLogout} className="sidebar-link" style={{ color: "#ef4444" }}>
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><LogoutIcon /></span>
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>

        <header style={{ height: 64, background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", fontWeight: 500, fontSize: 14 }}>
            <span>Admin</span>
            <span style={{ color: "#cbd5e1" }}>/</span>
            <span style={{ color: "#10b981", fontWeight: 600 }}>{menuItems.find(m => m.id === activeTab)?.label}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>
              A
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#334155" }}>Administrator</span>
          </div>
        </header>

        <div style={{ padding: "32px", overflowY: "auto", flex: 1 }}>

          {/* TOAST NOTIFICATIONS */}
          <div style={{ position: "fixed", top: 80, right: 32, zIndex: 100, display: "flex", flexDirection: "column", gap: 10 }}>
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", padding: "12px 16px", borderRadius: 6, fontSize: 14, fontWeight: 500, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>{error}</div>}
            {success && <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "12px 16px", borderRadius: 6, fontSize: 14, fontWeight: 500, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>{success}</div>}
          </div>

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && !viewingResult && (
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Dashboard Overview</h1>
                <p style={{ fontSize: 15, color: "#64748b" }}>Monitor key metrics and recent quiz submissions across the platform.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 32 }}>
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ color: "#10b981" }}><UsersIcon /></div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", marginBottom: 4, lineHeight: 1 }}>{results.length}</div>
                  <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Total Submissions</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ color: "#10b981" }}><ClipboardIcon /></div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", marginBottom: 4, lineHeight: 1 }}>{quizzes.length}</div>
                  <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Active Quizzes</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ color: "#f59e0b" }}><StarIcon /></div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a", marginBottom: 4, lineHeight: 1 }}>
                    {results.length ? Math.round(results.reduce((a, b) => a + b.percentage, 0) / results.length) : 0}%
                  </div>
                  <div style={{ fontSize: 14, color: "#64748b", fontWeight: 500 }}>Average Score</div>
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>Submission History</h3>
                  <button onClick={fetchData} className="btn-secondary" style={{ padding: "6px 12px", fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}>
                    <SyncIcon /> Sync Data
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr>
                        <th className="table-header">Student</th>
                        <th className="table-header">Quiz Title</th>
                        <th className="table-header">Score</th>
                        <th className="table-header">Date</th>
                        <th className="table-header">Status</th>
                        <th className="table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.length === 0 ? (
                        <tr><td colSpan="6" style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No recent submissions found.</td></tr>
                      ) : (
                        results.map(r => {
                          const noteLabel = (!r.note || r.note.includes("Manual")) ? "Submitted" : r.note.includes("Tab") ? "Violation" : r.note.includes("Time") ? "Time Ended" : r.note;
                          return (
                            <tr key={r._id} style={{ transition: "background 0.2s" }} className="hover:bg-slate-50">
                              <td className="table-cell" style={{ fontWeight: 500 }}>{r.userId?.name || r.userId || "Unknown"}</td>
                              <td className="table-cell" style={{ color: "#475569" }}>{r.quizId?.title || "Unknown Quiz"}</td>
                              <td className="table-cell" style={{ fontWeight: 500 }}>{Math.round(r.percentage)}% <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 400 }}>({r.correct}/{r.total})</span></td>
                              <td className="table-cell" style={{ color: "#64748b" }}>{new Date(r.completedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                              <td className="table-cell">
                                <span style={{
                                  background: noteLabel === "Submitted" ? "#f0fdf4" : noteLabel === "Violation" ? "#fef2f2" : "#f1f5f9",
                                  color: noteLabel === "Submitted" ? "#16a34a" : noteLabel === "Violation" ? "#dc2626" : "#475569",
                                  border: `1px solid ${noteLabel === "Submitted" ? "#bbf7d0" : noteLabel === "Violation" ? "#fecaca" : "#e2e8f0"}`,
                                  padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap"
                                }}>
                                  {noteLabel}
                                </span>
                              </td>
                              <td className="table-cell">
                                <button onClick={() => setViewingResult(r)} style={{ color: "#10b981", background: "transparent", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>View</button>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(resultsMeta, setResultsPage)}
              </div>
            </div>
          )}

          {/* VIEWING RESULT DETAILS */}
          {activeTab === "dashboard" && viewingResult && (
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <button onClick={() => setViewingResult(null)} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 8, cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}>
                  <ChevronLeftIcon />
                </button>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>Submission Details</h1>
                  <div style={{ fontSize: 14, color: "#64748b" }}>Reviewing student answers and quiz metrics.</div>
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 32, marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32, borderBottom: "1px solid #e2e8f0", paddingBottom: 32 }}>
                  <div>
                    <div style={labelStyle}>Student Name</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{viewingResult.userId?.name || "Unknown"}</div>
                  </div>
                  <div>
                    <div style={labelStyle}>Quiz Name</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>{viewingResult.quizId?.title || "Unknown"}</div>
                  </div>
                  <div>
                    <div style={labelStyle}>Final Score</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: viewingResult.percentage >= 50 ? "#16a34a" : "#dc2626" }}>
                      {viewingResult.percentage}% <span style={{ fontSize: 14, color: "#64748b", fontWeight: 400 }}>({viewingResult.correct} / {viewingResult.total})</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 32, background: "#f8fafc", padding: 20, borderRadius: 8, border: "1px solid #e2e8f0" }}>
                  <div>
                    <div style={labelStyle}>Submission Trigger</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: viewingResult.note?.includes("Auto") || viewingResult.note?.includes("Violation") ? "#dc2626" : "#0f172a" }}>
                      {viewingResult.note || "Standard Submission"}
                    </div>
                  </div>
                  <div>
                    <div style={labelStyle}>Tab Violations Detected</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: viewingResult.tabViolations > 0 ? "#dc2626" : "#0f172a" }}>
                      {viewingResult.tabViolations || 0} time(s)
                    </div>
                  </div>
                  <div>
                    <div style={labelStyle}>Time Consumed</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: "#0f172a" }}>
                      {viewingResult.timeTaken ? `${Math.floor(viewingResult.timeTaken / 60)}m ${viewingResult.timeTaken % 60}s` : "N/A"}
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 20 }}>Question Breakdown</h3>
                {viewingResult.detailedAnswers && viewingResult.detailedAnswers.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {viewingResult.detailedAnswers.map((ans, idx) => {
                      const isCorrect = ans.isCorrect === true;
                      const isWrong = ans.isCorrect === false;
                      return (
                        <div key={idx} style={{ padding: 20, borderRadius: 8, background: "#fff", border: `1px solid ${isCorrect ? '#bbf7d0' : (isWrong ? '#fecaca' : '#e2e8f0')}`, borderLeft: `4px solid ${isCorrect ? '#22c55e' : (isWrong ? '#ef4444' : '#cbd5e1')}` }}>
                          <div style={{ fontSize: 15, fontWeight: 500, color: "#0f172a", marginBottom: 12 }}>{idx + 1}. {ans.questionText}</div>
                          <div style={{ display: "flex", gap: 32, fontSize: 14 }}>
                            <div style={{ color: isCorrect ? "#16a34a" : "#dc2626" }}>
                              <span style={{ fontWeight: 600 }}>Student Selected:</span> {ans.selectedOption || "Not Answered"}
                            </div>
                            {ans.correctAnswer && (
                              <div style={{ color: "#16a34a" }}>
                                <span style={{ fontWeight: 600 }}>Correct Answer:</span> {ans.correctAnswer}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div style={{ padding: 32, textAlign: "center", background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, color: "#64748b" }}>
                    No detailed question breakdown available for this submission.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QUIZZES TAB (List View) */}
          {activeTab === "quizzes" && !editingQuiz && (
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Manage Quizzes</h1>
                  <p style={{ fontSize: 15, color: "#64748b" }}>Create, configure, and manage assessment configurations.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <input type="text" value={searchQuiz} onChange={e => { setSearchQuiz(e.target.value); setQuizzesPage(1); }} placeholder="Search Quizzes..." style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", fontSize: 14 }} />
                  <button onClick={openBuilderForNew} className="btn-primary">
                    <PlusIcon /> Create New Quiz
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                {quizzes.map(q => (
                  <div key={q._id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{q.head || "General"} &bull; {q.category || "Uncategorized"}</div>
                        <h4 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", lineHeight: 1.3 }}>{q.title}</h4>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 500, padding: "2px 10px", borderRadius: 12,
                        background: q.status === "Open" ? "#f0fdf4" : "#f1f5f9",
                        color: q.status === "Open" ? "#16a34a" : "#475569",
                        border: `1px solid ${q.status === "Open" ? "#bbf7d0" : "#e2e8f0"}`
                      }}>
                        {q.status || "Unknown"}
                      </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: 20, marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Questions</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{q.numberOfQuestions || 0}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Time Limit</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{q.timeLimit} mins</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openBuilderForExisting(q)} className="btn-secondary" style={{ flex: 1 }}>
                        Configure Quiz
                      </button>
                      <button onClick={() => handleDelete('quizzes', q._id)} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 6, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination(quizzesMeta, setQuizzesPage)}
            </div>
          )}

          {/* QUIZ BUILDER VIEW */}
          {activeTab === "quizzes" && editingQuiz && (
            <div style={{ paddingBottom: 60, maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <button onClick={closeBuilder} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 8, cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}>
                  <ChevronLeftIcon />
                </button>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
                    {editingQuiz._id ? "Quiz Configuration" : "Create New Quiz"}
                  </h1>
                  <p style={{ fontSize: 14, color: "#64748b" }}>Define parameters and manage the question bank.</p>
                </div>
              </div>

              {/* 1. Quiz Settings Section */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 32, marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0 }}>General Settings</h3>
                  {editingQuiz._id && (
                    <button
                      onClick={handleToggleStatus}
                      style={{
                        background: editingQuiz.status === "Closed" ? "#16a34a" : "#fff",
                        color: editingQuiz.status === "Closed" ? "#fff" : "#dc2626",
                        border: editingQuiz.status === "Closed" ? "none" : "1px solid #fecaca",
                        borderRadius: 6, padding: "8px 16px",
                        fontSize: 14, fontWeight: 500, cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {editingQuiz.status === "Closed" ? "Publish / Open Quiz" : "Close Quiz Temporarily"}
                    </button>
                  )}
                </div>
                <form onSubmit={handleSaveQuizSettings} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Target Audience / Department</label>
                    <input type="text" value={editingQuiz.head || ""} onChange={e => setEditingQuiz({ ...editingQuiz, head: e.target.value })} style={inputStyle} placeholder="e.g. Engineering Hiring 2026" required />
                  </div>
                  <div>
                    <label style={labelStyle}>Quiz Category</label>
                    <select value={editingQuiz.category || ""} onChange={e => setEditingQuiz({ ...editingQuiz, category: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }} required>
                      <option value="" disabled>Select Domain</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="Design & UI/UX">Design & UI/UX</option>
                      <option value="Marketing">Marketing</option>
                      <option value="General Knowledge">General Knowledge</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Assessment Title</label>
                    <input type="text" value={editingQuiz.title || ""} onChange={e => setEditingQuiz({ ...editingQuiz, title: e.target.value })} style={inputStyle} placeholder="e.g. React & Node.js Core Evaluation" required />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Time Limit (Minutes)</label>
                    <input type="number" min="1" value={editingQuiz.timeLimit || 5} onChange={e => setEditingQuiz({ ...editingQuiz, timeLimit: parseInt(e.target.value) })} style={{ ...inputStyle, maxWidth: "200px" }} required />
                  </div>
                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? "Processing..." : editingQuiz._id ? "Update Configuration" : "Save Settings to Enable Questions"}
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. Questions Builder Section */}
              {editingQuiz._id && (
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, alignItems: "start", marginBottom: 32 }}>

                  {/* Add Question Form */}
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>Question Builder</h3>

                    {editingQuiz.status === "Closed" ? (
                      <div style={{ background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0", padding: 24, borderRadius: 8, textAlign: "center", fontSize: 14 }}>
                        Assessment is closed. Modifications to the question bank are locked.
                      </div>
                    ) : (
                      <form onSubmit={handleAddQuestion} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <label style={labelStyle}>Difficulty</label>
                            <select value={questionData.difficulty} onChange={e => setQuestionData({ ...questionData, difficulty: e.target.value })} style={inputStyle} required>
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Sub-topic tag</label>
                            <input type="text" value={questionData.questionCategory} onChange={e => setQuestionData({ ...questionData, questionCategory: e.target.value })} style={inputStyle} placeholder="e.g. React Hooks" required />
                          </div>
                        </div>

                        <div>
                          <label style={labelStyle}>Question Statement</label>
                          <textarea
                            value={questionData.questionText}
                            onChange={e => setQuestionData({ ...questionData, questionText: e.target.value })}
                            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                            placeholder="Enter the question text..."
                            required
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Multiple Choice Options</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {questionData.options.map((opt, idx) => (
                              <input
                                key={idx} type="text" value={opt} onChange={e => handleOptionChange(idx, e.target.value)}
                                style={inputStyle} placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <label style={labelStyle}>Valid Correct Answer</label>
                          <input
                            type="text" value={questionData.correctAnswer} onChange={e => setQuestionData({ ...questionData, correctAnswer: e.target.value })}
                            style={inputStyle} placeholder="Must identically match one of the options above" required
                          />
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                          <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Saving..." : "Add to Question Bank"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* List of Questions in Quiz */}
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
                      <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0 }}>Question Bank</h3>
                      <span style={{ background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>{quizQuestions.length} Items</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "600px", overflowY: "auto", paddingRight: 8 }}>
                      {quizQuestions.length === 0 ? (
                        <div style={{ padding: 32, textAlign: "center", color: "#94a3b8", background: "#f8fafc", borderRadius: 8, border: "1px dashed #e2e8f0", fontSize: 14 }}>
                          The question bank is empty.
                        </div>
                      ) : (
                        quizQuestions.map((q, idx) => (
                          <div key={q._id} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, background: "#f8fafc" }}>
                            <div style={{ fontWeight: 500, color: "#0f172a", fontSize: 14, marginBottom: 12, lineHeight: 1.5 }}>
                              {idx + 1}. {q.questionText}
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                              <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 500, background: "#f0fdf4", padding: "2px 8px", borderRadius: 4, border: "1px solid #bbf7d0" }}>
                                Ans: {q.correctAnswer}
                              </span>
                              <span style={{ fontSize: 12, color: "#475569", fontWeight: 500, background: "#e2e8f0", padding: "2px 8px", borderRadius: 4 }}>
                                {q.difficulty}
                              </span>
                              {q.questionCategory && (
                                <span style={{ fontSize: 12, color: "#10b981", fontWeight: 500, background: "#ecfdf5", padding: "2px 8px", borderRadius: 4 }}>
                                  {q.questionCategory}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* 3. Student Submissions for this Quiz */}
              {editingQuiz._id && (
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{ padding: "24px 32px", borderBottom: "1px solid #e2e8f0" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", margin: 0 }}>Assessment Results</h3>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr>
                          <th className="table-header" style={{ paddingLeft: 32 }}>Candidate</th>
                          <th className="table-header">Email Address</th>
                          <th className="table-header">Final Score</th>
                          <th className="table-header">Timestamp</th>
                          <th className="table-header">Flag</th>
                          <th className="table-header">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.filter(r => r.quizId?._id === editingQuiz._id || r.quizId === editingQuiz._id).length === 0 ? (
                          <tr><td colSpan="6" style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No data collected for this assessment yet.</td></tr>
                        ) : (
                          results.filter(r => r.quizId?._id === editingQuiz._id || r.quizId === editingQuiz._id).map(r => {
                            const noteLabel = (!r.note || r.note.includes("Manual")) ? "Standard" : r.note.includes("Tab") ? "Violation" : r.note.includes("Time") ? "Timeout" : r.note;
                            return (
                              <tr key={r._id} className="hover:bg-slate-50">
                                <td className="table-cell" style={{ paddingLeft: 32, fontWeight: 500 }}>{r.userId?.name || r.userId}</td>
                                <td className="table-cell" style={{ color: "#475569" }}>{r.userId?.email || "N/A"}</td>
                                <td className="table-cell" style={{ fontWeight: 500 }}>{Math.round(r.percentage)}% <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 400 }}>({r.correct}/{r.total})</span></td>
                                <td className="table-cell" style={{ color: "#64748b" }}>{new Date(r.completedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                <td className="table-cell">
                                  <span style={{
                                    color: noteLabel === "Standard" ? "#16a34a" : "#dc2626",
                                    fontSize: 13, fontWeight: 500
                                  }}>
                                    {noteLabel}
                                  </span>
                                </td>
                                <td className="table-cell">
                                  <button onClick={() => { setViewingResult(r); setActiveTab("dashboard"); }} style={{ color: "#10b981", background: "transparent", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>View</button>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* REATTEMPTS TAB */}
          {activeTab === "reattempts" && (
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Re-attempt Requests</h1>
                  <p style={{ fontSize: 15, color: "#64748b" }}>Manage student requests to retake closed or completed quizzes.</p>
                </div>
                <button onClick={fetchData} className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}>
                  <SyncIcon /> Refresh List
                </button>
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr>
                        <th className="table-header">Student</th>
                        <th className="table-header">Quiz Requested</th>
                        <th className="table-header">Reason Provided</th>
                        <th className="table-header">Date</th>
                        <th className="table-header">Status</th>
                        <th className="table-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reattempts.length === 0 ? (
                        <tr><td colSpan="6" style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No re-attempt requests found.</td></tr>
                      ) : (
                        reattempts.map(req => (
                          <tr key={req._id} className="hover:bg-slate-50" style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td className="table-cell" style={{ fontWeight: 500, color: "#0f172a" }}>
                              {req.userId?.name || "Unknown"}
                              <div style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>{req.userId?.email || ""}</div>
                            </td>
                            <td className="table-cell" style={{ color: "#334155", fontWeight: 500 }}>{req.quizId?.title || "Unknown Quiz"}</td>
                            <td className="table-cell" style={{ maxWidth: 280, color: "#475569" }}>
                              <div style={{ fontSize: 13, background: "#f8fafc", padding: "8px 12px", borderRadius: 6, border: "1px solid #e2e8f0", fontStyle: "italic" }}>
                                "{req.reason}"
                              </div>
                            </td>
                            <td className="table-cell" style={{ color: "#64748b", fontSize: 13 }}>{new Date(req.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</td>
                            <td className="table-cell">
                              <span style={{
                                background: req.status === "Pending" ? "#fffbeb" : req.status === "Approved" ? "#f0fdf4" : "#fef2f2",
                                color: req.status === "Pending" ? "#d97706" : req.status === "Approved" ? "#16a34a" : "#dc2626",
                                border: `1px solid ${req.status === "Pending" ? "#fde68a" : req.status === "Approved" ? "#bbf7d0" : "#fecaca"}`,
                                padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
                              }}>
                                {req.status}
                              </span>
                            </td>
                            <td className="table-cell">
                              {req.status === "Pending" ? (
                                <div style={{ display: "flex", gap: 8 }}>
                                  <button onClick={() => handleReattemptAction(req._id, "Approved")} disabled={loading} style={{ background: "#10b981", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>Approve</button>
                                  <button onClick={() => handleReattemptAction(req._id, "Rejected")} disabled={loading} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>Reject</button>
                                </div>
                              ) : (
                                <button onClick={() => handleDelete('reattempts', req._id)} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(reattemptsMeta, setReattemptsPage)}
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Manage Users</h1>
                  <p style={{ fontSize: 15, color: "#64748b" }}>View and manage registered users.</p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <input type="text" value={searchUser} onChange={e => { setSearchUser(e.target.value); setUsersPage(1); }} placeholder="Search Users by Name, ID, or Email..." style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", fontSize: 14, minWidth: 260 }} />
                  <button onClick={fetchData} className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}>
                    <SyncIcon /> Refresh Users
                  </button>
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr>
                        <th className="table-header">Name</th>
                        <th className="table-header">Email Address</th>
                        <th className="table-header">ID/Registration</th>
                        <th className="table-header">Role</th>
                        <th className="table-header">Joined</th>
                        <th className="table-header">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td colSpan="6" style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: 14 }}>No users found.</td></tr>
                      ) : (
                        users.map(u => (
                          <tr key={u._id} className="hover:bg-slate-50" style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td className="table-cell" style={{ fontWeight: 500, color: "#0f172a" }}>{u.name}</td>
                            <td className="table-cell" style={{ color: "#475569" }}>{u.email}</td>
                            <td className="table-cell" style={{ color: "#334155" }}>{u.idNo || 'N/A'}</td>
                            <td className="table-cell">
                              <span style={{
                                background: u.role === "admin" ? "#fef2f2" : "#f0fdf4",
                                color: u.role === "admin" ? "#dc2626" : "#16a34a",
                                border: `1px solid ${u.role === "admin" ? "#fecaca" : "#bbf7d0"}`,
                                padding: "4px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600
                              }}>
                                {u.role === 'admin' ? 'Administrator' : 'Student'}
                              </span>
                            </td>
                            <td className="table-cell" style={{ color: "#64748b", fontSize: 13 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="table-cell">
                              {u.role !== 'admin' && (
                                <button onClick={() => handleDelete('users', u._id)} style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Delete User</button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(usersMeta, setUsersPage)}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
