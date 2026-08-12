import { useMemo, useState } from "react";
import { Segmented, Slider } from "../ui/Primitives";

interface Pt { x: number; y: number; label: 1 | -1 }

// Fixed synthetic 2D dataset (illustrative — the real model trains on 4 PCA dims)
const POINTS: Pt[] = [
  { x: 1.5, y: 1.8, label: -1 }, { x: 2.1, y: 1.2, label: -1 }, { x: 1.1, y: 2.4, label: -1 },
  { x: 2.6, y: 2.0, label: -1 }, { x: 1.8, y: 3.0, label: -1 }, { x: 0.8, y: 1.4, label: -1 },
  { x: 2.3, y: 3.1, label: -1 }, { x: 1.3, y: 0.9, label: -1 }, { x: 3.0, y: 1.5, label: -1 },
  { x: 2.0, y: 2.5, label: -1 }, { x: 1.0, y: 1.9, label: -1 }, { x: 2.8, y: 2.6, label: -1 },
  { x: 6.5, y: 6.2, label: 1 }, { x: 7.1, y: 5.6, label: 1 }, { x: 6.0, y: 7.0, label: 1 },
  { x: 7.6, y: 6.4, label: 1 }, { x: 6.3, y: 5.0, label: 1 }, { x: 7.9, y: 7.2, label: 1 },
  { x: 5.8, y: 6.6, label: 1 }, { x: 7.2, y: 4.9, label: 1 }, { x: 6.8, y: 7.6, label: 1 },
  { x: 5.6, y: 5.8, label: 1 }, { x: 7.4, y: 5.9, label: 1 }, { x: 6.1, y: 4.6, label: 1 },
  { x: 4.2, y: 4.0, label: 1 }, { x: 3.6, y: 3.6, label: -1 },
];

const DOMAIN = { xMin: 0, xMax: 8.5, yMin: 0, yMax: 8.5 };

function rbfScore(px: number, py: number, gamma: number) {
  let s = 0;
  for (const p of POINTS) {
    const d2 = (px - p.x) ** 2 + (py - p.y) ** 2;
    s += p.label * Math.exp(-gamma * d2);
  }
  return s;
}

function linearWeights() {
  const pos = POINTS.filter((p) => p.label === 1);
  const neg = POINTS.filter((p) => p.label === -1);
  const mean = (arr: Pt[], key: "x" | "y") => arr.reduce((a, p) => a + p[key], 0) / arr.length;
  const mPos = { x: mean(pos, "x"), y: mean(pos, "y") };
  const mNeg = { x: mean(neg, "x"), y: mean(neg, "y") };
  const w = { x: mPos.x - mNeg.x, y: mPos.y - mNeg.y };
  const mid = { x: (mPos.x + mNeg.x) / 2, y: (mPos.y + mNeg.y) / 2 };
  const b = -(w.x * mid.x + w.y * mid.y);
  const norm = Math.sqrt(w.x ** 2 + w.y ** 2);
  return { w, b, norm };
}

export default function SvmPlayground() {
  const [kernel, setKernel] = useState<"linear" | "rbf">("rbf");
  const [gamma, setGamma] = useState(0.4);
  const [c, setC] = useState(1);

  const W = 520, H = 400, PAD = 24;
  const sx = (v: number) => PAD + ((v - DOMAIN.xMin) / (DOMAIN.xMax - DOMAIN.xMin)) * (W - 2 * PAD);
  const sy = (v: number) => H - PAD - ((v - DOMAIN.yMin) / (DOMAIN.yMax - DOMAIN.yMin)) * (H - 2 * PAD);

  const grid = useMemo(() => {
    const cells: { x: number; y: number; w: number; h: number; score: number }[] = [];
    const cols = 46, rows = 36;
    const cw = (W - 2 * PAD) / cols;
    const ch = (H - 2 * PAD) / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const px = PAD + (i + 0.5) * cw;
        const py = PAD + (j + 0.5) * ch;
        const dataX = DOMAIN.xMin + ((px - PAD) / (W - 2 * PAD)) * (DOMAIN.xMax - DOMAIN.xMin);
        const dataY = DOMAIN.yMax - ((py - PAD) / (H - 2 * PAD)) * (DOMAIN.yMax - DOMAIN.yMin);
        let score: number;
        if (kernel === "rbf") {
          score = rbfScore(dataX, dataY, gamma);
        } else {
          const { w, b, norm } = linearWeights();
          // C conceptually sharpens the margin (less tolerance) without altering the fixed geometric separator
          score = ((w.x * dataX + w.y * dataY + b) / norm) * (0.6 + c * 0.4);
        }
        cells.push({ x: PAD + i * cw, y: PAD + j * ch, w: cw + 0.5, h: ch + 0.5, score });
      }
    }
    return cells;
  }, [kernel, gamma, c]);

  const maxAbs = Math.max(...grid.map((g) => Math.abs(g.score)), 0.001);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 mb-4">
        <Segmented
          options={[{ value: "linear", label: "Linear" }, { value: "rbf", label: "RBF" }]}
          value={kernel}
          onChange={setKernel}
        />
        {kernel === "rbf" ? (
          <div className="w-56"><Slider label="gamma (γ)" value={gamma} min={0.05} max={2} step={0.05} onChange={setGamma} formatValue={(v) => v.toFixed(2)} /></div>
        ) : (
          <div className="w-56"><Slider label="C (regularization)" value={c} min={0.1} max={3} step={0.1} onChange={setC} formatValue={(v) => v.toFixed(1)} /></div>
        )}
      </div>
      <div className="border border-ink-600 bg-ink-800/40">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {grid.map((cell, i) => {
            const t = Math.max(-1, Math.min(1, cell.score / maxAbs));
            const color = t >= 0 ? `rgba(224,164,88,${Math.min(0.45, Math.abs(t) * 0.5)})` : `rgba(79,195,217,${Math.min(0.45, Math.abs(t) * 0.5)})`;
            return <rect key={i} x={cell.x} y={cell.y} width={cell.w} height={cell.h} fill={color} />;
          })}
          {POINTS.map((p, i) => (
            <circle
              key={i}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r={5}
              fill={p.label === 1 ? "#c07f28" : "#1090a8"}
              stroke="#1a1d24"
              strokeWidth={1}
            />
          ))}
        </svg>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-mist-400">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-quantum inline-block" /> class −1 (normal)</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-classical inline-block" /> class +1 (attack)</span>
        <span className="ml-auto eyebrow text-mist-500">2D teaching dataset — the real model uses 4 PCA dimensions</span>
      </div>
    </div>
  );
}
