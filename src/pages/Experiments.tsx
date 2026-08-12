import { CodeBlock, NotAvailableBadge, PageHeader, Panel, SectionTitle, Tag } from "../components/ui/Primitives";
import { CODE_FEATUREMAP_EXPERIMENT, CODE_OPTIMIZER_EXPERIMENT } from "../data/projectData";

export default function Experiments() {
  return (
    <div>
      <PageHeader
        eyebrow="Stage 11 · Synthesis"
        title="Experiments"
        lede="Two comparison scripts exist in the repository's experiments/ folder. Both are runnable, but neither persists its printed results to a file."
      />

      <Panel className="mb-6">
        <SectionTitle n="01">Feature map experiment</SectionTitle>
        <p className="text-sm text-mist-400 mb-4 max-w-2xl">
          Compares ZZFeatureMap, ZFeatureMap, and PauliFeatureMap under identical conditions
          — same 300 train / 150 test subsample, same reps=2, same classical SVC head.
        </p>
        <CodeBlock filename="experiments/qsvm_featuremap_experiment.py" code={CODE_FEATUREMAP_EXPERIMENT} />
        <div className="mt-5 grid grid-cols-3 gap-3">
          {["ZZFeatureMap", "ZFeatureMap", "PauliFeatureMap"].map((f) => (
            <div key={f} className="p-4 border border-ink-600 text-center">
              <div className="text-xs font-mono text-mist-300 mb-2">{f}</div>
              <NotAvailableBadge label="accuracy: not in repo" />
            </div>
          ))}
        </div>
        <p className="text-xs text-mist-500 mt-4">
          The script calls <code>print(f"{"{name}"} Accuracy:", acc)</code> — results go to
          stdout only. No results file is committed to the repository, so specific accuracy
          numbers per feature map can't be reported here without running the script.
        </p>
      </Panel>

      <Panel>
        <SectionTitle n="02">VQC optimizer experiment</SectionTitle>
        <p className="text-sm text-mist-400 mb-4 max-w-2xl">
          Compares COBYLA, SPSA, and ADAM as the classical optimizer for the same VQC
          (ZZFeatureMap + RealAmplitudes ansatz), on a 200 train / 100 test subsample.
        </p>
        <CodeBlock filename="experiments/vqc_optimizer_experiment.py" code={CODE_OPTIMIZER_EXPERIMENT} />
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[
            { name: "COBYLA", maxiter: 100 },
            { name: "SPSA", maxiter: 100 },
            { name: "ADAM", maxiter: 40 },
          ].map((o) => (
            <div key={o.name} className="p-4 border border-ink-600 text-center">
              <div className="text-xs font-mono text-mist-300 mb-1">{o.name}</div>
              <Tag>maxiter {o.maxiter}</Tag>
              <div className="mt-2"><NotAvailableBadge label="accuracy: not in repo" /></div>
            </div>
          ))}
        </div>
        <p className="text-xs text-mist-500 mt-4">
          Same situation as above — accuracy per optimizer is printed at runtime but not
          saved anywhere in the repository as committed.
        </p>
      </Panel>
    </div>
  );
}
