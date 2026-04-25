export default function ResultScreen({ result, user }) {
  const { correct, wrong, unattempted, total, percentage } = result;
  const passed = percentage >= 60;

  const stats = [
    { label: "Correct",     value: correct,     color: "var(--color-success)",  bg: "var(--color-success-bg)", icon: "✅" },
    { label: "Wrong",       value: wrong,        color: "var(--color-danger)",   bg: "var(--color-danger-bg)",  icon: "❌" },
    { label: "Not Attempted", value: unattempted, color: "var(--color-warning)",  bg: "var(--color-warning-bg)", icon: "⏭️" },
    { label: "Total Marks", value: `${correct}/${total}`, color: "var(--color-info)", bg: "var(--color-info-bg)", icon: "📊" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      background: "var(--color-bg)",
      fontFamily: "var(--font-body)"
    }}>
      {/* Header */}
      <header style={{
        background: "var(--color-primary)",
        padding: "18px 32px",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <span style={{ fontSize: 22 }}>📝</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "#fff" }}>
          QuizPro Assessment
        </span>
      </header>

      <main style={{ flex: 1, maxWidth: 700, width: "100%", margin: "0 auto", padding: "48px 20px" }}>
        <div className="scale-in">
          {/* Result Hero */}
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
            marginBottom: 24,
            textAlign: "center"
          }}>
            {/* Top Banner */}
            <div style={{
              background: passed
                ? "linear-gradient(135deg, #15803d 0%, var(--color-success) 100%)"
                : "linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)",
              padding: "40px 32px",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{
                position: "absolute", top: -30, right: -30,
                width: 120, height: 120, borderRadius: "50%",
                background: "rgba(255,255,255,0.06)"
              }} />
              <div style={{ fontSize: 52, marginBottom: 16 }}>
                {passed ? "🎉" : "📚"}
              </div>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: 26, fontWeight: 800,
                color: "#fff", marginBottom: 8
              }}>
                {passed ? "Congratulations!" : "Quiz Completed"}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, marginBottom: 20 }}>
                Your quiz has been successfully submitted. Good luck!
              </p>

              {/* Score Circle */}
              <div style={{
                width: 110, height: 110, borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                border: "3px solid rgba(255,255,255,0.3)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto"
              }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 800,
                  fontSize: 30, color: "#fff", lineHeight: 1
                }}>{percentage}%</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Score</div>
              </div>
            </div>

            {/* Student Info */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
                {[
                  { label: "Student Name", val: user.name },
                  { label: "Father's Name", val: user.fatherName },
                  { label: "Email", val: user.email },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text)" }}>
                      {item.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ padding: "24px 32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {stats.map(s => (
                  <div key={s.label} style={{
                    background: s.bg,
                    borderRadius: "var(--radius-md)",
                    padding: "16px 20px",
                    display: "flex", alignItems: "center", gap: 14
                  }}>
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: s.color }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                        {s.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "var(--color-surface)",
              borderRadius: 50,
              fontSize: 13,
              color: "var(--color-text-muted)",
              boxShadow: "var(--shadow-sm)"
            }}>
              ✓ Your results have been recorded in our system
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
