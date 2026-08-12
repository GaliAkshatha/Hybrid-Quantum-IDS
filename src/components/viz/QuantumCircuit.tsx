export type FeatureMapType = "ZFeatureMap" | "ZZFeatureMap" | "PauliFeatureMap";

interface Props {
  values: number[]; // 4 feature values, roughly [-1, 1]
  reps: number;
  mapType: FeatureMapType;
}

export default function QuantumCircuit({ values, reps, mapType }: Props) {
  const n = values.length;
  const rowH = 60;
  const leftPad = 90;
  const blockW = mapType === "ZFeatureMap" ? 90 : 150;
  const startX = leftPad + 20;
  const W = startX + reps * blockW + 60;
  const H = n * rowH + 30;

  const hasEntangle = mapType !== "ZFeatureMap";

  return (
    <div className="overflow-x-auto border border-ink-600 bg-ink-800/40 p-2">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="min-w-[560px]">
        {/* qubit wires */}
        {values.map((_, q) => (
          <g key={q}>
            <line x1={leftPad} y1={20 + q * rowH} x2={W - 20} y2={20 + q * rowH} stroke="#c7ccd6" strokeWidth={1.5} />
            <text x={0} y={24 + q * rowH} fontSize="12" fill="#0b6f83" fontFamily="IBM Plex Mono">
              q{q}: |0⟩
            </text>
          </g>
        ))}

        {/* Hadamard layer (all feature maps start with H on every qubit) */}
        {values.map((_, q) => (
          <g key={`h-${q}`}>
            <rect x={startX - 16} y={20 + q * rowH - 14} width={28} height={28} fill="#f4f5f7" stroke="#1090a8" strokeWidth={1.2} />
            <text x={startX - 2} y={20 + q * rowH + 5} fontSize="12" fill="#0b6f83" textAnchor="middle" fontFamily="IBM Plex Mono">H</text>
          </g>
        ))}

        {Array.from({ length: reps }).map((_, r) => {
          const baseX = startX + 30 + r * blockW;
          return (
            <g key={r}>
              {/* rotation gates encoding feature values */}
              {values.map((v, q) => (
                <g key={q}>
                  <rect
                    x={baseX} y={20 + q * rowH - 14}
                    width={44} height={28}
                    fill="#f4f5f7" stroke="#c07f28" strokeWidth={1.2}
                  />
                  <text x={baseX + 22} y={20 + q * rowH + 4} fontSize="10" fill="#96611c" textAnchor="middle" fontFamily="IBM Plex Mono">
                    P({v.toFixed(1)})
                  </text>
                </g>
              ))}

              {/* entangling layer for ZZ / Pauli */}
              {hasEntangle &&
                values.slice(0, -1).map((_, q) => (
                  <g key={`ent-${q}`}>
                    <line
                      x1={baseX + 70} y1={20 + q * rowH}
                      x2={baseX + 70} y2={20 + (q + 1) * rowH}
                      stroke="#1090a8" strokeWidth={1.4}
                    />
                    <circle cx={baseX + 70} cy={20 + q * rowH} r={4} fill="#1090a8" />
                    <circle cx={baseX + 70} cy={20 + (q + 1) * rowH} r={4} fill="#1090a8" />
                    <text x={baseX + 78} y={20 + q * rowH + (rowH / 2)} fontSize="9" fill="#1090a8" fontFamily="IBM Plex Mono">
                      ZZ
                    </text>
                  </g>
                ))}
              <text x={baseX + 20} y={H - 4} fontSize="9" fill="#7c8494" textAnchor="middle" fontFamily="IBM Plex Mono">
                rep {r + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
