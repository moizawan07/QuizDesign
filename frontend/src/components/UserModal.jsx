import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../utils/api";

export default function UserModal({ onComplete, onClose }) {
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    idNo: "",
    professional: "Web Development",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeField, setActiveField] = useState(null); // ✅ Track active input

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (!form.idNo.trim()) e.idNo = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    setApiError("");

    try {
      const response = await userAPI.register({
        name: form.name.trim(),
        email: form.email.trim(),
        idNo: form.idNo.trim(),
        professional: form.professional,
      });

      // login(response.data.user, response.data.token);
      onComplete(response.data.user, response.data.token);
    } catch (error) {
      setApiError(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, placeholder, type = "text") => (
    <div style={{ marginBottom: 10 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#059669",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => {
          setForm((p) => ({ ...p, [key]: e.target.value }));
          setErrors((p) => ({ ...p, [key]: "" }));
        }}
        onFocus={() => setActiveField(key)}
        onBlur={() => setActiveField(null)}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: `1.5px solid ${
            errors[key] 
              ? "#ef4444" 
              : activeField === key 
                ? "#10b981" 
                : "rgba(0,0,0,0.08)"
          }`,
          fontSize: 13,
          outline: "none",
          transition: "border-color 0.2s ease",
          boxShadow: activeField === key ? "0 0 0 2px rgba(16,185,129,0.1)" : "none",
        }}
      />

      {errors[key] && (
        <p style={{ fontSize: 10, color: "#ef4444", marginTop: 2 }}>
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <div
      onClick={() => onClose?.()}   // ✅ Click outside = close
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "400px",
          borderRadius: 12,
          padding: "24px",
          background: "#fff",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          transform: mounted ? "scale(1)" : "scale(0.9)",
          opacity: mounted ? 1 : 0,
          transition: "0.3s ease",
          position: "relative",
        }}
      >
        {/* ✅ CLOSE BUTTON - NOW WORKING */}
        <button
          onClick={() => onClose?.()}  // ✅ Fixed: ab kaam karega
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: "none",
            background: "#f1f5f9",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
        >
          ✕
        </button>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: "linear-gradient(135deg,#10b981,#059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "#fff",
              margin: "0 auto 10px",
            }}
          >
            👤
          </div>

          <h2 style={{ fontSize: 17, fontWeight: 700 }}>
            Student Registration
          </h2>
        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {field("name", "Full Name", "Enter name")}
          {field("idNo", "ID No", "Enter ID", "number")}
        </div>

        {field("email", "Email Address", "you@example.com", "email")}

        <div style={{ marginBottom: 10 }}>
          <label
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#059669",
              textTransform: "uppercase",
            }}
          >
            Professional
          </label>

          <select
            value={form.professional}
            onChange={(e) =>
              setForm((p) => ({ ...p, professional: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1.5px solid rgba(0,0,0,0.08)",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#10b981")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)")}
          >
            <option>Web Development</option>
            <option>UI UX</option>
          </select>
        </div>

        {apiError && (
          <p style={{ fontSize: 11, color: "#ef4444" }}>{apiError}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 12,
            border: "none",
            marginTop: 10,
            background: loading
              ? "#cbd5e1"
              : "linear-gradient(135deg,#10b981,#059669)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            transition: "transform 0.1s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? "Registering..." : "Continue →"}
        </button>
      </div>
    </div>
  );
}