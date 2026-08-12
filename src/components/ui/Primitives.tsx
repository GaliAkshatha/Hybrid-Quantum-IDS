import { useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, FlaskConical, AlertTriangle } from "lucide-react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow text-quantum-soft/80 mb-2">{children}</div>;
}

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="text-3xl md:text-4xl font-display font-semibold text-mist-200">{title}</h1>
      {lede && <p className="mt-3 text-mist-400 text-[15px] leading-relaxed">{lede}</p>}
    </div>
  );
}

export function Panel({
  children,
  className = "",
  accent,
}: {
  children: ReactNode;
  className?: string;
  accent?: "classical" | "quantum" | "none";
}) {
  const border =
    accent === "classical"
      ? "border-l-2 border-l-classical/60"
      : accent === "quantum"
      ? "border-l-2 border-l-quantum/60"
      : "";
  return (
    <div className={`lab-panel ${border} p-5 md:p-6 ${className}`}>{children}</div>
  );
}

export function SectionTitle({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <h2 className="text-lg font-display font-semibold text-mist-200 flex items-baseline gap-2 mb-3">
      {n && <span className="font-mono text-xs text-quantum/70">{n}</span>}
      {children}
    </h2>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "classical" | "quantum" | "good" | "warn" | "bad";
}) {
  const map: Record<string, string> = {
    neutral: "bg-ink-700 text-mist-300",
    classical: "bg-classical/15 text-classical-soft border border-classical/30",
    quantum: "bg-quantum/15 text-quantum-soft border border-quantum/30",
    good: "bg-signal-good/15 text-signal-good border border-signal-good/30",
    warn: "bg-signal-warn/15 text-signal-warn border border-signal-warn/30",
    bad: "bg-signal-bad/15 text-signal-bad border border-signal-bad/30",
  };
  return (
    <span className={`eyebrow inline-flex items-center px-2 py-1 rounded-sm ${map[tone]}`}>
      {children}
    </span>
  );
}

export function ConceptualBadge({ label = "Conceptual simulation" }: { label?: string }) {
  return (
    <span className="eyebrow inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-quantum-violet/10 text-quantum-violet border border-quantum-violet/30">
      <FlaskConical size={12} /> {label}
    </span>
  );
}

export function NotAvailableBadge({ label = "Not available in current repository" }: { label?: string }) {
  return (
    <span className="eyebrow inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-ink-700 text-mist-400 border border-ink-500">
      <AlertTriangle size={12} /> {label}
    </span>
  );
}

export function WhyBox({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="eyebrow flex items-center gap-1.5 text-quantum-soft hover:text-quantum transition-colors"
      >
        <HelpCircle size={13} /> WHY THIS STEP?
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-sm text-mist-300 leading-relaxed border-l-2 border-quantum/40 pl-3 py-1">
              {children}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Expandable({
  title,
  children,
  defaultOpen = false,
  meta,
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  meta?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-ink-600">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-ink-800/60 transition-colors"
      >
        <span className="font-medium text-mist-200 text-sm">{title}</span>
        <div className="flex items-center gap-3 shrink-0">
          {meta}
          <ChevronDown size={15} className={`text-mist-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 text-sm text-mist-400 leading-relaxed border-t border-ink-700">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CodeBlock({
  code,
  filename,
  annotations,
}: {
  code: string;
  filename?: string;
  annotations?: { match: string; note: string }[];
}) {
  const lines = code.split("\n");
  const [activeLine, setActiveLine] = useState<number | null>(null);

  function findAnnotation(line: string) {
    if (!annotations) return null;
    return annotations.find((a) => line.includes(a.match)) ?? null;
  }

  return (
    <div className="border border-ink-600 bg-ink-800/50 overflow-hidden">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-ink-800 border-b border-ink-600">
          <span className="font-mono text-xs text-mist-400">{filename}</span>
          <span className="eyebrow text-mist-500">from repository</span>
        </div>
      )}
      <div className="overflow-x-auto text-[13px]">
        {lines.map((line, i) => {
          const ann = findAnnotation(line);
          const isActive = activeLine === i;
          return (
            <div key={i}>
              <div
                onClick={() => ann && setActiveLine(isActive ? null : i)}
                className={`flex gap-4 px-4 py-[3px] font-mono whitespace-pre ${
                  ann ? "cursor-pointer hover:bg-quantum/10" : ""
                } ${isActive ? "bg-quantum/10" : ""}`}
              >
                <span className="text-mist-500/50 select-none w-5 text-right shrink-0">{i + 1}</span>
                <span className={ann ? "text-quantum-soft border-b border-dotted border-quantum/50" : "text-mist-300"}>
                  {line || " "}
                </span>
              </div>
              <AnimatePresence>
                {isActive && ann && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-4 my-2 px-3 py-2 bg-ink-800/80 border-l-2 border-quantum text-xs text-mist-300 leading-relaxed">
                      {ann.note}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      {annotations && (
        <div className="px-4 py-2 bg-ink-800/60 border-t border-ink-600 eyebrow text-mist-500">
          click a highlighted line for detail
        </div>
      )}
    </div>
  );
}

export function StatRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-ink-700/70 last:border-0">
      <span className="text-sm text-mist-400">{label}</span>
      <span className="font-mono text-sm text-mist-200">{value}</span>
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  accent = "quantum",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
  accent?: "quantum" | "classical";
}) {
  const color = accent === "quantum" ? "accent-quantum" : "accent-classical";
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-mist-400">{label}</span>
        <span className="font-mono text-mist-200">{formatValue ? formatValue(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 bg-ink-600 appearance-none cursor-pointer ${color}`}
      />
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex border border-ink-600 p-0.5 bg-ink-900">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 text-xs font-mono transition-colors ${
            value === o.value ? "bg-quantum/20 text-quantum-soft" : "text-mist-400 hover:text-mist-200"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
