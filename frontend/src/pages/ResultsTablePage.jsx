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
    if (!loading && !user) navigate("/");
  }, [user, loading]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setTableLoading(true);
      const res = await quizAPI.getResultsTable();
      setResults(res.data.results || []);
    } catch (err) {
      setError("Failed to load results");
    } finally {
      setTableLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f7fb",
      fontFamily: "'Poppins', sans-serif"
    }}>

      {/* HEADER (NEW THEME) */}
      <header style={{
        background: "linear-gradient(135deg, #10b981, #059669)",
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "#fff",
        fontWeight: 800,
        fontSize: 16,
        boxShadow: "0 10px 25px rgba(16,185,129,0.25)"
      }}>
        📊 QuizPro Results Dashboard
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 20px" }}>

        {/* TITLE */}
        <div style={{ marginBottom: 25 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#0f172a"
          }}>
            Results Overview
          </h1>
          <p style={{ color: "#64748b", fontSize: 13 }}>
            Total Submissions: <b>{results.length}</b>
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            color: "#dc2626",
            padding: 14,
            borderRadius: 12,
            marginBottom: 20,
            fontWeight: 600
          }}>
            ⚠ {error}
          </div>
        )}

        {/* LOADING */}
        {tableLoading ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 60,
            gap: 12
          }}>
            <div className="loader" />
            <p style={{ color: "#64748b" }}>Loading results...</p>
          </div>
        ) : results.length === 0 ? (
          <div style={{
            background: "#fff",
            padding: 50,
            textAlign: "center",
            borderRadius: 16,
            boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
          }}>
            📭 No results found
          </div>
        ) : (

          /* SAME TABLE STRUCTURE (NO CHANGE) */
          <div style={{
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0"
          }}>

            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13
            }}>

              <thead>
                <tr style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff"
                }}>
                  {["Name","Email","Correct","Wrong","Unattempted","Percentage","Date"].map((h) => (
                    <th key={h} style={{
                      padding: 14,
                      textAlign: "left",
                      fontWeight: 800,
                      letterSpacing: 0.5
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {results.map((r, i) => (
                  <tr
                    key={r._id}
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      background: i % 2 === 0 ? "#fff" : "#f8fafc",
                      transition: "0.2s"
                    }}
                    onMouseEnter={(e) =>
                      e.currentTarget.style.background = "#ecfdf5"
                    }
                    onMouseLeave={(e) =>
                      e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#f8fafc"
                    }
                  >

                    <td style={cellBold}>{r.userId?.name || "N/A"}</td>
                    <td style={cell}>{r.userId?.email}</td>

                    <td style={{ ...cell, color: "#10b981", fontWeight: 700 }}>
                      {r.correct}
                    </td>

                    <td style={{ ...cell, color: "#ef4444", fontWeight: 700 }}>
                      {r.wrong}
                    </td>

                    <td style={{ ...cell, color: "#f59e0b", fontWeight: 700 }}>
                      {r.unattempted}
                    </td>

                    <td style={{
                      fontWeight: 800,
                      color: r.percentage >= 60 ? "#10b981" : "#ef4444"
                    }}>
                      {r.percentage}%
                    </td>

                    <td style={{ fontSize: 12, color: "#64748b" }}>
                      {new Date(r.completedAt).toLocaleString()}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: 22,
            padding: "12px 18px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 10px 20px rgba(16,185,129,0.25)"
          }}
        >
          ← Back
        </button>

      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loader {
          width: 42px;
          height: 42px;
          border: 4px solid #e2e8f0;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
      `}</style>

    </div>
  );
}

const cell = { padding: 14, color: "#334155" };
const cellBold = { padding: 14, fontWeight: 700, color: "#0f172a" };
