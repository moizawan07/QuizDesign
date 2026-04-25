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

  const handleModalComplete = (userData, token) => {
    login(userData, token);
    setShowModal(false);
    navigate("/quiz");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <HomeScreen onStart={handleStartClick} user={user} />

      {showModal && (
        <UserModal
          onComplete={handleModalComplete}
          onClose={handleCloseModal}   // ✅ FIXED HERE
        />
      )}
    </>
  );
}