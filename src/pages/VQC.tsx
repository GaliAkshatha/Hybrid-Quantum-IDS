import { useState, useRef } from "react";
import { CodeBlock, ConceptualBadge, PageHeader, Panel, SectionTitle, Slider, Tag, WhyBox } from "../components/ui/Primitives";
import AnsatzCircuit from "../components/viz/AnsatzCircuit";
import { CODE_VQC_PY, VQC_OPTIMIZER_DEFAULT, VQC_REPS, VQC_TEST_SUBSAMPLE, VQC_TRAIN_SUBSAMPLE } from "../data/projectData";
import { motion } from "framer-motion";

const NUM_QUBITS = 4;

export default function VQC() {
  const [thetas, setThetas] = useState<number[]>(new Array(NUM_QUBITS * VQC_REPS).fill(0.5));
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [training, setTraining] = useState(false);
  const timerRef = useRef<number | null>(null);

  function updateTheta(i: number, v: number) {
    setThetas((old) => old.map((o, idx) => (idx === i ? v : o)));
  }

  function train() {
    if (training) return;
    setTraining(true);
    setLossHistory([1.0]);
    let iter = 0;
    const maxIter = 24;
    timerRef.current = window.setInterval(() => {
      iter++;
      setLossHistory((old) => {
        const last = old[old.length - 1];
        const noise = (Math.random() - 0.5) * 0.05;
        const next = Math.max(0.08, last * (0.86 + noise) + 0.01 * Math.random());
        return [...old, next];
      });
      setThetas((old) => old.map((o) => o + (Math.random() - 0.5) * 0.15));
      if (iter >= maxIter) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setTraining(false);
      }
    }, 180);
  }

  const W = 480, H = 160, PAD = 24;
  const maxLoss = 1.05;
  const points = lossHistory
    .map((l, i) => {
      const x = PAD + (i / Math.max(1, 23)) * (W - 2 * PAD);
      const y = H - PAD - (l / maxLoss) * (H - 2 * PAD);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <PageHeader
        eyebrow="Stage 09 · Quantum Path"
        title="VQC Laboratory"
        lede="A Variational Quantum Classifier: a trainable quantum circuit optimized end-to-end by a classical optimizer."
      />

      <Panel className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {["Input", "Feature Map", "Ansatz (θ)", "Measurement", "Prediction", "Loss", "Optimizer"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <div className="px-3 py-2 border border-ink-500 text-xs font-mono text-mist-300">{s}</div>
              {i < arr.length - 1 && <span className="text-mist-500">→</span>}
            </div>
          ))}
          <span className="text-mist-500">↺ update θ</span>
        </div>
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="01">Implementation</SectionTitle>
        <CodeBlock
          filename="src/models/vqc_model.py"
          code={CODE_VQC_PY}
          annotations={[
            { match: "ansatz = RealAmplitudes(num_qubits, reps=2)", note: "The trainable part of the circuit — layers of Ry rotations and CNOT entanglers whose angles (θ) are learned." },
            { match: "optimizer = COBYLA(maxiter=100)", note: "A classical, gradient-free optimizer updates θ for up to 100 iterations to minimize the training loss." },
            { match: "vqc.fit(X_train, y_train)", note: "Runs the full train loop: encode → measure → loss → COBYLA update → repeat." },
          ]}
        />
        <div className="flex flex-wrap gap-2 mt-4">
          <Tag>train subsample: {VQC_TRAIN_SUBSAMPLE}</Tag>
          <Tag>test subsample: {VQC_TEST_SUBSAMPLE}</Tag>
          <Tag>ansatz reps: {VQC_REPS}</Tag>
          <Tag>optimizer: {VQC_OPTIMIZER_DEFAULT}</Tag>
        </div>
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="02">RealAmplitudes ansatz</SectionTitle>
        <p className="text-sm text-mist-400 mb-5 max-w-2xl">
          Drag the θ sliders to see the parameterized circuit change — in real training,
          COBYLA chooses these values automatically to minimize loss.
        </p>
        <AnsatzCircuit thetas={thetas} numQubits={NUM_QUBITS} reps={VQC_REPS} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {thetas.map((t, i) => (
            <Slider key={i} label={`θ${i + 1}`} value={t} min={0} max={Math.PI} step={0.05} onChange={(v) => updateTheta(i, v)} accent="classical" formatValue={(v) => v.toFixed(2)} />
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <SectionTitle n="03">Training animation</SectionTitle>
          <ConceptualBadge />
        </div>
        <p className="text-sm text-mist-400 mb-5 max-w-2xl">
          This loss curve is a pedagogical simulation of what COBYLA-driven optimization
          typically looks like — a noisy, generally decreasing curve — not a replay of an
          actual training run from this repository.
        </p>
        <button
          onClick={train}
          disabled={training}
          className="px-4 py-2 border border-quantum/50 text-quantum-soft text-sm font-mono hover:bg-quantum/10 transition-colors disabled:opacity-40 mb-5"
        >
          {training ? "training…" : "Train"}
        </button>
        <div className="border border-ink-600 bg-ink-800/40">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#c7ccd6" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#c7ccd6" />
            {lossHistory.length > 1 && (
              <motion.polyline
                points={points}
                fill="none"
                stroke="#1090a8"
                strokeWidth={1.8}
              />
            )}
            {lossHistory.map((l, i) => {
              const x = PAD + (i / Math.max(1, 23)) * (W - 2 * PAD);
              const y = H - PAD - (l / maxLoss) * (H - 2 * PAD);
              return <circle key={i} cx={x} cy={y} r={2.2} fill="#0b6f83" />;
            })}
            <text x={PAD} y={16} fontSize="10" fill="#7c8494" fontFamily="IBM Plex Mono">loss</text>
            <text x={W - PAD} y={H - 6} fontSize="10" fill="#7c8494" fontFamily="IBM Plex Mono" textAnchor="end">iteration</text>
          </svg>
        </div>
        <WhyBox>
          VQC training repeats: encode data with the (fixed) feature map, run the
          parameterized ansatz, measure, compute how wrong the prediction was (loss), then
          let COBYLA propose new θ values — for up to 100 iterations per vqc_model.py.
        </WhyBox>
      </Panel>
    </div>
  );
}
