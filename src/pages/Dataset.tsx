import { useState } from "react";
import { PageHeader, Panel, SectionTitle, Tag, WhyBox } from "../components/ui/Primitives";
import {
  DATASET_COLUMNS,
  DATASET_FILE,
  DATASET_ROW_COUNT,
  DATASET_COL_COUNT,
  SAMPLE_ROWS,
  FEATURE_MEANINGS,
} from "../data/projectData";

const DISPLAY_COLS = ["duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes", "count", "srv_count", "label", "difficulty"];

export default function Dataset() {
  const [hoverCol, setHoverCol] = useState<string | null>(null);
  const [selectedCol, setSelectedCol] = useState<string>("protocol_type");

  const info = FEATURE_MEANINGS[selectedCol];

  return (
    <div>
      <PageHeader
        eyebrow="Stage 02 · Orientation"
        title="Dataset"
        lede={`This project trains on ${DATASET_FILE}, loaded directly by src/training/train.py.`}
      />

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <Panel>
          <div className="eyebrow text-mist-500 mb-1">rows</div>
          <div className="text-2xl font-display text-mist-200">{DATASET_ROW_COUNT.toLocaleString()}</div>
        </Panel>
        <Panel>
          <div className="eyebrow text-mist-500 mb-1">columns</div>
          <div className="text-2xl font-display text-mist-200">{DATASET_COL_COUNT}</div>
        </Panel>
        <Panel>
          <div className="eyebrow text-mist-500 mb-1">feature columns</div>
          <div className="text-2xl font-display text-mist-200">41</div>
        </Panel>
        <Panel>
          <div className="eyebrow text-mist-500 mb-1">task</div>
          <div className="text-2xl font-display text-quantum-soft">binary</div>
        </Panel>
      </div>

      <Panel className="mb-6">
        <SectionTitle n="01">Sample rows</SectionTitle>
        <p className="text-sm text-mist-400 mb-4">
          A subset of columns from the first rows of KDDTrain+.txt. Hover a column to
          highlight it; click to inspect its meaning below.
        </p>
        <div className="overflow-x-auto border border-ink-600">
          <table className="min-w-full text-xs font-mono">
            <thead>
              <tr className="bg-ink-800">
                {DISPLAY_COLS.map((c) => (
                  <th
                    key={c}
                    onMouseEnter={() => setHoverCol(c)}
                    onMouseLeave={() => setHoverCol(null)}
                    onClick={() => setSelectedCol(c)}
                    className={`px-3 py-2 text-left cursor-pointer whitespace-nowrap transition-colors ${
                      hoverCol === c || selectedCol === c ? "text-quantum-soft bg-quantum/10" : "text-mist-400"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ROWS.map((row, i) => (
                <tr key={i} className="border-t border-ink-700">
                  {DISPLAY_COLS.map((c) => (
                    <td
                      key={c}
                      onMouseEnter={() => setHoverCol(c)}
                      onMouseLeave={() => setHoverCol(null)}
                      className={`px-3 py-2 whitespace-nowrap ${
                        hoverCol === c ? "bg-quantum/10 text-mist-200" : "text-mist-300"
                      } ${c === "label" ? (row[c] === "normal" ? "text-signal-good" : "text-signal-bad") : ""}`}
                    >
                      {row[c]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {info && (
          <div className="mt-4 p-4 border border-ink-600 bg-ink-900/60">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-sm text-mist-200">{selectedCol}</span>
              <Tag tone={info.type === "categorical" ? "quantum" : info.type === "binary" ? "warn" : "classical"}>
                {info.type}
              </Tag>
            </div>
            <p className="text-xs text-mist-400 leading-relaxed">{info.meaning}</p>
          </div>
        )}
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="02">All 43 columns</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {DATASET_COLUMNS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCol(c)}
              className={`px-2 py-1 text-[11px] font-mono border transition-colors ${
                selectedCol === c
                  ? "border-quantum text-quantum-soft bg-quantum/10"
                  : "border-ink-600 text-mist-400 hover:text-mist-200 hover:border-ink-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="text-xs text-mist-500 mt-3">
          Only a subset of these have verified per-feature descriptions above; the rest
          follow the standard NSL-KDD schema referenced in train.py's <code>columns</code> list.
        </p>
      </Panel>

      <Panel>
        <SectionTitle n="03">Data journey</SectionTitle>
        <div className="flex flex-wrap items-center gap-3">
          {["Raw Row (43 cols)", "Feature Extraction", "Clean Row (41 features)", "Model Input"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <div className="px-3 py-2 border border-ink-500 text-xs font-mono text-mist-300">{s}</div>
              {i < arr.length - 1 && <span className="text-mist-500">→</span>}
            </div>
          ))}
        </div>
        <WhyBox>
          The raw row carries a NSL-KDD "difficulty" score and a multiclass label string —
          neither is a network-observable feature, so both are removed before the row
          becomes model input. See the Preprocessing lab for exactly how.
        </WhyBox>
      </Panel>
    </div>
  );
}
