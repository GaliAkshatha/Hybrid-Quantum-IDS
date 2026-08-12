import { NavLink, useLocation } from "react-router-dom";
import { NAV_ITEMS, SECTION_LABEL } from "../../data/nav";
import type { NavItem } from "../../data/nav";
import { Atom } from "lucide-react";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function groupBySection(items: NavItem[]) {
  const groups: Record<string, NavItem[]> = {};
  for (const item of items) {
    groups[item.section] = groups[item.section] || [];
    groups[item.section].push(item);
  }
  return groups;
}

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentIndex = NAV_ITEMS.findIndex((i) => i.path === location.pathname);
  const progress = ((currentIndex + 1) / NAV_ITEMS.length) * 100;
  const groups = groupBySection(NAV_ITEMS);

  const content = (
    <>
      <div className="px-5 pt-6 pb-5 border-b border-ink-700">
        <div className="flex items-center gap-2.5">
          <Atom size={20} className="text-quantum" strokeWidth={1.6} />
          <div>
            <div className="font-display font-semibold text-sm text-mist-200 leading-tight">
              Hybrid Quantum IDS
            </div>
            <div className="eyebrow text-mist-500">Technical Laboratory</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-[3px] bg-ink-700 w-full relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-classical to-quantum transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="eyebrow text-mist-500 mt-1.5">
            {currentIndex >= 0 ? currentIndex + 1 : 0} / {NAV_ITEMS.length} stages
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {(Object.keys(groups) as (keyof typeof SECTION_LABEL)[]).map((section) => (
          <div key={section} className="mb-5">
            <div className="eyebrow text-mist-500 px-2 mb-1.5">{SECTION_LABEL[section]}</div>
            <div className="space-y-0.5">
              {groups[section].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-2 text-[13px] transition-colors border-l-2 ${
                      isActive
                        ? "border-l-quantum bg-quantum/10 text-mist-200"
                        : "border-l-transparent text-mist-400 hover:text-mist-200 hover:bg-ink-800/60"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-ink-700">
        <a
          href="https://github.com/GaliAkshatha/HybridQuantum-AIAutonomus_IDS"
          target="_blank"
          rel="noreferrer"
          className="eyebrow text-mist-500 hover:text-quantum-soft transition-colors"
        >
          source repository ↗
        </a>
      </div>
    </>
  );

  return (
    <>
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-ink-800 border border-ink-600"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      <aside className="hidden md:flex md:flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-ink-700 bg-ink-900/60 backdrop-blur-sm">
        {content}
      </aside>
      {mobileOpen && (
        <aside className="md:hidden fixed inset-0 z-40 flex flex-col w-72 h-screen bg-ink-900 border-r border-ink-700">
          {content}
        </aside>
      )}
    </>
  );
}
