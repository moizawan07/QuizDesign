

import { useEffect, useState, useRef } from "react";
import { useGetAvailableQuizzesQuery, useGetMyAttemptsQuery, useGetMyReattemptsQuery, useRequestReattemptMutation } from "../store/apiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import RulesAcknowledgeTour from "./RulesAcknowledgeTour";
 
const rules = [
  { icon: "🚫", title: "No AI Tools", desc: "Use of ChatGPT, Claude, or any AI assistant is strictly prohibited." },
  { icon: "📋", title: "No Copy-Paste", desc: "Copying or pasting text from any external source is disabled." },
  { icon: "🔒", title: "Stay on Tab", desc: "Switching browser tabs will be detected and recorded as a violation." },
  { icon: "⏱️", title: `${QUIZ_CONFIG.TIMER_MINUTES}-Minute Limit`, desc: "The quiz auto-submits when the timer runs out." },
  { icon: "✅", title: "1 Mark Per Question", desc: "Each correct answer carries 1 mark. No negative marking." },
  { icon: "📵", title: "No External Help", desc: "No textbooks, notes, or peer assistance allowed during the quiz." },
];
 
export default function HomeScreen({ onStart, user }) {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState([]);
  const [msg, setMsg] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const ruleRefs = useRef([]);
 
  const [quizSearch, setQuizSearch] = useState("");
  const { data: quizzesData } = useGetAvailableQuizzesQuery({ limit: 100, search: quizSearch }, { skip: !user });
  const { data: attemptsData, isLoading: loadingAttempts } = useGetMyAttemptsQuery({ limit: 100 }, { skip: !user });
  const { data: reattemptsData } = useGetMyReattemptsQuery({ limit: 100 }, { skip: !user });
  const [requestReattempt, { isLoading: isRequesting }] = useRequestReattemptMutation();
 
  const [showReattemptForm, setShowReattemptForm] = useState(false);
  const [reattemptReason, setReattemptReason] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState(localStorage.getItem("selectedQuizId") || "");
 
  const quizzes = quizzesData?.quizzes || [];
  const attempts = attemptsData?.attempts || [];
  const reattempts = reattemptsData?.data || [];
  const attemptedQuizIds = attempts.map(a => typeof a.quizId === 'object' ? a.quizId?._id : a.quizId);
 
  const selectedQuiz = quizzes.find(q => q._id === selectedQuizId);
  const existingReq = reattempts.find(r => r.quizId?._id === selectedQuizId || r.quizId === selectedQuizId);
  
  const attemptsForSelected = attempts.filter(a => (typeof a.quizId === 'object' ? a.quizId?._id : a.quizId) === selectedQuizId).length;
  const hasUnusedApprovedReattempt = existingReq && existingReq.status === "Approved" && attemptsForSelected === 1;
  const alreadyAttempted = attemptedQuizIds.includes(selectedQuizId) && !hasUnusedApprovedReattempt;
  
  const quizClosed = selectedQuiz && selectedQuiz.status === "Closed";
 
  // Derive what the status zone should show (outside the card)
  const getStatusInfo = () => {
    if (!selectedQuizId) return null;
 
    if (existingReq) {
      if (existingReq.status === "Pending")
        return { bg: "#fffbeb", border: "#fde68a", color: "#92400e", text: <>⏳ <strong>Request Pending.</strong> Admin is reviewing your re-attempt request.</> };
      if (existingReq.status === "Rejected")
        return { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c", text: <>❌ <strong>Request Denied.</strong> Your re-attempt request was rejected by the admin.</> };
      if (existingReq.status === "Approved") {
        if (attemptsForSelected >= 2) {
          return { bg: "#f8fafc", border: "#e2e8f0", color: "#475569", text: <>⚠️ <strong>Attempts Exhausted.</strong> You have already used your approved re-attempt for this quiz.</> };
        } else {
          return { bg: "#ecfdf5", border: "#a7f3d0", color: "#065f46", text: <>✅ <strong>Re-attempt Approved!</strong> You can now take the quiz again.</> };
        }
      }
    }
 
    if (alreadyAttempted && quizClosed)
      return { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c", text: <>❌ <strong>Quiz Closed.</strong> This quiz is currently closed and not accepting any re-attempts.</> };
 
    if (!alreadyAttempted && quizClosed)
      return { bg: "#fef2f2", border: "#fecaca", color: "#b91c1c", text: <>❌ <strong>Quiz Closed.</strong> This quiz is currently closed and not accepting any attempts.</> };
 
    return null;
  };
 
  const statusInfo = getStatusInfo();
 
  // What to show inside the card action area
  const getCardAction = () => {
    if (!selectedQuizId) return null;
 
    // If there's a status message, show nothing in card (unless it's an approved reattempt)
    if (statusInfo && !hasUnusedApprovedReattempt) return null;
 
    // Already attempted — show reattempt flow
    if (alreadyAttempted) {
      if (showReattemptForm) {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <textarea
              placeholder="Please explain why you need a re-attempt..."
              value={reattemptReason}
              onChange={(e) => setReattemptReason(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, minHeight: 80, fontFamily: "'Poppins', sans-serif" }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowReattemptForm(false)} style={{ flex: 1, padding: "10px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleRequestReattemptSubmit} disabled={isRequesting || !reattemptReason.trim()} style={{ flex: 1, padding: "10px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: !reattemptReason.trim() ? "not-allowed" : "pointer", opacity: !reattemptReason.trim() ? 0.6 : 1 }}>
                {isRequesting ? "Submitting..." : "Send Request"}
              </button>
            </div>
          </div>
        );
      }
      return (
        <button onClick={() => setShowReattemptForm(true)} style={{
          width: "100%", padding: "14px 0",
          background: "#fff", color: "#10b981", border: "1.5px solid #10b981", borderRadius: 8,
          fontSize: 14, fontWeight: 600, fontFamily: "'Poppins', sans-serif",
          cursor: "pointer", transition: "all 0.2s"
        }}>
          Request Re-attempt
        </button>
      );
    }
 
    // Normal begin button
    return (
      <button className="cta-btn" onClick={handleStart} disabled={!acknowledged} style={{
        width: "100%", padding: "14px 0",
        background: acknowledged ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#cbd5e1",
        color: acknowledged ? "#fff" : "#94a3b8", border: "none", borderRadius: 8,
        fontSize: 15, fontWeight: 700, fontFamily: "'Poppins', sans-serif",
        cursor: acknowledged ? "pointer" : "not-allowed", letterSpacing: "0.02em",
        boxShadow: acknowledged ? "0 8px 28px rgba(16,185,129,0.28)" : "none",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        transition: "all 0.3s ease"
      }}>
        <span style={{ fontSize: 16, filter: acknowledged ? "none" : "grayscale(100%) opacity(0.5)" }}>🚀</span>
        Begin Quiz Now
      </button>
    );
  };
 
  const handleSelectQuiz = (e) => {
    const val = e.target.value;
    localStorage.setItem("selectedQuizId", val);
    setSelectedQuizId(val);
    setShowReattemptForm(false);
    setReattemptReason("");
    setMsg("");
 
    if (loadingAttempts) return;
    if (attemptedQuizIds.includes(val)) { setShowTour(false); setAcknowledged(false); return; }
    const q = quizzes.find(q => q._id === val);
    if (q && q.status === "Closed") { setShowTour(false); setAcknowledged(false); return; }
    if (!acknowledged && val) setShowTour(true);
  };
 
  const handleRequestReattemptSubmit = async () => {
    if (!selectedQuizId || !reattemptReason.trim()) return;
    try {
      await requestReattempt({ quizId: selectedQuizId, reason: reattemptReason }).unwrap();
      setShowReattemptForm(false);
      setReattemptReason("");
      setMsg("✅ Request submitted to admin successfully.");
    } catch (err) {
      setMsg(`❌ ${err?.data?.message || "Failed to submit request"}`);
    }
  };
 
  const handleStart = () => {
    if (user) {
      if (!selectedQuizId) { setMsg("❌ Please select a quiz from the dropdown first."); return; }
      if (alreadyAttempted) { setMsg("❌ You already gave this quiz, contact admin."); return; }
      if (quizClosed) return;
      if (!acknowledged) { setMsg(""); setShowTour(true); return; }
    }
    onStart();
  };
 
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("selectedQuizId");
    setSelectedQuizId("");
    localStorage.removeItem("quiz_attempted");
    setAcknowledged(false);
    setMsg("");
  };
 
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    const t1 = setTimeout(() => setMounted(true), 80);
    rules.forEach((_, i) => {
      setTimeout(() => setShown(p => [...p, i]), 400 + i * 100);
    });
    return () => { clearTimeout(t1); document.head.removeChild(link); };
  }, []);
 
  return (
    <>
      {showTour && (
        <RulesAcknowledgeTour
          ruleElements={ruleRefs.current}
          onComplete={() => { setShowTour(false); setAcknowledged(true); }}
        />
      )}
      <div style={{
        minHeight: "100vh", width: "100%",
        fontFamily: "'Poppins', sans-serif",
        background: "#ffffff",
        display: "flex", flexDirection: "column",
        position: "relative", overflowX: "hidden", overflowY: "auto",
      }}>
        <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeLeft {
          from { opacity: 0; transform: translateX(22px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(0.65); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 4px 18px rgba(16,185,129,0.3); }
          50%       { box-shadow: 0 4px 28px rgba(16,185,129,0.55); }
        }
 
        .rule-card {
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.45s ease, transform 0.45s ease, border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .rule-card.vis { opacity: 1; transform: translateY(0); }
        .rule-card:hover { border-color: rgba(16,185,129,0.5) !important; background: rgba(16,185,129,0.04) !important; box-shadow: 0 4px 20px rgba(16,185,129,0.1); }
        .cta-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); position: relative; overflow: hidden; }
        .cta-btn:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 20px 50px rgba(16,185,129,0.35) !important; }
        .cta-btn:active { transform: scale(0.97); }
        .cta-btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transition: left 0.55s ease; }
        .cta-btn:hover::before { left: 160%; }
        `}</style>
 
        {/* BG DECORATION */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -140, right: -140, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 68%)" }} />
          <div style={{ position: "absolute", bottom: -100, left: -100, width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 68%)" }} />
          <div style={{ position: "absolute", top: "10%", right: "5%", width: 220, height: 220, border: "1px solid rgba(16,185,129,0.12)", borderRadius: "50%", animation: "rotateSlow 20s linear infinite" }}>
            <div style={{ position: "absolute", top: -4, left: "50%", width: 8, height: 8, borderRadius: "50%", background: "#10b981", marginLeft: -4, boxShadow: "0 0 10px rgba(16,185,129,0.7)" }} />
          </div>
          <div style={{ position: "absolute", top: "10%", right: "5%", width: 140, height: 140, border: "1px solid rgba(16,185,129,0.07)", borderRadius: "50%", marginTop: 40, marginRight: 40, animation: "rotateSlow 14s linear infinite reverse" }} />
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
            <defs><pattern id="dotgrid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.2" fill="#10b981" fillOpacity="0.12" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#dotgrid)" />
          </svg>
          <div style={{ position: "absolute", top: 0, left: "42%", width: 1, height: "100%", background: "linear-gradient(180deg, transparent, rgba(16,185,129,0.06) 30%, rgba(16,185,129,0.06) 70%, transparent)" }} />
        </div>
 
        {/* HEADER */}
        <header style={{ position: "relative", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 52px", height: 85, borderBottom: "1px solid rgba(0,0,0,0.07)", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", animation: mounted ? "fadeUp 0.5s ease both" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img src="/logo.png" alt="Logo" style={{ height: 32, width: "auto", objectFit: "contain", display: "block", borderRadius: 6 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a", letterSpacing: "0.01em" }}>QuizPro</div>
              <div style={{ fontWeight: 400, fontSize: 11, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase" }}>Assessment Platform</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff", boxShadow: "0 2px 10px rgba(16,185,129,0.35)" }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{user.name}</span>
                <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", marginLeft: 8 }}>Logout</button>
              </div>
            )}
          </div>
        </header>
 
        {/* MAIN */}
        <main style={{ flex: 1, position: "relative", zIndex: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, width: "100%", margin: "0 auto", padding: "0 95px", minHeight: "calc(100vh - 85px - 55px)", alignItems: "stretch" }}>
 
          {/* LEFT */}
          <div style={{ paddingRight: 56, animation: mounted ? "fadeUp 0.65s ease 0.1s both" : "none", alignSelf: "flex-start", marginTop: "clamp(40px, 15vh, 120px)" }}>
 
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: 8, padding: "6px 16px", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", letterSpacing: "0.14em", textTransform: "uppercase" }}>Quiz Assessment</span>
            </div>
 
            <h1 style={{ fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.08, marginBottom: 20, letterSpacing: "-0.02em" }}>
              Ready to test<br />
              your{" "}
              <span style={{ position: "relative", display: "inline-block", color: "#10b981" }}>
                knowledge?
                <span style={{ position: "absolute", bottom: -4, left: 0, right: 0, height: 5, background: "linear-gradient(90deg, #10b981, transparent)", borderRadius: 3 }} />
              </span>
            </h1>
 
            <p style={{ fontSize: 14, fontWeight: 400, color: "#64748b", lineHeight: 1.85, marginBottom: 30, maxWidth: 380 }}>
              A timed, proctored quiz to assess your understanding. Answer carefully — every mark counts. Good luck!
            </p>

            {/* Main Action Card */}
            {user ? (
              <div style={{
                background: "#ffffff",
                padding: 32,
                borderRadius: 20,
                border: "1px solid rgba(16,185,129,0.15)",
                marginBottom: 20,
                boxShadow: "0 20px 40px -15px rgba(16,185,129,0.1), 0 0 0 1px rgba(16,185,129,0.05)",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #10b981, #34d399)" }} />

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "#ecfdf5", color: "#10b981" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Assessment Module</h3>
                    <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Select your assigned quiz</div>
                  </div>
                </div>

                <select
                  style={{ width: "100%", padding: "16px 20px", borderRadius: 12, border: "2px solid #e2e8f0", fontSize: 15, color: "#0f172a", outline: "none", marginBottom: 20, fontFamily: "'Poppins', sans-serif", backgroundColor: "#f8fafc", transition: "all 0.3s ease", cursor: "pointer", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 16px center", backgroundSize: "18px" }}
                  onChange={handleSelectQuiz}
                  value={selectedQuizId}
                  onFocus={(e) => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 4px rgba(16,185,129,0.1)"; e.target.style.backgroundColor = "#ffffff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.backgroundColor = "#f8fafc"; }}
                >
                  <option value="" disabled> Choose a quiz </option>
                  {quizzes.map(q => (
                    <option key={q._id} value={q._id}>
                      {q.title}
                    </option>
                  ))}
                </select>

                {(() => {
                  if (!selectedQuizId) return null;

                  const selectedQuiz = quizzes.find(q => q._id === selectedQuizId);

                  const existingReq = reattempts.find(r => r.quizId?._id === selectedQuizId || r.quizId === selectedQuizId);
                  if (existingReq) {
                    if (existingReq.status === "Pending") {
                      return (
                        <div style={{ padding: 16, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, marginTop: 16, textAlign: "center", fontSize: 13, color: "#92400e" }}>
                          ⏳ <strong>Request Pending.</strong> Admin is reviewing your re-attempt request.
                        </div>
                      );
                    } else if (existingReq.status === "Rejected") {
                      return (
                        <div style={{ padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, marginTop: 16, textAlign: "center", fontSize: 13, color: "#b91c1c" }}>
                          ❌ <strong>Request Denied.</strong> Your re-attempt request was rejected by the admin.
                        </div>
                      );
                    } else if (existingReq.status === "Approved") {
                      return (
                        <div style={{ padding: 16, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, marginTop: 16, textAlign: "center", fontSize: 13, color: "#475569" }}>
                          ⚠️ <strong>Attempts Exhausted.</strong> You have already used your approved re-attempt for this quiz.
                        </div>
                      );
                    }
                  }

                  if (attemptedQuizIds.includes(selectedQuizId)) {
                    if (selectedQuiz && selectedQuiz.status === "Closed") {
                      return (
                        <div style={{ padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, marginTop: 16, textAlign: "center", fontSize: 13, color: "#b91c1c" }}>
                          ❌ <strong>Quiz Closed.</strong> This quiz is currently closed and not accepting any re-attempts.
                        </div>
                      );
                    }

                    if (showReattemptForm) {
                      return (
                        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                          <textarea
                            placeholder="Please explain why you need a re-attempt..."
                            value={reattemptReason}
                            onChange={(e) => setReattemptReason(e.target.value)}
                            style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, minHeight: 80, fontFamily: "'Poppins', sans-serif" }}
                          />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => setShowReattemptForm(false)} style={{ flex: 1, padding: "10px", background: "#f1f5f9", color: "#475569", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                            <button onClick={handleRequestReattemptSubmit} disabled={isRequesting || !reattemptReason.trim()} style={{ flex: 1, padding: "10px", background: "#10b981", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: !reattemptReason.trim() ? "not-allowed" : "pointer", opacity: !reattemptReason.trim() ? 0.6 : 1 }}>
                              {isRequesting ? "Submitting..." : "Send Request"}
                            </button>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div style={{ marginTop: 16 }}>
                        <div style={{ padding: 12, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, textAlign: "center", fontSize: 12, color: "#64748b", marginBottom: 12 }}>
                          ℹ️ You have already completed this quiz.
                        </div>
                        <button onClick={() => setShowReattemptForm(true)} style={{
                          width: "100%", padding: "14px 0",
                          background: "#fff", color: "#10b981", border: "1.5px solid #10b981", borderRadius: 8,
                          fontSize: 14, fontWeight: 600, fontFamily: "'Poppins', sans-serif",
                          cursor: "pointer", transition: "all 0.2s"
                        }}>
                          Request Re-attempt
                        </button>
                      </div>
                    );
                  }

                  if (selectedQuiz && selectedQuiz.status === "Closed") {
                    return (
                      <div style={{ padding: 16, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, marginTop: 16, textAlign: "center", fontSize: 13, color: "#b91c1c" }}>
                        ❌ <strong>Quiz Closed.</strong> This quiz is currently closed and not accepting any attempts.
                      </div>
                    );
                  }

                  return (
                    <button className="cta-btn" onClick={handleStart} disabled={!acknowledged} style={{
                      width: "100%", padding: "14px 0",
                      background: acknowledged ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "#cbd5e1",
                      color: acknowledged ? "#fff" : "#94a3b8", border: "none", borderRadius: 8,
                      fontSize: 15, fontWeight: 700, fontFamily: "'Poppins', sans-serif",
                      cursor: acknowledged ? "pointer" : "not-allowed", letterSpacing: "0.02em",
                      boxShadow: acknowledged ? "0 8px 28px rgba(16,185,129,0.28)" : "none",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                      transition: "all 0.3s ease"
                    }}>
                      <span style={{ fontSize: 16, filter: acknowledged ? "none" : "grayscale(100%) opacity(0.5)" }}>🚀</span>
                      Begin Quiz Now
                    </button>
                  );
                })()}
              </div>
            ) : (
              <button className="cta-btn" onClick={onStart} style={{
                width: "100%", padding: "17px 0",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff", border: "none", borderRadius: 12,
                fontSize: 16, fontWeight: 700, fontFamily: "'Poppins', sans-serif",
                cursor: "pointer", letterSpacing: "0.02em",
                boxShadow: "0 8px 28px rgba(16,185,129,0.28)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}>
                <span style={{ fontSize: 18 }}>🔐</span>
                Login to Begin
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9h10M10 5l4 4-4 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {msg && (
              <div style={{
                marginTop: 12,
                color: "#ef4444",
                fontSize: 11,
                fontWeight: 600,
                textAlign: "center",
                borderRadius: 4,
                paddingBlock: 5,
                paddingInline: 8,
              }}>
                {msg}
              </div>
            )}
   
              <p style={{ fontSize: 11, fontWeight: 400, color: "#94a3b8", textAlign: "center", marginTop: 6 }}>
                By starting, you agree to abide by all the rules listed.
              </p>
            </div>
          </div>
 
          {/* RIGHT */}
          <div style={{ paddingLeft: 56, animation: mounted ? "fadeLeft 0.65s ease 0.2s both" : "none", alignSelf: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 42, marginTop: "20px" }}>
              <div style={{ width: 3, height: 18, borderRadius: 4, background: "linear-gradient(180deg, #10b981, #6366f1)" }} />
              <h2 style={{ fontWeight: 600, fontSize: 13, color: "#334155", textTransform: "uppercase", letterSpacing: "0.15em" }}>Rules & Instructions</h2>
            </div>
 
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rules.map((rule, i) => (
                <div key={i} ref={(el) => (ruleRefs.current[i] = el)} className={`rule-card${shown.includes(i) ? " vis" : ""}`} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px", display: "flex", gap: 13, alignItems: "center", cursor: "default" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                    {rule.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", marginBottom: 3 }}>{rule.title}</div>
                    <div style={{ fontWeight: 400, fontSize: 11.5, color: "#94a3b8", lineHeight: 1.6 }}>{rule.desc}</div>
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: "#10b981", boxShadow: "0 0 8px rgba(16,185,129,0.5)", animation: "pulseDot 2s ease-in-out infinite", animationDelay: `${i * 0.3}s` }} />
                </div>
              ))}
            </div>
 
            <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fde68a", display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
              <p style={{ fontWeight: 400, fontSize: 12, color: "#92400e", lineHeight: 1.7 }}>
                <strong style={{ fontWeight: 600, color: "#78350f" }}>Warning: </strong>
                Cheating or using unauthorized resources will result in immediate disqualification. All activity is monitored throughout the session.
              </p>
            </div>
          </div>
        </main>
 
        {/* FOOTER */}
        <footer style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: "18px 52px", borderTop: "1px solid rgba(0,0,0,0.06)", fontSize: 12, fontWeight: 400, marginTop: 30, color: "#000", letterSpacing: "0.08em" }}>
          © 2025 QUIZPRO · ALL RIGHTS RESERVED
        </footer>
      </div>
    </>
  );
}
