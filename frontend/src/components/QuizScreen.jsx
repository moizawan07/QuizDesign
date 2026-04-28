import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_QUESTIONS, QUIZ_CONFIG } from "../questions";
import { shuffleArray, formatTime } from "../helpers";
import { quizAPI } from "../utils/api";

const TOTAL_SECONDS = QUIZ_CONFIG.TIMER_MINUTES * 60;

export default function QuizScreen({ user }) {
  const filteredQuestions = ALL_QUESTIONS.filter(
    (q) => !q.professional || q.professional === user.professional,
  );

  const [questions] = useState(() => shuffleArray(filteredQuestions));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);
  const isSubmittingRef = useRef(false);

  // IMPORTANT FIX: useRef to store latest answers for timer
  const answersRef = useRef(answers);

  // Update ref whenever answers change
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ─── Calculate Result ───────────────────────────────────
  const calcResult = useCallback(
    (ans) => {
      let correct = 0;
      let wrong = 0;
      let unattempted = 0;

      questions.forEach((q) => {
        const userAnswer = ans[q.id];

        if (
          userAnswer === undefined ||
          userAnswer === null ||
          userAnswer === ""
        ) {
          unattempted++;
        } else {
          if (userAnswer === q.answer) {
            correct++;
          } else {
            wrong++;
          }
        }
      });

      return {
        correct,
        wrong,
        unattempted,
        total: questions.length,
        percentage: Math.round((correct / questions.length) * 100),
      };
    },
    [questions],
  );

  // ─── Submit Function ──────────────────────────────────────
  const handleSubmit = useCallback(
    async (forcedByViolation = false, timedOut = false) => {
      if (submitting || isSubmittingRef.current || submitted) return;

      clearInterval(timerRef.current);
      isSubmittingRef.current = true;
      setSubmitting(true);

      const finalAnswers = answersRef.current;
      const res = calcResult(finalAnswers);

      const payload = {
        correct: res.correct,
        wrong: res.wrong,
        unattempted: res.unattempted,
        total: res.total,
        percentage: res.percentage,
        completedAt: new Date().toISOString(),
        timeTaken: TOTAL_SECONDS - timeLeft,
        tabViolations: tabWarnings,
        note: forcedByViolation
          ? `DQ: Tab violation (${tabWarnings} times)`
          : timedOut
            ? "DQ: Time expired"
            : "Completed",
      };

      try {
        await quizAPI.submitQuiz(payload);
      } catch (e) {
        console.error(e);
      }

      localStorage.setItem("quiz_attempted", true);

      // Redirect to home
      window.location.replace("/");
    },
    [calcResult, submitting, timeLeft, tabWarnings, submitted],
  );

  // ─── Tab Switch Detection ─────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && !submitted && !submitting) {
        setTabWarnings((prev) => {
          const newCount = prev + 1;

          if (newCount === 1) {
            setShowWarning(true);
            setWarningMsg(
              "⚠️ Warning! Do not switch tabs. Your quiz will be automatically submitted if you switch again.",
            );
            setTimeout(() => {
              setShowWarning(false);
            }, 4000);
            return newCount;
          } else {
            setShowWarning(true);
            setWarningMsg(
              "❌ You switched tabs again! Your quiz has been automatically submitted for integrity reasons.",
            );
            setTimeout(() => {
              handleSubmit(true, false); 
            }, 3000);
            return newCount;
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [submitted, submitting, handleSubmit]);

  // ─── Disable Copy/Paste/Right-Click ──────────────────────
  useEffect(() => {
    const block = (e) => e.preventDefault();
    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("cut", block);
    document.addEventListener("contextmenu", block);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("cut", block);
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  // ─── Timer Effect ─────────────────────────────────────────
  useEffect(() => {
    if (submitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(false, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [submitted, handleSubmit]);

  if (submitting) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            border: "4px solid var(--color-border)",
            borderTopColor: "var(--color-primary)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginBottom: 20,
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 18,
            color: "var(--color-primary)",
          }}
        >
          Submitting your quiz...
        </p>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: 13,
            marginTop: 8,
          }}
        >
          Please wait, do not close this window.
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const isUrgent = timeLeft <= 120;
  const progress = ((current + 1) / questions.length) * 100;
  const isLastQuestion = current === questions.length - 1;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        fontFamily: "'Poppins', sans-serif",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 4px 18px rgba(16,185,129,0.3); }
          50%       { box-shadow: 0 4px 28px rgba(16,185,129,0.55); }
        }

        .option-btn {
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
        }
        .option-btn:hover:not(:disabled) {
          transform: translateX(4px);
          border-color: #10b981 !important;
          background: rgba(16,185,129,0.04) !important;
        }
        .option-btn:active { transform: scale(0.99); }

        .nav-btn {
          transition: all 0.25s ease;
        }
        .nav-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16,185,129,0.25);
        }

        .warning-toast {
          animation: slideIn 0.3s ease;
        }

        @keyframes submitPop {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .submit-appear {
          animation: submitPop 0.3s ease both;
        }
      `}</style>

      {/* ── BG DECORATION ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ── TAB WARNING TOAST ── */}
      {showWarning && (
        <div
          className="warning-toast"
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 13,
            zIndex: 999,
            boxShadow: "0 10px 40px rgba(239,68,68,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {warningMsg}
          {tabWarnings === 1 && (
            <button
              onClick={() => setShowWarning(false)}
              style={{
                background: "rgba(255,255,255,0.25)",
                border: "none",
                color: "#fff",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.4)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.25)")
              }
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {/* ── HEADER ── */}
      <header
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          height: 72,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Logo + User */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              animation: "glowPulse 3s ease-in-out infinite",
            }}
          >
            📝
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#0f172a",
                letterSpacing: "-0.01em",
              }}
            >
              QuizPro
            </div>
            <div
              style={{
                fontWeight: 400,
                fontSize: 10,
                color: "#10b981",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              {user.name}
            </div>
          </div>
        </div>

        {/* Progress + Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 280,
                height: 5,
                borderRadius: 3,
                background: "rgba(16,185,129,0.1)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #10b981, #059669)",
                  transition: "width 0.4s ease",
                  borderRadius: 3,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#10b981",
                whiteSpace: "nowrap",
              }}
            >
              {current + 1}/{questions.length}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: isUrgent
                ? "rgba(239,68,68,0.12)"
                : "rgba(16,185,129,0.1)",
              border: isUrgent
                ? "1px solid rgba(239,68,68,0.3)"
                : "1px solid rgba(16,185,129,0.2)",
              padding: "8px 16px",
              borderRadius: 10,
              transition: "all 0.3s",
            }}
          >
            <span style={{ fontSize: 16 }}>⏱️</span>
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                color: isUrgent ? "#dc2626" : "#10b981",
                letterSpacing: "0.05em",
                animation: isUrgent
                  ? "glowPulse 0.6s ease-in-out infinite"
                  : "none",
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          flex: 1,
          position: "relative",
          zIndex: 10,
          padding: "40px 150px",
        }}
      >
        <div
          style={{
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: 32,
          }}
        >
          {/* ── QUESTION PANEL ── */}
          <div>
            <div
              key={q.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                animation: "fadeUp 0.4s ease",
              }}
            >
              {/* Question Header */}
              <div
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  padding: "32px 36px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.1)",
                  }}
                />
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        padding: "6px 14px",
                        borderRadius: 8,
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      Q{current + 1}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "rgba(255,255,255,0.75)",
                        fontWeight: 500,
                      }}
                    >
                      1 Mark
                    </span>
                  </div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "clamp(18px, 3vw, 22px)",
                      color: "#fff",
                      lineHeight: 1.6,
                    }}
                  >
                    {q.question}
                  </p>
                </div>
              </div>

              {/* Options */}
              <div style={{ padding: "32px 36px" }}>
                <div style={{ marginBottom: 8 }}>
                  {q.options.map((opt, i) => {
                    const selected = answers[q.id] === opt;
                    const letter = ["A", "B", "C", "D"][i];
                    return (
                      <button
                        key={i}
                        className="option-btn"
                        onClick={() => {
                          setAnswers((p) => ({ ...p, [q.id]: opt }));
                          // Auto-advance to next — but NOT on last question
                          if (!isLastQuestion) {
                            setTimeout(() => {
                              setCurrent((c) => c + 1);
                            }, 320);
                          }
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          padding: "16px 18px",
                          marginBottom: 12,
                          borderRadius: 12,
                          border: `2px solid ${selected ? "#10b981" : "#e2e8f0"}`,
                          background: selected
                            ? "rgba(16,185,129,0.08)"
                            : "#f8fafc",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: selected
                              ? "linear-gradient(135deg, #10b981, #059669)"
                              : "#e2e8f0",
                            color: selected ? "#fff" : "#94a3b8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: 13,
                            flexShrink: 0,
                            transition: "all 0.2s",
                          }}
                        >
                          {letter}
                        </div>
                        <span
                          style={{
                            fontSize: 15,
                            color: "#0f172a",
                            fontWeight: selected ? 600 : 400,
                            flex: 1,
                          }}
                        >
                          {opt}
                        </span>
                        {selected && (
                          <span
                            style={{
                              fontSize: 18,
                              color: "#10b981",
                              flexShrink: 0,
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Submit button — appears only on last question after an option is selected */}
                {isLastQuestion && answers[q.id] && (
                  <div
                    className="submit-appear"
                    style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
                  >
                    <button
                      className="nav-btn"
                      onClick={() => handleSubmit()}
                      style={{
                        padding: "13px 32px",
                        borderRadius: 10,
                        border: "none",
                        background:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#fff",
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      ✓ Submit Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <aside style={{ animation: "slideIn 0.5s ease 0.1s both" }}>
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                position: "sticky",
                top: 100,
              }}
            >
              {/* Progress Stats */}
              <div style={{ marginBottom: 24 }}>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#10b981",
                    marginBottom: 14,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  Progress
                </h3>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { label: "Done", val: answered, color: "#10b981" },
                    {
                      label: "Left",
                      val: questions.length - answered,
                      color: "#94a3b8",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        flex: 1,
                        padding: "12px 10px",
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 800,
                          fontSize: 22,
                          color: s.color,
                          lineHeight: 1,
                        }}
                      >
                        {s.val}
                      </div>
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: 10,
                          color: "#94a3b8",
                          marginTop: 6,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Question Navigator — READ ONLY, no onClick */}
              <div style={{ marginBottom: 20 }}>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 11,
                    color: "#64748b",
                    marginBottom: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  Question Guide
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: 6,
                    maxHeight: "290px",
                    overflowY: "auto",
                    paddingRight: "4px",
                    scrollbarWidth: "thin",
                  }}
                >
                  {questions.map((q2, i) => {
                    const isAnswered = !!answers[q2.id];
                    const isCurrent = i === current;
                    return (
                      <div
                        key={q2.id}
                        style={{
                          width: "100%",
                          aspectRatio: "1",
                          borderRadius: 8,
                          border: isCurrent
                            ? "2px solid #10b981"
                            : "1.5px solid #e2e8f0",
                          background: isCurrent
                            ? "linear-gradient(135deg, #10b981, #059669)"
                            : isAnswered
                              ? "rgba(16,185,129,0.15)"
                              : "#f8fafc",
                          color: isCurrent
                            ? "#fff"
                            : isAnswered
                              ? "#10b981"
                              : "#94a3b8",
                          fontSize: 11,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          // No pointer, no click — purely visual
                          cursor: "default",
                          userSelect: "none",
                        }}
                      >
                        {i + 1}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
                  {[
                    { color: "#10b981", label: "Current" },
                    { color: "#10b981", label: "Answered", opacity: 0.3 },
                    { color: "#e2e8f0", label: "Pending" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 3,
                          background: item.color,
                          opacity: item.opacity || 1,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}