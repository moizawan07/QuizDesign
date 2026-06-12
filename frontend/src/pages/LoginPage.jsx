import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useLoginUserMutation } from "../store/apiSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const [loginUser, { isLoading }] = useLoginUserMutation();

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap";
    document.head.appendChild(link);
    const t = setTimeout(() => setMounted(true), 100);
    return () => {
      clearTimeout(t);
      document.head.removeChild(link);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) return setError("Please fill all fields");
    try {
      const res = await loginUser({ email: form.email, password: form.password }).unwrap();
      dispatch(login({ user: res.user, token: res.token }));
      if (res.user.role?.title === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.data?.message || "Login failed. Please check your credentials.");
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
    display: "block", fontSize: 12, fontWeight: 600,
    color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em"
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Poppins', sans-serif", padding: 20 }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .input-field:focus { border-color: #10b981 !important; background: #ffffff !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 440, background: "#fff", borderRadius: 24, padding: "32px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.4s ease-out" }}>
        
        {/* Top Accent Line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg, #10b981, #059669)" }} />
        
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Please enter your details to sign in
          </p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "10px 14px", borderRadius: 10, fontSize: 12, fontWeight: 500, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input 
              type="email" value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              className="input-field" style={inputStyle} placeholder="you@example.com" 
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
            </div>
            <input 
              type="password" value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
              className="input-field" style={inputStyle} placeholder="Enter your password" 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: "100%", padding: "12px", borderRadius: 10, border: "none", 
              background: isLoading ? "#cbd5e1" : "#10b981", 
              color: "#fff", fontWeight: 600, fontSize: 14, cursor: isLoading ? "not-allowed" : "pointer", 
              marginTop: 4, transition: "background 0.2s"
            }}
            onMouseOver={(e) => { if(!isLoading) e.target.style.background = "#059669" }}
            onMouseOut={(e) => { if(!isLoading) e.target.style.background = "#10b981" }}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Don't have an account?{" "}
            <Link 
              to="/register" 
              style={{ textDecoration: "none", color: "#10b981", fontWeight: 600 }}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
