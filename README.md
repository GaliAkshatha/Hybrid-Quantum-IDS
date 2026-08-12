# Hybrid Quantum IDS — Interactive Technical Laboratory

An interactive teaching platform for the project at
https://github.com/GaliAkshatha/HybridQuantum-AIAutonomus_IDS

Every fact, code snippet, and confusion matrix in this app is transcribed from that
repository (see `src/data/projectData.ts` for the single source of truth). Where the
repository doesn't contain a value, the UI explicitly says "Not available in current
repository" rather than inventing one. Where a visualization is pedagogical rather than
a captured project result, it's labeled "Conceptual simulation."

The PCA scatter plot and explained-variance numbers on the PCA page are not illustrative
placeholders — they come from actually re-running the repository's preprocessing + PCA
pipeline against `Data/raw/KDDTrain+.txt` (see `src/data/pcaOutput.ts`).

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

This is a static Vite build, so Vercel's default settings work out of the box.

**Option A — Vercel dashboard (no CLI needed)**
1. Push this folder to a GitHub repo.
2. In Vercel, click **Add New → Project**, import that repo.
3. Vercel auto-detects the Vite framework preset:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**.

**Option B — Vercel CLI**
```bash
npm install -g vercel
vercel        # first deploy, follow the prompts
vercel --prod # promote to production
```

`vercel.json` is already included and rewrites all routes to `index.html`, which is
required because this app uses client-side routing (`react-router-dom`'s
`BrowserRouter`) — without it, refreshing on a page like `/pca` or `/qsvm` would 404.

## Stack

React 18 · TypeScript 5 · Vite 5 · Tailwind CSS · Framer Motion · KaTeX · Lucide icons

## Structure

```
src/
  components/
    layout/      sidebar navigation, page shell
    ui/           reusable primitives (panels, code blocks, equations, badges)
    viz/          pipeline diagram, PCA scatter, SVM playground, quantum circuits
  data/
    projectData.ts     all real figures/code/confusion matrices from the repo
    pcaOutput.ts        real PCA output from re-running the repo's pipeline
    vivaQuestions.ts    viva/guide-mode question bank
    nav.ts              sidebar navigation config
  pages/           one file per lab stage (Overview, PCA, QSVM, VQC, Viva, ...)
```
