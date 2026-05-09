// ─── THEME TOKENS ────────────────────────────────────────────────────────────
export const T = {
  bg: "#ffffff",
  surface: "#fafafa",
  panel: "#f5f5f5",
  border: "#e0e0e0",
  accent: "#2563eb",
  violet: "#7c3aed",
  green: "#059669",
  amber: "#d97706",
  red: "#dc2626",
  muted: "#6b7280",
  text: "#1f2937",
  dim: "#9ca3af",
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${T.bg};
    color: ${T.text};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    font-family: inherit;
  }

  svg {
    display: block;
  }
`;
