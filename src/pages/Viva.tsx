import { useMemo, useState } from "react";
import { Expandable, PageHeader, Panel, SectionTitle, Tag } from "../components/ui/Primitives";
import { VIVA_QUESTIONS } from "../data/vivaQuestions";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle } from "lucide-react";

const TOPICS = Array.from(new Set(VIVA_QUESTIONS.map((q) => q.topic)));

export default function Viva() {
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const filtered = topicFilter ? VIVA_QUESTIONS.filter((q) => q.topic === topicFilter) : VIVA_QUESTIONS;
  const challenge = useMemo(() => VIVA_QUESTIONS.find((q) => q.id === challengeId) ?? null, [challengeId]);

  function newChallenge() {
    const pool = VIVA_QUESTIONS.filter((q) => q.id !== challengeId);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setChallengeId(next.id);
    setRevealed(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Stage 14 · Synthesis"
        title="Viva / Guide Mode"
        lede="Answers your guide is likely to ask for — organized by topic, plus a challenge mode to test yourself before the real thing."
      />

      <Panel className="mb-6" accent="quantum">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <SectionTitle n="00">Challenge me</SectionTitle>
          <button
            onClick={newChallenge}
            className="flex items-center gap-2 px-4 py-2 border border-quantum/50 text-quantum-soft text-sm font-mono hover:bg-quantum/10 transition-colors"
          >
            <Shuffle size={14} /> {challenge ? "next question" : "start"}
          </button>
        </div>
        <AnimatePresence mode="wait">
          {challenge ? (
            <motion.div key={challenge.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 mb-3">
                <Tag tone="quantum">{challenge.topic}</Tag>
              </div>
              <p className="text-lg text-mist-200 font-display mb-4">{challenge.question}</p>
              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  className="px-4 py-2 border border-ink-500 text-mist-300 text-sm hover:border-quantum-soft hover:text-quantum-soft transition-colors"
                >
                  Reveal explanation
                </button>
              ) : (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-sm text-mist-400 leading-relaxed border-l-2 border-quantum/40 pl-4 py-1"
                >
                  {challenge.answer}
                </motion.p>
              )}
            </motion.div>
          ) : (
            <p className="text-sm text-mist-500">Press start for a random viva question, answer it yourself, then reveal.</p>
          )}
        </AnimatePresence>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <SectionTitle n="01">Full question bank</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setTopicFilter(null)}
              className={`px-2.5 py-1 text-xs font-mono border ${!topicFilter ? "border-quantum text-quantum-soft bg-quantum/10" : "border-ink-600 text-mist-400"}`}
            >
              all
            </button>
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setTopicFilter(t)}
                className={`px-2.5 py-1 text-xs font-mono border ${topicFilter === t ? "border-quantum text-quantum-soft bg-quantum/10" : "border-ink-600 text-mist-400"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map((q) => (
            <Expandable key={q.id} title={q.question} meta={<Tag>{q.topic}</Tag>}>
              {q.answer}
            </Expandable>
          ))}
        </div>
      </Panel>
    </div>
  );
}
