interface Props {
  thetas: number[]; // length n * reps
  numQubits: number;
  reps: number;
}

export default function AnsatzCircuit({ thetas, numQubits, reps }: Props) {
  const rowH = 60;
  const blockW = 110;
  const leftPad = 90;
  const startX = leftPad + 20;
  const W = startX + reps * blockW + 60;
  const H = numQubits * rowH + 30;

  return (
    <div className="overflow-x-auto border border-ink-600 bg-ink-800/40 p-2">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="min-w-[520px]">
        {Array.from({ length: numQubits }).map((_, q) => (
          <g key={q}>
            <line x1={leftPad} y1={20 + q * rowH} x2={W - 20} y2={20 + q * rowH} stroke="#c7ccd6" strokeWidth={1.5} />
            <text x={0} y={24 + q * rowH} fontSize="12" fill="#96611c" fontFamily="IBM Plex Mono">q{q}</text>
          </g>
        ))}
        {Array.from({ length: reps }).map((_, r) => {
          const baseX = startX + r * blockW;
          return (
            <g key={r}>
              {Array.from({ length: numQubits }).map((_, q) => {
                const idx = r * numQubits + q;
                const val = thetas[idx] ?? 0;
                return (
                  <g key={q}>
                    <rect x={baseX} y={20 + q * rowH - 14} width={44} height={28} fill="#f4f5f7" stroke="#c07f28" strokeWidth={1.2} />
                    <text x={baseX + 22} y={20 + q * rowH + 4} fontSize="10" fill="#96611c" textAnchor="middle" fontFamily="IBM Plex Mono">
                      Ry({val.toFixed(1)})
                    </text>
                  </g>
                );
              })}
              {Array.from({ length: numQubits - 1 }).map((_, q) => (
                <g key={`cx-${q}`}>
                  <line x1={baseX + 60} y1={20 + q * rowH} x2={baseX + 60} y2={20 + (q + 1) * rowH} stroke="#1090a8" strokeWidth={1.4} />
                  <circle cx={baseX + 60} cy={20 + q * rowH} r={4} fill="#1090a8" />
                  <circle cx={baseX + 60} cy={20 + (q + 1) * rowH} r={7} fill="none" stroke="#1090a8" strokeWidth={1.4} />
                </g>
              ))}
              <text x={baseX + 30} y={H - 4} fontSize="9" fill="#7c8494" textAnchor="middle" fontFamily="IBM Plex Mono">rep {r + 1}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
