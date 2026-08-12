import { motion } from "framer-motion";
import { Eyebrow, Panel, SectionTitle, Tag } from "../components/ui/Primitives";
import PipelineFlow from "../components/viz/PipelineFlow";
import { REPO_URL, CONTRACTS_STATUS } from "../data/projectData";
import { ArrowUpRight } from "lucide-react";

export default function Overview() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-14"
      >
        <Eyebrow>Interactive Technical Laboratory</Eyebrow>
        <h1 className="text-4xl md:text-6xl font-display font-semibold leading-[1.05] text-mist-200 max-w-3xl">
          Hybrid Quantum IDS
        </h1>
        <p className="mt-5 text-mist-400 max-w-xl text-[15px] leading-relaxed">
          A working laboratory for explaining this project — not just showing it. Every
          diagram below is wired to the pipeline actually implemented in{" "}
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-quantum-soft hover:underline">
            the repository
          </a>
          , from raw NSL&#8209;KDD traffic through classical and quantum classifiers.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Tag tone="neutral">NSL-KDD · binary classification</Tag>
          <Tag tone="classical">Classical SVM baseline</Tag>
          <Tag tone="quantum">QSVM + VQC on 4 qubits</Tag>
        </div>
      </motion.div>

      <Panel className="mb-10">
        <SectionTitle n="00">System pipeline</SectionTitle>
        <p className="text-sm text-mist-400 mb-6 max-w-2xl">
          Click any stage to open its dedicated lab. The pipeline branches after PCA: the
          same 4 reduced features feed a classical SVM and two quantum models in parallel.
        </p>
        <PipelineFlow />
      </Panel>

      <div className="grid md:grid-cols-2 gap-5 mb-10">
        <Panel>
          <SectionTitle n="01">What problem is being solved</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            An intrusion detection system decides, from features of a network connection,
            whether it represents normal traffic or an attack. This project builds that
            decision as a binary classifier trained on the NSL&#8209;KDD dataset, then
            compares a classical model against two quantum-enhanced models on the same
            reduced feature space.
          </p>
        </Panel>
        <Panel>
          <SectionTitle n="02">Why machine learning</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            Attack traffic doesn't follow a fixed signature — it shows up as statistical
            patterns across dozens of connection features (byte counts, error rates, login
            behaviour). A learned classifier can generalize across attack types instead of
            needing a hand-written rule for each one.
          </p>
        </Panel>
        <Panel>
          <SectionTitle n="03">Why quantum computing</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            Quantum feature maps encode classical data into a much higher-dimensional
            Hilbert space using entangling gates, which — in principle — can express
            similarity structure that's expensive to reach with classical kernels. This
            project tests that idea directly with a quantum kernel (QSVM) and a trainable
            quantum circuit (VQC).
          </p>
        </Panel>
        <Panel>
          <SectionTitle n="04">Why hybrid, not pure quantum</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            Current quantum hardware and simulators can't run a full ML pipeline alone.
            Both quantum models here still rely on classical components — QSVM hands its
            kernel to a classical SVM optimizer; VQC is trained by a classical optimizer
            (COBYLA). The quantum piece is deliberately scoped to where it can plausibly
            help.
          </p>
        </Panel>
      </div>

      <Panel accent="quantum">
        <SectionTitle n="05">Scope, honestly stated</SectionTitle>
        <p className="text-sm text-mist-400 leading-relaxed whitespace-pre-line">{CONTRACTS_STATUS}</p>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-xs text-quantum-soft hover:underline"
        >
          Inspect the repository <ArrowUpRight size={13} />
        </a>
      </Panel>
    </div>
  );
}
