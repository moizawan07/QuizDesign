import { QUIZ_CONFIG } from "../questions";
import { useEffect, useState } from "react";

const rules = [
  { icon: "🚫", title: "No AI Tools", desc: "Use of ChatGPT, Claude, or any AI assistant is strictly prohibited." },
  { icon: "📋", title: "No Copy-Paste", desc: "Copying or pasting text from any external source is disabled." },
  { icon: "🔒", title: "Stay on Tab", desc: "Switching browser tabs will be detected and recorded as a violation." },
  { icon: "⏱️", title: `${QUIZ_CONFIG.TIMER_MINUTES}-Minute Limit`, desc: "The quiz auto-submits when the timer runs out." },
  { icon: "✅", title: "1 Mark Per Question", desc: "Each correct answer carries 1 mark. No negative marking." },
  { icon: "📵", title: "No External Help", desc: "No textbooks, notes, or peer assistance allowed during the quiz." },
];

export default function HomeScreen({ onStart, user }) {
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState([]);
  const [msg, setMsg] = useState("");

  const handleStart = () => {
    const attempted = localStorage.getItem("quiz_attempted");

    // if (attempted === "true") {
    //   setMsg("❌ You are not eligible. You have already attempted the quiz.");
    //   return;
    // }

    onStart();
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    const t1 = setTimeout(() => setMounted(true), 80);
    rules.forEach((_, i) => {
      setTimeout(() => setShown(p => [...p, i]), 400 + i * 100);
    });
    return () => { clearTimeout(t1); document.head.removeChild(link); };
  }, []);

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      fontFamily: "'Poppins', sans-serif",
      background: "#ffffff",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
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
        .rule-card:hover {
          border-color: rgba(16,185,129,0.5) !important;
          background: rgba(16,185,129,0.04) !important;
          box-shadow: 0 4px 20px rgba(16,185,129,0.1);
        }
 
        .cta-btn {
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; overflow: hidden;
        }
        .cta-btn:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 20px 50px rgba(16,185,129,0.35) !important;
        }
        .cta-btn:active { transform: scale(0.97); }
        .cta-btn::before {
          content: '';
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transition: left 0.55s ease;
        }
        .cta-btn:hover::before { left: 160%; }
 
        .stat-pill {
          transition: transform 0.2s ease, border-color 0.2s, box-shadow 0.2s;
        }
        .stat-pill:hover {
          transform: translateY(-4px);
          border-color: rgba(16,185,129,0.45) !important;
          box-shadow: 0 8px 24px rgba(16,185,129,0.12);
        }
      `}</style>

      {/* ── BG DECORATION ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>

        {/* Emerald glow top-right */}
        <div style={{
          position: "absolute", top: -140, right: -140,
          width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 68%)",
        }} />

        {/* Light green glow bottom-left */}
        <div style={{
          position: "absolute", bottom: -100, left: -100,
          width: 420, height: 420, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 68%)",
        }} />

        {/* Rotating ring */}
        <div style={{
          position: "absolute", top: "10%", right: "5%",
          width: 220, height: 220,
          border: "1px solid rgba(16,185,129,0.12)",
          borderRadius: "50%",
          animation: "rotateSlow 20s linear infinite",
        }}>
          <div style={{
            position: "absolute", top: -4, left: "50%",
            width: 8, height: 8, borderRadius: "50%",
            background: "#10b981", marginLeft: -4,
            boxShadow: "0 0 10px rgba(16,185,129,0.7)",
          }} />
        </div>
        <div style={{
          position: "absolute", top: "10%", right: "5%",
          width: 140, height: 140,
          border: "1px solid rgba(16,185,129,0.07)",
          borderRadius: "50%",
          marginTop: 40, marginRight: 40,
          animation: "rotateSlow 14s linear infinite reverse",
        }} />

        {/* Dot grid */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.55 }}>
          <defs>
            <pattern id="dotgrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.2" fill="#10b981" fillOpacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotgrid)" />
        </svg>

        {/* Vertical divider hint */}
        <div style={{
          position: "absolute", top: 0, left: "42%",
          width: 1, height: "100%",
          background: "linear-gradient(180deg, transparent, rgba(16,185,129,0.06) 30%, rgba(16,185,129,0.06) 70%, transparent)",
        }} />
      </div>

      {/* ── HEADER ── */}
      <header style={{
        position: "relative", zIndex: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 52px", height: 68,
        borderBottom: "1px solid rgba(0,0,0,0.07)",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        animation: mounted ? "fadeUp 0.5s ease both" : "none",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 19,
            animation: mounted ? "glowPulse 3s ease-in-out infinite" : "none",
          }}>📝</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", letterSpacing: "0.01em" }}>
              QuizPro
            </div>
            <div style={{ fontWeight: 400, fontSize: 10, color: "#94a3b8", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Assessment Platform
            </div>
          </div>
        </div>

        {/* Right: user + badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981, #059669)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14, color: "#fff",
                boxShadow: "0 2px 10px rgba(16,185,129,0.35)",
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>
                {user.name}
              </span>
            </div>
          )}
          <div style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.22)",
            borderRadius: 8, padding: "6px 14px",
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Quiz Mode
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{
        flex: 1, position: "relative", zIndex: 10,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 0,
        maxWidth: 1280, width: "100%",
        margin: "0 auto",
        padding: "52px 52px",
        alignItems: "center",
      }}>

        {/* LEFT */}
        <div style={{
          paddingRight: 56,
          borderRight: "1px solid rgba(0,0,0,0.07)",
          animation: mounted ? "fadeUp 0.65s ease 0.1s both" : "none",
        }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.22)",
            borderRadius: 8, padding: "6px 16px", marginBottom: 28,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#059669", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Quiz Assessment
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 800,
            color: "#0f172a", lineHeight: 1.08, marginBottom: 20,
            letterSpacing: "-0.02em",
          }}>
            Ready to test<br />
            your{" "}
            <span style={{ position: "relative", display: "inline-block", color: "#10b981" }}>
              knowledge?
              <span style={{
                position: "absolute", bottom: -4, left: 0, right: 0, height: 3,
                background: "linear-gradient(90deg, #10b981, transparent)",
                borderRadius: 2,
              }} />
            </span>
          </h1>

          <p style={{
            fontSize: 14, fontWeight: 400,
            color: "#64748b", lineHeight: 1.85, marginBottom: 40,
            maxWidth: 380,
          }}>
            A timed, proctored quiz to assess your understanding. Answer carefully — every mark counts. Good luck!
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 40 }}>
            {[
              { label: "Questions", value: "50" },
              { label: "Minutes", value: `${QUIZ_CONFIG.TIMER_MINUTES}` },
              { label: "Marks", value: "50" },
              { label: "Pass", value: "30" },
            ].map((s, i) => (
              <div key={i} className="stat-pill" style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12, padding: "16px 10px",
                textAlign: "center",
                animation: mounted ? `fadeUp 0.5s ease ${0.25 + i * 0.07}s both` : "none",
              }}>
                <div style={{ fontWeight: 700, fontSize: 26, color: "#10b981", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontWeight: 400, fontSize: 10, color: "#94a3b8", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="cta-btn" onClick={handleStart} style={{
            width: "100%", padding: "17px 0",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff", border: "none", borderRadius: 12,
            fontSize: 16, fontWeight: 700, fontFamily: "'Poppins', sans-serif",
            cursor: "pointer", letterSpacing: "0.02em",
            boxShadow: "0 8px 28px rgba(16,185,129,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <span style={{ fontSize: 18 }}>🚀</span>
            Begin Quiz Now
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9h10M10 5l4 4-4 4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {msg && (
            <div style={{
              marginTop: 12,
              color: "#ef4444",
              fontSize: 13,
              fontWeight: 600,
              textAlign: "center"
            }}>
              {msg}
            </div>
          )}

          <p style={{ marginTop: 16, fontSize: 11, fontWeight: 400, color: "#cbd5e1", textAlign: "center" }}>
            By starting, you agree to abide by all the rules listed.
          </p>
        </div>

        {/* RIGHT */}
        <div style={{
          paddingLeft: 56,
          animation: mounted ? "fadeLeft 0.65s ease 0.2s both" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <div style={{
              width: 3, height: 18, borderRadius: 4,
              background: "linear-gradient(180deg, #10b981, #6366f1)",
            }} />
            <h2 style={{
              fontWeight: 600, fontSize: 13,
              color: "#334155",
              textTransform: "uppercase", letterSpacing: "0.15em",
            }}>
              Rules & Instructions
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rules.map((rule, i) => (
              <div
                key={i}
                className={`rule-card${shown.includes(i) ? " vis" : ""}`}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12, padding: "13px 16px",
                  display: "flex", gap: 13, alignItems: "center",
                  transitionDelay: `${0.3 + i * 0.08}s`,
                  cursor: "default",
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 17,
                }}>
                  {rule.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a", marginBottom: 3 }}>
                    {rule.title}
                  </div>
                  <div style={{ fontWeight: 400, fontSize: 11.5, color: "#94a3b8", lineHeight: 1.6 }}>
                    {rule.desc}
                  </div>
                </div>
                <div style={{
                  width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
                  background: "#10b981",
                  boxShadow: "0 0 8px rgba(16,185,129,0.5)",
                  animation: "pulseDot 2s ease-in-out infinite",
                  animationDelay: `${i * 0.3}s`,
                }} />
              </div>
            ))}
          </div>

          {/* Warning */}
          <div style={{
            marginTop: 14, padding: "14px 16px", borderRadius: 12,
            background: "#fffbeb",
            border: "1px solid #fde68a",
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>⚠️</span>
            <p style={{ fontWeight: 400, fontSize: 12, color: "#92400e", lineHeight: 1.7 }}>
              <strong style={{ fontWeight: 600, color: "#78350f" }}>Warning: </strong>
              Cheating or using unauthorized resources will result in immediate disqualification.
              All activity is monitored throughout the session.
            </p>
          </div>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "18px 52px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        fontSize: 11, fontWeight: 400,
        color: "#cbd5e1", letterSpacing: "0.08em",
      }}>
        © 2025 QUIZPRO · ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}