import { T } from '../constants/theme';

export function Btn({ children, onClick, disabled, primary }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "10px 16px",
      background: primary ? T.accent : T.bg,
      color: primary ? "white" : T.text,
      border: `1px solid ${primary ? T.accent : T.border}`,
      fontFamily: "Inter",
      fontSize: "0.875rem", fontWeight: 500,
      cursor: disabled ? "not-allowed" : "pointer",
      borderRadius: 6, opacity: disabled ? 0.5 : 1,
      transition: "all 0.2s",
    }}
      onMouseEnter={e => { if (!disabled && !primary) { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; } }}
      onMouseLeave={e => { if (!disabled && !primary) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; } }}
    >
      {children}
    </button>
  );
}

export function InfoSection({ title, children }) {
  return (
    <div style={{ borderBottom: `1px solid ${T.border}`, padding: "20px 24px" }}>
      <div style={{
        fontSize: "0.875rem", fontWeight: 600, color: T.text,
        marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}
