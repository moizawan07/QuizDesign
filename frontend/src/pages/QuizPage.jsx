import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import QuizScreen from "../components/QuizScreen";
import { useEffect } from "react";

export default function QuizPage() {
  const navigate = useNavigate();
  const { user, loading } = useSelector(state => state.auth);
  const token = localStorage.getItem("auth_token");
  
  // Removed legacy quizCompleted check so users can attempt multiple distinct quizzes

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmitComplete = (result) => {
    navigate("/");
  };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
        <div style={{ width: 56, height: 56, border: "4px solid var(--color-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <QuizScreen user={user} onSubmitComplete={handleSubmitComplete} />;
}
