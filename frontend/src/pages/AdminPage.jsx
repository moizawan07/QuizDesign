import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

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
  
  // Unified Quiz Builder State
  const [editingQuiz, setEditingQuiz] = useState(null); // null means list view. {} means new. { _id, title, ... } means editing existing.
  const [quizQuestions, setQuizQuestions] = useState([]); // Questions for the currently editing quiz
  
  const [questionData, setQuestionData] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: "Medium",
    questionCategory: "",
    isLogical: false,
    testCases: [],
    functionName: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [viewingResult, setViewingResult] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    fetchData();
    return () => document.head.removeChild(link);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesRes, resultsRes] = await Promise.all([
        api.get(`/admin/quizzes`),
        api.get(`/admin/results`)
      ]);
      setQuizzes(quizzesRes.data.data);
      setResults(resultsRes.data.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGrade = async (resultId, questionId, isCorrect) => {
    try {
      setLoading(true);
      const response = await api.put(`/admin/results/${resultId}/grade`, { questionId, isCorrect });
      
      const updatedResult = response.data.data;
      
      setResults(prev => prev.map(r => r._id === resultId ? updatedResult : r));
      if (viewingResult && viewingResult._id === resultId) {
        setViewingResult(updatedResult);
      }
      setSuccess(`Grade updated successfully`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to update grade");
      setTimeout(() => setError(""), 3000);
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
      // Currently only supports creating new quiz. (Can add PUT endpoint later if needed)
      if (!editingQuiz._id) {
        const res = await api.post(`/admin/quizzes`, {
          head: editingQuiz.head,
          category: editingQuiz.category,
          title: editingQuiz.title,
          timeLimit: editingQuiz.timeLimit || 5
        });
        setEditingQuiz(res.data.data); // Switch to editing the newly saved quiz
        setSuccess("Quiz created! Now add questions below.");
        fetchData(); // Refresh list in background
      } else {
        // If it was update: await api.put(...)
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
    
    if (!questionData.isLogical) {
      if (!questionData.correctAnswer) return;
      if (filteredOptions.length < 2) {
        setError("For regular questions, please provide at least two valid options.");
        setTimeout(() => setError(""), 3000);
        return;
      }
      if (!filteredOptions.includes(questionData.correctAnswer)) {
        setError("Correct answer must match one of the options exactly.");
        setTimeout(() => setError(""), 3000);
        return;
      }
    } else {
      if (filteredOptions.length > 0 && questionData.correctAnswer) {
        if (!filteredOptions.includes(questionData.correctAnswer)) {
          setError("Correct answer must match one of the options exactly.");
          setTimeout(() => setError(""), 3000);
          return;
        }
      }
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
        questionCategory: questionData.questionCategory,
        isLogical: questionData.isLogical,
        testCases: [],
        functionName: ""
      });
      setSuccess("Question added and saved automatically!");
      fetchQuestionsForQuiz(editingQuiz._id); // Refresh questions
      fetchData(); // Refresh quiz question counts
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
    fetchData(); // Refresh list to get accurate counts
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    borderRadius: 8, border: "1px solid #e2e8f0",
    background: "#fff", color: "#0f172a",
    fontSize: 13, outline: "none", transition: "border-color 0.2s",
    fontFamily: "'Poppins', sans-serif"
  };

  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: "#64748b", textTransform: "uppercase", marginBottom: 6,
    letterSpacing: "0.05em"
  };

  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "quizzes", icon: "📝", label: "Manage Quizzes" }
  ];

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      fontFamily: "'Poppins', sans-serif",
      background: "#f8fafc",
      display: "flex"
    }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .sidebar-link {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; margin-bottom: 4px;
          border-radius: 0 8px 8px 0; border-left: 4px solid transparent;
          color: #1e293b; font-weight: 500; font-size: 14px;
          text-decoration: none; cursor: pointer; transition: all 0.2s;
          background: transparent; border-top: none; border-right: none; border-bottom: none; width: 100%; text-align: left;
        }
        .sidebar-link:hover { background: #f1f5f9; }
        .sidebar-link.active {
          background: #ecfdf5; color: #059669; border-left-color: #10b981; font-weight: 600;
        }
        .btn-primary {
          background: #10b981; color: #fff; border: none; border-radius: 8px;
          padding: 10px 20px; font-weight: 600; font-size: 13px; cursor: pointer; transition: background 0.2s;
        }
        .btn-primary:hover:not(:disabled) { background: #059669; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-secondary {
          background: #fff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 8px;
          padding: 10px 20px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover { background: #f8fafc; border-color: #cbd5e1; }
        input:focus, select:focus, textarea:focus { border-color: #10b981 !important; }
      `}</style>

      {/* --- SIDEBAR --- */}
      <aside style={{ width: 260, background: "#fff", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#10b981", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚙️</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", lineHeight: 1.2 }}>QuizPro</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Admin Console</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: "24px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.05em", padding: "0 24px", marginBottom: 12 }}>WORKSPACE</div>
          {menuItems.map(item => (
            <button key={item.id} className={`sidebar-link ${activeTab === item.id ? "active" : ""}`} onClick={() => { setActiveTab(item.id); setViewingResult(null); setEditingQuiz(null); }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.05em", padding: "0 24px", marginTop: 32, marginBottom: 12 }}>ACCOUNT</div>
          <button onClick={handleLogout} className="sidebar-link" style={{ color: "#ef4444" }}>
            <span style={{ fontSize: 18 }}>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>
        
        <header style={{ height: 64, background: "#fff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#0f172a", fontWeight: 600, fontSize: 14 }}>
            <span>Admin</span>
            <span style={{ color: "#94a3b8" }}>/</span>
            <span style={{ color: "#10b981" }}>{menuItems.find(m => m.id === activeTab)?.label}</span>
          </div>
        </header>

        <div style={{ padding: "32px", overflowY: "auto", flex: 1 }}>
          
          {/* TOAST NOTIFICATIONS */}
          <div style={{ position: "fixed", top: 80, right: 32, zIndex: 100, display: "flex", flexDirection: "column", gap: 10 }}>
            {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 12px rgba(239,68,68,0.15)" }}>❌ {error}</div>}
            {success && <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 12px rgba(16,185,129,0.15)" }}>✅ {success}</div>}
          </div>

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && !viewingResult && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Dashboard Overview</h1>
                <p style={{ fontSize: 14, color: "#64748b" }}>Monitor quiz performance and identify which questions students got wrong.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 32 }}>
                <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👥</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 4, lineHeight: 1 }}>{results.length}</div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Total Submissions</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📝</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 4, lineHeight: 1 }}>{quizzes.length}</div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Active Quizzes</div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "#fffbeb", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>⭐</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 4, lineHeight: 1 }}>
                    {results.length ? Math.round(results.reduce((a, b) => a + b.percentage, 0) / results.length) : 0}%
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Average Score</div>
                </div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, overflow: "hidden", borderTop: "4px solid #10b981", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Submission History</div>
                  <button onClick={fetchData} style={{ background: "#ecfdf5", color: "#059669", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>↻ Sync</button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>User / ID</th>
                        <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Quiz Title</th>
                        <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Score</th>
                        <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Date</th>
                        <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Type</th>
                        <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.length === 0 ? (
                        <tr><td colSpan="6" style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No recent results</td></tr>
                      ) : (
                        results.map(r => {
                          const noteLabel = (!r.note || r.note.includes("Manual")) ? "Submitted" : r.note.includes("Tab") ? "Tab Violation" : r.note.includes("Time") ? "Time Ended" : r.note;
                          return (
                          <tr key={r._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                            <td style={{ padding: "16px", fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{r.userId?.name || r.userId || "Unknown"}</td>
                            <td style={{ padding: "16px", fontSize: 13, color: "#64748b" }}>{r.quizId?.title || "Unknown Quiz"}</td>
                            <td style={{ padding: "16px", fontSize: 13, color: "#0f172a", fontWeight: 500, whiteSpace: "nowrap" }}>{r.correct} / {r.total} ({Math.round(r.percentage)}%)</td>
                            <td style={{ padding: "16px", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{new Date(r.completedAt).toLocaleString(undefined, {dateStyle: 'short', timeStyle: 'short'})}</td>
                            <td style={{ padding: "16px", fontSize: 12 }}>
                              <span style={{ 
                                background: noteLabel === "Submitted" ? "#ecfdf5" : "#fef2f2", 
                                color: noteLabel === "Submitted" ? "#10b981" : "#ef4444", 
                                padding: "4px 8px", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap" 
                              }}>
                                {noteLabel}
                              </span>
                            </td>
                            <td style={{ padding: "16px" }}>
                              <button onClick={() => setViewingResult(r)} style={{ background: "#eff6ff", color: "#3b82f6", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>View Details</button>
                            </td>
                          </tr>
                        )})
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEWING RESULT DETAILS */}
          {activeTab === "dashboard" && viewingResult && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <button onClick={() => setViewingResult(null)} style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>←</button>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Submission Details</h1>
              </div>

              <div style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 32, marginBottom: 32, borderTop: "4px solid #10b981", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", gap: 40, marginBottom: 32, borderBottom: "1px solid #e2e8f0", paddingBottom: 24 }}>
                  <div><div style={labelStyle}>Student</div><div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{viewingResult.userId?.name}</div></div>
                  <div><div style={labelStyle}>Quiz</div><div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{viewingResult.quizId?.title}</div></div>
                  <div><div style={labelStyle}>Score</div><div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{viewingResult.percentage}%</div></div>
                </div>

                <div style={{ display: "flex", gap: 40, marginBottom: 32, borderBottom: "1px solid #e2e8f0", paddingBottom: 24, background: "#f8fafc", padding: "16px 20px", borderRadius: 8 }}>
                  <div><div style={labelStyle}>Submission Type</div><div style={{ fontSize: 14, fontWeight: 600, color: viewingResult.note?.includes("Auto") ? "#ef4444" : "#10b981" }}>{viewingResult.note || "N/A"}</div></div>
                  <div><div style={labelStyle}>Tab Violations</div><div style={{ fontSize: 14, fontWeight: 600, color: viewingResult.tabViolations > 0 ? "#ef4444" : "#0f172a" }}>{viewingResult.tabViolations || 0} time(s)</div></div>
                  <div><div style={labelStyle}>Time Taken</div><div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{viewingResult.timeTaken ? `${Math.floor(viewingResult.timeTaken / 60)}m ${viewingResult.timeTaken % 60}s` : "N/A"}</div></div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Question Breakdown</h3>
                {viewingResult.detailedAnswers && viewingResult.detailedAnswers.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {viewingResult.detailedAnswers.map((ans, idx) => (
                      <div key={idx} style={{ padding: 16, borderRadius: 8, background: (ans.isCorrect === true) ? "#ecfdf5" : (ans.isCorrect === false ? "#fef2f2" : "#f8fafc"), border: `1px solid ${(ans.isCorrect === true) ? '#a7f3d0' : (ans.isCorrect === false ? '#fecaca' : '#e2e8f0')}` }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Q{idx + 1}: {ans.questionText}</div>
                        {ans.userCode && (
                          <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Student's Code Solution:</div>
                            <pre style={{ background: "#0f172a", color: "#f8fafc", padding: 12, borderRadius: 8, fontSize: 12, overflowX: "auto", fontFamily: "'Fira Code', 'Courier New', monospace" }}>{ans.userCode}</pre>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 20, fontSize: 13, alignItems: "center" }}>
                          {ans.correctAnswer && <div style={{ color: (ans.isCorrect === true) ? "#059669" : "#dc2626" }}><strong>Student Selected:</strong> {ans.selectedOption || "Not Answered"}</div>}
                          {(ans.isCorrect === false && ans.correctAnswer) && <div style={{ color: "#059669" }}><strong>Correct Answer:</strong> {ans.correctAnswer}</div>}
                          
                          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                            <button onClick={() => handleUpdateGrade(viewingResult._id, ans.questionId, true)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #10b981", background: ans.isCorrect === true ? "#10b981" : "transparent", color: ans.isCorrect === true ? "#fff" : "#10b981", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>✓ Correct</button>
                            <button onClick={() => handleUpdateGrade(viewingResult._id, ans.questionId, false)} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #ef4444", background: ans.isCorrect === false ? "#ef4444" : "transparent", color: ans.isCorrect === false ? "#fff" : "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>✕ Incorrect</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#64748b", fontSize: 14 }}>No detailed question breakdown available for this submission.</p>
                )}
              </div>
            </div>
          )}

          {/* QUIZZES TAB (List View) */}
          {activeTab === "quizzes" && !editingQuiz && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Manage Quizzes</h1>
                  <p style={{ fontSize: 14, color: "#64748b" }}>Create and edit quizzes in one unified place.</p>
                </div>
                <button onClick={openBuilderForNew} className="btn-primary" style={{ padding: "12px 24px", fontSize: 14 }}>
                  + Create New Quiz
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                {quizzes.map(q => (
                  <div key={q._id} style={{ background: "#fff", border: "1px solid #f1f5f9", borderRadius: 12, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{q.head || "General"} &gt; {q.category || "Uncategorized"}</div>
                        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{q.title}</h4>
                      </div>
                      {q.status && (
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: q.status === "Open" ? "#ecfdf5" : "#fef2f2", color: q.status === "Open" ? "#059669" : "#dc2626", flexShrink: 0 }}>
                          {q.status}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 16, borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                      <div>
                        <div style={labelStyle}>Questions Added</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{q.numberOfQuestions || 0}</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={labelStyle}>Time Limit</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{q.timeLimit} mins</div>
                      </div>
                      <button onClick={() => openBuilderForExisting(q)} className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }}>
                        Edit Quiz
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUIZ BUILDER VIEW */}
          {activeTab === "quizzes" && editingQuiz && (
            <div style={{ paddingBottom: 60 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <button onClick={closeBuilder} style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>←</button>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                    {editingQuiz._id ? "Quiz Builder" : "Create New Quiz"}
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748b" }}>Configure settings and automatically save questions as you add them.</p>
                </div>
              </div>

              {/* 1. Quiz Settings Section */}
              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 32, marginBottom: 32, borderTop: "4px solid #10b981", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>1. Quiz Settings</h3>
                  {editingQuiz._id && (
                    <button 
                      onClick={handleToggleStatus} 
                      style={{ 
                        background: editingQuiz.status === "Closed" ? "#10b981" : "#ef4444", 
                        color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", 
                        fontSize: 12, fontWeight: 600, cursor: "pointer" 
                      }}
                    >
                      {editingQuiz.status === "Closed" ? "Re-open Quiz" : "Close Quiz"}
                    </button>
                  )}
                </div>
                <form onSubmit={handleSaveQuizSettings} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <label style={labelStyle}>Head (e.g. Google Hiring, Midterm)</label>
                    <input type="text" value={editingQuiz.head || ""} onChange={e => setEditingQuiz({...editingQuiz, head: e.target.value})} style={inputStyle} placeholder="Who is this quiz for? (Event/Org)..." required />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select value={editingQuiz.category || ""} onChange={e => setEditingQuiz({...editingQuiz, category: e.target.value})} style={{...inputStyle, cursor: "pointer"}} required>
                      <option value="" disabled>-- Select Category --</option>
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
                    <label style={labelStyle}>Quiz Title (e.g. Final Evaluation)</label>
                    <input type="text" value={editingQuiz.title || ""} onChange={e => setEditingQuiz({...editingQuiz, title: e.target.value})} style={inputStyle} placeholder="Title of this quiz..." required />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Time Limit (Minutes)</label>
                    <input type="number" min="1" value={editingQuiz.timeLimit || 5} onChange={e => setEditingQuiz({...editingQuiz, timeLimit: parseInt(e.target.value)})} style={{...inputStyle, width: "50%"}} required />
                  </div>
                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? "Saving..." : editingQuiz._id ? "Update Settings" : "Save Settings to Start Adding Questions"}
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. Questions Builder Section */}
              {editingQuiz._id && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: 24, alignItems: "start", marginBottom: 32 }}>
                  
                  {/* Add Question Form */}
                  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 32, borderTop: "4px solid #3b82f6", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>2. Add New Question</h3>
                    
                    {editingQuiz.status === "Closed" ? (
                      <div style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: 20, borderRadius: 8, textAlign: "center", fontWeight: 600, fontSize: 13 }}>
                        This quiz is currently closed. You cannot add new questions.
                      </div>
                    ) : (
                      <form onSubmit={handleAddQuestion} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <label style={labelStyle}>Difficulty Level</label>
                            <select value={questionData.difficulty} onChange={e => setQuestionData({...questionData, difficulty: e.target.value})} style={inputStyle} required>
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                              <option value="Logical">Logical (Full Hardcore)</option>
                            </select>
                          </div>
                          <div>
                            <label style={labelStyle}>Question Category (e.g. Node.js)</label>
                            <input type="text" value={questionData.questionCategory} onChange={e => setQuestionData({...questionData, questionCategory: e.target.value})} style={inputStyle} placeholder="Specific topic..." required />
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: questionData.isLogical ? "#eff6ff" : "#f8fafc", border: `1px solid ${questionData.isLogical ? "#bfdbfe" : "#e2e8f0"}`, borderRadius: 8 }}>
                          <input 
                            type="checkbox" 
                            id="isLogical"
                            checked={questionData.isLogical}
                            onChange={e => setQuestionData({...questionData, isLogical: e.target.checked})}
                            style={{ width: 18, height: 18, accentColor: "#3b82f6", cursor: "pointer" }}
                          />
                          <label htmlFor="isLogical" style={{ cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#1e293b", userSelect: "none" }}>
                            Is this a Logical/Coding Question?
                            <span style={{ display: "block", fontSize: 12, fontWeight: 400, color: "#64748b", marginTop: 2 }}>
                              If checked, students will see a code editor. Options and Correct Answer become optional (leave blank for pure coding questions, or fill them for hybrid questions).
                            </span>
                          </label>
                        </div>

                        <div>
                          <label style={labelStyle}>Question Text</label>
                          <textarea 
                            value={questionData.questionText} 
                            onChange={e => setQuestionData({...questionData, questionText: e.target.value})} 
                            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} 
                            placeholder="Type your logical or hard question here..." 
                            required 
                          />
                        </div>

                        {questionData.isLogical && (
                          <div style={{ background: "#f8fafc", padding: 16, borderRadius: 8, border: "1px dashed #cbd5e1" }}>
                            <div style={{ marginBottom: 16 }}>
                              <label style={labelStyle}>Function Name <span style={{color:"#ef4444"}}>*</span></label>
                              <input 
                                type="text" 
                                value={questionData.functionName} 
                                onChange={e => setQuestionData({...questionData, functionName: e.target.value})} 
                                style={inputStyle} 
                                placeholder="e.g. solve" 
                                required={questionData.isLogical} 
                              />
                            </div>
                            
                            <label style={{...labelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              Test Cases (Auto-Evaluation)
                              <button 
                                type="button" 
                                onClick={() => setQuestionData({...questionData, testCases: [...questionData.testCases, { input: "", expectedOutput: "" }]})}
                                style={{ background: "#10b981", color: "white", border: "none", borderRadius: 4, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
                              >
                                + Add Test Case
                              </button>
                            </label>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                              {questionData.testCases.map((tc, idx) => (
                                <div key={idx} style={{ display: "flex", gap: 8 }}>
                                  <input 
                                    type="text" 
                                    value={tc.input} 
                                    onChange={e => {
                                      const newTc = [...questionData.testCases];
                                      newTc[idx].input = e.target.value;
                                      setQuestionData({...questionData, testCases: newTc});
                                    }} 
                                    style={{...inputStyle, flex: 1}} 
                                    placeholder="Input (e.g. 2, 3)" 
                                    required={questionData.isLogical}
                                  />
                                  <input 
                                    type="text" 
                                    value={tc.expectedOutput} 
                                    onChange={e => {
                                      const newTc = [...questionData.testCases];
                                      newTc[idx].expectedOutput = e.target.value;
                                      setQuestionData({...questionData, testCases: newTc});
                                    }} 
                                    style={{...inputStyle, flex: 1}} 
                                    placeholder="Expected Output (e.g. 5)" 
                                    required={questionData.isLogical}
                                  />
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      const newTc = [...questionData.testCases];
                                      newTc.splice(idx, 1);
                                      setQuestionData({...questionData, testCases: newTc});
                                    }}
                                    style={{ background: "#ef4444", color: "white", border: "none", borderRadius: 4, padding: "0 12px", cursor: "pointer", fontWeight: "bold" }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                              {questionData.testCases.length === 0 && (
                                <p style={{ fontSize: 12, color: "#64748b" }}>Please add at least one test case. Inputs and Outputs must be valid JS expressions.</p>
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <label style={labelStyle}>Options {questionData.isLogical ? "(Optional for Logical)" : "(Fill at least 2)"}</label>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {questionData.options.map((opt, idx) => (
                              <input 
                                key={idx} type="text" value={opt} onChange={e => handleOptionChange(idx, e.target.value)} 
                                style={inputStyle} placeholder={`Option ${idx + 1}`} 
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <label style={labelStyle}>Correct Answer {questionData.isLogical ? "(Optional)" : "(Must match one option exactly)"}</label>
                          <input 
                            type="text" value={questionData.correctAnswer} onChange={e => setQuestionData({...questionData, correctAnswer: e.target.value})} 
                            style={inputStyle} placeholder="Copy & Paste the exact correct option text here" required={!questionData.isLogical} 
                          />
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                          <button type="submit" className="btn-primary" disabled={loading} style={{ background: "#3b82f6" }}>
                            {loading ? "Saving..." : "+ Save Question"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* List of Questions in Quiz */}
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Saved Questions ({quizQuestions.length})</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: "600px", overflowY: "auto", paddingRight: 4 }}>
                      {quizQuestions.length === 0 ? (
                        <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", background: "#fff", borderRadius: 8, border: "1px dashed #cbd5e1" }}>No questions added yet.</div>
                      ) : (
                        quizQuestions.map((q, idx) => (
                          <div key={q._id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                              <span style={{ fontWeight: 600, color: "#0f172a", fontSize: 13 }}>Q{idx + 1}. {q.questionText}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: "#059669", fontWeight: 600, background: "#ecfdf5", padding: "4px 8px", borderRadius: 4 }}>
                                Ans: {q.correctAnswer}
                              </span>
                              <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600, background: "#eff6ff", padding: "4px 8px", borderRadius: 4 }}>
                                {q.difficulty}
                              </span>
                              {q.questionCategory && (
                                <span style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 600, background: "#f5f3ff", padding: "4px 8px", borderRadius: 4 }}>
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
                <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 32, borderTop: "4px solid #f59e0b", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>3. Student Submissions for this Quiz</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "#f8fafc" }}>
                          <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Student Name</th>
                          <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Email</th>
                          <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Score</th>
                          <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Date Completed</th>
                          <th style={{ padding: "14px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.filter(r => r.quizId?._id === editingQuiz._id || r.quizId === editingQuiz._id).length === 0 ? (
                          <tr><td colSpan="5" style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No submissions for this quiz yet.</td></tr>
                        ) : (
                          results.filter(r => r.quizId?._id === editingQuiz._id || r.quizId === editingQuiz._id).map(r => {
                            const noteLabel = (!r.note || r.note.includes("Manual")) ? "Submitted" : r.note.includes("Tab") ? "Tab Violation" : r.note.includes("Time") ? "Time Ended" : r.note;
                            return (
                            <tr key={r._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                              <td style={{ padding: "16px", fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{r.userId?.name || r.userId}</td>
                              <td style={{ padding: "16px", fontSize: 13, color: "#64748b" }}>{r.userId?.email || "N/A"}</td>
                              <td style={{ padding: "16px", fontSize: 13, color: "#0f172a", fontWeight: 500, whiteSpace: "nowrap" }}>{r.correct} / {r.total} ({Math.round(r.percentage)}%)</td>
                              <td style={{ padding: "16px", fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{new Date(r.completedAt).toLocaleString(undefined, {dateStyle: 'short', timeStyle: 'short'})}</td>
                              <td style={{ padding: "16px", fontSize: 12 }}>
                                <span style={{ 
                                  background: noteLabel === "Submitted" ? "#ecfdf5" : "#fef2f2", 
                                  color: noteLabel === "Submitted" ? "#10b981" : "#ef4444", 
                                  padding: "4px 8px", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap" 
                                }}>
                                  {noteLabel}
                                </span>
                              </td>
                            </tr>
                          )})
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
