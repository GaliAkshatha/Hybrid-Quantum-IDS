import { useState } from "react";
import { PageHeader, Panel, SectionTitle, Segmented, Slider, WhyBox } from "../components/ui/Primitives";
import { Eq } from "../components/ui/Equation";
import QuantumCircuit from "../components/viz/QuantumCircuit";
import type { FeatureMapType } from "../components/viz/QuantumCircuit";

const MAP_INFO: Record<FeatureMapType, string> = {
  ZFeatureMap:
    "Applies a single-qubit rotation per feature, with no entangling gates between qubits. Each feature is encoded independently.",
  ZZFeatureMap:
    "Adds a layer of ZZ two-qubit interaction gates after the single-qubit rotations, encoding pairwise correlations between features. This is the feature map used throughout this project's QSVM and VQC models.",
  PauliFeatureMap:
    "Generalizes ZZFeatureMap: you choose which Pauli terms (Z, ZZ, XX, YY, ...) form the entangling layer, trading circuit depth for a different encoding of feature interactions.",
};

export default function FeatureMaps() {
  const [mapType, setMapType] = useState<FeatureMapType>("ZZFeatureMap");
  const [reps, setReps] = useState(2);
  const [values, setValues] = useState([0.3, -0.6, 0.8, -0.2]);

  return (
    <div>
      <PageHeader
        eyebrow="Stage 07 · Quantum Path"
        title="Quantum Feature Maps"
        lede="A quantum feature map turns a classical vector x = [x1, x2, x3, x4] into a quantum state |φ(x)⟩ by using each value as a gate parameter."
      />

      <Panel className="mb-6">
        <SectionTitle n="00">Classical → quantum</SectionTitle>
        <div className="flex flex-wrap items-center gap-3">
          {["x = [x1..x4]", "feature map circuit", "|φ(x)⟩"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <div className="px-3 py-2 border border-ink-500 text-xs font-mono text-mist-300">{s}</div>
              {i < arr.length - 1 && <span className="text-mist-500">→</span>}
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="01">Interactive circuit</SectionTitle>
        <p className="text-sm text-mist-400 mb-5 max-w-2xl">
          num_qubits = 4, matching the PCA output. Switch the feature map, change reps, or
          drag the feature values below — the circuit redraws.
        </p>
        <div className="flex flex-wrap items-center gap-4 mb-5">
          <Segmented
            options={[
              { value: "ZFeatureMap", label: "ZFeatureMap" },
              { value: "ZZFeatureMap", label: "ZZFeatureMap" },
              { value: "PauliFeatureMap", label: "PauliFeatureMap" },
            ]}
            value={mapType}
            onChange={setMapType}
          />
          <div className="w-48"><Slider label="reps" value={reps} min={1} max={3} step={1} onChange={setReps} /></div>
        </div>

        <QuantumCircuit values={values} reps={reps} mapType={mapType} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {values.map((v, i) => (
            <Slider
              key={i}
              label={`x${i + 1} (PC${i + 1})`}
              value={v}
              min={-1}
              max={1}
              step={0.05}
              onChange={(nv) => setValues((old) => old.map((o, idx) => (idx === i ? nv : o)))}
              accent="classical"
            />
          ))}
        </div>

        <div className="mt-5 p-4 bg-ink-900/60 border border-ink-600 text-sm text-mist-400">{MAP_INFO[mapType]}</div>

        <WhyBox>
          ZZFeatureMap is the one actually used in this project's qsvm_model.py and
          vqc_model.py — chosen specifically because its entangling layer can capture
          feature interactions that a purely single-qubit encoding (ZFeatureMap) cannot.
        </WhyBox>
      </Panel>

      <Panel>
        <SectionTitle n="02">Encoding, in equations</SectionTitle>
        <p className="text-sm text-mist-400 mb-3">A single-qubit rotation layer applies:</p>
        <Eq tex="U_\\phi(x) = \\exp\\Big(i \\, x_k \\, Z_k\\Big)" />
        <p className="text-sm text-mist-400 mb-3 mt-4">The ZZ entangling layer additionally applies, for each qubit pair:</p>
        <Eq tex="U_{ZZ}(x) = \\exp\\Big(i \\,(\\pi - x_j)(\\pi - x_k)\\, Z_jZ_k\\Big)" />
        <p className="text-xs text-mist-500">
          Repeating the rotation + entangle block <code>reps</code> times (2, in this
          project) increases circuit depth and the complexity of the resulting encoding.
        </p>
      </Panel>
    </div>
  );
}
