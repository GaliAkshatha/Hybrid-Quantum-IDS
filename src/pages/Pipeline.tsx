import { useState } from "react";
import { PageHeader, Panel, SectionTitle, Tag } from "../components/ui/Primitives";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  {
    name: "Raw",
    detail: "protocol_type=tcp, service=http, flag=SF, src_bytes=232, dst_bytes=8153, count=5, ...",
  },
  {
    name: "Encoded",
    detail: "[0(tcp), 22(http), 9(SF), 232, 8153, 5, ...]  — LabelEncoder applied to categoricals",
  },
  {
    name: "Scaled",
    detail: "[0.20, 0.73, 0.90, 0.01, 0.04, ...]  — MinMaxScaler, all values in [0, 1]",
  },
  {
    name: "PCA (4D)",
    detail: "[0.21, 0.73, 0.42, 0.91]  — 41 features compressed to 4 principal components",
  },
  {
    name: "Quantum encoding",
    detail: "|φ(x)⟩ via ZZFeatureMap — 4 PCA values become 4 qubit rotation parameters",
  },
  {
    name: "Prediction",
    detail: "ATTACK",
  },
];

const BRANCHES = [
  { label: "Classical SVM", kind: "classical" as const },
  { label: "QSVM", kind: "quantum" as const },
  { label: "VQC", kind: "quantum" as const },
];

export default function Pipeline() {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);

  function run() {
    if (running) return;
    setRunning(true);
    setStep(-1);
    let s = -1;
    const timer = setInterval(() => {
      s++;
      setStep(s);
      if (s >= STAGES.length - 1) {
        clearInterval(timer);
        setRunning(false);
      }
    }, 900);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Stage 13 · Synthesis"
        title="End-to-End Pipeline"
        lede="One sample, traced through every stage this project implements — from a raw connection to a prediction."
      />

      <Panel className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <SectionTitle n="00">Run pipeline</SectionTitle>
          <button
            onClick={run}
            disabled={running}
            className="px-4 py-2 border border-quantum/50 text-quantum-soft text-sm font-mono hover:bg-quantum/10 transition-colors disabled:opacity-40"
          >
            {running ? "running…" : "Run Pipeline"}
          </button>
        </div>

        <div className="flex flex-wrap items-stretch gap-3">
          {STAGES.slice(0, 4).map((s, i) => (
            <StageCard key={s.name} stage={s} active={step === i} done={step > i} onClick={() => setStep(i)} />
          ))}
        </div>

        <div className="flex items-center gap-2 my-3">
          <div className="w-8 h-px bg-ink-500" />
          <span className="eyebrow text-mist-500">branches into 3 models</span>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          {BRANCHES.map((b) => (
            <div
              key={b.label}
              className={`px-4 py-3 border text-center text-xs font-mono transition-colors ${
                step === 4
                  ? b.kind === "classical"
                    ? "border-classical text-classical-soft bg-classical/10"
                    : "border-quantum text-quantum-soft bg-quantum/10"
                  : "border-ink-600 text-mist-500"
              }`}
            >
              {b.label}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-stretch gap-3">
          {STAGES.slice(4).map((s, i) => {
            const idx = i + 4;
            return <StageCard key={s.name} stage={s} active={step === idx} done={step > idx} onClick={() => setStep(idx)} />;
          })}
        </div>

        <AnimatePresence mode="wait">
          {step >= 0 && (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 border border-quantum/30 bg-quantum/5"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-medium text-mist-200">{STAGES[step].name}</span>
                {STAGES[step].name === "Prediction" && <Tag tone="bad">ATTACK</Tag>}
              </div>
              <p className="text-xs font-mono text-mist-400 leading-relaxed">{STAGES[step].detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Panel>

      <Panel>
        <SectionTitle n="01">What this traces</SectionTitle>
        <p className="text-sm text-mist-400 leading-relaxed max-w-2xl">
          This walkthrough mirrors the code path across <code>train.py</code> →{" "}
          <code>pca_reduction.py</code> → <code>classical_model.py</code> /{" "}
          <code>qsvm_model.py</code> / <code>vqc_model.py</code>. The specific numeric values
          shown are illustrative of the transformation shape (real column count, real value
          ranges), not a captured trace from an actual run — the repository doesn't persist
          per-sample intermediate values to inspect.
        </p>
      </Panel>
    </div>
  );
}

function StageCard({
  stage,
  active,
  done,
  onClick,
}: {
  stage: { name: string; detail: string };
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-[120px] px-3 py-3 border text-center transition-colors ${
        active ? "border-quantum text-quantum-soft bg-quantum/10" : done ? "border-ink-500 text-mist-300" : "border-ink-700 text-mist-500"
      }`}
    >
      <div className="text-xs font-mono">{stage.name}</div>
    </button>
  );
}
