import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { quizAPI } from "../utils/api";

export default function ResultsTablePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [results, setResults] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setTableLoading(true);
      const response = await quizAPI.getResultsTable();
      setResults(response.data.results || []);
    } catch (error) {
      setError("Failed to load results. Please try again.");
      console.error("Error fetching results:", error);
    } finally {
      setTableLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)" }}>
        <div style={{ width: 56, height: 56, border: "4px solid var(--color-border)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <header style={{
        background: "var(--color-primary)",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "var(--shadow-md)",
      }}>
        <span style={{ fontSize: 22 }}>📊</span>
        <span style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 16,
          color: "#fff",
        }}>
          Quiz Results
        </span>
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 800,
            color: "var(--color-primary)",
            marginBottom: 8,
          }}>
            All Quiz Results
          </h1>
          <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
            Total Submissions: <strong>{results.length}</strong>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "var(--color-danger-bg)",
            color: "var(--color-danger)",
            padding: "16px",
            borderRadius: "var(--radius-md)",
            marginBottom: 20,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Table Loading */}
        {tableLoading ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
            flexDirection: "column",
            gap: 16,
          }}>
            <div style={{
              width: 48,
              height: 48,
              border: "3px solid var(--color-border)",
              borderTopColor: "var(--color-primary)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <p style={{ color: "var(--color-text-muted)" }}>Loading results...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : results.length === 0 ? (
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            padding: "48px 32px",
            textAlign: "center",
            boxShadow: "var(--shadow-md)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: 18,
              color: "var(--color-text)",
              marginBottom: 8,
            }}>
              No Results Yet
            </h2>
            <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
              No quiz results have been submitted yet.
            </p>
          </div>
        ) : (
          <div style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            boxShadow: "var(--shadow-md)",
            overflowX: "auto",
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}>
              <thead>
                <tr style={{ background: "var(--color-primary)", color: "#fff" }}>
                  <th style={{ padding: "14px", textAlign: "left", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Name</th>
                  <th style={{ padding: "14px", textAlign: "left", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Email</th>
                  <th style={{ padding: "14px", textAlign: "left", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Correct</th>
                  <th style={{ padding: "14px", textAlign: "left", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Wrong</th>
                  <th style={{ padding: "14px", textAlign: "left", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Unattempted</th>
                  <th style={{ padding: "14px", textAlign: "left", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Percentage</th>
                  <th style={{ padding: "14px", textAlign: "left", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, idx) => (
                  <tr
                    key={result._id}
                    style={{
                      borderTop: "1px solid var(--color-border)",
                      background: idx % 2 === 0 ? "transparent" : "var(--color-surface-2)",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--color-primary-bg)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = idx % 2 === 0 ? "transparent" : "var(--color-surface-2)";
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      <strong>{result.userId?.name || "N/A"}</strong>
                    </td>
                    <td style={{ padding: "14px" }}>{result.userId?.email || "N/A"}</td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ color: "var(--color-success)", fontWeight: 600 }}>{result.correct}</span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ color: "var(--color-danger)", fontWeight: 600 }}>{result.wrong}</span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ color: "var(--color-warning)", fontWeight: 600 }}>{result.unattempted}</span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span style={{
                        fontWeight: 700,
                        color: result.percentage >= 60 ? "var(--color-success)" : "var(--color-danger)",
                      }}>
                        {result.percentage}%
                      </span>
                    </td>
                    <td style={{ padding: "14px", fontSize: 12 }}>
                      {new Date(result.completedAt).toLocaleDateString()} <br />
                      {new Date(result.completedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 24,
            padding: "12px 24px",
            background: "var(--color-primary)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--radius-md)",
            fontSize: 14,
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
          ← Back to Home
        </button>
      </main>
    </div>
  );
}
