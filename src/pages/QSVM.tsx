import { useState } from "react";
import { CodeBlock, ConceptualBadge, PageHeader, Panel, SectionTitle, Slider, Tag, WhyBox } from "../components/ui/Primitives";
import { Eq } from "../components/ui/Equation";
import { CODE_QSVM_PY, QSVM_REPS, QSVM_TEST_SUBSAMPLE, QSVM_TRAIN_SUBSAMPLE } from "../data/projectData";

// Simplified single-qubit-rotation fidelity approximation, ignoring ZZ entangling terms.
// Real fidelity |<phi(x)|phi(z)>|^2 for the actual ZZFeatureMap requires state-vector
// simulation; this reduced formula is for building intuition about how distance -> similarity.
function approxKernel(x: number[], z: number[]) {
  let k = 1;
  for (let i = 0; i < x.length; i++) {
    k *= Math.cos((x[i] - z[i]) / 2) ** 2;
  }
  return k;
}

const SAMPLES = [
  { name: "x1", v: [0.4, -0.5, 0.7, -0.1] },
  { name: "x2", v: [0.3, -0.4, 0.6, -0.2] },
  { name: "x3", v: [-0.6, 0.8, -0.2, 0.5] },
  { name: "x4", v: [0.1, 0.2, -0.3, 0.4] },
];

export default function QSVM() {
  const [x, setX] = useState([0.4, -0.5, 0.7, -0.1]);
  const [z, setZ] = useState([0.3, 0.5, -0.6, 0.2]);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);

  const k = approxKernel(x, z);

  return (
    <div>
      <PageHeader
        eyebrow="Stage 08 · Quantum Path"
        title="QSVM Laboratory"
        lede="The project's core quantum model: a quantum kernel feeding a classical SVM."
      />

      <Panel className="mb-6" accent="quantum">
        <p className="text-sm text-mist-300 leading-relaxed">
          <strong className="text-quantum-soft">The quantum computer does not perform the
          entire SVM.</strong> Quantum: feature encoding + kernel evaluation only. Classical:
          the SVM optimization and final decision boundary.
        </p>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {["Training data", "Quantum kernel", "Kernel matrix", "Classical SVM", "Prediction"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`px-3 py-2 border text-xs font-mono ${i === 1 || i === 2 ? "border-quantum/50 text-quantum-soft" : "border-classical/50 text-classical-soft"}`}>
                {s}
              </div>
              {i < arr.length - 1 && <span className="text-mist-500">→</span>}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="01">Implementation</SectionTitle>
        <CodeBlock
          filename="src/models/qsvm_model.py"
          code={CODE_QSVM_PY}
          annotations={[
            { match: "ZZFeatureMap(feature_dimension=num_qubits", note: "num_qubits = 4 here, matching the PCA output — one qubit per principal component." },
            { match: "FidelityQuantumKernel(feature_map=feature_map)", note: "Defines the kernel as state fidelity between two feature-mapped quantum states, evaluated via simulation." },
            { match: "quantum_kernel.evaluate(x_vec=X_train)", note: "Computes the full pairwise training kernel matrix — the expensive, quantum-simulated step." },
            { match: 'model = SVC(kernel="precomputed")', note: "Hands the precomputed kernel matrix to a standard classical SVM — from here on, training is entirely classical." },
          ]}
        />
        <div className="flex flex-wrap gap-2 mt-4">
          <Tag>train subsample: {QSVM_TRAIN_SUBSAMPLE}</Tag>
          <Tag>test subsample: {QSVM_TEST_SUBSAMPLE}</Tag>
          <Tag>feature map reps: {QSVM_REPS}</Tag>
        </div>
        <WhyBox>
          Quantum-kernel evaluation costs grow quickly with sample count, since every pair
          of samples needs a simulated fidelity. Subsampling to 300 train / 150 test keeps
          this tractable — at the cost of training on far less data than the classical SVM.
        </WhyBox>
      </Panel>

      <Panel className="mb-6">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <SectionTitle n="02">Kernel value explorer</SectionTitle>
          <ConceptualBadge label="simplified single-qubit approximation" />
        </div>
        <p className="text-sm text-mist-400 mb-5 max-w-2xl">
          Drag x and z (each a 4-dim PCA vector) to see how their quantum-kernel similarity
          changes. This uses a reduced formula that ignores the ZZ entangling terms in the
          real feature map — useful for intuition, not the exact FidelityQuantumKernel value.
        </p>
        <Eq tex="K(x,z) = |\\langle\\phi(x)|\\phi(z)\\rangle|^2" />
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-3">
            <div className="eyebrow text-quantum-soft mb-1">x</div>
            {x.map((v, i) => (
              <Slider key={i} label={`x${i + 1}`} value={v} min={-1} max={1} step={0.05} onChange={(nv) => setX((o) => o.map((ov, idx) => (idx === i ? nv : ov)))} />
            ))}
          </div>
          <div className="space-y-3">
            <div className="eyebrow text-classical-soft mb-1">z</div>
            {z.map((v, i) => (
              <Slider key={i} label={`z${i + 1}`} value={v} min={-1} max={1} step={0.05} onChange={(nv) => setZ((o) => o.map((ov, idx) => (idx === i ? nv : ov)))} accent="classical" />
            ))}
          </div>
        </div>
        <div className="mt-5 p-4 border border-ink-600 bg-ink-900/60 text-center">
          <div className="eyebrow text-mist-500 mb-2">K(x, z)</div>
          <div className="text-3xl font-display text-quantum-soft">{k.toFixed(4)}</div>
          <div className="h-2 bg-ink-800 w-full mt-2"><div className="h-full bg-quantum" style={{ width: `${k * 100}%` }} /></div>
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <SectionTitle n="03">Quantum kernel matrix</SectionTitle>
          <ConceptualBadge label="illustrative example, same approximation" />
        </div>
        <p className="text-sm text-mist-400 mb-5 max-w-2xl">
          Click a cell to see which pair of samples it compares. K<sub>ij</sub> = similarity
          between sample i and sample j — this is what FidelityQuantumKernel.evaluate()
          builds for the whole training set (at 300×300, far bigger than this 4×4 example).
        </p>
        <div className="overflow-x-auto">
          <table className="border-collapse font-mono text-xs">
            <thead>
              <tr>
                <th className="p-2"></th>
                {SAMPLES.map((s) => <th key={s.name} className="p-2 text-mist-400">{s.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {SAMPLES.map((row, i) => (
                <tr key={row.name}>
                  <td className="p-2 text-mist-400">{row.name}</td>
                  {SAMPLES.map((col, j) => {
                    const val = approxKernel(row.v, col.v);
                    const active = activeCell && activeCell[0] === i && activeCell[1] === j;
                    return (
                      <td
                        key={col.name}
                        onClick={() => setActiveCell([i, j])}
                        className={`p-3 text-center cursor-pointer border border-ink-700 transition-colors ${active ? "bg-quantum/20 text-quantum-soft" : "text-mist-300 hover:bg-ink-800"}`}
                        style={{ backgroundColor: active ? undefined : `rgba(79,195,217,${val * 0.35})` }}
                      >
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {activeCell && (
          <p className="text-xs text-mist-400 mt-3">
            K[{SAMPLES[activeCell[0]].name}, {SAMPLES[activeCell[1]].name}] ={" "}
            {approxKernel(SAMPLES[activeCell[0]].v, SAMPLES[activeCell[1]].v).toFixed(4)} — the
            quantum-estimated similarity between {SAMPLES[activeCell[0]].name} and {SAMPLES[activeCell[1]].name}.
          </p>
        )}
      </Panel>
    </div>
  );
}
