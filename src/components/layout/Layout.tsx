import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { NAV_ITEMS } from "../../data/nav";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const idx = NAV_ITEMS.findIndex((i) => i.path === location.pathname);
  const prev = idx > 0 ? NAV_ITEMS[idx - 1] : null;
  const next = idx >= 0 && idx < NAV_ITEMS.length - 1 ? NAV_ITEMS[idx + 1] : null;

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="px-6 md:px-12 py-10 md:py-14 max-w-6xl mx-auto"
        >
          {children}

          <div className="mt-16 pt-6 border-t border-ink-700 flex items-center justify-between">
            {prev ? (
              <Link
                to={prev.path}
                className="flex items-center gap-2 text-sm text-mist-400 hover:text-quantum-soft transition-colors"
              >
                <ArrowLeft size={15} /> {prev.label}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={next.path}
                className="flex items-center gap-2 text-sm text-mist-400 hover:text-quantum-soft transition-colors ml-auto"
              >
                {next.label} <ArrowRight size={15} />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
