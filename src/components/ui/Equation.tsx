import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import type { ReactNode } from "react";

export function Eq({ tex }: { tex: string }) {
  return (
    <div className="my-3 py-3 px-4 bg-ink-900/70 border border-ink-600 overflow-x-auto">
      <BlockMath math={tex} />
    </div>
  );
}

export function InlineEq({ tex }: { tex: string }) {
  return <InlineMath math={tex} />;
}

export function EquationExplorer({
  tex,
  terms,
  intuition,
  connection,
}: {
  tex: string;
  terms: { symbol: string; meaning: string }[];
  intuition: string;
  connection: string;
}) {
  return (
    <div className="border border-ink-600">
      <div className="p-4 bg-ink-900/70 overflow-x-auto">
        <BlockMath math={tex} />
      </div>
      <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink-700 border-t border-ink-700">
        <div className="p-4">
          <div className="eyebrow text-quantum-soft mb-2">Term by term</div>
          <ul className="space-y-1.5">
            {terms.map((t, i) => (
              <li key={i} className="text-xs text-mist-400 flex gap-2">
                <span className="font-mono text-mist-200 shrink-0">
                  <InlineMath math={t.symbol} />
                </span>
                <span>{t.meaning}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <div className="eyebrow text-quantum-soft mb-2">Intuition</div>
          <p className="text-xs text-mist-400 leading-relaxed">{intuition}</p>
        </div>
        <div className="p-4">
          <div className="eyebrow text-quantum-soft mb-2">In this project</div>
          <p className="text-xs text-mist-400 leading-relaxed">{connection}</p>
        </div>
      </div>
    </div>
  );
}

export function MathText({ children }: { children: ReactNode }) {
  return <span className="font-mono text-mist-200">{children}</span>;
}
