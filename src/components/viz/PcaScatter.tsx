import { useMemo, useState } from "react";
import { PCA_SAMPLE_POINTS } from "../../data/pcaOutput";
import type { PcaPoint } from "../../data/pcaOutput";

const AXES = ["pc1", "pc2", "pc3", "pc4"] as const;
type Axis = (typeof AXES)[number];

export default function PcaScatter() {
  const [xAxis, setXAxis] = useState<Axis>("pc1");
  const [yAxis, setYAxis] = useState<Axis>("pc2");
  const [hovered, setHovered] = useState<PcaPoint | null>(null);

  const { xs, ys, xMin, xMax, yMin, yMax } = useMemo(() => {
    const xs = PCA_SAMPLE_POINTS.map((p) => p[xAxis]);
    const ys = PCA_SAMPLE_POINTS.map((p) => p[yAxis]);
    return {
      xs, ys,
      xMin: Math.min(...xs), xMax: Math.max(...xs),
      yMin: Math.min(...ys), yMax: Math.max(...ys),
    };
  }, [xAxis, yAxis]);

  const W = 560, H = 360, PAD = 36;
  const sx = (v: number) => PAD + ((v - xMin) / (xMax - xMin)) * (W - 2 * PAD);
  const sy = (v: number) => H - PAD - ((v - yMin) / (yMax - yMin)) * (H - 2 * PAD);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        <AxisPicker label="x-axis" value={xAxis} onChange={setXAxis} />
        <AxisPicker label="y-axis" value={yAxis} onChange={setYAxis} />
      </div>
      <div className="border border-ink-600 bg-ink-800/40 relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          {/* axes */}
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#c7ccd6" strokeWidth={1} />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#c7ccd6" strokeWidth={1} />
          <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="#7c8494" fontFamily="IBM Plex Mono">
            {xAxis.toUpperCase()}
          </text>
          <text x={12} y={H / 2} textAnchor="middle" fontSize="11" fill="#7c8494" fontFamily="IBM Plex Mono" transform={`rotate(-90 12 ${H / 2})`}>
            {yAxis.toUpperCase()}
          </text>
          {PCA_SAMPLE_POINTS.map((p, i) => (
            <circle
              key={i}
              cx={sx(xs[i])}
              cy={sy(ys[i])}
              r={hovered === p ? 5 : 3.2}
              fill={p.label === 0 ? "#1a8a5c" : "#c23a34"}
              fillOpacity={hovered && hovered !== p ? 0.25 : 0.75}
              stroke={hovered === p ? "#171a21" : "none"}
              strokeWidth={1}
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer", transition: "r 0.15s" }}
            />
          ))}
        </svg>
        {hovered && (
          <div className="absolute bottom-3 left-3 px-3 py-2 bg-ink-800 border border-ink-600 text-[11px] font-mono text-mist-300">
            PC1 {hovered.pc1.toFixed(2)} · PC2 {hovered.pc2.toFixed(2)} · PC3 {hovered.pc3.toFixed(2)} · PC4 {hovered.pc4.toFixed(2)}
            <br />
            label: <span className={hovered.label === 0 ? "text-signal-good" : "text-signal-bad"}>{hovered.label === 0 ? "normal" : "attack"}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-mist-400">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-signal-good inline-block" /> normal</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-signal-bad inline-block" /> attack</span>
        <span className="ml-auto eyebrow text-mist-500">250 sampled training points, actual PCA output</span>
      </div>
    </div>
  );
}

function AxisPicker({ label, value, onChange }: { label: string; value: Axis; onChange: (a: Axis) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow text-mist-500">{label}</span>
      <div className="inline-flex border border-ink-600">
        {AXES.map((a) => (
          <button
            key={a}
            onClick={() => onChange(a)}
            className={`px-2.5 py-1 text-xs font-mono ${value === a ? "bg-quantum/20 text-quantum-soft" : "text-mist-400 hover:text-mist-200"}`}
          >
            {a.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
