import { useState } from "react";
import { PageHeader, Panel, SectionTitle, Tag } from "../components/ui/Primitives";
import { motion } from "framer-motion";

interface Connection {
  id: string;
  from: string;
  status: "normal" | "attack" | "unknown";
  detail: string;
}

const CONNECTIONS: Connection[] = [
  { id: "c1", from: "Client A", status: "normal", detail: "HTTP GET, SF flag, ordinary byte counts — classified normal." },
  { id: "c2", from: "Client B", status: "normal", detail: "Short FTP-data transfer, clean completion — classified normal." },
  { id: "c3", from: "Client C", status: "attack", detail: "S0 flag (no reply), src_bytes = 0, very high connection count in 2s — matches a SYN-flood-style pattern (e.g. 'neptune')." },
  { id: "c4", from: "Client D", status: "unknown", detail: "Ambiguous feature values — model confidence near the decision boundary. This is exactly where false positives/negatives happen." },
];

const TERMS = [
  { term: "Normal traffic", def: "A connection whose feature pattern matches the behaviour of legitimate use." },
  { term: "Malicious traffic", def: "A connection whose pattern matches known or novel attack behaviour (e.g. probing, denial of service, unauthorized access)." },
  { term: "Anomaly", def: "A connection that deviates statistically from learned normal behaviour, whether or not it is confirmed malicious." },
  { term: "Attack classification", def: "Assigning a traffic sample to an attack category; this project simplifies this to a single binary 'attack' class." },
  { term: "False positive", def: "Normal traffic incorrectly flagged as an attack — costs analyst time, but traffic still gets through eventually." },
  { term: "False negative", def: "An actual attack incorrectly labeled normal — the connection is let through undetected. The costliest error type for an IDS." },
];

export default function IdsFundamentals() {
  const [selected, setSelected] = useState<Connection | null>(null);

  return (
    <div>
      <PageHeader
        eyebrow="Stage 01 · Orientation"
        title="IDS Fundamentals"
        lede="Before any model, the vocabulary: what an intrusion detection system is deciding, and what it can get wrong."
      />

      <Panel className="mb-6">
        <SectionTitle n="01">Core definitions</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {TERMS.map((t) => (
            <div key={t.term} className="border-l-2 border-ink-600 pl-3">
              <div className="text-sm font-medium text-mist-200">{t.term}</div>
              <div className="text-xs text-mist-400 mt-1 leading-relaxed">{t.def}</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="02">Click a connection</SectionTitle>
        <p className="text-sm text-mist-400 mb-6 max-w-xl">
          A simplified network view. Each client opens a connection to the server; click one
          to see how its features would be read.
        </p>
        <div className="flex flex-col md:flex-row gap-10 items-center justify-center py-6">
          <div className="flex flex-col gap-5">
            {CONNECTIONS.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`flex items-center gap-3 group ${selected?.id === c.id ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
              >
                <span className="w-20 text-right text-xs font-mono text-mist-300">{c.from}</span>
                <span className="relative w-28 h-px bg-ink-500">
                  <motion.span
                    className={`absolute w-1.5 h-1.5 rounded-full top-1/2 -translate-y-1/2 ${
                      c.status === "attack" ? "bg-signal-bad" : c.status === "unknown" ? "bg-signal-warn" : "bg-signal-good"
                    }`}
                    animate={{ left: ["0%", "96%"] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: parseFloat(c.id.slice(1)) * 0.2 }}
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="px-5 py-8 border border-mist-500 text-xs font-mono text-mist-300">SERVER</div>
        </div>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-4 border border-ink-600 bg-ink-900/60"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-mist-200">{selected.from}</span>
              <Tag tone={selected.status === "attack" ? "bad" : selected.status === "unknown" ? "warn" : "good"}>
                {selected.status}
              </Tag>
            </div>
            <p className="text-xs text-mist-400 leading-relaxed">{selected.detail}</p>
          </motion.div>
        )}
      </Panel>

      <Panel>
        <SectionTitle n="03">From packet to prediction</SectionTitle>
        <p className="text-sm text-mist-400 mb-5 max-w-xl">
          A machine-learning IDS never sees "an attack" directly — it sees numbers. Every
          stage that follows in this lab is about that transformation.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {["Network Packet", "Features (41)", "Feature Vector", "ML Model", "Prediction"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <div className="px-3 py-2 border border-ink-500 text-xs font-mono text-mist-300">{s}</div>
              {i < arr.length - 1 && <span className="text-mist-500">→</span>}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
