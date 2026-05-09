import { useRef, useEffect } from "react";
import { T } from '../constants/theme';

const FIB_N = 10;
const LCS_X = "ABCBDAB";
const LCS_Y = "BDCABA";
const KS_W = [2, 3, 4, 5];
const KS_V = [3, 4, 5, 6];
const KS_CAP = 8;
const TARGET = 6;
const COINS = [1, 3, 4];

function SvgContainer({ svgRef }) {
  return (
    <div
      ref={svgRef}
      style={{ width: "100%", height: "100%", overflow: "auto" }}
    />
  );
}

// ─── SORTING CANVAS ───────────────────────────────────────────────
export function SortingCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { arr, comparing, swapped, sorted, pivot } = state;
    if (!arr || !arr.length) return;
    const maxVal = Math.max(...arr);
    const barWidth = 40;
    const maxHeight = 200;
    const ox = 40;
    const oy = 60;

    const bars = arr.map((val, i) => {
      const x = ox + i * barWidth;
      const height = maxVal > 0 ? (val / maxVal) * maxHeight : 0;
      const isComparing = comparing && comparing.includes(i);
      const isSwapped = swapped && swapped.includes(i);
      const isSorted = sorted && sorted.includes(i);
      const isPivot = pivot === i;

      let fill = T.surface;
      if (isSorted) fill = T.green;
      else if (isPivot) fill = T.amber;
      else if (isComparing) fill = T.accent;
      else if (isSwapped) fill = T.red;

      return `
        <rect x="${x}" y="${oy + maxHeight - height}" width="${barWidth - 2}" height="${height}"
              fill="${fill}" stroke="${isPivot ? T.amber : T.border}" stroke-width="${isPivot ? 2 : 1}" />
        <text x="${x + barWidth / 2}" y="${oy + maxHeight + 15}"
              text-anchor="middle" font-size="10" fill="${T.text}" font-family="monospace">${val}</text>
      `;
    }).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${arr.length * barWidth + 80} ${maxHeight + 100}">
        ${bars}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── GRAPH CANVAS ───────────────────────────────────────────────
export function GraphCanvas({ graph, state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!graph || !state || !ref.current) return;
    const { nodes, edges } = graph;
    const { nodeColors, edgeColors, labels } = state;
    
    // Get container dimensions for responsive sizing
    const container = ref.current.parentElement;
    const width = container?.clientWidth || 700;
    const height = container?.clientHeight || 380;
    const ox = 50, oy = 50;
    
    // Scale node positions if they exceed bounds
    const maxX = Math.max(...nodes.map(n => n.x || 0));
    const maxY = Math.max(...nodes.map(n => n.y || 0));
    const scaleX = (width - ox * 2) / Math.max(maxX, width - ox * 2);
    const scaleY = (height - oy * 2) / Math.max(maxY, height - oy * 2);
    const scale = Math.min(scaleX, scaleY, 1);

    const edgeSvg = edges.map((edge, i) => {
      const from = nodes[edge.from];
      const to = nodes[edge.to];
      if (!from || !to) return '';
      const x1 = ox + (from.x || 0) * scale;
      const y1 = oy + (from.y || 0) * scale;
      const x2 = ox + (to.x || 0) * scale;
      const y2 = oy + (to.y || 0) * scale;
      const color = edgeColors?.[i] || T.border;
      const strokeWidth = (edgeColors?.[i] && (edgeColors[i] === T.accent || edgeColors[i] === T.amber)) ? "3" : "2";
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      return `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${strokeWidth}" />
        <text x="${mx}" y="${my - 4}" text-anchor="middle" font-size="10" fill="${T.muted}" font-family="monospace">${edge.weight ?? ''}</text>
      `;
    }).join('');

    const nodeSvg = nodes.map((node, i) => {
      const x = ox + (node.x || 0) * scale;
      const y = oy + (node.y || 0) * scale;
      const color = nodeColors?.[i] || T.border;
      const lbl = labels?.[i] !== undefined ? labels[i] : node.label || i;
      return `
        <circle cx="${x}" cy="${y}" r="18" fill="${color}" stroke="${T.border}" stroke-width="2" />
        <text x="${x}" y="${y + 4}" text-anchor="middle" font-size="11" fill="white" font-family="monospace" font-weight="700">${node.label || i}</text>
        <text x="${x}" y="${y + 32}" text-anchor="middle" font-size="9" fill="${T.muted}" font-family="monospace">${lbl}</text>
      `;
    }).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}">
        ${edgeSvg}${nodeSvg}
      </svg>
    `;
  }, [graph, state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── TREE CANVAS ───────────────────────────────────────────────
export function TreeCanvas({ graph, state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!graph || !state || !ref.current) return;
    const { nodes, edges } = graph;
    const { nodeColors } = state;
    const width = 600, height = 380, ox = 50, oy = 50;

    const edgeSvg = edges.map((edge) => {
      const from = nodes[edge.s ?? edge.from];
      const to = nodes[edge.t ?? edge.to];
      if (!from || !to) return '';
      return `<line x1="${ox + from.x}" y1="${oy + from.y}" x2="${ox + to.x}" y2="${oy + to.y}" stroke="${T.border}" stroke-width="2" />`;
    }).join('');

    const nodeSvg = nodes.map((node, i) => {
      const x = ox + node.x, y = oy + node.y;
      const color = nodeColors?.[i] || T.border;
      return `
        <circle cx="${x}" cy="${y}" r="20" fill="${color}" stroke="${T.border}" stroke-width="2" />
        <text x="${x}" y="${y + 5}" text-anchor="middle" font-size="13" fill="white" font-family="monospace" font-weight="700">${node.value ?? node.label ?? i}</text>
      `;
    }).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width + ox} ${height + oy}">
        ${edgeSvg}${nodeSvg}
      </svg>
    `;
  }, [graph, state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── FIB CANVAS ───────────────────────────────────────────────
export function FibCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { dp, current } = state;
    const cw = 50, ch = 36, ox = 60, oy = 60;
    const cells = Array.from({ length: FIB_N + 1 }, (_, i) => {
      const val = dp?.[i] ?? 0;
      const isActive = i === current;
      return `
        <rect x="${ox + i * cw + 1}" y="${oy + 1}" width="${cw - 2}" height="${ch - 2}"
              fill="${isActive ? T.violet : val > 0 ? 'rgba(37,99,235,0.2)' : T.surface}"
              stroke="${isActive ? T.violet : T.border}" stroke-width="${isActive ? 2 : 1}" rx="3" />
        <text x="${ox + i * cw + cw / 2}" y="${oy + ch / 2 + 5}" text-anchor="middle"
              font-size="12" fill="${isActive ? '#fff' : val > 0 ? T.text : T.muted}"
              font-family="monospace" font-weight="${val > 0 ? 700 : 400}">${val}</text>
        <text x="${ox + i * cw + cw / 2}" y="${oy + ch + 18}" text-anchor="middle"
              font-size="10" fill="${T.muted}" font-family="monospace">F(${i})</text>
      `;
    }).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${(FIB_N + 1) * cw + ox * 2} ${oy + ch + 40}">
        <text x="${ox}" y="${oy - 15}" font-size="13" fill="${T.muted}" font-family="monospace">Fibonacci DP Table</text>
        ${cells}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── LCS CANVAS ───────────────────────────────────────────────
export function LCSCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { dp, ci, cj, X, Y } = state;
    const m = X ? X.length : LCS_X.length, n = Y ? Y.length : LCS_Y.length;
    const cw = 40, ch = 32, ox = 60, oy = 60;
    const maxVal = dp ? Math.max(1, ...dp.flat()) : 1;

    const headers = Array.from({ length: n }, (_, i) =>
      `<text x="${ox + (i + 2) * cw + cw / 2}" y="${oy - 8}" text-anchor="middle" font-size="13"
             fill="${T.accent}" font-family="monospace" font-weight="700">${Y ? Y[i] : LCS_Y[i]}</text>`
    ).join('') +
    Array.from({ length: m }, (_, j) =>
      `<text x="${ox + cw / 2}" y="${oy + (j + 2) * ch + ch / 2 + 4}" text-anchor="middle" font-size="13"
             fill="${T.accent}" font-family="monospace" font-weight="700">${X ? X[j] : LCS_X[j]}</text>`
    ).join('');

    const cells = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => {
        const val = dp?.[i]?.[j] ?? 0;
        const isActive = i === ci && j === cj;
        return `
          <rect x="${ox + (j + 1) * cw + 1}" y="${oy + (i + 1) * ch + 1}" width="${cw - 2}" height="${ch - 2}"
                fill="${isActive ? T.violet : val > 0 ? `rgba(37,99,235,${Math.min(0.1 + val / maxVal, 0.4)})` : T.surface}"
                stroke="${isActive ? T.violet : T.border}" stroke-width="${isActive ? 2 : 0.5}" />
          <text x="${ox + (j + 1) * cw + cw / 2}" y="${oy + (i + 1) * ch + ch / 2 + 4}" text-anchor="middle"
                font-size="11" fill="${isActive ? '#fff' : val > 0 ? T.text : T.muted}"
                font-family="monospace" font-weight="${val > 0 ? 700 : 400}">${val}</text>
        `;
      }).join('')
    ).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${(n + 3) * cw + ox} ${(m + 3) * ch + oy}">
        <text x="${ox}" y="${oy - 25}" font-size="13" fill="${T.muted}" font-family="monospace">LCS: "${X || LCS_X}" vs "${Y || LCS_Y}"</text>
        ${headers}${cells}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── KNAPSACK CANVAS ───────────────────────────────────────────────
export function KnapsackCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { dp, ci, W, V, CAP } = state;
    const n = W ? W.length : KS_W.length, capacity = CAP || KS_CAP;
    const cw = 42, ch = 32, ox = 60, oy = 60;
    const maxVal = dp ? Math.max(1, ...dp.flat()) : 1;

    const colHeaders = Array.from({ length: capacity + 1 }, (_, j) =>
      `<text x="${ox + j * cw + cw / 2}" y="${oy - 8}" text-anchor="middle" font-size="11"
             fill="${T.accent}" font-family="monospace">${j}</text>`
    ).join('');
    const rowHeaders = Array.from({ length: n + 1 }, (_, i) =>
      `<text x="${ox - 10}" y="${oy + i * ch + ch / 2 + 4}" text-anchor="end" font-size="11"
             fill="${T.accent}" font-family="monospace">${i === 0 ? '0' : `W${i}`}</text>`
    ).join('');

    const cells = Array.from({ length: n + 1 }, (_, i) =>
      Array.from({ length: capacity + 1 }, (_, j) => {
        const val = dp?.[i]?.[j] ?? 0;
        const isActive = i === ci;
        return `
          <rect x="${ox + j * cw + 1}" y="${oy + i * ch + 1}" width="${cw - 2}" height="${ch - 2}"
                fill="${isActive ? 'rgba(37,99,235,0.25)' : val > 0 ? `rgba(5,150,105,${Math.min(0.1 + val / maxVal, 0.5)})` : T.surface}"
                stroke="${T.border}" stroke-width="0.5" />
          <text x="${ox + j * cw + cw / 2}" y="${oy + i * ch + ch / 2 + 4}" text-anchor="middle"
                font-size="10" fill="${val > 0 ? T.text : T.muted}"
                font-family="monospace" font-weight="${val > 0 ? 700 : 400}">${val}</text>
        `;
      }).join('')
    ).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${(capacity + 1) * cw + ox + 20} ${(n + 1) * ch + oy + 30}">
        <text x="${ox}" y="${oy - 25}" font-size="13" fill="${T.muted}" font-family="monospace">0/1 Knapsack (Weights: [${W || KS_W}], Values: [${V || KS_V}], Cap: ${CAP || KS_CAP})</text>
        ${colHeaders}${rowHeaders}${cells}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── COIN CHANGE CANVAS ───────────────────────────────────────────────
export function CoinChangeCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { dp, current, COINS, TARGET } = state;
    const coins = COINS || [1, 3, 4];
    const target = TARGET || 6;
    const cw = 50, ch = 36, ox = 60, oy = 70;

    const cells = Array.from({ length: target + 1 }, (_, i) => {
      const val = dp?.[i] ?? (i === 0 ? 0 : Infinity);
      const isActive = i === current;
      const display = val === Infinity ? '∞' : String(val);
      return `
        <rect x="${ox + i * cw + 1}" y="${oy + 1}" width="${cw - 2}" height="${ch - 2}"
              fill="${isActive ? T.amber : val < Infinity && val > 0 ? 'rgba(5,150,105,0.2)' : T.surface}"
              stroke="${isActive ? T.amber : T.border}" stroke-width="${isActive ? 2 : 1}" rx="3" />
        <text x="${ox + i * cw + cw / 2}" y="${oy + ch / 2 + 5}" text-anchor="middle"
              font-size="13" fill="${isActive ? '#fff' : val < Infinity ? T.text : T.muted}"
              font-family="monospace" font-weight="700">${display}</text>
        <text x="${ox + i * cw + cw / 2}" y="${oy + ch + 18}" text-anchor="middle"
              font-size="10" fill="${T.muted}" font-family="monospace">${i}</text>
      `;
    }).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${(target + 1) * cw + ox * 2} ${oy + ch + 50}">
        <text x="${ox}" y="${oy - 30}" font-size="13" fill="${T.muted}" font-family="monospace">Coin Change (Target: ${target}, Coins: [${coins}])</text>
        <text x="${ox}" y="${oy - 12}" font-size="11" fill="${T.muted}" font-family="monospace">dp[i] = min coins to make amount i</text>
        ${cells}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── MATRIX CHAIN CANVAS ───────────────────────────────────────────────
export function MatrixChainCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { dp, split, ci, cj, dims } = state;
    const dimensions = dims || [10, 20, 30, 40, 30];
    const n = dimensions.length - 1;
    const cw = 100, ch = 60, ox = 80, oy = 80;

    const cells = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => {
        const val = dp?.[i]?.[j] ?? Infinity;
        const isActive = i === ci && j === cj;
        const splitPoint = split?.[i]?.[j];
        const fill = isActive ? T.violet : val !== Infinity ? `rgba(37,99,235,${Math.min(0.1 + val / 10000, 0.4)})` : T.surface;
        const display = val === Infinity ? '∞' : val;
        return `
          <rect x="${ox + j * cw + 1}" y="${oy + i * ch + 1}" width="${cw - 2}" height="${ch - 2}"
                fill="${fill}" stroke="${isActive ? T.violet : T.border}" stroke-width="${isActive ? 2 : 0.5}" rx="3" />
          <text x="${ox + j * cw + cw / 2}" y="${oy + i * ch + ch / 2 + 5}" text-anchor="middle"
                font-size="10" fill="${isActive ? '#fff' : val !== Infinity ? T.text : T.muted}"
                font-family="monospace" font-weight="${val !== Infinity ? 700 : 400}">${display}</text>
          ${splitPoint !== undefined && splitPoint !== -1 ? `
            <text x="${ox + j * cw + cw / 2}" y="${oy + i * ch + 10}" text-anchor="middle"
                  font-size="8" fill="${T.amber}" font-family="monospace">k=${splitPoint}</text>
          ` : ''}
        `;
      }).join('')
    ).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" style="width: 100%; height: 100%;">
        <text x="${ox}" y="${oy - 30}" font-size="18" fill="${T.muted}" font-family="monospace">Matrix Chain (dims: [${dimensions.join(' x ')}])</text>
        ${cells}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── LIS CANVAS ───────────────────────────────────────────────
export function LISCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { arr, dp, lis, maxIdx } = state;
    if (!arr || !arr.length) return;
    const barWidth = 44, maxHeight = 200, ox = 40, oy = 60;
    const maxVal = Math.max(...arr, 1);

    const bars = arr.map((val, i) => {
      const x = ox + i * barWidth;
      const height = (val / maxVal) * maxHeight;
      const isInLIS = lis && lis.includes(i);
      const isMaxIdx = i === maxIdx;
      const dpVal = dp?.[i] ?? 0;
      return `
        <rect x="${x}" y="${oy + maxHeight - height}" width="${barWidth - 2}" height="${height}"
              fill="${isInLIS ? T.green : T.surface}" stroke="${isMaxIdx ? T.amber : T.border}" stroke-width="${isMaxIdx ? 2 : 1}" />
        <text x="${x + barWidth / 2}" y="${oy + maxHeight + 14}" text-anchor="middle"
              font-size="10" fill="${T.text}" font-family="monospace">${val}</text>
        <text x="${x + barWidth / 2}" y="${oy + maxHeight + 26}" text-anchor="middle"
              font-size="9" fill="${T.muted}" font-family="monospace">dp:${dpVal}</text>
        ${isInLIS ? `<text x="${x + barWidth / 2}" y="${oy + maxHeight - height - 6}" text-anchor="middle" font-size="8" fill="${T.amber}" font-family="monospace">LIS</text>` : ''}
      `;
    }).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${arr.length * barWidth + 80} ${maxHeight + 120}">
        <text x="${ox}" y="${oy - 20}" font-size="13" fill="${T.muted}" font-family="monospace">Longest Increasing Subsequence</text>
        ${bars}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── SUBSET SUM CANVAS ───────────────────────────────────────────────
export function SubsetSumCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { nums, dp, solution, target } = state;
    if (!nums) return;
    const n = nums.length;
    const cs = 38, ox = 60, oy = 70;

    const colHeaders = Array.from({ length: target + 1 }, (_, j) =>
      `<text x="${ox + j * cs + cs / 2}" y="${oy - 8}" text-anchor="middle" font-size="11" fill="${T.accent}" font-family="monospace">${j}</text>`
    ).join('');
    const rowHeaders = Array.from({ length: n + 1 }, (_, i) =>
      `<text x="${ox - 8}" y="${oy + i * cs + cs / 2 + 4}" text-anchor="end" font-size="11" fill="${T.accent}" font-family="monospace">${i === 0 ? '-' : nums[i - 1]}</text>`
    ).join('');

    const cells = Array.from({ length: n + 1 }, (_, i) =>
      Array.from({ length: target + 1 }, (_, j) => {
        const isPossible = dp?.[i]?.[j];
        const isSelected = solution && solution.includes(nums[i - 1]) && j === target;
        return `
          <rect x="${ox + j * cs + 1}" y="${oy + i * cs + 1}" width="${cs - 2}" height="${cs - 2}"
                fill="${isPossible ? T.green : T.surface}" stroke="${isSelected ? T.amber : T.border}"
                stroke-width="${isSelected ? 2 : 0.5}" rx="3" />
          <text x="${ox + j * cs + cs / 2}" y="${oy + i * cs + cs / 2 + 4}" text-anchor="middle"
                font-size="13" fill="${isPossible ? 'white' : T.muted}" font-family="monospace">${isPossible ? '✓' : ''}</text>
        `;
      }).join('')
    ).join('');

    const solutionText = solution && solution.length > 0
      ? `<text x="${ox}" y="${oy + (n + 1) * cs + 20}" font-size="12" fill="${T.green}" font-family="monospace">Solution: [${solution.join(', ')}]</text>`
      : '';

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${(target + 1) * cs + ox + 20} ${(n + 1) * cs + oy + 50}">
        <text x="${ox}" y="${oy - 25}" font-size="13" fill="${T.muted}" font-family="monospace">Subset Sum (Target: ${target}, Nums: [${nums ? nums.join(', ') : ''}])</text>
        ${colHeaders}${rowHeaders}${cells}${solutionText}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── KMP CANVAS ───────────────────────────────────────────────
export function KMPCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { text, pattern, s, j, found } = state;
    if (!text || !pattern) return;
    const cs = 28, ox = 30, oy = 50;

    const textCells = text.split('').map((ch, idx) => {
      const isWindow = s !== undefined && idx >= s && idx < s + pattern.length;
      const isMatch = j !== undefined && isWindow && idx - s < j;
      const fill = isMatch ? T.green : isWindow ? T.accent : T.surface;
      return `
        <rect x="${ox + idx * cs + 1}" y="${oy + 1}" width="${cs - 2}" height="${cs - 2}"
              fill="${fill}" stroke="${T.border}" stroke-width="1" rx="2" />
        <text x="${ox + idx * cs + cs / 2}" y="${oy + cs / 2 + 5}" text-anchor="middle"
              font-size="13" fill="${isWindow ? 'white' : T.text}" font-family="monospace" font-weight="700">${ch}</text>
        <text x="${ox + idx * cs + cs / 2}" y="${oy + cs + 15}" text-anchor="middle"
              font-size="9" fill="${T.muted}" font-family="monospace">${idx}</text>
      `;
    }).join('');

    const patternCells = pattern.split('').map((ch, idx) => {
      const fill = j !== undefined && idx < j ? T.green : T.surface;
      return `
        <rect x="${ox + (s !== undefined ? s : 0) * cs + idx * cs + 1}" y="${oy + cs + 30 + 1}" width="${cs - 2}" height="${cs - 2}"
              fill="${fill}" stroke="${T.accent}" stroke-width="1" rx="2" />
        <text x="${ox + (s !== undefined ? s : 0) * cs + idx * cs + cs / 2}" y="${oy + cs + 30 + cs / 2 + 5}" text-anchor="middle"
              font-size="13" fill="${fill === T.surface ? T.text : 'white'}" font-family="monospace" font-weight="700">${ch}</text>
      `;
    }).join('');

    const foundText = found
      ? `<text x="${ox}" y="${oy + cs * 2 + 70}" font-size="13" fill="${T.green}" font-family="monospace" font-weight="700">Match found at position ${s}!</text>`
      : '';

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${text.length * cs + ox * 2} ${oy + cs * 2 + 90}">
        <text x="${ox}" y="${oy - 15}" font-size="12" fill="${T.muted}" font-family="monospace">Text:</text>
        ${textCells}
        <text x="${ox}" y="${oy + cs + 28}" font-size="12" fill="${T.accent}" font-family="monospace">Pattern (at ${s ?? 0}):</text>
        ${patternCells}
        ${foundText}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── RABIN-KARP CANVAS ───────────────────────────────────────────────
export function RabinKarpCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { text, pattern, t, s, found } = state;
    if (!text || !pattern) return;
    const cs = 28, ox = 30, oy = 50;

    const textCells = text.split('').map((ch, idx) => {
      const pos = s !== undefined ? s : 0;
      const isWindow = idx >= pos && idx < pos + pattern.length;
      const fill = isWindow ? T.accent : T.surface;
      return `
        <rect x="${ox + idx * cs + 1}" y="${oy + 1}" width="${cs - 2}" height="${cs - 2}"
              fill="${fill}" stroke="${T.border}" stroke-width="1" rx="2" />
        <text x="${ox + idx * cs + cs / 2}" y="${oy + cs / 2 + 5}" text-anchor="middle"
              font-size="13" fill="${isWindow ? 'white' : T.text}" font-family="monospace" font-weight="700">${ch}</text>
        <text x="${ox + idx * cs + cs / 2}" y="${oy + cs + 15}" text-anchor="middle"
              font-size="9" fill="${T.muted}" font-family="monospace">${idx}</text>
      `;
    }).join('');

    const foundText = found
      ? `<text x="${ox}" y="${oy + cs + 65}" font-size="13" fill="${T.green}" font-family="monospace" font-weight="700">Match found at position ${s}!</text>`
      : '';

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${text.length * cs + ox * 2} ${oy + cs + 80}">
        <text x="${ox}" y="${oy - 15}" font-size="12" fill="${T.muted}" font-family="monospace">Text (Rabin-Karp, window at ${s ?? 0}):</text>
        ${textCells}
        <text x="${ox}" y="${oy + cs + 35}" font-size="11" fill="${T.amber}" font-family="monospace">Pattern hash: ${t ?? 'N/A'} | Pattern: "${pattern}"</text>
        ${foundText}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── BOYER-MOORE CANVAS ───────────────────────────────────────────────
export function BoyerMooreCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { text, pattern, s, j, shift, found } = state;
    if (!text || !pattern) return;
    const cs = 28, ox = 30, oy = 50;

    const textCells = text.split('').map((ch, idx) => {
      const pos = s !== undefined ? s : 0;
      const isWindow = idx >= pos && idx < pos + pattern.length;
      const fill = isWindow ? T.accent : T.surface;
      return `
        <rect x="${ox + idx * cs + 1}" y="${oy + 1}" width="${cs - 2}" height="${cs - 2}"
              fill="${fill}" stroke="${T.border}" stroke-width="1" rx="2" />
        <text x="${ox + idx * cs + cs / 2}" y="${oy + cs / 2 + 5}" text-anchor="middle"
              font-size="13" fill="${isWindow ? 'white' : T.text}" font-family="monospace" font-weight="700">${ch}</text>
        <text x="${ox + idx * cs + cs / 2}" y="${oy + cs + 15}" text-anchor="middle"
              font-size="9" fill="${T.muted}" font-family="monospace">${idx}</text>
      `;
    }).join('');

    const patternCells = pattern.split('').map((ch, idx) => {
      const pos = s !== undefined ? s : 0;
      const isCurrent = j !== undefined && idx === pattern.length - 1 - j;
      const fill = isCurrent ? T.red : T.surface;
      return `
        <rect x="${ox + pos * cs + idx * cs + 1}" y="${oy + cs + 30 + 1}" width="${cs - 2}" height="${cs - 2}"
              fill="${fill}" stroke="${isCurrent ? T.red : T.accent}" stroke-width="1" rx="2" />
        <text x="${ox + pos * cs + idx * cs + cs / 2}" y="${oy + cs + 30 + cs / 2 + 5}" text-anchor="middle"
              font-size="13" fill="${T.text}" font-family="monospace" font-weight="700">${ch}</text>
      `;
    }).join('');

    const foundText = found
      ? `<text x="${ox}" y="${oy + cs * 2 + 75}" font-size="13" fill="${T.green}" font-family="monospace" font-weight="700">Pattern found at position ${s}!</text>`
      : shift !== undefined
      ? `<text x="${ox}" y="${oy + cs * 2 + 75}" font-size="12" fill="${T.amber}" font-family="monospace">Shift by ${shift}</text>`
      : '';

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${Math.max(text.length * cs + ox * 2 + 200, pattern.length * cs + ox * 2 + 200)} ${Math.max(oy + cs * 2 + 95, pattern.length * cs + 80) + 200}">
        <text x="${ox}" y="${oy - 15}" font-size="12" fill="${T.muted}" font-family="monospace">Text (Boyer-Moore):</text>
        ${textCells}
        <text x="${ox}" y="${oy + cs + 28}" font-size="12" fill="${T.accent}" font-family="monospace">Pattern (at ${s ?? 0}):</text>
        ${patternCells}
        ${foundText}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}

// ─── EDIT DISTANCE CANVAS ───────────────────────────────────────────────
export function EditDistanceCanvas({ state }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!state || !ref.current) return;
    const { dp, ci, cj, str1, str2 } = state;
    if (!str1 || !str2) return;
    const m = str1.length, n = str2.length;
    const cw = 40, ch = 32, ox = 60, oy = 60;
    const maxVal = dp ? Math.max(1, ...dp.flat()) : 1;

    const colHeaders = Array.from({ length: n + 1 }, (_, j) =>
      `<text x="${ox + (j + 1) * cw + cw / 2}" y="${oy - 8}" text-anchor="middle" font-size="13"
             fill="${T.accent}" font-family="monospace" font-weight="700">${j === 0 ? '' : str2[j - 1]}</text>`
    ).join('');
    const rowHeaders = Array.from({ length: m + 1 }, (_, i) =>
      `<text x="${ox - 8}" y="${oy + (i + 1) * ch + ch / 2 + 4}" text-anchor="end" font-size="13"
             fill="${T.accent}" font-family="monospace" font-weight="700">${i === 0 ? '' : str1[i - 1]}</text>`
    ).join('');

    const cells = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => {
        const val = dp?.[i]?.[j] ?? 0;
        const isActive = i === ci && j === cj;
        return `
          <rect x="${ox + (j + 1) * cw + 1}" y="${oy + (i + 1) * ch + 1}" width="${cw - 2}" height="${ch - 2}"
                fill="${isActive ? T.violet : val > 0 ? `rgba(37,99,235,${Math.min(0.1 + val / maxVal, 0.4)})` : T.surface}"
                stroke="${isActive ? T.violet : T.border}" stroke-width="${isActive ? 2 : 0.5}" />
          <text x="${ox + (j + 1) * cw + cw / 2}" y="${oy + (i + 1) * ch + ch / 2 + 4}" text-anchor="middle"
                font-size="11" fill="${isActive ? '#fff' : val > 0 ? T.text : T.muted}"
                font-family="monospace" font-weight="${val > 0 ? 700 : 400}">${val}</text>
        `;
      }).join('')
    ).join('');

    ref.current.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${(n + 2) * cw + ox + 10} ${(m + 2) * ch + oy + 30}">
        <text x="${ox}" y="${oy - 25}" font-size="13" fill="${T.muted}" font-family="monospace">Edit Distance: "${str1}" → "${str2}"</text>
        ${colHeaders}${rowHeaders}${cells}
      </svg>
    `;
  }, [state]);

  return <div ref={ref} style={{ width: "100%", height: "100%", overflow: "auto" }} />;
}
