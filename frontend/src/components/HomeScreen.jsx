import { QUIZ_CONFIG } from "../questions";

const rules = [
  { icon: "🚫", title: "No AI Tools", desc: "Use of ChatGPT, Claude, or any AI assistant is strictly prohibited." },
  { icon: "📋", title: "No Copy-Paste", desc: "Copying or pasting text from any external source is disabled." },
  { icon: "🔒", title: "Stay on Tab", desc: "Switching browser tabs will be detected and recorded as a violation." },
  { icon: "⏱️", title: `${QUIZ_CONFIG.TIMER_MINUTES}-Minute Limit`, desc: "The quiz auto-submits when the timer runs out." },
  { icon: "✅", title: "1 Mark Per Question", desc: "Each correct answer carries 1 mark. No negative marking." },
  { icon: "📵", title: "No External Help", desc: "No textbooks, notes, or peer assistance allowed during the quiz." },
];

export default function HomeScreen({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-body)", background: "var(--color-bg)" }}>
      {/* Header */}
      <header className="fade-in" style={{
        background: "var(--color-primary)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: "var(--shadow-md)"
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "var(--color-accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22
        }}>📝</div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "#fff", letterSpacing: 0.5 }}>
            QuizPro Assessment
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
            Professional Examination System
          </div>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 860, width: "100%", margin: "0 auto", padding: "40px 20px" }}>
        {/* Hero Section */}
        <div className="fade-in" style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          boxShadow: "var(--shadow-lg)",
          marginBottom: 28
        }}>
          {/* Banner */}
          <div style={{
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)",
            padding: "40px 40px 36px",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Decorative circles */}
            <div style={{
              position: "absolute", right: -30, top: -30,
              width: 160, height: 160, borderRadius: "50%",
              background: "rgba(255,255,255,0.05)"
            }} />
            <div style={{
              position: "absolute", right: 40, bottom: -50,
              width: 100, height: 100, borderRadius: "50%",
              background: "rgba(240,165,0,0.12)"
            }} />

            <div style={{ position: "relative" }}>
              <span style={{
                background: "var(--color-accent)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: 20,
                display: "inline-block",
                marginBottom: 14
              }}>Web Development</span>

              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(26px, 4vw, 36px)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.2,
                marginBottom: 12
              }}>
                Web Technologies<br />
                <span style={{ color: "var(--color-accent-light)" }}>Assessment Quiz</span>
              </h1>

              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, maxWidth: 420, lineHeight: 1.6 }}>
                Test your knowledge of HTML, CSS, JavaScript, and modern web frameworks.
                Read all instructions carefully before beginning.
              </p>

              <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
                {[
                  { label: "Questions", value: "50" },
                  { label: "Duration", value: `${QUIZ_CONFIG.TIMER_MINUTES} min` },
                  { label: "Total Marks", value: "50" },
                  { label: "Passing", value: "30" },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--color-accent-light)" }}>
                      {item.value}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 2 }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Instructions Body */}
          <div style={{ padding: "32px 40px 36px" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16,
              color: "var(--color-primary)", marginBottom: 20,
              textTransform: "uppercase", letterSpacing: 1,
              display: "flex", alignItems: "center", gap: 8
            }}>
              <span style={{
                width: 28, height: 28, background: "var(--color-primary)",
                borderRadius: 6, display: "inline-flex",
                alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 12
              }}>📋</span>
              Instructions & Rules
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {rules.map((rule, i) => (
                <div key={i} style={{
                  background: "var(--color-surface-2)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 18px",
                  display: "flex", gap: 12, alignItems: "flex-start",
                  border: "1px solid var(--color-border)"
                }}>
                  <span style={{ fontSize: 20, lineHeight: 1, marginTop: 2 }}>{rule.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--color-text)", marginBottom: 4 }}>
                      {rule.title}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                      {rule.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Warning Box */}
            <div style={{
              marginTop: 20, padding: "14px 18px",
              background: "var(--color-warning-bg)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-warning)",
              display: "flex", gap: 10, alignItems: "flex-start"
            }}>
              <span style={{ fontSize: 16, marginTop: 1 }}>⚠️</span>
              <p style={{ fontSize: 12, color: "var(--color-warning)", lineHeight: 1.6 }}>
                <strong>Important:</strong> Any attempt to cheat or use unauthorized resources will result in immediate
                disqualification. All activities are monitored. Ensure you are ready before clicking "Start Quiz."
              </p>
            </div>
          </div>
        </div>

        {/* Start Button Area */}
        <div className="fade-in" style={{ textAlign: "center", animationDelay: "0.2s" }}>
          <p style={{ fontSize: 14, color: "var(--color-text-muted)", marginBottom: 18 }}>
            By starting the quiz, you agree to abide by all the above rules.
          </p>
          <button
            onClick={onStart}
            style={{
              background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius-lg)",
              padding: "16px 52px",
              fontSize: 16,
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(240,165,0,0.4)",
              letterSpacing: 0.5,
              transition: "all 0.2s ease",
              display: "inline-flex", alignItems: "center", gap: 10
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(240,165,0,0.5)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(240,165,0,0.4)";
            }}
          >
            <span>🚀</span>
            Ready for the Quiz? Start Now
          </button>
        </div>
      </main>

      <footer style={{ textAlign: "center", padding: "20px", fontSize: 12, color: "var(--color-text-light)" }}>
        © 2025 QuizPro Assessment System · All Rights Reserved
      </footer>
    </div>
  );
}
