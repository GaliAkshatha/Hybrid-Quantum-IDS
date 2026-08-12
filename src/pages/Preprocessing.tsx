import { useMemo, useState } from "react";
import { CodeBlock, PageHeader, Panel, SectionTitle, Slider, Tag, WhyBox } from "../components/ui/Primitives";
import { Eq } from "../components/ui/Equation";
import { CODE_TRAIN_PY, TRAIN_TEST_SPLIT } from "../data/projectData";
import { motion } from "framer-motion";

const LABEL_EXAMPLES = ["normal", "neptune", "satan", "ipsweep", "normal", "smurf", "normal", "portsweep"];

const CATEGORICAL_EXAMPLES: Record<string, string[]> = {
  protocol_type: ["tcp", "udp", "icmp"],
  service: ["http", "ftp_data", "private", "smtp"],
  flag: ["SF", "S0", "REJ", "RSTO"],
};

const SCALER_FEATURES: Record<string, number[]> = {
  src_bytes: [0, 100, 491, 10000, 50000],
  duration: [0, 2, 15, 120, 900],
  dst_host_count: [1, 20, 100, 200, 255],
};

export default function Preprocessing() {
  const [split, setSplit] = useState(80);
  const [scalerFeature, setScalerFeature] = useState<keyof typeof SCALER_FEATURES>("src_bytes");
  const [encodeInput, setEncodeInput] = useState("tcp");

  const raw = SCALER_FEATURES[scalerFeature];
  const min = Math.min(...raw);
  const max = Math.max(...raw);
  const scaled = raw.map((x) => (max === min ? 0 : (x - min) / (max - min)));

  const encoderMap = useMemo(() => {
    const opts = CATEGORICAL_EXAMPLES.protocol_type;
    const m: Record<string, number> = {};
    opts.forEach((o, i) => (m[o] = i));
    return m;
  }, []);

  const totalRows = 125973;
  const trainRows = Math.round((totalRows * split) / 100);
  const testRows = totalRows - trainRows;

  return (
    <div>
      <PageHeader
        eyebrow="Stage 03 · Classical Path"
        title="Preprocessing Lab"
        lede="Five transformations turn a raw NSL-KDD row into a model-ready numeric vector. All of this happens in src/training/train.py."
      />

      <Panel className="mb-6">
        <SectionTitle>Full preprocessing code</SectionTitle>
        <CodeBlock
          filename="src/training/train.py"
          code={CODE_TRAIN_PY}
          annotations={[
            { match: "drop('difficulty'", note: "Difficulty is an NSL-KDD scoring artifact, not a traffic feature — it's removed before modeling." },
            { match: "df['label'] = df['label'].apply", note: "Collapses every specific attack name (neptune, satan, ...) into 1; 'normal' stays 0. This makes it binary classification." },
            { match: "encoder.fit_transform(df['protocol_type'])", note: "LabelEncoder assigns each category (tcp/udp/icmp) an integer id, since models need numbers, not strings." },
            { match: "train_test_split(", note: "80% of rows become the training set, 20% become the held-out test set, with a fixed random_state=42 for reproducibility." },
            { match: "scaler.fit_transform(X_train)", note: "MinMaxScaler is fit only on the training data, then applied to both train and test — the scaler's min/max never see test data directly." },
          ]}
        />
      </Panel>

      {/* A. label transform */}
      <Panel className="mb-6">
        <SectionTitle n="A">Binary label transformation</SectionTitle>
        <p className="text-sm text-mist-400 mb-4 max-w-2xl">
          NSL-KDD ships specific attack names as the label. This project maps every
          non-'normal' name to <code className="text-quantum-soft">1</code>, and 'normal' to{" "}
          <code className="text-quantum-soft">0</code>.
        </p>
        <Tag tone="warn">This project performs binary classification, not multiclass.</Tag>
        <div className="mt-5 flex flex-wrap gap-2">
          {LABEL_EXAMPLES.map((l, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -2 }}
              className={`px-3 py-2 border text-xs font-mono ${
                l === "normal" ? "border-signal-good/40 text-signal-good" : "border-signal-bad/40 text-signal-bad"
              }`}
            >
              {l} → {l === "normal" ? 0 : 1}
            </motion.div>
          ))}
        </div>
      </Panel>

      {/* C. categorical encoding */}
      <Panel className="mb-6">
        <SectionTitle n="B">Categorical encoding</SectionTitle>
        <p className="text-sm text-mist-400 mb-4 max-w-2xl">
          <code>protocol_type</code>, <code>service</code>, and <code>flag</code> are text
          categories. <code>LabelEncoder</code> assigns each an integer, fit independently
          per column.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORICAL_EXAMPLES.protocol_type.map((o) => (
            <button
              key={o}
              onClick={() => setEncodeInput(o)}
              className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                encodeInput === o ? "border-quantum text-quantum-soft bg-quantum/10" : "border-ink-600 text-mist-400"
              }`}
            >
              "{o}"
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 font-mono text-sm">
          <span className="px-3 py-2 border border-ink-500 text-mist-200">"{encodeInput}"</span>
          <span className="text-mist-500">→ LabelEncoder →</span>
          <span className="px-3 py-2 border border-quantum/40 text-quantum-soft">{encoderMap[encodeInput]}</span>
        </div>
        <p className="text-xs text-mist-500 mt-4">
          The same pattern is applied independently to <code>service</code> and <code>flag</code>.
        </p>
      </Panel>

      {/* D. Train/test split */}
      <Panel className="mb-6">
        <SectionTitle n="C">Train / test split</SectionTitle>
        <p className="text-sm text-mist-400 mb-4 max-w-2xl">
          The project uses <code>test_size={TRAIN_TEST_SPLIT.test_size}</code>,{" "}
          <code>random_state={TRAIN_TEST_SPLIT.random_state}</code> — a fixed 80/20 split.
          Drag to see how the split would redistribute {totalRows.toLocaleString()} rows
          (illustrative — the shipped code always uses 80/20).
        </p>
        <Slider
          label="train percentage"
          value={split}
          min={50}
          max={95}
          step={5}
          onChange={setSplit}
          formatValue={(v) => `${v}%`}
        />
        <div className="mt-5 flex h-8 w-full overflow-hidden border border-ink-600">
          <motion.div
            className="bg-classical/85 flex items-center justify-center text-[11px] font-mono text-white"
            animate={{ width: `${split}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            TRAIN {split}%
          </motion.div>
          <motion.div
            className="bg-quantum/85 flex items-center justify-center text-[11px] font-mono text-white"
            animate={{ width: `${100 - split}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          >
            TEST {100 - split}%
          </motion.div>
        </div>
        <div className="mt-3 flex gap-6 text-xs font-mono text-mist-400">
          <span>train rows ≈ {trainRows.toLocaleString()}</span>
          <span>test rows ≈ {testRows.toLocaleString()}</span>
        </div>
        <WhyBox>
          Test data must stay unseen during training so the reported accuracy reflects
          generalization to new traffic, not memorization. Both the scaler and every model
          in this project are fit on X_train only, then applied to X_test.
        </WhyBox>
      </Panel>

      {/* E. MinMaxScaler */}
      <Panel>
        <SectionTitle n="D">MinMaxScaler</SectionTitle>
        <p className="text-sm text-mist-400 mb-4 max-w-2xl">Pick a feature to see its raw values rescaled to [0, 1].</p>
        <div className="flex gap-2 mb-5">
          {Object.keys(SCALER_FEATURES).map((f) => (
            <button
              key={f}
              onClick={() => setScalerFeature(f as keyof typeof SCALER_FEATURES)}
              className={`px-3 py-1.5 text-xs font-mono border transition-colors ${
                scalerFeature === f ? "border-quantum text-quantum-soft bg-quantum/10" : "border-ink-600 text-mist-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Eq tex={`x' = \\dfrac{x - x_{min}}{x_{max} - x_{min}}`} />
        <div className="grid grid-cols-2 gap-6 mt-4">
          <div>
            <div className="eyebrow text-mist-500 mb-2">before</div>
            <div className="space-y-1.5">
              {raw.map((v, i) => (
                <div key={i} className="font-mono text-sm text-mist-300 px-3 py-1.5 border border-ink-700">{v}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow text-mist-500 mb-2">after</div>
            <div className="space-y-1.5">
              {scaled.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-sm text-quantum-soft px-3 py-1.5 border border-quantum/30 relative overflow-hidden"
                >
                  <div className="absolute inset-y-0 left-0 bg-quantum/10" style={{ width: `${v * 100}%` }} />
                  <span className="relative">{v.toFixed(4)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
