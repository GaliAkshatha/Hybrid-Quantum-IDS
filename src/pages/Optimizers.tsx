import { useState } from "react";
import { ConceptualBadge, PageHeader, Panel, SectionTitle, Segmented, WhyBox } from "../components/ui/Primitives";
import { motion } from "framer-motion";

type Opt = "COBYLA" | "SPSA" | "ADAM";

const OPT_INFO: Record<Opt, { desc: string; path: [number, number][]; maxiter: string }> = {
  COBYLA: {
    desc: "Constrained Optimization BY Linear Approximation — a gradient-free method that builds a local linear model of the loss from nearby trial points and takes a step within a shrinking trust region. Used by default in vqc_model.py with maxiter=100.",
    path: [[0.15, 0.85], [0.28, 0.62], [0.33, 0.5], [0.42, 0.38], [0.48, 0.28], [0.5, 0.18]],
    maxiter: "100",
  },
  SPSA: {
    desc: "Simultaneous Perturbation Stochastic Approximation — estimates a descent direction by perturbing all parameters at once in a random direction and comparing two noisy loss evaluations. Efficient on noisy quantum hardware since it needs only 2 evaluations per step regardless of parameter count.",
    path: [[0.15, 0.85], [0.32, 0.7], [0.22, 0.55], [0.4, 0.48], [0.3, 0.32], [0.48, 0.22], [0.5, 0.18]],
    maxiter: "100",
  },
  ADAM: {
    desc: "Adaptive Moment Estimation — a gradient-based optimizer (using estimated or parameter-shift gradients) that adapts a per-parameter learning rate from running averages of past gradients and their squares, the same optimizer widely used in classical deep learning.",
    path: [[0.15, 0.85], [0.24, 0.68], [0.3, 0.5], [0.36, 0.36], [0.42, 0.26], [0.47, 0.2], [0.5, 0.18]],
    maxiter: "40",
  },
};

export default function Optimizers() {
  const [opt, setOpt] = useState<Opt>("COBYLA");
  const info = OPT_INFO[opt];

  const W = 420, H = 300;
  const pathStr = info.path.map(([x, y]) => `${x * W},${y * H}`).join(" ");

  return (
    <div>
      <PageHeader
        eyebrow="Stage 10 · Quantum Path"
        title="Optimizer Laboratory"
        lede="VQC needs a classical optimizer to tune its ansatz parameters θ. This project's experiments compare three."
      />

      <Panel className="mb-6">
        <SectionTitle n="01">Why VQC needs a classical optimizer</SectionTitle>
        <p className="text-sm text-mist-400 leading-relaxed max-w-2xl">
          The ansatz's rotation angles θ have to be tuned so that circuit measurements match
          the correct labels as closely as possible. There's no closed-form solution for
          this — it's framed as minimizing a loss function over θ, the same way weights are
          trained in a classical neural network, except here the loss depends on a quantum
          circuit's measurement statistics.
        </p>
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="02">Compare optimizers</SectionTitle>
        <div className="mb-5">
          <Segmented options={[{ value: "COBYLA", label: "COBYLA" }, { value: "SPSA", label: "SPSA" }, { value: "ADAM", label: "ADAM" }]} value={opt} onChange={setOpt} />
        </div>
        <p className="text-sm text-mist-400 mb-5 max-w-2xl leading-relaxed">{info.desc}</p>
        <div className="flex items-center justify-between mb-1">
          <ConceptualBadge label="conceptual optimization path, not a real training trajectory" />
          <span className="eyebrow text-mist-500">maxiter used in this project: {info.maxiter}</span>
        </div>
        <div className="border border-ink-600 bg-ink-800/40 mt-3">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            {/* contour-like bowl */}
            {[1, 0.75, 0.5, 0.25].map((r, i) => (
              <ellipse key={i} cx={W * 0.5} cy={H * 0.18} rx={r * 190} ry={r * 130} fill="none" stroke="#e2e5eb" strokeWidth={1} />
            ))}
            <circle cx={W * 0.5} cy={H * 0.18} r={4} fill="#1a8a5c" />
            <text x={W * 0.5 + 10} y={H * 0.18 + 4} fontSize="10" fill="#1a8a5c" fontFamily="IBM Plex Mono">minimum loss</text>
            <motion.polyline
              key={opt}
              points={pathStr}
              fill="none"
              stroke="#1090a8"
              strokeWidth={1.8}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />
            {info.path.map(([x, y], i) => (
              <circle key={i} cx={x * W} cy={y * H} r={3} fill="#0b6f83" />
            ))}
          </svg>
        </div>
        <WhyBox>
          COBYLA is the default used in vqc_model.py and save_vqc_model.py. The
          optimizer-comparison experiment (vqc_optimizer_experiment.py) exists specifically
          to test whether SPSA or ADAM would train faster or reach a better loss on this
          same task — see the Experiments lab for what that script actually measures.
        </WhyBox>
      </Panel>

      <Panel>
        <SectionTitle n="03">How θ actually gets updated</SectionTitle>
        <div className="flex flex-wrap items-center gap-3">
          {["Evaluate loss at current θ", "Propose new θ", "Evaluate loss again", "Accept/adjust step", "Repeat"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <div className="px-3 py-2 border border-ink-500 text-xs font-mono text-mist-300 text-center">{s}</div>
              {i < arr.length - 1 && <span className="text-mist-500">→</span>}
            </div>
          ))}
        </div>
        <p className="text-xs text-mist-500 mt-4">
          The exact "propose new θ" rule differs per optimizer: COBYLA fits a local linear
          model, SPSA perturbs randomly, ADAM follows an adapted gradient estimate. All
          three share this evaluate-propose-repeat structure.
        </p>
      </Panel>
    </div>
  );
}
