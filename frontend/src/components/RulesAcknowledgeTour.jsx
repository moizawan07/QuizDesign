import { useState, useEffect } from "react";

/**
 * RulesAcknowledgeTour
 *
 * Props:
 *   ruleRefs   – array of React refs, one per rule card (from HomeScreen)
 *   onComplete – called when user clicks "Acknowledge All Rules" on last step
 */
export default function RulesAcknowledgeTour({ ruleRefs, onComplete }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const total = ruleRefs.length;
  const isLast = step === total - 1;
  const PAD = 10;

  useEffect(() => {
    const el = ruleRefs[step]?.current;
    if (!el) return;

    const measure = () => {
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top - PAD,
        left: r.left - PAD,
        width: r.width + PAD * 2,
        height: r.height + PAD * 2,
        bottom: r.bottom + PAD,
      });
    };

    measure();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [step]);

  const handleNext = () => {
    if (isLast) onComplete();
    else setStep((s) => s + 1);
  };

  if (!rect) return null;

  const tooltipWidth = Math.max(rect.width, 320);
  const tooltipLeft = Math.min(rect.left, window.innerWidth - tooltipWidth - 16);
  const tooltipTop = rect.bottom + 14;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        .rat-clickblock {
          position: fixed;
          inset: 0;
          z-index: 9997;
        }

        .rat-svg {
          position: fixed;
          inset: 0;
          z-index: 9998;
          pointer-events: none;
          width: 100%;
          height: 100%;
        }

        .rat-tooltip {
          position: fixed;
          z-index: 9999;
          background: #ffffff;
          border-radius: 14px;
          padding: 16px 18px 18px;
          box-shadow: 0 24px 70px rgba(0,0,0,0.32), 0 0 0 1px rgba(16,185,129,0.18);
          font-family: 'Poppins', sans-serif;
          pointer-events: all;
          transition: top 0.36s cubic-bezier(0.4,0,0.2,1), left 0.36s cubic-bezier(0.4,0,0.2,1);
        }

        .rat-arrow {
          position: absolute;
          top: -7px;
          left: 22px;
          width: 14px;
          height: 7px;
          overflow: visible;
        }

        .rat-progress {
          height: 3px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 13px;
        }
        .rat-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .rat-btn {
          padding: 10px 20px;
          border-radius: 9px;
          border: none;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(16,185,129,0.3);
          white-space: nowrap;
        }
        .rat-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 10px 28px rgba(16,185,129,0.38);
        }
        .rat-btn:active { transform: scale(0.97); }

        @keyframes rat-glow {
          0%,100% { opacity: 0.85; }
          50%      { opacity: 1; }
        }
      `}</style>

      {/* Blocks all clicks behind the tooltip */}
      <div className="rat-clickblock" />

      {/* SVG dark overlay with spotlight cutout */}
      <svg className="rat-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="rat-cutout">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={rect.left}
              y={rect.top}
              width={rect.width}
              height={rect.height}
              rx="14"
              fill="black"
            />
          </mask>
        </defs>

        {/* Dark overlay */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.72)"
          mask="url(#rat-cutout)"
        />

        {/* Green border around spotlight */}
        <rect
          x={rect.left}
          y={rect.top}
          width={rect.width}
          height={rect.height}
          rx="14"
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          style={{ animation: "rat-glow 2s ease-in-out infinite" }}
        />
      </svg>

      {/* Floating tooltip below the active rule */}
      <div
        className="rat-tooltip"
        style={{ top: tooltipTop, left: tooltipLeft, width: tooltipWidth }}
      >
        {/* Arrow pointing up */}
        <svg className="rat-arrow" viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 7 L7 0 L14 7" fill="white" />
          <path d="M0 7 L7 0 L14 7" fill="none" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
        </svg>

        {/* Progress */}
        <div className="rat-progress">
          <div className="rat-progress-fill" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>
              Rule {step + 1} of {total}
            </div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
              {isLast
                ? "You've reviewed all rules. Click to begin!"
                : `${total - step - 1} rule${total - step - 1 !== 1 ? "s" : ""} remaining — keep going.`}
            </div>
          </div>

          <button className="rat-btn" onClick={handleNext}>
            {isLast
              ? <>✅ Acknowledge All</>
              : <>
                  Got it
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
            }
          </button>
        </div>
      </div>
    </>
  );
}