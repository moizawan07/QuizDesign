import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ResultScreen from "../components/ResultScreen";
import { useEffect } from "react";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state;

  useEffect(() => {
    if (!state?.result || !state?.user) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state?.result || !state?.user) {
    return null;
  }

  return (
    <div>
      {/* Success Message */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-bg)",
          fontFamily: "var(--font-body)",
        }}
      >
        {/* Header */}
        <header
          style={{
            background: "var(--color-primary)",
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>📝</span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 16,
              color: "#fff",
            }}
          >
            QuizPro Assessment
          </span>
        </header>

        {/* Success Message Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #15803d 0%, var(--color-success) 100%)",
            color: "#fff",
            padding: "32px",
            textAlign: "center",
            animation: "fadeIn 0.6s ease",
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>✓</div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Your Quiz Has Been Successfully Submitted!
          </h1>
          <p style={{ fontSize: 16, opacity: 0.9 }}>
            Thank you {state.user.name}. Your responses have been saved.
          </p>
        </div>

        {/* Result Screen */}
        <div style={{ flex: 1 }}>
          <ResultScreen result={state.result} user={state.user} />
        </div>

        <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      </div>
    </div>
  );
}
