import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HomeScreen from "../components/HomeScreen";
import UserModal from "../components/UserModal";
import { useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleStartClick = () => {
    if (user) {
      navigate("/quiz");
    } else {
      setShowModal(true);
    }
  };

  const handleModalComplete = (userData) => {
    setShowModal(false);
    navigate("/quiz");
  };

  const handleViewResults = () => {
    navigate("/results");
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        {user && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 100,
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
              {user.name}
            </span>
            <button
              onClick={handleViewResults}
              style={{
                padding: "8px 16px",
                background: "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-primary)";
              }}
            >
              📊 View Results
            </button>
          </div>
        )}
      </div>
      <HomeScreen onStart={handleStartClick} />
      {showModal && <UserModal onComplete={handleModalComplete} />}
    </>
  );
}
