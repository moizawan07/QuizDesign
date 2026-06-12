import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { useRegisterUserMutation } from "../store/apiSlice";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ name: "", email: "", idNo: "", password: "" });
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const [registerUser, { isLoading }] = useRegisterUserMutation();

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

    if (!form.name || !form.email || !form.password || !form.idNo) {
      return setError("Please fill all fields");
    }

    try {
      const res = await registerUser(form).unwrap();
      dispatch(login({ user: res.user, token: res.token }));
      navigate("/");
    } catch (err) {
      setError(err.data?.message || "Registration failed. Please try again.");
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px",
    borderRadius: 10, border: "1.5px solid #e2e8f0",
    background: "#f8fafc", color: "#0f172a",
    fontSize: 13, outline: "none", transition: "all 0.2s",
    fontFamily: "'Poppins', sans-serif"
  };

  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 600,
    color: "#475569", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em"
  };

  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "'Poppins', sans-serif", padding: 20 }}>
      <style>{`
        * { box-sizing: border-box; }
        .input-field:focus { border-color: #10b981 !important; background: #ffffff !important; box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
      `}</style>

      <div style={{ width: "100%", maxWidth: 460, background: "#fff", borderRadius: 24, padding: "28px 36px", boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.4s ease-out" }}>
        
        {/* Top Accent Line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg, #10b981, #059669)" }} />
        
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#ecfdf5", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
            Create Account
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Register your details to start taking quizzes
          </p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Full Name</label>
              <input 
                type="text" value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                className="input-field" style={inputStyle} placeholder="John Doe" 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>ID Number</label>
              <input 
                type="text" value={form.idNo} 
                onChange={e => setForm({...form, idNo: e.target.value})} 
                className="input-field" style={inputStyle} placeholder="e.g. 12345" 
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address</label>
            <input 
              type="email" value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})} 
              className="input-field" style={inputStyle} placeholder="you@example.com" 
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input 
              type="password" value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
              className="input-field" style={inputStyle} placeholder="Create a strong password" 
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
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            Already have an account?{" "}
            <Link 
              to="/login" 
              style={{ textDecoration: "none", color: "#10b981", fontWeight: 600 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
