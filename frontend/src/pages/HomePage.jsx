import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import HomeScreen from "../components/HomeScreen";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleStartClick = () => {
    if (user) {
      // User is logged in, QuizSelection is handled inside HomeScreen now
      navigate("/quiz");
    } else {
      // If not logged in, go to unified Login Page
      navigate("/login");
    }
  };

  return (
    <>
      <HomeScreen onStart={handleStartClick} user={user} />
    </>
  );
}