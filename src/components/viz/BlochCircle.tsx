import { motion } from "framer-motion";

export default function BlochCircle({ theta }: { theta: number }) {
  const R = 110;
  const cx = 140, cy = 140;
  const px = cx + R * Math.sin(theta);
  const py = cy - R * Math.cos(theta);

  return (
    <svg viewBox="0 0 280 280" className="w-full max-w-[280px] mx-auto">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#c7ccd6" strokeWidth={1} />
      <line x1={cx} y1={cy - R - 14} x2={cx} y2={cy + R + 14} stroke="#e2e5eb" strokeWidth={1} />
      <line x1={cx - R - 14} y1={cy} x2={cx + R + 14} y2={cy} stroke="#e2e5eb" strokeWidth={1} />
      <text x={cx} y={cy - R - 20} textAnchor="middle" fontSize="12" fill="#0b6f83" fontFamily="IBM Plex Mono">|0⟩</text>
      <text x={cx} y={cy + R + 30} textAnchor="middle" fontSize="12" fill="#0b6f83" fontFamily="IBM Plex Mono">|1⟩</text>
      <motion.line
        x1={cx} y1={cy} x2={px} y2={py}
        stroke="#1090a8" strokeWidth={2}
        animate={{ x2: px, y2: py }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      />
      <motion.circle
        cx={px} cy={py} r={6} fill="#1090a8"
        animate={{ cx: px, cy: py }}
        transition={{ type: "spring", stiffness: 90, damping: 14 }}
      />
    </svg>
  );
}
