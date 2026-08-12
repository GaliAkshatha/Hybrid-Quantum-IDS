import { CodeBlock, PageHeader, Panel, SectionTitle, WhyBox } from "../components/ui/Primitives";
import { Eq, EquationExplorer } from "../components/ui/Equation";
import PcaScatter from "../components/viz/PcaScatter";
import { EXPLAINED_VARIANCE_RATIO } from "../data/pcaOutput";
import { CODE_PCA_PY, ORIGINAL_FEATURE_COUNT, PCA_N_COMPONENTS } from "../data/projectData";
import { motion } from "framer-motion";

export default function PCA() {
  const cumulative = EXPLAINED_VARIANCE_RATIO.reduce<number[]>((acc, v, i) => {
    acc.push((acc[i - 1] ?? 0) + v);
    return acc;
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Stage 04 · Classical Path"
        title="PCA Laboratory"
        lede="Principal Component Analysis compresses 41 scaled features down to 4 — the exact number of qubits the quantum stages will use."
      />

      <Panel className="mb-6" accent="quantum">
        <SectionTitle n="00">The critical transformation</SectionTitle>
        <div className="flex flex-wrap items-center justify-center gap-4 py-6">
          {[`${ORIGINAL_FEATURE_COUNT} features`, "PCA", `${PCA_N_COMPONENTS} components`, `${PCA_N_COMPONENTS} qubits`].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className={`px-4 py-3 border text-center font-mono text-sm ${
                  i === 1 ? "border-quantum text-quantum-soft" : i === 3 ? "border-quantum/60 text-quantum-soft bg-quantum/5" : "border-ink-500 text-mist-200"
                }`}
              >
                {s}
              </motion.div>
              {i < arr.length - 1 && <span className="text-mist-500">→</span>}
            </div>
          ))}
        </div>
        <p className="text-sm text-mist-400 text-center max-w-lg mx-auto">
          Every PCA component becomes the rotation angle for one qubit in the quantum
          feature maps used later — this is why the component count is not arbitrary.
        </p>
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="01">Real PCA output on this dataset</SectionTitle>
        <p className="text-sm text-mist-400 mb-4 max-w-2xl">
          This scatter plot is not illustrative filler — it's the actual PCA projection
          produced by re-running this project's preprocessing + <code>PCA(n_components=4)</code> on
          KDDTrain+.txt, sampled to 250 training points. Hover a point to inspect it; switch axes to view different component pairs.
        </p>
        <PcaScatter />
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="02">Explained variance</SectionTitle>
        <p className="text-sm text-mist-400 mb-4 max-w-2xl">
          How much of the total feature variance each component captures — computed from
          the same real run.
        </p>
        <div className="space-y-3">
          {EXPLAINED_VARIANCE_RATIO.map((v, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-mist-300">PC{i + 1}</span>
                <span className="text-mist-400">{(v * 100).toFixed(1)}% · cumulative {(cumulative[i] * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2.5 bg-ink-800 w-full">
                <motion.div
                  className="h-full bg-gradient-to-r from-quantum-dim to-quantum"
                  initial={{ width: 0 }}
                  animate={{ width: `${v * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-mist-500 mt-4">
          These 4 components together retain about {(cumulative[3] * 100).toFixed(0)}% of the
          variance present in the scaled 41-feature space — the remaining ~{(100 - cumulative[3] * 100).toFixed(0)}% is the
          information-loss tradeoff of compressing to 4 dimensions.
        </p>
      </Panel>

      <Panel className="mb-6">
        <SectionTitle n="03">Implementation</SectionTitle>
        <CodeBlock
          filename="src/preprocessing/pca_reduction.py"
          code={CODE_PCA_PY}
          annotations={[
            { match: "PCA(n_components=4)", note: "Fixes the output dimensionality to 4 — chosen to match a small, simulatable qubit count for the quantum stages." },
            { match: "pca.fit_transform(X_train)", note: "The projection axes (principal components) are learned only from training data..." },
            { match: "pca.transform(X_test)", note: "...then applied to test data without refitting, so test information never leaks into the transformation." },
          ]}
        />
        <WhyBox>
          Quantum circuits in this implementation use a small number of qubits. PCA reduces
          the original feature space to four components, making the quantum representation
          tractable to simulate.
        </WhyBox>
      </Panel>

      <div className="grid md:grid-cols-2 gap-5">
        <Panel>
          <SectionTitle n="04">Variance & covariance</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            Variance measures how spread out a single feature's values are. Covariance
            measures how two features move together. PCA operates on the covariance matrix
            of all 41 scaled features — a 41×41 table of how every pair of features
            co-varies.
          </p>
        </Panel>
        <Panel>
          <SectionTitle n="05">Eigenvectors & eigenvalues</SectionTitle>
          <p className="text-sm text-mist-400 leading-relaxed">
            The eigenvectors of that covariance matrix are the principal component
            directions; each eigenvalue is the variance captured along its eigenvector.
            Sorting by eigenvalue and keeping the top 4 gives the components shown above.
          </p>
        </Panel>
      </div>

      <Panel className="mt-6">
        <SectionTitle n="06">The transformation, in equations</SectionTitle>
        <EquationExplorer
          tex="PC_1 = a_1x_1 + a_2x_2 + \\cdots + a_nx_n"
          terms={[
            { symbol: "x_1 \\ldots x_n", meaning: "the n = 41 scaled input features of one row" },
            { symbol: "a_1 \\ldots a_n", meaning: "loadings — the entries of the first eigenvector" },
            { symbol: "PC_1", meaning: "the row's coordinate along the first principal component" },
          ]}
          intuition="Each principal component is a weighted sum of all original features — a new axis chosen so that projecting the data onto it spreads the points out as much as possible."
          connection="X_train_pca in pca_reduction.py is exactly this: every row re-expressed in 4 new coordinates (PC1..PC4) instead of the original 41."
        />
        <div className="mt-4">
          <Eq tex="PC_i \\cdot PC_j = 0 \\quad (i \\neq j)" />
        </div>
        <p className="text-xs text-mist-500 -mt-2">
          Principal components are constructed to be orthogonal (uncorrelated with each
          other) — each new axis captures variance the previous ones didn't.
        </p>
      </Panel>

      <Panel className="mt-6" accent="quantum">
        <SectionTitle n="07">Why PCA specifically helps the quantum stages</SectionTitle>
        <p className="text-sm text-mist-400 leading-relaxed max-w-2xl">
          Simulating an n-qubit circuit costs resources that grow exponentially with n.
          Encoding all 41 features would require 41 qubits on a simulator — infeasible on
          ordinary hardware. Reducing to 4 components keeps the feature map at 4 qubits,
          which is exactly what ZZFeatureMap(feature_dimension=num_qubits) receives in
          qsvm_model.py and vqc_model.py, where <code>num_qubits = X_train.shape[1]</code>.
        </p>
      </Panel>
    </div>
  );
}
