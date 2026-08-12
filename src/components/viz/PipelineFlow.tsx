import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Node {
  label: string;
  sub?: string;
  path?: string;
  kind?: "classical" | "quantum" | "neutral";
}

const FLOW: Node[] = [
  { label: "Network Traffic", sub: "NSL-KDD", path: "/dataset", kind: "neutral" },
  { label: "Preprocessing", sub: "encode + scale", path: "/preprocessing", kind: "neutral" },
  { label: "PCA", sub: "41 → 4 dims", path: "/pca", kind: "neutral" },
];

const BRANCH_CLASSICAL: Node = { label: "Classical SVM", sub: "RBF kernel", path: "/svm", kind: "classical" };
const BRANCH_QUANTUM: Node[] = [
  { label: "QSVM", sub: "quantum kernel", path: "/qsvm", kind: "quantum" },
  { label: "VQC", sub: "trainable circuit", path: "/vqc", kind: "quantum" },
];

const TAIL: Node[] = [
  { label: "Evaluation", sub: "confusion matrix", path: "/evaluation", kind: "neutral" },
  { label: "Attack / Normal", sub: "prediction", kind: "neutral" },
];

function NodeCard({ node, delay }: { node: Node; delay: number }) {
  const kindColor =
    node.kind === "classical"
      ? "border-classical/50 hover:border-classical text-classical-soft"
      : node.kind === "quantum"
      ? "border-quantum/50 hover:border-quantum text-quantum-soft"
      : "border-ink-500 hover:border-mist-400 text-mist-200";

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`shrink-0 px-4 py-3 border bg-ink-900/80 ${kindColor} transition-colors min-w-[132px] text-center cursor-pointer`}
    >
      <div className="text-[13px] font-medium leading-tight">{node.label}</div>
      {node.sub && <div className="eyebrow text-mist-500 mt-1">{node.sub}</div>}
    </motion.div>
  );

  return node.path ? (
    <Link to={node.path} className="no-underline">
      {inner}
    </Link>
  ) : (
    inner
  );
}

function Connector({ delay = 0, vertical = false }: { delay?: number; vertical?: boolean }) {
  return (
    <div className={`relative shrink-0 ${vertical ? "h-8 w-px" : "w-8 h-px"} bg-ink-500`}>
      <motion.div
        className={`absolute ${vertical ? "w-1.5 h-1.5 left-1/2 -translate-x-1/2" : "w-1.5 h-1.5 top-1/2 -translate-y-1/2"} rounded-full bg-quantum`}
        animate={vertical ? { top: ["0%", "100%"] } : { left: ["0%", "100%"] }}
        transition={{ duration: 1.4, repeat: Infinity, delay, ease: "linear" }}
      />
    </div>
  );
}

export default function PipelineFlow() {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="min-w-[880px] flex flex-col items-center">
        <div className="flex items-center">
          {FLOW.map((n, i) => (
            <div key={n.label} className="flex items-center">
              <NodeCard node={n} delay={i * 0.08} />
              <Connector delay={i * 0.2} />
            </div>
          ))}
        </div>

        <div className="flex items-stretch mt-0">
          <div className="w-8" />
          <div className="flex flex-col border border-ink-600 divide-y divide-ink-600">
            <div className="flex items-center gap-3 px-4 py-3 bg-classical/[0.04]">
              <span className="eyebrow text-classical w-20 shrink-0">classical</span>
              <NodeCard node={BRANCH_CLASSICAL} delay={0.3} />
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-quantum/[0.04]">
              <span className="eyebrow text-quantum w-20 shrink-0">quantum</span>
              <div className="flex items-center gap-3">
                {BRANCH_QUANTUM.map((n, i) => (
                  <NodeCard key={n.label} node={n} delay={0.35 + i * 0.08} />
                ))}
              </div>
            </div>
          </div>
          <Connector delay={0.5} />
          {TAIL.map((n, i) => (
            <div key={n.label} className="flex items-center">
              <NodeCard node={n} delay={0.6 + i * 0.1} />
              {i < TAIL.length - 1 && <Connector delay={0.7} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
