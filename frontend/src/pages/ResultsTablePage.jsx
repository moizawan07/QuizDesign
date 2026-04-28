import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { quizAPI } from "../utils/api";

export default function ResultsTablePage() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* HEADER (NEW THEME) */}
      <header
        style={{
          background: "linear-gradient(135deg, #10b981, #059669)",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#fff",
          fontWeight: 800,
          fontSize: 16,
          boxShadow: "0 10px 25px rgba(16,185,129,0.25)",
        }}
      >
        📊 QuizPro Results Dashboard
      </header>

      <main style={{ margin: "0 auto", padding: "30px 100px" }}>
        {/* TITLE */}
        <div className="flex flex-row justify-between items-center">
        <div style={{ marginBottom: 25 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            Results Overview
          </h1>
          <p style={{ color: "#64748b", fontSize: 13 }}>
            Total Submissions: <b>{results.length}</b>
          </p>
        </div>

          {/* BACK BUTTON */}
          <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 18px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 10px 20px rgba(16,185,129,0.25)",
          }}
        >
          ← Back
          </button>

           </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.08)",
              color: "#dc2626",
              padding: 14,
              borderRadius: 12,
              marginBottom: 20,
              fontWeight: 600,
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* LOADING */}
        {tableLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 60,
              gap: 12,
            }}
          >
            <div className="loader" />
            <p style={{ color: "#64748b" }}>Loading results...</p>
          </div>
        ) : results.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: 50,
              textAlign: "center",
              borderRadius: 16,
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            }}
          >
            📭 No results found
          </div>
        ) : (
          /* SAME TABLE STRUCTURE (NO CHANGE) */
          <div
            style={{
              background: "#fff",
              borderRadius: 7,
              overflow: "hidden",
              boxShadow: "0 10px 10px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  fontSize: 14,
                  minWidth: "1100px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "#fff",
                    }}
                  >
                    {[
                      "Id",
                      "Name",
                      "Email",
                      "Correct",
                      "Wrong",
                      "Unattempted",
                      "Percentage",
                      "Note",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "20px 18px",
                          textAlign: "left",
                          fontWeight: 800,
                          fontSize: 13,
                          letterSpacing: 0.5,
                          whiteSpace: "nowrap",
                        }}
                      >
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
                        borderBottom: "1px solid #f1f5f9",
                        background: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          i % 2 === 0 ? "#ffffff" : "#f8fafc";
                      }}
                    >
                      <td style={cellBold}>{"#" + r.userId?.idNo || "N/A"}</td>
                      <td style={cell}>{r.userId?.name || "N/A"}</td>

                      <td style={cell}>{r.userId?.email}</td>

                      <td style={cell}>
                        <span style={successBadge}>{r.correct}</span>
                      </td>

                      <td style={cell}>
                        <span style={dangerBadge}>{r.wrong}</span>
                      </td>

                      <td style={cell}>
                        <span style={warningBadge}>{r.unattempted}</span>
                      </td>

                      <td style={cell}>
                        <span
                          style={{
                            padding: "8px 12px",
                            borderRadius: 5,
                            fontWeight: 800,
                            fontSize: 12,
                            background:
                              r.percentage >= 60
                                ? "rgba(16,185,129,0.12)"
                                : "rgba(239,68,68,0.12)",
                            color: r.percentage >= 60 ? "#059669" : "#dc2626",
                          }}
                        >
                          {r.percentage}%
                        </span>
                      </td>

                      {/* NOTE COLUMN */}
                      <td style={cell}>
                        <div
                          title={r.note || "No note"}
                          style={{
                            maxWidth: "220px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            color: "#2563eb",
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          {r.note
                            ? r.note.length > 30
                              ? `${r.note.slice(0, 30)}...`
                              : r.note
                            : "No note"}
                        </div>
                      </td>

                      <td style={cell}>
                        <div
                          style={{
                            background: "#DCF2ED",
                            padding: "8px 10px",
                            borderRadius: 10,
                            fontSize: 12,
                            color: "#64748b",
                            display: "inline-block",
                            fontWeight: 600,
                          }}
                        >
                          {new Date(r.completedAt).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

const cell = {
  padding: "16px 18px",
  color: "#334155",
};

const cellBold = {
  padding: "16px 18px",
  fontWeight: 700,
  color: "#0f172a",
};

const successBadge = {
  background: "rgba(16,185,129,0.12)",
  color: "#059669",
  padding: "7px 12px",
  borderRadius: 5,
  fontWeight: 700,
};

const dangerBadge = {
  background: "rgba(239,68,68,0.12)",
  color: "#dc2626",
  padding: "7px 12px",
  borderRadius: 5,
  fontWeight: 700,
};

const warningBadge = {
  background: "rgba(245,158,11,0.12)",
  color: "#d97706",
  padding: "7px 12px",
  borderRadius: 5,
  fontWeight: 700,
};
