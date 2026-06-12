import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useLoginUserMutation, useRegisterUserMutation } from "../store/apiSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({ name: "", email: "", idNo: "", password: "" });
  const [error, setError] = useState("");
  
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();

  const isLoading = isLoggingIn || isRegistering;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "login") {
      if (!form.email || !form.password) return setError("Please fill all fields");
      try {
        const res = await loginUser({ email: form.email, password: form.password }).unwrap();
        dispatch(login({ user: res.user, token: res.token }));
        // Redirect based on role
        if (res.user.role?.title === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (err) {
        setError(err.data?.message || "Login failed");
      }
    } else {
      if (!form.name || !form.email || !form.password || !form.idNo) return setError("Please fill all fields");
      try {
        const res = await registerUser(form).unwrap();
        dispatch(login({ user: res.user, token: res.token }));
        navigate("/");
      } catch (err) {
        setError(err.data?.message || "Registration failed");
      }
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px",
    borderRadius: 12, border: "1.5px solid #e2e8f0",
    background: "#f8fafc", color: "#0f172a",
    fontSize: 14, outline: "none", transition: "all 0.2s",
    fontFamily: "'Poppins', sans-serif"
  };

  const labelStyle = {
    display: "block", fontSize: 12, fontWeight: 700,
    color: "#64748b", textTransform: "uppercase", marginBottom: 8,
    letterSpacing: "0.05em"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9", fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ width: 440, background: "#fff", borderRadius: 24, padding: 40, boxShadow: "0 20px 60px rgba(0,0,0,0.08)" }}>
        
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            {mode === "login" ? "🔐" : "📝"}
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p style={{ fontSize: 14, color: "#64748b" }}>
            {mode === "login" ? "Sign in to access your dashboard" : "Register to start taking quizzes"}
          </p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "12px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 24, textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {mode === "register" && (
            <>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input 
                  type="text" value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  style={inputStyle} placeholder="John Doe" 
                />
              </div>
              <div>
                <label style={labelStyle}>ID Number</label>
                <input 
                  type="text" value={form.idNo} 
                  onChange={e => setForm({...form, idNo: e.target.value})} 
                  style={inputStyle} placeholder="e.g. 12345" 
                />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Email Address</label>
            <input 
              type="email" value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              style={inputStyle} placeholder="you@example.com" 
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input 
              type="password" value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
              style={inputStyle} placeholder="Enter your password" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: "100%", padding: "16px", borderRadius: 12, border: "none", 
              background: isLoading ? "#cbd5e1" : "linear-gradient(135deg, #10b981, #059669)", 
              color: "#fff", fontWeight: 700, fontSize: 15, cursor: isLoading ? "not-allowed" : "pointer", 
              marginTop: 12, boxShadow: isLoading ? "none" : "0 10px 25px rgba(16,185,129,0.25)",
              transition: "transform 0.2s"
            }}
          >
            {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Register"}
          </button>
        </form>
        
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button 
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} 
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
