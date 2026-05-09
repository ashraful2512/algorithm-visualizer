import { useState, useEffect, useRef, useCallback } from "react";
import { 
  SortingCanvas, 
  GraphCanvas, 
  FibCanvas, 
  LCSCanvas, 
  KnapsackCanvas, 
  CoinChangeCanvas, 
  TreeCanvas, 
  KMPCanvas, 
  RabinKarpCanvas, 
  BoyerMooreCanvas, 
  EditDistanceCanvas,
  MatrixChainCanvas,
  LISCanvas,
  SubsetSumCanvas
} from './components/CanvasComponents';
import {
  bubbleGen, mergeGen, quickGen, insertionGen, selectionGen, heapGen, shellGen, countingGen, radixGen, bucketGen, timGen, cocktailGen, gnomeGen,
  dijkstraGen, kruskalGen, bellmanFordGen, floydWarshallGen, bfsGen, dfsGen, primGen, topologicalGen, kosarajuGen, astarGen, fordFulkersonGen,
  fibGen, lcsGen, knapsackGen, coinChangeGen, inorderGen, preorderGen, postorderGen, levelorderGen,
  kmpGen, rabinKarpGen, boyerMooreGen, editDistanceGen, matrixChainGen, lisGen, subsetSumGen
} from './components/AlgorithmGenerators';
import { T, globalStyles } from './constants/theme';
import { ALGOS, SIMPLE_EXPLANATIONS } from './constants/algorithms';
import { generateSortingArray, generateGraph, generateRandomStrings, generateRandomKnapsackData, generateRandomCoinChangeData, generateRandomMatrixChainData, generateRandomLISData, generateRandomSubsetSumData, generateRandomStringData } from './utils/helpers';
import { Btn, InfoSection } from './components/UIComponents';

function HighlightMatch({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "rgba(37,99,235,0.2)", color: T.accent, borderRadius: 2, padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function AlgoViz() {
  const [selected, setSelected] = useState(null);
  const [arrSize, setArrSize] = useState(32);
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [stats, setStats] = useState({ cmp: 0, sw: 0, ms: 0 });
  const [status, setStatus] = useState("idle");
  const [graph, setGraph] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const canvasRef = useRef(null);

  const isSorting = (id) => ["bubble","merge","quick","insertion","selection","heap","shell","counting","radix","bucket","tim","cocktail","gnome"].includes(id);
  const isGraph = (id) => ["dijkstra","kruskal","bellman-ford","floyd-warshall","bfs","dfs","prim","topological","kosaraju","astar","ford-fulkerson"].includes(id);
  const isTree = (id) => ["inorder","preorder","postorder","levelorder"].includes(id);
  const isDP = (id) => ["fibonacci","lcs","knapsack","coinchange","matrixchain","lis","subsetsum"].includes(id);
  const isString = (id) => ["kmp","rabin-karp","boyer-moore","edit-distance"].includes(id);

  const getDelay = () => Math.max(8, 700 - speed * 65);

  const buildSteps = useCallback((algo, arr, g) => {
    const genMap = {
      bubble: () => bubbleGen(arr),
      merge: () => mergeGen(arr),
      quick: () => quickGen(arr),
      insertion: () => insertionGen(arr),
      selection: () => selectionGen(arr),
      heap: () => heapGen(arr),
      shell: () => shellGen(arr),
      counting: () => countingGen(arr),
      radix: () => radixGen(arr),
      bucket: () => bucketGen(arr),
      tim: () => timGen(arr),
      cocktail: () => cocktailGen(arr),
      gnome: () => gnomeGen(arr),
      dijkstra: () => dijkstraGen(g.nodes, g.edges),
      kruskal: () => kruskalGen(g.nodes, g.edges),
      "bellman-ford": () => bellmanFordGen(g.nodes, g.edges),
      "floyd-warshall": () => floydWarshallGen(g.nodes, g.edges),
      bfs: () => bfsGen(g.nodes, g.edges),
      dfs: () => dfsGen(g.nodes, g.edges),
      prim: () => primGen(g.nodes, g.edges),
      topological: () => topologicalGen(g.nodes, g.edges),
      kosaraju: () => kosarajuGen(g.nodes, g.edges),
      astar: () => astarGen(g.nodes, g.edges),
      "ford-fulkerson": () => fordFulkersonGen(g.nodes, g.edges),
      inorder: () => inorderGen(),
      preorder: () => preorderGen(),
      postorder: () => postorderGen(),
      levelorder: () => levelorderGen(),
      fibonacci: () => fibGen(),
      lcs: () => {
        const { str1, str2 } = generateRandomStrings();
        return lcsGen(str1, str2);
      },
      knapsack: () => {
        const { weights, values, capacity } = generateRandomKnapsackData();
        return knapsackGen(weights, values, capacity);
      },
      coinchange: () => {
        const { coins, target } = generateRandomCoinChangeData();
        return coinChangeGen(coins, target);
      },
      matrixchain: () => {
        const dims = generateRandomMatrixChainData();
        return matrixChainGen(dims);
      },
      lis: () => {
        const arr = generateRandomLISData();
        return lisGen(arr);
      },
      subsetsum: () => {
        const { nums, target } = generateRandomSubsetSumData();
        return subsetSumGen(nums, target);
      },
      kmp: () => {
        const text = generateRandomStringData();
        const pattern = generateRandomStringData(4, 8);
        return kmpGen(text, pattern);
      },
      "rabin-karp": () => {
        const text = generateRandomStringData();
        const pattern = generateRandomStringData(4, 8);
        return rabinKarpGen(text, pattern);
      },
      "boyer-moore": () => {
        const text = generateRandomStringData();
        const pattern = generateRandomStringData(4, 8);
        return boyerMooreGen(text, pattern);
      },
      "edit-distance": () => {
        const str1 = generateRandomStringData();
        const str2 = generateRandomStringData();
        return editDistanceGen(str1, str2);
      },
    };
    // Generate steps with timeout to prevent infinite loops
    const steps = [];
    const gen = genMap[algo]();
    const startTime = Date.now();
    const timeout = 5000; // 5 second max for step generation
    
    let step;
    while (!(step = gen.next()).done) {
      steps.push(step.value);
      
      // Check if we've been running too long
      if (Date.now() - startTime > timeout) {
        console.warn(`Algorithm ${algo} step generation timed out after ${timeout}ms`);
        break;
      }
    }
    
    return steps;
  }, []);

  const freshArray = useCallback(() => generateSortingArray(arrSize), [arrSize]);

  const freshGraph = useCallback(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return generateGraph(rect?.width || 700, rect?.height || 380);
  }, []);

  const selectAlgo = useCallback((algo) => {
    clearInterval(timerRef.current);
    setRunning(false);
    setStatus("idle");
    setSelected(algo);
    setStats({ cmp: 0, sw: 0, ms: 0 });
    setSearchQuery("");
    const arr = freshArray();
    const g = isGraph(algo) ? freshGraph() : null;
    setGraph(g);
    const s = buildSteps(algo, arr, g);
    setSteps(s);
    setStepIdx(0);
  }, [freshArray, freshGraph, buildSteps]);

  const newData = useCallback(() => {
    if (!selected) return;
    clearInterval(timerRef.current);
    setRunning(false);
    setStatus("idle");
    setStats({ cmp: 0, sw: 0, ms: 0 });
    const arr = freshArray();
    const g = isGraph(selected) ? freshGraph() : null;
    setGraph(g);
    const s = buildSteps(selected, arr, g);
    setSteps(s);
    setStepIdx(0);
  }, [selected, freshArray, freshGraph, buildSteps]);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setRunning(false);
    setStatus("idle");
    setStats({ cmp: 0, sw: 0, ms: 0 });
    setStepIdx(0);
    startTimeRef.current = null;
  }, []);

  const stepForward = useCallback(() => {
    if (!steps.length) return;
    const idx = stepIdx;
    if (idx < steps.length) {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      setStepIdx(idx + 1);
      setStats(prev => ({
        cmp: prev.cmp + (steps[idx].cmp || 0),
        sw: prev.sw + (steps[idx].sw || 0),
        ms: Date.now() - (startTimeRef.current || Date.now()),
      }));
      if (idx + 1 >= steps.length) setStatus("done");
    }
  }, [steps, stepIdx]);

  const toggleRun = useCallback(() => {
    if (status === "done") return;
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
      setStatus("paused");
    } else {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      setRunning(true);
      setStatus("running");
    }
  }, [running, status]);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setStepIdx(prev => {
        if (prev >= steps.length) {
          clearInterval(timerRef.current);
          setRunning(false);
          setStatus("done");
          return prev;
        }
        const s = steps[prev];
        setStats(p => ({
          cmp: p.cmp + (s?.cmp || 0),
          sw: p.sw + (s?.sw || 0),
          ms: Date.now() - (startTimeRef.current || Date.now()),
        }));
        return prev + 1;
      });
    }, getDelay());
    return () => clearInterval(timerRef.current);
  }, [running, steps, speed]);

  // Keyboard shortcut: press "/" to focus search
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSearchQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const currentStep = steps[Math.max(0, stepIdx - 1)];
  const meta = selected ? [...ALGOS.sorting, ...ALGOS.graph, ...ALGOS.dp, ...ALGOS.string].find(a => a.id === selected) : null;
  const statusColor = status === "running" ? T.green : status === "done" ? T.amber : status === "paused" ? T.accent : T.muted;
  const progress = steps.length > 0 ? (stepIdx / steps.length) * 100 : 0;

  const q = searchQuery.trim().toLowerCase();
  const SECTIONS = [
    { label: "SORTING",       algos: ALGOS.sorting, color: T.accent  },
    { label: "GRAPH",         algos: ALGOS.graph,   color: T.violet  },
    { label: "DYNAMIC PROG.", algos: ALGOS.dp,       color: T.green   },
    { label: "STRING",        algos: ALGOS.string,  color: T.amber   },
  ];
  const filtered = SECTIONS.map(s => ({
    ...s,
    algos: q ? s.algos.filter(a => a.name.toLowerCase().includes(q)) : s.algos,
  }));
  const totalResults = filtered.reduce((n, s) => n + s.algos.length, 0);

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: T.bg }}>

        {/* ── HEADER ── */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 32px", height: 64,
          borderBottom: `1px solid ${T.border}`,
          background: T.bg,
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 36, height: 36,
              background: T.accent,
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "white",
            }}>⬡</div>
            <span style={{
              fontFamily: "Inter", fontSize: "1.5rem", fontWeight: 600,
              color: T.text,
            }}>AlgoViz</span>
          </div>
          {meta && (
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.875rem", color: T.text, fontWeight: 500 }}>{meta.name}</div>
                <div style={{ fontSize: "0.75rem", color: T.muted }}>
                  Time: <span style={{ color: T.amber, fontWeight: 500 }}>{meta.time}</span> &nbsp;
                  Space: <span style={{ color: T.amber, fontWeight: 500 }}>{meta.space}</span>
                </div>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: statusColor,
              }} />
            </div>
          )}
        </header>

        {/* ── BODY ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

          {/* ── SIDEBAR ── */}
          <aside style={{
            width: 240, flexShrink: 0,
            borderRight: `1px solid ${T.border}`,
            background: T.surface,
            display: "flex", flexDirection: "column",
          }}>
            {/* Search Bar */}
            <div style={{
              padding: "12px 12px 10px",
              borderBottom: `1px solid ${T.border}`,
              flexShrink: 0,
            }}>
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                  color: T.muted, fontSize: 13, pointerEvents: "none",
                }}>🔍</span>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search algorithms…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 28px 8px 30px",
                    background: T.bg, border: `1px solid ${T.border}`,
                    borderRadius: 7, color: T.text,
                    fontFamily: "Inter", fontSize: "0.8125rem",
                    outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={e => { e.target.style.borderColor = T.accent; }}
                  onBlur={e => { e.target.style.borderColor = T.border; }}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
                    style={{
                      position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: T.muted, fontSize: 14, lineHeight: 1, padding: 2,
                    }}
                  >✕</button>
                )}
              </div>
              {q && (
                <div style={{ fontSize: "0.7rem", color: T.muted, marginTop: 6, paddingLeft: 2 }}>
                  {totalResults === 0 ? "No results" : `${totalResults} result${totalResults !== 1 ? "s" : ""}`}
                </div>
              )}
            </div>

            {/* Algorithm List */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              {totalResults === 0 && q ? (
                <div style={{
                  padding: "32px 20px", textAlign: "center",
                  color: T.muted, fontSize: "0.8125rem",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🔎</div>
                  No algorithms match<br />
                  <span style={{ color: T.accent, fontWeight: 500 }}>"{searchQuery}"</span>
                </div>
              ) : (
                filtered.map(({ label, algos, color }) => {
                  if (algos.length === 0) return null;
                  return (
                    <div key={label}>
                      <div style={{
                        fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.07em",
                        color: T.muted, padding: "18px 16px 8px",
                        textTransform: "uppercase",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <span style={{
                          display: "inline-block", width: 6, height: 6,
                          borderRadius: "50%", background: color, flexShrink: 0,
                        }} />
                        {label}
                        {q && (
                          <span style={{
                            marginLeft: "auto", fontSize: "0.65rem",
                            background: color + "22", color: color,
                            borderRadius: 10, padding: "1px 7px", fontWeight: 500,
                          }}>{algos.length}</span>
                        )}
                      </div>
                      {algos.map(a => (
                        <button key={a.id} onClick={() => selectAlgo(a.id)}
                          style={{
                            display: "flex", alignItems: "center",
                            width: "100%", padding: "10px 16px 10px 20px",
                            background: selected === a.id ? color : "transparent",
                            border: "none",
                            borderLeft: selected === a.id ? `3px solid ${color}` : "3px solid transparent",
                            cursor: "pointer",
                            color: selected === a.id ? "white" : T.text,
                            fontFamily: "Inter", fontSize: "0.8125rem",
                            textAlign: "left", transition: "background 0.15s",
                          }}
                          onMouseEnter={e => { if (selected !== a.id) e.currentTarget.style.background = T.panel; }}
                          onMouseLeave={e => { if (selected !== a.id) e.currentTarget.style.background = "transparent"; }}
                        >
                          <HighlightMatch text={a.name} query={q} />
                        </button>
                      ))}
                    </div>
                  );
                })
              )}
            </div>

            {/* Keyboard hint */}
            <div style={{
              padding: "8px 12px",
              borderTop: `1px solid ${T.border}`,
              fontSize: "0.65rem", color: T.muted,
              display: "flex", alignItems: "center", gap: 4,
              flexShrink: 0,
            }}>
              <kbd style={{
                background: T.border, borderRadius: 3, padding: "1px 5px",
                fontFamily: "monospace", fontSize: "0.65rem", color: T.muted,
              }}>/</kbd>
              to search &nbsp;·&nbsp;
              <kbd style={{
                background: T.border, borderRadius: 3, padding: "1px 5px",
                fontFamily: "monospace", fontSize: "0.65rem", color: T.muted,
              }}>Esc</kbd>
              to clear
            </div>
          </aside>

          {/* ── MAIN CANVAS ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>

            {/* ── CONTROLS ── */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
              padding: "16px 24px",
              borderBottom: `1px solid ${T.border}`,
              background: T.bg, flexShrink: 0,
            }}>
              <Btn primary disabled={!selected || status === "done"} onClick={toggleRun}>
                {running ? "Pause" : status === "paused" ? "Resume" : "Run"}
              </Btn>
              <Btn disabled={!selected || running || status === "done"} onClick={stepForward}>Step</Btn>
              <Btn disabled={!selected} onClick={reset}>Reset</Btn>
              <Btn disabled={!selected} onClick={newData}>New Data</Btn>
              <div style={{ width: 1, height: 24, background: T.border, margin: "0 8px" }} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: T.muted }}>
                Speed
                <input type="range" min={1} max={10} value={speed}
                  onChange={e => setSpeed(+e.target.value)}
                  style={{ width: 100, accentColor: T.accent }} />
              </label>
              {selected && isSorting(selected) && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.875rem", color: T.muted }}>
                  Size
                  <input type="number" min={8} max={80} value={arrSize}
                    onChange={e => setArrSize(+e.target.value)}
                    onBlur={newData}
                    style={{
                      width: 60, padding: "6px 8px",
                      background: T.surface, border: `1px solid ${T.border}`,
                      color: T.text, fontFamily: "Inter",
                      fontSize: "0.875rem", borderRadius: 6,
                    }} />
                </label>
              )}
              {selected && (
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 140, height: 4, background: T.border, borderRadius: 2 }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${progress}%`,
                      background: T.accent,
                      transition: "width 0.2s",
                    }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: T.muted, fontWeight: 500 }}>{Math.round(progress)}%</span>
                </div>
              )}
            </div>

            {/* ── VISUALIZATION ── */}
            <div ref={canvasRef} style={{
              flex: 1, position: "relative", overflow: "hidden",
              background: T.surface,
            }}>
              {!selected && (
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center", color: T.muted,
                }}>
                  <div style={{ fontSize: "1.25rem", fontWeight: 500, marginBottom: 8 }}>Select an algorithm to begin</div>
                  <div style={{ fontSize: "0.875rem" }}>Search or choose from the sidebar →</div>
                </div>
              )}
              {selected && isSorting(selected) && <SortingCanvas state={currentStep} />}
              {selected && isGraph(selected) && <GraphCanvas graph={graph} state={currentStep} />}
              {selected && isTree(selected) && <TreeCanvas graph={graph} state={currentStep} />}
              {selected && isDP(selected) && (
                {
                  fibonacci: <FibCanvas state={currentStep} />,
                  lcs: <LCSCanvas state={currentStep} />,
                  knapsack: <KnapsackCanvas state={currentStep} />,
                  coinchange: <CoinChangeCanvas state={currentStep} />,
                  matrixchain: <MatrixChainCanvas state={currentStep} />,
                  lis: <LISCanvas state={currentStep} />,
                  subsetsum: <SubsetSumCanvas state={currentStep} />,
                }[selected]
              )}
              {selected && isString(selected) && (
                {
                  kmp: <KMPCanvas state={currentStep} />,
                  "rabin-karp": <RabinKarpCanvas state={currentStep} />,
                  "boyer-moore": <BoyerMooreCanvas state={currentStep} />,
                  "edit-distance": <EditDistanceCanvas state={currentStep} />,
                }[selected]
              )}
            </div>

            {/* ── STATS ── */}
            {selected && (
              <div style={{
                display: "flex", alignItems: "center", gap: 24,
                padding: "12px 24px",
                borderTop: `1px solid ${T.border}`,
                background: T.bg, flexShrink: 0,
                fontFamily: "Inter", fontSize: "0.875rem",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.accent }} />
                  <span style={{ color: T.muted }}>Comparisons:</span>
                  <span style={{ fontWeight: 600, color: T.text }}>{stats.cmp}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.violet }} />
                  <span style={{ color: T.muted }}>Swaps:</span>
                  <span style={{ fontWeight: 600, color: T.text }}>{stats.sw}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.amber }} />
                  <span style={{ color: T.muted }}>Time:</span>
                  <span style={{ fontWeight: 600, color: T.text }}>{stats.ms}ms</span>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: T.muted }}>Step:</span>
                  <span style={{ fontWeight: 600, color: T.text }}>{stepIdx}/{steps.length}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── INFO PANEL ── */}
          {selected && (
            <aside style={{
              width: 320, flexShrink: 0,
              borderLeft: `1px solid ${T.border}`,
              background: T.surface,
              overflowY: "auto",
              minHeight: 0,
            }}>
              <InfoSection title="Description">
                <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                  {meta?.description}
                </div>
              </InfoSection>
              <InfoSection title="Pseudocode">
                <pre style={{
                  fontSize: "0.75rem", color: T.muted, lineHeight: 1.5,
                  fontFamily: "'Fira Code', monospace",
                  whiteSpace: "pre-wrap",
                  background: T.bg, padding: 12, borderRadius: 6,
                  border: `1px solid ${T.border}`,
                }}>{meta?.pseudocode}</pre>
              </InfoSection>
              <InfoSection title="Complexity">
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: T.muted, fontSize: "0.875rem" }}>Time:</span>
                    <span style={{ color: T.amber, fontWeight: 500, fontSize: "0.875rem" }}>{meta?.time}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: T.muted, fontSize: "0.875rem" }}>Space:</span>
                    <span style={{ color: T.amber, fontWeight: 500, fontSize: "0.875rem" }}>{meta?.space}</span>
                  </div>
                </div>
              </InfoSection>
              <InfoSection title="Use Cases">
                <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                  {meta?.useCases?.map((use, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>{use.title}</div>
                      <div style={{ color: T.muted, fontSize: "0.8125rem" }}>{use.desc}</div>
                    </div>
                  ))}
                </div>
              </InfoSection>
              <InfoSection title="How It Works">
                <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                  {SIMPLE_EXPLANATIONS[selected]}
                </div>
              </InfoSection>
              {selected === "bubble" && (
                <InfoSection title="How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being compared</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being swapped</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (in final position)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Bar Heights:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Each bar represents an array element</div>
                        <div style={{ marginBottom: 4 }}>Height indicates element's value</div>
                        <div style={{ marginBottom: 4 }}>Position shows array index</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Compare adjacent elements (blue bars)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> If left {"<"} right, swap them (amber bars)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Move to next pair, repeat until end</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Largest element bubbles to the end (green)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Repeat for remaining unsorted portion</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Watch how larger elements gradually move to the right like bubbles rising to the surface!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "quick" && (
                <InfoSection title="⚡ How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being compared to pivot</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being swapped with pivot</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (in final position)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                        <div style={{ marginBottom: 4 }}>🔴 <strong>Red Element</strong>: Current pivot element</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Pivot Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Pivot divides array into smaller/larger parts</div>
                        <div style={{ marginBottom: 4 }}>Elements {"<"} pivot go left, {">"} pivot go right</div>
                        <div style={{ marginBottom: 4 }}>Pivot moves to its final sorted position</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Choose pivot element (usually last element)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Partition: elements less than pivot left, greater than pivot right</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Move pivot to correct position</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Recursively sort left and right partitions</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Combine: left + pivot + right = sorted array</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Watch how pivot creates two sub-problems that are solved independently!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "fibonacci" && (
                <InfoSection title="🔢 How to Visualize DP">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Cell</strong>: Currently being calculated</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Cells</strong>: Previously calculated values</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Cells</strong>: Not yet calculated</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 DP Table:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Each cell shows fib[i] value</div>
                        <div style={{ marginBottom: 4 }}>Index 0 and 1 are base cases (0, 1)</div>
                        <div style={{ marginBottom: 4 }}>Each subsequent cell = sum of two previous</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Initialize fib[0] = 0, fib[1] = 1</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For i = 2 to n: fib[i] = fib[i-1] + fib[i-2]</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Each calculation depends on previous two values</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Blue cell shows current calculation</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Green cells show completed calculations</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Fibonacci demonstrates how DP builds solutions from smaller sub-problems!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "merge" && (
                <InfoSection title="🔀 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being compared</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being merged or placed</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (merged sections)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Merge Process:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Divide array into two halves recursively</div>
                        <div style={{ marginBottom: 4 }}>Sort each half independently</div>
                        <div style={{ marginBottom: 4 }}>Merge two sorted halves back together</div>
                        <div style={{ marginBottom: 4 }}>Amber shows elements being merged</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Recursively split array until single elements</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Compare and merge sorted subarrays</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Place smaller element first in merged array</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Continue until all elements are merged</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Result: completely sorted array</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Watch how algorithm divides and conquers by merging sorted subarrays!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "insertion" && (
                <InfoSection title="📥 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Current element being inserted</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being shifted to make space</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (left portion)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Insertion Process:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Pick element and insert into sorted portion</div>
                        <div style={{ marginBottom: 4 }}>Shift larger elements right to make space</div>
                        <div style={{ marginBottom: 4 }}>Insert element at correct position</div>
                        <div style={{ marginBottom: 4 }}>Blue shows current insertion point</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Start from second element (index 1)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Compare with sorted left portion</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Shift larger elements right to make space</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Insert element at correct position</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Repeat until array is sorted</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Watch how sorted portion grows one element at a time!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "selection" && (
                <InfoSection title="🎯 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being compared to find minimum</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Current minimum found</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (in final position)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Selection Process:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Find minimum element in unsorted portion</div>
                        <div style={{ marginBottom: 4 }}>Swap with first unsorted element</div>
                        <div style={{ marginBottom: 4 }}>Move sorted boundary one position right</div>
                        <div style={{ marginBottom: 4 }}>Amber shows current minimum being found</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Find minimum in unsorted portion</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Swap with first unsorted element</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Move sorted boundary right</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Repeat until array is sorted</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Each pass places one element correctly</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Watch how algorithm repeatedly selects the minimum element!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "heap" && (
                <InfoSection title="🔺 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being compared in heapify</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being swapped during heapify</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (extracted from heap)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                        <div style={{ marginBottom: 4 }}>🔴 <strong>Red Elements</strong>: Root element being moved to end</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Heap Structure:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Binary tree with parent greater than children property</div>
                        <div style={{ marginBottom: 4 }}>Root at index 0, children at 2i+1, 2i+2</div>
                        <div style={{ marginBottom: 4 }}>Max heap property: parent always larger</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Build max heap from unsorted array</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Swap root with last element (red)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Reduce heap size by 1</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Heapify root to maintain heap property</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Repeat until heap is empty</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Result: sorted array</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Watch how heap uses binary tree structure for efficient sorting!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "shell" && (
                <InfoSection title="🐚 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being compared with gap</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being swapped across gap</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (in final position)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Gap Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Start with large gap, gradually reduce</div>
                        <div style={{ marginBottom: 4 }}>Elements far apart compared first</div>
                        <div style={{ marginBottom: 4 }}>Gap halves each iteration</div>
                        <div style={{ marginBottom: 4 }}>Final pass uses gap of 1</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Set initial gap = n/2</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Compare elements gap distance apart</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Perform insertion sort with current gap</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Reduce gap = gap/2, repeat</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Continue until gap = 1, then final pass</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Watch how Shell sort combines insertion sort with gap-based comparisons!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "counting" && (
                <InfoSection title="🔢 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being counted</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being placed in output array</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (in final position)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Counting Process:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Count frequency of each value</div>
                        <div style={{ marginBottom: 4 }}>Build prefix sum array</div>
                        <div style={{ marginBottom: 4 }}>Place elements based on counts</div>
                        <div style={{ marginBottom: 4 }}>Stable: maintains original order</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Find minimum and maximum values</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Create count array for frequencies</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Build prefix sum from counts</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Place elements in correct positions</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Result: sorted array</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Counting sort is O(n+k) where k is range of values!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "radix" && (
                <InfoSection title="🔢 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being processed at current digit</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being placed in buckets</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted for this digit</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Radix Process:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Sort by least significant digit first</div>
                        <div style={{ marginBottom: 4 }}>Place elements in digit buckets</div>
                        <div style={{ marginBottom: 4 }}>Collect buckets back in order</div>
                        <div style={{ marginBottom: 4 }}>Repeat for more significant digits</div>
                        <div style={{ marginBottom: 4 }}>Blue shows current digit being processed</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Find maximum number of digits</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For each digit (least to most significant)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Create 10 buckets for digits 0-9</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Distribute elements by current digit</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Collect buckets back in order</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Repeat for next digit position</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Radix sort processes digits independently for efficient sorting!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "bucket" && (
                <InfoSection title="🪣 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being placed in bucket</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Current bucket being processed</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (from buckets)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Bucket Process:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Create empty buckets for value ranges</div>
                        <div style={{ marginBottom: 4 }}>Distribute elements into appropriate buckets</div>
                        <div style={{ marginBottom: 4 }}>Sort each bucket individually</div>
                        <div style={{ marginBottom: 4 }}>Concatenate buckets back together</div>
                        <div style={{ marginBottom: 4 }}>Amber shows current bucket being filled</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Find minimum and maximum values</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Create buckets for value ranges</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Distribute elements into buckets</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Sort each bucket (using insertion sort)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Concatenate all buckets</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Result: sorted array</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Bucket sort distributes elements into ranges for efficient sorting!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "tim" && (
                <InfoSection title="⏱️ How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being compared</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being swapped in merge</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (merged runs)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Tim Sort Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Combines insertion sort and merge sort</div>
                        <div style={{ marginBottom: 4 }}>Detects small runs (already sorted)</div>
                        <div style={{ marginBottom: 4 }}>Merges runs efficiently</div>
                        <div style={{ marginBottom: 4 }}>Adaptive: performs better on nearly sorted data</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Scan for natural runs (sorted sequences)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Identify small runs to merge</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Merge runs using temporary array</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Insert remaining elements using binary search</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Repeat until array is sorted</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Result: O(n log n) average case</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Tim sort adapts to existing order for optimal performance!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "cocktail" && (
                <InfoSection title="🍸 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being compared (forward/backward)</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being swapped</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (both ends)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Cocktail Process:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Forward pass: left to right</div>
                        <div style={{ marginBottom: 4 }}>Backward pass: right to left</div>
                        <div style={{ marginBottom: 4 }}>Largest elements bubble to both ends</div>
                        <div style={{ marginBottom: 4 }}>More efficient than bubble sort</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Forward pass: compare adjacent pairs</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Swap if left {"<"} right (like bubble)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Backward pass: compare adjacent pairs</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Swap if left {"<"} right (reverse bubble)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Reduce range by 1 each pass</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Repeat until array is sorted</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Cocktail sort is bidirectional bubble sort - more efficient!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "gnome" && (
                <InfoSection title="👺 How to Visualize Sorting">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Elements</strong>: Currently being compared</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Being swapped</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Already sorted (in position)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Gnome Process:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Compare current element with previous</div>
                        <div style={{ marginBottom: 4 }}>If current is less than previous, swap backwards</div>
                        <div style={{ marginBottom: 4 }}>If current is greater than or equal to previous, move forward</div>
                        <div style={{ marginBottom: 4 }}>Like a gnome walking through garden</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Start at index 1 (second element)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Compare with previous element</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> If smaller, swap backwards (like gnome)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> If not smaller, move forward one step</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Reset to start if at beginning</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Repeat until array is sorted</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Gnome sort is like insertion sort but moves backwards when needed!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "lcs" && (
                <InfoSection title="🧬 How to Visualize DP">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Cell</strong>: Currently being calculated</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Cells</strong>: Characters being compared</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Cells</strong>: Match found (diagonal)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Cells</strong>: Not yet calculated</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 DP Table:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Rows represent string X characters</div>
                        <div style={{ marginBottom: 4 }}>Columns represent string Y characters</div>
                        <div style={{ marginBottom: 4 }}>Cell shows LCS length up to that point</div>
                        <div style={{ marginBottom: 4 }}>Diagonal shows character matches</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Initialize first row/column to 0</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For each cell (i,j): if X[i-1] == Y[j-1]</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Then dp[i][j] = dp[i-1][j-1] + 1</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Else dp[i][j] = max(dp[i-1][j], dp[i][j-1])</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Blue shows current cell calculation</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Green shows completed calculations</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Final cell contains LCS length</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> LCS finds longest common subsequence by building optimal substructure!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "knapsack" && (
                <InfoSection title="🎒 How to Visualize DP">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Cell</strong>: Currently being calculated</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Cells</strong>: Items being considered</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Cells</strong>: Optimal solution found</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Cells</strong>: Not yet calculated</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Knapsack Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Each item has weight and value</div>
                        <div style={{ marginBottom: 4 }}>Knapsack has maximum weight capacity</div>
                        <div style={{ marginBottom: 4 }}>Goal: maximize total value</div>
                        <div style={{ marginBottom: 4 }}>Blue shows current item consideration</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Initialize DP table with zeros</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For each item i and weight w:</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Consider: include item i (value + DP[i-1][w])</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Or: exclude item i (DP[i-1][w])</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Choose maximum of these options</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Blue shows current item being processed</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Green shows optimal solution path</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Knapsack demonstrates optimal substructure property in DP!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "coinchange" && (
                <InfoSection title="🪙 How to Visualize DP">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Cell</strong>: Currently being calculated</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Cells</strong>: Coins being considered</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Cells</strong>: Optimal coins found</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Cells</strong>: Not yet calculated</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Coin Change Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Find minimum coins for each amount</div>
                        <div style={{ marginBottom: 4 }}>Build solution from smaller amounts</div>
                        <div style={{ marginBottom: 4 }}>Unlimited coins of each denomination</div>
                        <div style={{ marginBottom: 4 }}>Blue shows current amount being processed</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Initialize dp[0] = 0, others = infinity</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For each coin and amount:</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> dp[amount] = min(dp[amount], dp[amount-coin] + 1)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Blue shows current coin being considered</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Green shows optimal solution</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Result: minimum coins needed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Coin change demonstrates optimal substructure property in DP!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "matrixchain" && (
                <InfoSection title="🔗 How to Visualize DP">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Cell</strong>: Currently being calculated</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Cells</strong>: Current split point being evaluated</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Cells</strong>: Optimal multiplication cost found</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Cells</strong>: Not yet calculated</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Matrix Chain Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Find optimal parenthesization order</div>
                        <div style={{ marginBottom: 4 }}>Minimize scalar multiplication operations</div>
                        <div style={{ marginBottom: 4 }}>Split point shows optimal k value</div>
                        <div style={{ marginBottom: 4 }}>Dynamic programming builds optimal solution</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Initialize diagonal dp[i][i] = 0</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For chain length L from 2 to n:</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> For each start i to end-L:</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Try split k from i to j-1</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> dp[i][j] = min of all possible costs</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Blue shows current split evaluation</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 8:</strong> Green shows optimal costs found</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Matrix chain minimizes multiplication costs through optimal ordering!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "lis" && (
                <InfoSection title="📈 How to Visualize DP">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Element</strong>: Currently being processed</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Elements</strong>: Part of current LIS</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Elements</strong>: Part of final LIS</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Elements</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 LIS Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>dp[i] = length of LIS ending at i</div>
                        <div style={{ marginBottom: 4 }}>parent[i] tracks previous element in LIS</div>
                        <div style={{ marginBottom: 4 }}>Build LIS incrementally</div>
                        <div style={{ marginBottom: 4 }}>Amber shows current LIS construction</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Initialize dp[i] = 1, parent[i] = -1</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For each element j from 0 to i-1:</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> If arr[j] is less than arr[i] and dp[j] + 1 is greater than dp[i]:</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Update dp[i] = dp[j] + 1, parent[i] = j</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Amber shows current LIS being built</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Green shows completed LIS elements</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Reconstruct LIS by following parent pointers</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> LIS demonstrates optimal substructure property in DP!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "subsetsum" && (
                <InfoSection title="🧮 How to Visualize DP">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Cell</strong>: Currently being calculated</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Cells</strong>: Numbers being considered</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Cells</strong>: Subset found (true)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Cells</strong>: Not yet calculated</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Subset Sum Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>dp[i][j] = true if subset sums to j exists</div>
                        <div style={{ marginBottom: 4 }}>Include current number OR exclude it</div>
                        <div style={{ marginBottom: 4 }}>Build solution by backtracking</div>
                        <div style={{ marginBottom: 4 }}>Blue shows current subset evaluation</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Initialize dp[0][0] = true (empty subset)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For each number and target:</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> dp[i][j] = dp[i-1][j] OR (dp[i-1][j-nums[i]] AND nums[i-1] is less than or equal to target)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Blue shows current number being considered</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Green shows subset found (true cells)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Reconstruct subset by backtracking</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Subset sum demonstrates exact decision-making in DP!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "kmp" && (
                <InfoSection title="🔍 How to Visualize Pattern Matching">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Characters</strong>: Currently being compared</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Characters</strong>: Pattern characters being matched</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Characters</strong>: Matched characters (found)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Characters</strong>: Not yet processed</div>
                        <div style={{ marginBottom: 4 }}>🔴 <strong>Red Characters</strong>: Current pattern position</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 LPS Array:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Longest proper prefix that is also suffix</div>
                        <div style={{ marginBottom: 4 }}>Used for pattern shifts after mismatches</div>
                        <div style={{ marginBottom: 4 }}>Blue shows current LPS calculation</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Build LPS array for pattern</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Start pattern matching with text</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Compare characters, advance on match</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> On mismatch, use LPS to shift pattern</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Continue until pattern found or text ends</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Red shows current pattern position</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> KMP uses LPS array to avoid re-comparisons and achieve O(n+m) complexity!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "rabin-karp" && (
                <InfoSection title="🔢 How to Visualize Pattern Matching">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Characters</strong>: Currently being compared (hash calculation)</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Characters</strong>: Current window being examined</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Characters</strong>: Hash match found (potential match)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Characters</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Rolling Hash Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Calculate hash of current window</div>
                        <div style={{ marginBottom: 4 }}>Slide window by one character</div>
                        <div style={{ marginBottom: 4 }}>Update hash efficiently (remove old, add new)</div>
                        <div style={{ marginBottom: 4 }}>Blue shows current window hash</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Calculate pattern hash (prime number)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Calculate initial text hash</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Slide window through text</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Update rolling hash (remove old, add new)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Compare hashes for potential matches</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> On hash match, verify actual characters</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Continue until end of text</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 8:</strong> Found pattern or not found</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Rabin-Karp uses rolling hash for efficient pattern searching!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "boyer-moore" && (
                <InfoSection title="🔎 How to Visualize Pattern Matching">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Characters</strong>: Currently being compared</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Characters</strong>: Pattern being shifted</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Characters</strong>: Matched characters</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Characters</strong>: Not yet processed</div>
                        <div style={{ marginBottom: 4 }}>🔴 <strong>Red Characters</strong>: Bad character heuristic table</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Bad Character Heuristic:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Precomputed shift distances for each character</div>
                        <div style={{ marginBottom: 4 }}>Allows large jumps on mismatches</div>
                        <div style={{ marginBottom: 4 }}>Red shows current bad character table</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Align pattern and text at right</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Compare from right to left</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> On match, continue; on mismatch, shift</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Use bad character heuristic for shift</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Continue until pattern found or text ends</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Amber shows current pattern position</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Green shows matched characters</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Boyer-Moore uses bad character heuristic for efficient searching!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "edit-distance" && (
                <InfoSection title="📝 How to Visualize String Distance">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Cell</strong>: Currently being calculated</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Cells</strong>: Operations being considered</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Cells</strong>: Completed operations</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Cells</strong>: Not yet calculated</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Edit Distance Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Three operations: insert, delete, substitute</div>
                        <div style={{ marginBottom: 4 }}>Cost: 1 for insert/delete, 2 for substitute</div>
                        <div style={{ marginBottom: 4 }}>Blue shows current operation being calculated</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Initialize first row/column with base cases</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For each cell (i,j): calculate minimum cost</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> If characters match: dp[i-1][j-1] + 0</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Else: min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Blue shows current cell calculation</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Green shows completed operations</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Final cell contains edit distance</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Edit distance finds minimum operations to transform strings!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "bfs" && (
                <InfoSection title="🌳 How to Visualize Tree Traversal">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Node</strong>: Currently being visited</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Nodes</strong>: In queue (to be visited)</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Nodes</strong>: Already visited</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Nodes</strong>: Not yet discovered</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 BFS Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Level-order traversal (breadth-first)</div>
                        <div style={{ marginBottom: 4 }}>Visit all nodes at current level first</div>
                        <div style={{ marginBottom: 4 }}>Uses queue for node management</div>
                        <div style={{ marginBottom: 4 }}>Amber shows nodes in queue</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Start at root node, add to queue</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> While queue is not empty:</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Dequeue front node (blue)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Add all unvisited children to queue (amber)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Mark current node as visited (green)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Continue until all nodes visited</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> BFS explores tree level by level like ripples in water!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "dfs" && (
                <InfoSection title="🌲 How to Visualize Tree Traversal">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Node</strong>: Currently being visited</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Nodes</strong>: On call stack (to be processed)</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Nodes</strong>: Already visited</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Nodes</strong>: Not yet discovered</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 DFS Concept:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>Depth-first traversal (go deep first)</div>
                        <div style={{ marginBottom: 4 }}>Visit as far as possible before backtracking</div>
                        <div style={{ marginBottom: 4 }}>Uses stack (recursion) for node management</div>
                        <div style={{ marginBottom: 4 }}>Amber shows nodes on call stack</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Start at root node, mark as visited</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> For each unvisited child:</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Recursively visit child (blue)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Add to call stack (amber)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> After all children visited, backtrack</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Mark node as completed (green)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Continue until all nodes visited</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> DFS explores tree depth-first like exploring a maze!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "dijkstra" && (
                <InfoSection title="🧠 How It Works">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      Dijkstra's Algorithm finds the shortest path from a starting point to all other points. It maintains a set of visited nodes and always expands the unvisited node with the smallest distance.
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Node</strong>: Currently processing this node</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Node</strong>: Already visited (shortest path found)</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Node</strong>: Distance being updated this step</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Node</strong>: Not visited yet</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📏 Edge Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Edge</strong>: Exploring from current node</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Edge</strong>: Found shorter path</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Edge</strong>: Not considering yet</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Start at node A (distance 0)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Find unvisited node with minimum distance</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Explore all edges from current node (blue edges)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Update neighbor distances if shorter path found (amber edges)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Mark current node as visited (green)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Repeat: Select next minimum unvisited node</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Watch how the algorithm gradually spreads from the start node, always choosing the shortest unvisited path!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "kruskal" && (
                <InfoSection title="🌲 How to Visualize MST">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Node</strong>: Part of Minimum Spanning Tree</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Node</strong>: Not yet in MST</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📏 Edge Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Edge</strong>: Currently being considered for MST</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Edge</strong>: Added to MST</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Edge</strong>: Not yet considered</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Sort all edges by weight (smallest first)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Pick the smallest edge (blue edge)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Check if it connects two different components</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> If yes, add to MST (green edge)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> If no, skip this edge</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Repeat until MST has n-1 edges</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Kruskal builds MST by always choosing the cheapest edge that doesn't create a cycle!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "bellman-ford" && (
                <InfoSection title="🔄 How to Visualize Paths">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Nodes</strong>: Currently processing edge (u,v)</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Nodes</strong>: Have finite distance from source</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Nodes</strong>: Still unreachable (∞ distance)</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Distance Labels:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔢 <strong>Numbers</strong>: Current shortest distance from source</div>
                        <div style={{ marginBottom: 4 }}>♾️ <strong>∞ Symbol</strong>: Unreachable from source</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Set source distance to 0, others to ∞</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Relax all edges (V-1 times)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> For each edge (u,v,w): check if dist[u] + w &lt; dist[v]</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> If yes, update dist[v] = dist[u] + w</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Repeat for V-1 iterations</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Final distances are shortest paths</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Bellman-Ford finds shortest paths and detects negative cycles by relaxing edges repeatedly!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "bfs" && (
                <InfoSection title="🌊 How to Visualize Traversal">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Nodes</strong>: Visited nodes (explored)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Nodes</strong>: Unvisited nodes</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Start at source node, mark as visited</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Add all neighbors to queue</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Dequeue node, mark as visited</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Repeat until queue is empty</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> All reachable nodes are visited</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> BFS explores graph level by level, guaranteeing shortest path in unweighted graphs!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "dfs" && (
                <InfoSection title="🔍 How to Visualize Depth">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Nodes</strong>: Visited nodes (explored)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Nodes</strong>: Unvisited nodes</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Start at source node, mark as visited</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Explore as deep as possible before backtracking</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> When dead end reached, backtrack to last unvisited neighbor</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Repeat until all nodes are visited</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Complete traversal of all reachable nodes</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> DFS explores deeply before backtracking, useful for finding paths and cycles!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "prim" && (
                <InfoSection title="🌲 How to Visualize MST">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Nodes</strong>: Part of Minimum Spanning Tree</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Nodes</strong>: Not yet in MST</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📏 Edge Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Edge</strong>: Currently being considered for MST</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Edge</strong>: Added to MST</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Edge</strong>: Not yet considered</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Start from any node, set its key to 0</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Pick the smallest edge connecting to visited nodes</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Add edge to MST, update keys</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Repeat until MST has V-1 edges</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Final MST connects all nodes with minimum total weight</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Prim grows MST by always adding the cheapest edge that connects to the current tree!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "topological" && (
                <InfoSection title="📋 How It Works">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      Topological Sort orders vertices so that every edge goes from earlier to later in the order. It's like ordering tasks based on their dependencies.
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>� <strong>Blue Node</strong>: Currently processing node</div>
                        <div style={{ marginBottom: 4 }}>�� <strong>Green Node</strong>: Already processed in topological order</div>
                        <div style={{ marginBottom: 4 }}>🔴 <strong>Red Node</strong>: Indicates graph has cycles (no valid topological order)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Node</strong>: Not processed yet</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>� Order Labels:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔢 <strong>Numbers</strong>: Current topological order being built</div>
                        <div style={{ marginBottom: 4 }}>🔴 <strong>Red Highlight</strong>: Indicates cycle detection</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>�� Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Calculate in-degrees of all nodes</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Add nodes with in-degree 0 to queue</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Process nodes from queue in order</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Update in-degrees of neighbors</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Add newly zero in-degree nodes to queue</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Repeat until queue is empty</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Detect cycles if nodes remain unprocessed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Topological sort is essential for task scheduling and build systems where dependencies must be resolved first!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "kosaraju" && (
                <InfoSection title="🔄 How to Visualize SCCs">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Nodes</strong>: In the same strongly connected component</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Nodes</strong>: Not yet processed</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> First DFS to get processing order and stack</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Second DFS from each unvisited node</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Collect nodes in same SCC (same stack pop time)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Repeat until all nodes are processed</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Each SCC represents a maximal strongly connected component</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Kosaraju finds strongly connected components using two DFS passes!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "astar" && (
                <InfoSection title="🌟 How It Works">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      A* Search finds the shortest path using a heuristic to guide the search. It balances the cost so far with an estimate of remaining cost.
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>� <strong>Blue Node</strong>: Currently processing node</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Node</strong>: In open set (to be explored)</div>
                        <div style={{ marginBottom: 4 }}>� <strong>Green Node</strong>: Visited vs unvisited</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Node</strong>: Not processed yet</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>� Edge Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>� <strong>Blue Edge</strong>: Edges from current node being explored</div>
                        <div style={{ marginBottom: 4 }}>🟢 <strong>Green Path</strong>: Final optimal path when goal is reached</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Edge</strong>: Not considering yet</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Start at source, set g=0, others=∞</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Pick node with lowest f(n) = g(n) + h(n)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Move from closed to open set</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Update neighbor scores if better path found</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Repeat until goal reached or no nodes left</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Optimal path found when goal is reached</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> A* combines Dijkstra's accuracy with heuristic guidance for faster optimal pathfinding!
                    </div>
                  </div>
                </InfoSection>
              )}
              {selected === "ford-fulkerson" && (
                <InfoSection title="💧 How It Works">
                  <div style={{ fontSize: "0.875rem", color: T.text, lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 12 }}>
                      Ford-Fulkerson finds the maximum amount of flow possible from source to sink in a network. It repeatedly finds augmenting paths and increases flow along them.
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>🎨 Color Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>� <strong>Violet Node</strong>: Source node</div>
                        <div style={{ marginBottom: 4 }}>�� <strong>Green Node</strong>: Sink node</div>
                        <div style={{ marginBottom: 4 }}>🟡 <strong>Amber Node</strong>: Nodes in current augmenting path</div>
                        <div style={{ marginBottom: 4 }}>🔴 <strong>Red Node</strong>: Saturated nodes (no residual capacity)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Node</strong>: Other nodes</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📏 Edge Guide:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔵 <strong>Blue Edge</strong>: Current augmenting path edges</div>
                        <div style={{ marginBottom: 4 }}>🔴 <strong>Red Edge</strong>: Saturated edges (no residual capacity)</div>
                        <div style={{ marginBottom: 4 }}>⚪ <strong>Gray Edge</strong>: Other edges</div>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <strong>📊 Flow Labels:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8 }}>
                        <div style={{ marginBottom: 4 }}>🔢 <strong>Number</strong>: Current maximum flow value</div>
                        <div style={{ marginBottom: 4 }}>💧 <strong>Flow Direction</strong>: From source to sink</div>
                      </div>
                    </div>
                    
                    <div>
                      <strong>🔍 Algorithm Steps:</strong>
                      <div style={{ marginLeft: 16, marginTop: 8, fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: 6 }}><strong>Step 1:</strong> Build residual graph with forward and reverse edges</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 2:</strong> Find augmenting path using BFS on residual graph</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 3:</strong> Calculate bottleneck (minimum capacity) in the path</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 4:</strong> Add bottleneck flow to total flow</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 5:</strong> Update residual capacities (decrease forward, increase reverse)</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 6:</strong> Repeat until no augmenting paths exist</div>
                        <div style={{ marginBottom: 6 }}><strong>Step 7:</strong> Maximum flow achieved when no more paths can be augmented</div>
                      </div>
                    </div>
                    
                    <div style={{ marginTop: 12, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
                      <strong>💡 Tip:</strong> Ford-Fulkerson finds the maximum possible flow from source to sink using repeated path augmentation!
                    </div>
                  </div>
                </InfoSection>
              )}
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
