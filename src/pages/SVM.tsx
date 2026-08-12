import { useState } from "react";
import { CodeBlock, ConceptualBadge, PageHeader, Panel, SectionTitle, Slider, WhyBox } from "../components/ui/Primitives";
import { EquationExplorer } from "../components/ui/Equation";
import SvmPlayground from "../components/viz/SvmPlayground";
import { CODE_SVM_PY } from "../data/projectData";

export default function SVM() {
  const [gamma, setGamma] = useState(0.5);
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(4);

  const dist2 = (x1 - x2) ** 2;
  const rbf = Math.exp(-gamma * dist2);

  return (
    <div>
      <PageHeader
        eyebrow="Stage 05 · Classical Path"
        title="Classical SVM Laboratory"
        lede="The project's classical baseline: SVC(kernel='rbf') trained on the 4 PCA components."
      />

      <Panel className="mb-6">
        <SectionTitle n="01">Implementation</SectionTitle>
        <CodeBlock
          filename="src/models/classical_model.py"
          code={CODE_SVM_PY}
          annotations={[
            { match: "SVC(kernel='rbf')", note: "Chooses a Radial Basis Function kernel — lets the SVM draw a nonlinear boundary in the original 4D PCA space." },
            { match: "model.fit(X_train, y_train)", note: "Trained on the full PCA-reduced training set (no subsampling, unlike the quantum models)." },
            { match: "model.predict(X_test)", note: "Predictions on the untouched 20% test split, later used to build the confusion matrix in the Evaluation lab." },
          ]}
        />
      </Panel>

      <Panel className="mb-6">
        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
          <SectionTitle n="02">Decision boundary playground</SectionTitle>
          <ConceptualBadge label="2D teaching visualization" />
        </div>
        <p className="text-sm text-mist-400 mb-4 max-w-2xl">
          The real classifier operates on 4 PCA dimensions, which can't be drawn directly.
          This is a 2D stand-in dataset so you can see what gamma and kernel choice actually
          do to a decision surface — switch kernel, drag gamma or C.
        </p>
        <SvmPlayground />
        <WhyBox>
          Small gamma → each point's influence reaches far, producing a smoother, more
          linear-looking boundary (risk of underfitting). Large gamma → influence is very
          local, so the boundary hugs individual points tightly (risk of overfitting).
        </WhyBox>
      </Panel>

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <Panel>
          <SectionTitle n="03">Hyperplane & margin</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            A hyperplane is the decision surface separating the two classes — a line in 2D,
            a plane in 3D, a 3-dimensional hyperplane in the model's actual 4D PCA space.
            The margin is the gap between the hyperplane and the closest points of each
            class; SVM specifically chooses the hyperplane that maximizes this gap.
          </p>
        </Panel>
        <Panel>
          <SectionTitle n="04">Support vectors</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            Support vectors are the training points closest to the boundary — the ones that
            actually determine where it sits. Every other point could move (as long as it
            doesn't cross the margin) without changing the learned hyperplane at all.
          </p>
        </Panel>
      </div>

      <Panel className="mb-6">
        <SectionTitle n="05">RBF kernel</SectionTitle>
        <EquationExplorer
          tex="K(x, z) = \\exp(-\\gamma \\lVert x - z \\rVert^2)"
          terms={[
            { symbol: "x, z", meaning: "two feature vectors being compared" },
            { symbol: "\\lVert x-z \\rVert^2", meaning: "squared Euclidean distance between them" },
            { symbol: "\\gamma", meaning: "controls how quickly similarity falls off with distance" },
            { symbol: "K(x,z)", meaning: "similarity score in [0, 1]; 1 when x = z" },
          ]}
          intuition="Two points that are close together get a similarity near 1; far-apart points get a similarity near 0, decaying exponentially. This turns raw distance into a bounded 'closeness' score the SVM can use."
          connection="scikit-learn's SVC(kernel='rbf') computes exactly this kernel internally between every pair of training points to find the maximum-margin boundary in an implicitly higher-dimensional space."
        />
        <div className="mt-6 grid md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <Slider label="x₁" value={x1} min={0} max={8} step={0.1} onChange={setX1} accent="classical" />
            <Slider label="x₂" value={x2} min={0} max={8} step={0.1} onChange={setX2} accent="classical" />
            <Slider label="gamma (γ)" value={gamma} min={0.05} max={2} step={0.05} onChange={setGamma} />
          </div>
          <div className="p-4 border border-ink-600 bg-ink-900/60 text-center">
            <div className="eyebrow text-mist-500 mb-2">similarity</div>
            <div className="text-3xl font-display text-quantum-soft mb-3">{rbf.toFixed(4)}</div>
            <div className="h-2 bg-ink-800 w-full mb-1">
              <div className="h-full bg-quantum" style={{ width: `${rbf * 100}%` }} />
            </div>
            <div className="text-[11px] text-mist-500 font-mono">distance² = {dist2.toFixed(2)}</div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
