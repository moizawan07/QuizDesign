import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_QUESTIONS, QUIZ_CONFIG } from "../questions";
import { shuffleArray, formatTime } from "../helpers";
import { quizAPI } from "../utils/api";

const TOTAL_SECONDS = QUIZ_CONFIG.TIMER_MINUTES * 60;

export default function QuizScreen({ user, onSubmitComplete }) {
  // Filter questions by professional field
  const filteredQuestions = ALL_QUESTIONS.filter(q => 
    !q.professional || q.professional === user.professional
  );
  
  const [questions] = useState(() => shuffleArray(filteredQuestions));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});    // { questionId: selectedOption }
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg]   = useState("");
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [result, setResult]           = useState(null);
  const timerRef = useRef(null);

  // ─── Tab Switch Detection ───────────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !submitted) {
        setTabWarnings(w => {
          const next = w + 1;
          setWarningMsg(`⚠️ Tab switch detected! Warning ${next}/3. Quiz will auto-submit on 3rd violation.`);
          setShowWarning(true);
          if (next >= 3) {
            setTimeout(() => handleSubmit(true), 1500);
          }
          return next;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [submitted]);

  // ─── Disable Copy/Paste/Right-Click ────────────────────────────
  useEffect(() => {
    const block = e => e.preventDefault();
    document.addEventListener("copy",        block);
    document.addEventListener("paste",       block);
    document.addEventListener("cut",         block);
    document.addEventListener("contextmenu", block);
    return () => {
      document.removeEventListener("copy",        block);
      document.removeEventListener("paste",       block);
      document.removeEventListener("cut",         block);
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  // ─── Timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(false, true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitted]);

  // ─── Calculate Result ───────────────────────────────────────────
  const calcResult = useCallback((ans) => {
    let correct = 0, wrong = 0, unattempted = 0;
    questions.forEach(q => {
      if (!ans[q.id]) {
        unattempted++;
      } else if (ans[q.id] === q.answer) {
        correct++;
      } else {
        wrong++;
      }
    });
    return { correct, wrong, unattempted, total: questions.length, percentage: Math.round((correct / questions.length) * 100) };
  }, [questions]);

  // ─── Submit ─────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (forcedByViolation = false, timedOut = false) => {
    if (submitted || submitting) return;
    clearInterval(timerRef.current);
    setSubmitting(true);

    const finalAnswers = answers;
    const res = calcResult(finalAnswers);
    setResult(res);
    const completedAt = new Date();
    const timeTakenSeconds = TOTAL_SECONDS - timeLeft;

    const payload = {
      correct:      res.correct,
      wrong:        res.wrong,
      unattempted:  res.unattempted,
      total:        res.total,
      percentage:   res.percentage,
      completedAt:  completedAt.toISOString(),
      timeTaken:    timeTakenSeconds,
      note:         forcedByViolation ? "Auto-submitted: Tab violation" : timedOut ? "Auto-submitted: Time expired" : "Manual submit",
    };

    try {
      await quizAPI.submitQuiz(payload);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }

    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => onSubmitComplete(res, user), 300);
  }, [submitted, submitting, answers, calcResult, user, onSubmitComplete, timeLeft]);

  if (submitting) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
        <div style={{ width: 56, height: 56, border: "4px solid var(--color-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 20 }} />
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--color-primary)" }}>Submitting your quiz...</p>
        <p style={{ color: "var(--color-text-muted)", fontSize: 13, marginTop: 8 }}>Please wait, do not close this window.</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const isUrgent = timeLeft <= 120;
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)", fontFamily: "var(--font-body)" }}>
      {/* Tab Warning Toast */}
      {showWarning && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          background: "var(--color-danger)", color: "#fff",
          padding: "12px 24px", borderRadius: 50,
          fontWeight: 600, fontSize: 13, zIndex: 999,
          boxShadow: "0 4px 20px rgba(220,38,38,0.4)",
          display: "flex", alignItems: "center", gap: 8,
          animation: "fadeIn 0.3s ease"
        }}>
          {warningMsg}
          <button onClick={() => setShowWarning(false)}
            style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 12 }}>
            OK
          </button>
        </div>
      )}

      {/* Top Bar */}
      <header style={{
        background: "var(--color-primary)",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "var(--shadow-md)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        {/* Left: Quiz title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>📝</span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#fff" }}>
              Web Tech Quiz
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
              {user.name}
            </div>
          </div>
        </div>

        {/* Center: Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, maxWidth: 300, margin: "0 24px" }}>
          <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--color-accent)", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>
            {current + 1}/{questions.length}
          </span>
        </div>

        {/* Right: Timer */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: isUrgent ? "var(--color-danger)" : "rgba(255,255,255,0.12)",
          padding: "6px 14px", borderRadius: 24,
          transition: "background 0.3s"
        }} className={isUrgent ? "timer-urgent" : ""}>
          <span style={{ fontSize: 14 }}>⏱</span>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16,
            color: "#fff", letterSpacing: 1
          }}>{formatTime(timeLeft)}</span>
        </div>
      </header>

      <div style={{ flex: 1, maxWidth: 860, width: "100%", margin: "0 auto", padding: "24px 16px", display: "flex", gap: 20 }}>
        {/* Question Panel */}
        <main style={{ flex: 1 }}>
          <div key={q.id} className="fade-in" style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden"
          }}>
            {/* Question Header */}
            <div style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)",
              padding: "24px 28px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{
                  background: "var(--color-accent)",
                  color: "#fff",
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 13,
                  padding: "3px 12px",
                  borderRadius: 20
                }}>Q{current + 1}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                  1 Mark
                </span>
              </div>
              <p style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(15px, 2.5vw, 18px)",
                color: "#fff",
                lineHeight: 1.5
              }}>{q.question}</p>
            </div>

            {/* Options */}
            <div style={{ padding: "24px 28px" }}>
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === opt;
                const letter = ["A", "B", "C", "D"][i];
                return (
                  <button key={i} onClick={() => setAnswers(p => ({ ...p, [q.id]: opt }))}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      padding: "14px 18px",
                      marginBottom: 10,
                      borderRadius: "var(--radius-md)",
                      border: `2px solid ${selected ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: selected ? "rgba(26,58,92,0.06)" : "var(--color-surface-2)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      transform: selected ? "translateX(4px)" : "translateX(0)"
                    }}
                    onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = "var(--color-primary-light)"; e.currentTarget.style.background = "#fff"; } }}
                    onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.background = "var(--color-surface-2)"; } }}
                  >
                    <span style={{
                      minWidth: 28, height: 28,
                      borderRadius: 8,
                      background: selected ? "var(--color-primary)" : "var(--color-border)",
                      color: selected ? "#fff" : "var(--color-text-muted)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 12,
                      transition: "all 0.15s"
                    }}>{letter}</span>
                    <span style={{ fontSize: 14, color: "var(--color-text)", lineHeight: 1.5, paddingTop: 4, flex: 1 }}>
                      {opt}
                    </span>
                    {selected && <span style={{ color: "var(--color-primary)", fontSize: 16, marginTop: 4 }}>✓</span>}
                  </button>
                );
              })}

              {/* Nav Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
                  style={{
                    padding: "10px 22px", borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--color-border)",
                    background: "var(--color-surface)",
                    fontSize: 13, fontWeight: 600, color: "var(--color-text-muted)",
                    cursor: current === 0 ? "not-allowed" : "pointer",
                    opacity: current === 0 ? 0.4 : 1,
                    transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 6
                  }}>← Previous</button>

                {current < questions.length - 1 ? (
                  <button onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                    style={{
                      padding: "10px 22px", borderRadius: "var(--radius-md)",
                      border: "none",
                      background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)",
                      fontSize: 13, fontWeight: 600, color: "#fff",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 6
                    }}>Next →</button>
                ) : (
                  <button onClick={() => handleSubmit()}
                    style={{
                      padding: "10px 24px", borderRadius: "var(--radius-md)",
                      border: "none",
                      background: "linear-gradient(135deg, var(--color-success) 0%, #15803d 100%)",
                      fontSize: 13, fontWeight: 700, color: "#fff",
                      cursor: "pointer",
                      fontFamily: "var(--font-display)",
                      display: "flex", alignItems: "center", gap: 6,
                      boxShadow: "0 4px 16px rgba(22,163,74,0.35)"
                    }}>✓ Submit Quiz</button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar: Question Navigator */}
        <aside style={{ width: 220, flexShrink: 0 }}>
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            padding: 20,
            boxShadow: "var(--shadow-md)",
            position: "sticky", top: 76
          }}>
            {/* Stats */}
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--color-primary)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.8 }}>
                Progress
              </h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                {[
                  { label: "Answered", val: answered, color: "var(--color-success)" },
                  { label: "Remaining", val: questions.length - answered, color: "var(--color-text-muted)" },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, minWidth: 70, padding: "8px 10px", background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-light)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {[
                { color: "var(--color-primary)", label: "Current" },
                { color: "var(--color-success)", label: "Answered" },
                { color: "var(--color-border)", label: "Pending" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                  <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Grid Navigator */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 5 }}>
              {questions.map((q2, i) => {
                const isAnswered = !!answers[q2.id];
                const isCurrent = i === current;
                return (
                  <button key={q2.id} onClick={() => setCurrent(i)}
                    style={{
                      width: "100%", aspectRatio: "1",
                      borderRadius: 6,
                      border: isCurrent ? "2px solid var(--color-primary)" : "1.5px solid transparent",
                      background: isCurrent
                        ? "var(--color-primary)"
                        : isAnswered
                          ? "var(--color-success)"
                          : "var(--color-surface-2)",
                      color: (isCurrent || isAnswered) ? "#fff" : "var(--color-text-muted)",
                      fontSize: 11, fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}>{i + 1}</button>
                );
              })}
            </div>

            {/* Final Submit */}
            <button onClick={() => handleSubmit()}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "11px",
                background: "linear-gradient(135deg, var(--color-success) 0%, #15803d 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: 13,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(22,163,74,0.3)"
              }}>
              ✓ Submit Quiz
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
