import { useState } from "react";
import { ConceptualBadge, PageHeader, Panel, SectionTitle, Slider, Tag } from "../components/ui/Primitives";
import { Eq } from "../components/ui/Equation";
import BlochCircle from "../components/viz/BlochCircle";
import { motion, AnimatePresence } from "framer-motion";

export default function QuantumBasics() {
  const [theta, setTheta] = useState(Math.PI / 4);
  const [measurement, setMeasurement] = useState<0 | 1 | null>(null);

  const p0 = Math.cos(theta / 2) ** 2;
  const p1 = Math.sin(theta / 2) ** 2;

  function measure() {
    const r = Math.random();
    setMeasurement(r < p0 ? 0 : 1);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Stage 06 · Quantum Path"
        title="Quantum Computing Basics"
        lede="Before QSVM or VQC make sense, a few fundamentals: what a qubit is, and what a gate does to it."
      />

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <Panel>
          <SectionTitle n="01">Classical bit vs qubit</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed mb-3">
            A classical bit is always definitely 0 or 1. A qubit's state before measurement
            is a superposition of both, described by complex amplitudes:
          </p>
          <Eq tex="|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle, \\quad |\\alpha|^2 + |\\beta|^2 = 1" />
          <p className="text-xs text-mist-500">
            |α|² and |β|² are the probabilities of measuring 0 or 1 — they must sum to 1.
          </p>
        </Panel>
        <Panel>
          <SectionTitle n="02">Superposition & measurement</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            Superposition isn't directly observable — measuring a qubit always returns a
            definite 0 or 1, with probability set by the amplitudes at the moment of
            measurement. The circuit only manipulates the superposition <em>before</em> that
            collapse happens.
          </p>
        </Panel>
      </div>

      <Panel className="mb-6">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <SectionTitle n="03">Manipulate a qubit</SectionTitle>
          <ConceptualBadge label="simplified 2D Bloch representation (real amplitudes)" />
        </div>
        <p className="text-sm text-mist-400 mb-6 max-w-2xl">
          Drag θ to rotate the state between |0⟩ and |1⟩. This restricts to real amplitudes
          — a full Bloch sphere also has a phase axis, omitted here for clarity.
        </p>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <BlochCircle theta={theta} />
          <div className="space-y-5">
            <Slider label="θ (rotation)" value={theta} min={0} max={Math.PI} step={0.01} onChange={setTheta} formatValue={(v) => `${(v * (180 / Math.PI)).toFixed(0)}°`} />
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-quantum/30 bg-quantum/5">
                <div className="eyebrow text-mist-500">P(|0⟩)</div>
                <div className="text-xl font-mono text-quantum-soft">{p0.toFixed(3)}</div>
              </div>
              <div className="p-3 border border-classical/30 bg-classical/5">
                <div className="eyebrow text-mist-500">P(|1⟩)</div>
                <div className="text-xl font-mono text-classical-soft">{p1.toFixed(3)}</div>
              </div>
            </div>
            <button
              onClick={measure}
              className="w-full py-2.5 border border-quantum/50 text-quantum-soft text-sm font-mono hover:bg-quantum/10 transition-colors"
            >
              Measure
            </button>
            <AnimatePresence mode="wait">
              {measurement !== null && (
                <motion.div
                  key={measurement}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-2 border border-ink-600 font-mono text-lg text-mist-200"
                >
                  result: |{measurement}⟩
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Panel>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <Panel>
          <SectionTitle n="04">Hadamard gate</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed mb-3">
            Applied to |0⟩, the Hadamard gate produces an equal superposition — θ = 90° in
            the visualization above, giving P(|0⟩) = P(|1⟩) = 0.5.
          </p>
          <button
            onClick={() => setTheta(Math.PI / 2)}
            className="text-xs font-mono px-3 py-1.5 border border-ink-600 text-mist-300 hover:border-quantum/50 hover:text-quantum-soft transition-colors"
          >
            set θ = 90° (H|0⟩)
          </button>
        </Panel>
        <Panel>
          <SectionTitle n="05">Rotation gates</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            Rotation gates (Rx, Ry, Rz) move the state around the Bloch sphere by a chosen
            angle. This is exactly the mechanism quantum feature maps use: a classical
            feature's numeric value becomes the rotation angle applied to a qubit.
          </p>
        </Panel>
      </div>

      <Panel>
        <SectionTitle n="06">Entanglement</SectionTitle>
        <p className="text-sm text-mist-400 leading-relaxed max-w-2xl mb-4">
          Two-qubit gates (like the ZZ-interaction used in ZZFeatureMap) can entangle
          qubits, so their measurement outcomes become statistically correlated in a way no
          classical bit pair can reproduce. This is what lets a quantum feature map encode
          interactions <em>between</em> features, not just each feature independently.
        </p>
        <div className="flex items-center gap-6 justify-center py-4">
          <Tag tone="quantum">qubit 1</Tag>
          <motion.div
            className="w-16 h-px bg-quantum relative"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 eyebrow text-quantum-soft">ZZ</span>
          </motion.div>
          <Tag tone="quantum">qubit 2</Tag>
        </div>
      </Panel>
    </div>
  );
}
