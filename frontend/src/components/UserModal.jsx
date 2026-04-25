import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../utils/api";

export default function UserModal({ onComplete }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    email: "",
    idNo: "",
    professional: "Web Development",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.fatherName.trim()) e.fatherName = "Father's name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.idNo.trim()) e.idNo = "ID No is required";
    if (!form.professional) e.professional = "Professional field is required";
    return e;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const response = await userAPI.register({
        name: form.name.trim(),
        fatherName: form.fatherName.trim(),
        email: form.email.trim(),
        idNo: form.idNo.trim(),
        professional: form.professional,
      });

      // Store token and user in context
      login(response.data.user, response.data.token);
      onComplete(response.data.user);
    } catch (error) {
      setApiError(error.response?.data?.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, placeholder, type = "text") => (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--color-primary)",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 0.8,
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
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: "var(--radius-sm)",
          border: `1.5px solid ${errors[key] ? "var(--color-danger)" : "var(--color-border)"}`,
          fontSize: 14,
          fontFamily: "var(--font-body)",
          color: "var(--color-text)",
          background: "var(--color-surface)",
          outline: "none",
          transition: "border 0.2s",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = errors[key] ? "var(--color-danger)" : "var(--color-border)";
        }}
      />
      {errors[key] && <p style={{ fontSize: 11, color: "var(--color-danger)", marginTop: 4 }}>⚠ {errors[key]}</p>}
    </div>
  );

  const selectField = (key, label, options) => (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--color-primary)",
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {label}
      </label>
      <select
        value={form[key]}
        onChange={(e) => {
          setForm((p) => ({ ...p, [key]: e.target.value }));
          setErrors((p) => ({ ...p, [key]: "" }));
        }}
        style={{
          width: "100%",
          padding: "11px 14px",
          borderRadius: "var(--radius-sm)",
          border: `1.5px solid ${errors[key] ? "var(--color-danger)" : "var(--color-border)"}`,
          fontSize: 14,
          fontFamily: "var(--font-body)",
          color: "var(--color-text)",
          background: "var(--color-surface)",
          outline: "none",
          transition: "border 0.2s",
          cursor: "pointer",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = errors[key] ? "var(--color-danger)" : "var(--color-border)";
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[key] && <p style={{ fontSize: 11, color: "var(--color-danger)", marginTop: 4 }}>⚠ {errors[key]}</p>}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(10,20,35,0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="scale-in"
        style={{
          background: "var(--color-surface)",
          borderRadius: "var(--radius-xl)",
          padding: "36px 32px",
          width: "100%",
          maxWidth: 440,
          boxShadow: "var(--shadow-xl)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              margin: "0 auto 14px",
            }}
          >
            👤
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 20, color: "var(--color-primary)" }}>
            Student Registration
          </h2>
          <p style={{ fontSize: 13, color: "var(--color-text-muted)", marginTop: 6 }}>
            Please enter your details before proceeding to the quiz.
          </p>
        </div>

        {field("name", "Full Name", "Enter your full name")}
        {field("fatherName", "Father's Name", "Enter your father's name")}
        {field("email", "Email Address", "you@example.com", "email")}
        {field("idNo", "ID No", "Enter your ID number")}
        {selectField("professional", "Professional Field", ["Web Development", "UI UX"])}

        {apiError && (
          <p style={{ fontSize: 12, color: "var(--color-danger)", marginBottom: 12, padding: "8px", background: "var(--color-danger-bg)", borderRadius: 4 }}>
            ⚠ {apiError}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            background: loading ? "var(--color-border)" : "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: 15,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: 4,
            transition: "all 0.2s",
            letterSpacing: 0.3,
          }}
        >
          {loading ? "Registering..." : "Continue to Quiz →"}
        </button>
      </div>
    </div>
  );
}
