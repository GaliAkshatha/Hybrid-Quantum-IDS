import { useState } from "react";
import { PageHeader, Panel, SectionTitle, Segmented, Slider, WhyBox } from "../components/ui/Primitives";
import { Eq } from "../components/ui/Equation";
import {
  COMPARISON_GRAPH_ACCURACY,
  QSVM_CONFUSION,
  SVM_CONFUSION,
  VQC_CONFUSION,
  metricsFromConfusion,
} from "../data/projectData";
import { motion } from "framer-motion";

type ModelKey = "Classical SVM" | "QSVM" | "VQC";

const CONFUSIONS: Record<ModelKey, { tn: number; fp: number; fn: number; tp: number }> = {
  "Classical SVM": SVM_CONFUSION,
  QSVM: QSVM_CONFUSION,
  VQC: VQC_CONFUSION,
};

export default function Evaluation() {
  const [model, setModel] = useState<ModelKey>("Classical SVM");
  const [custom, setCustom] = useState({ tp: 51, tn: 86, fp: 4, fn: 9 });

  const real = metricsFromConfusion(CONFUSIONS[model]);
  const live = metricsFromConfusion(custom);

  return (
    <div>
      <PageHeader
        eyebrow="Stage 12 · Synthesis"
        title="Evaluation & Model Comparison"
        lede="Confusion matrices transcribed from results/svm.png, qsvm.png and vcq.png — the actual generated output images in the repository."
      />

      <Panel className="mb-6">
        <SectionTitle n="01">Real confusion matrices</SectionTitle>
        <div className="mb-5">
          <Segmented
            options={[{ value: "Classical SVM", label: "Classical SVM" }, { value: "QSVM", label: "QSVM" }, { value: "VQC", label: "VQC" }]}
            value={model}
            onChange={(v) => setModel(v as ModelKey)}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <table className="w-full border-collapse font-mono text-sm">
              <thead>
                <tr>
                  <th></th>
                  <th className="p-2 text-mist-500 eyebrow font-normal" colSpan={2}>predicted</th>
                </tr>
                <tr>
                  <th></th>
                  <th className="p-2 text-mist-400 text-xs">normal</th>
                  <th className="p-2 text-mist-400 text-xs">attack</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-mist-400 text-xs">actual normal</td>
                  <td className="p-4 text-center border border-ink-700 bg-signal-good/10 text-signal-good">{CONFUSIONS[model].tn}</td>
                  <td className="p-4 text-center border border-ink-700 bg-signal-bad/10 text-signal-bad">{CONFUSIONS[model].fp}</td>
                </tr>
                <tr>
                  <td className="p-2 text-mist-400 text-xs">actual attack</td>
                  <td className="p-4 text-center border border-ink-700 bg-signal-bad/10 text-signal-bad">{CONFUSIONS[model].fn}</td>
                  <td className="p-4 text-center border border-ink-700 bg-signal-good/10 text-signal-good">{CONFUSIONS[model].tp}</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[11px] text-mist-500 mt-2">total test samples: {real.total.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <MetricRow label="Accuracy" value={real.accuracy} formula="(TP+TN)/(TP+TN+FP+FN)" />
            <MetricRow label="Precision" value={real.precision} formula="TP/(TP+FP)" />
            <MetricRow label="Recall" value={real.recall} formula="TP/(TP+FN)" />
            <MetricRow label="F1 score" value={real.f1} formula="2PR/(P+R)" />
          </div>
        </div>
        {model === "VQC" && (
          <p className="text-xs text-mist-500 mt-4 border-t border-ink-700 pt-3">
            Note: <code>results/comparison_graph.py</code> hardcodes VQC accuracy as{" "}
            {COMPARISON_GRAPH_ACCURACY.VQC} while this confusion matrix (from vcq.png)
            implies {(real.accuracy).toFixed(2)} — consistent with VQC training being
            stochastic (COBYLA converges to different local optima across runs). Both
            numbers are shown rather than silently picking one.
          </p>
        )}
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="02">Confusion matrix definitions</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { t: "TP — True Positive", d: "An actual attack, correctly predicted as attack." },
            { t: "TN — True Negative", d: "Actual normal traffic, correctly predicted as normal." },
            { t: "FP — False Positive", d: "Normal traffic incorrectly predicted as attack." },
            { t: "FN — False Negative", d: "An actual attack incorrectly predicted as normal — the costly miss." },
          ].map((x) => (
            <div key={x.t} className="border-l-2 border-ink-600 pl-3">
              <div className="text-sm text-mist-200 font-medium">{x.t}</div>
              <div className="text-xs text-mist-400 mt-1">{x.d}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="03">Live metric calculator</SectionTitle>
        <p className="text-sm text-mist-400 mb-5 max-w-2xl">
          Drag any cell to see how accuracy, precision, recall and F1 respond — useful for
          building intuition about the tradeoffs before looking at real numbers again.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            {(["tp", "tn", "fp", "fn"] as const).map((k) => (
              <Slider
                key={k}
                label={k.toUpperCase()}
                value={custom[k]}
                min={0}
                max={200}
                step={1}
                onChange={(v) => setCustom((o) => ({ ...o, [k]: v }))}
              />
            ))}
          </div>
          <div className="space-y-2">
            <MetricRow label="Accuracy" value={live.accuracy} formula="(TP+TN)/(TP+TN+FP+FN)" />
            <MetricRow label="Precision" value={live.precision} formula="TP/(TP+FP)" />
            <MetricRow label="Recall" value={live.recall} formula="TP/(TP+FN)" />
            <MetricRow label="F1 score" value={live.f1} formula="2PR/(P+R)" />
          </div>
        </div>
        <Eq tex="\\text{Accuracy} = \\dfrac{TP+TN}{TP+TN+FP+FN} \\qquad \\text{Precision} = \\dfrac{TP}{TP+FP} \\qquad \\text{Recall} = \\dfrac{TP}{TP+FN} \\qquad F_1 = \\dfrac{2PR}{P+R}" />
        <WhyBox>
          Recall matters most for an IDS: a false negative means a real attack passed
          through undetected, while a false positive only costs a second look at benign
          traffic. Drag FN up in the calculator above and watch recall drop faster than
          precision does.
        </WhyBox>
      </Panel>

      <Panel accent="quantum">
        <SectionTitle n="04">Model comparison</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono border-collapse">
            <thead>
              <tr className="border-b border-ink-600">
                <th className="text-left py-2 text-mist-500 font-normal text-xs">model</th>
                <th className="text-left py-2 text-mist-500 font-normal text-xs">quantum component</th>
                <th className="text-left py-2 text-mist-500 font-normal text-xs">classical component</th>
                <th className="text-right py-2 text-mist-500 font-normal text-xs">accuracy (comparison_graph.py)</th>
                <th className="text-right py-2 text-mist-500 font-normal text-xs">test set size</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-ink-700">
                <td className="py-3 text-mist-200">Classical SVM</td>
                <td className="py-3 text-mist-500">none</td>
                <td className="py-3 text-mist-300">RBF-kernel SVC, full training</td>
                <td className="py-3 text-right text-mist-200">{COMPARISON_GRAPH_ACCURACY["Classical SVM"]}</td>
                <td className="py-3 text-right text-mist-400">~25,195</td>
              </tr>
              <tr className="border-b border-ink-700">
                <td className="py-3 text-mist-200">QSVM</td>
                <td className="py-3 text-quantum-soft">ZZFeatureMap + kernel evaluation</td>
                <td className="py-3 text-mist-300">SVC(kernel="precomputed")</td>
                <td className="py-3 text-right text-mist-200">{COMPARISON_GRAPH_ACCURACY.QSVM}</td>
                <td className="py-3 text-right text-mist-400">150</td>
              </tr>
              <tr>
                <td className="py-3 text-mist-200">VQC</td>
                <td className="py-3 text-quantum-soft">ZZFeatureMap + RealAmplitudes (trained)</td>
                <td className="py-3 text-mist-300">COBYLA optimizer loop</td>
                <td className="py-3 text-right text-mist-200">{COMPARISON_GRAPH_ACCURACY.VQC}</td>
                <td className="py-3 text-right text-mist-400">100</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-mist-300 leading-relaxed mt-5">
          <strong className="text-quantum-soft">Higher accuracy does not automatically mean
          quantum advantage.</strong> The classical SVM here trains on far more data (the
          full ~25k-row test set vs. 100–150 for the quantum models) and achieves the
          highest accuracy. Quantum advantage is a specific, narrower claim — that a quantum
          algorithm outperforms every known classical approach at scale — which this
          project does not attempt to demonstrate. The comparison here is informative about
          feasibility and behaviour on this task, not a proof of quantum superiority.
        </p>
      </Panel>
    </div>
  );
}

function MetricRow({ label, value, formula }: { label: string; value: number; formula: string }) {
  return (
    <div className="p-3 border border-ink-600">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm text-mist-300">{label}</span>
        <span className="font-mono text-lg text-quantum-soft">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-ink-800 w-full mb-1.5">
        <motion.div className="h-full bg-quantum" animate={{ width: `${value * 100}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
      </div>
      <div className="eyebrow text-mist-500">{formula}</div>
    </div>
  );
}
