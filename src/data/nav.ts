export interface NavItem {
  path: string;
  label: string;
  section: "orient" | "classical" | "quantum" | "synthesize";
}

export const NAV_ITEMS: NavItem[] = [
  { path: "/", label: "Overview", section: "orient" },
  { path: "/ids-fundamentals", label: "IDS Fundamentals", section: "orient" },
  { path: "/dataset", label: "Dataset", section: "orient" },
  { path: "/preprocessing", label: "Preprocessing", section: "classical" },
  { path: "/pca", label: "PCA", section: "classical" },
  { path: "/svm", label: "Classical SVM", section: "classical" },
  { path: "/quantum-basics", label: "Quantum Computing Basics", section: "quantum" },
  { path: "/feature-maps", label: "Quantum Feature Maps", section: "quantum" },
  { path: "/qsvm", label: "QSVM", section: "quantum" },
  { path: "/vqc", label: "VQC", section: "quantum" },
  { path: "/optimizers", label: "Optimizers", section: "quantum" },
  { path: "/experiments", label: "Experiments", section: "synthesize" },
  { path: "/evaluation", label: "Evaluation", section: "synthesize" },
  { path: "/pipeline", label: "End-to-End Pipeline", section: "synthesize" },
  { path: "/viva", label: "Viva / Guide Mode", section: "synthesize" },
];

export const SECTION_LABEL: Record<NavItem["section"], string> = {
  orient: "Orientation",
  classical: "Classical Path",
  quantum: "Quantum Path",
  synthesize: "Synthesis",
};
