// ============================================================================
// All figures on this page are transcribed directly from:
// https://github.com/GaliAkshatha/HybridQuantum-AIAutonomus_IDS
// Nothing here is invented. Where the repository does not contain a value,
// it is marked NOT_AVAILABLE and the UI must say so explicitly.
// ============================================================================

export const REPO_URL =
  "https://github.com/GaliAkshatha/HybridQuantum-AIAutonomus_IDS";

export const NOT_AVAILABLE = "Not available in current repository";
export const CONCEPTUAL_SIM = "Conceptual simulation — not an experimental project result";

// ---------------------------------------------------------------------------
// Dataset — src/training/train.py, Data/raw/KDDTrain+.txt
// ---------------------------------------------------------------------------
export const DATASET_COLUMNS = [
  "duration", "protocol_type", "service", "flag", "src_bytes", "dst_bytes",
  "land", "wrong_fragment", "urgent", "hot", "num_failed_logins", "logged_in",
  "num_compromised", "root_shell", "su_attempted", "num_root",
  "num_file_creations", "num_shells", "num_access_files", "num_outbound_cmds",
  "is_host_login", "is_guest_login", "count", "srv_count", "serror_rate",
  "srv_serror_rate", "rerror_rate", "srv_rerror_rate", "same_srv_rate",
  "diff_srv_rate", "srv_diff_host_rate", "dst_host_count",
  "dst_host_srv_count", "dst_host_same_srv_rate", "dst_host_diff_srv_rate",
  "dst_host_same_src_port_rate", "dst_host_srv_diff_host_rate",
  "dst_host_serror_rate", "dst_host_srv_serror_rate", "dst_host_rerror_rate",
  "dst_host_srv_rerror_rate", "label", "difficulty",
];

export const DATASET_FILE = "KDDTrain+.txt (NSL-KDD)";
export const DATASET_ROW_COUNT = 125973; // wc -l Data/raw/KDDTrain+.txt
export const DATASET_COL_COUNT = 43; // 41 features + label + difficulty

export const SAMPLE_ROWS: Record<string, string | number>[] = [
  { duration: 0, protocol_type: "tcp", service: "ftp_data", flag: "SF", src_bytes: 491, dst_bytes: 0, count: 2, srv_count: 2, label: "normal", difficulty: 20 },
  { duration: 0, protocol_type: "udp", service: "other", flag: "SF", src_bytes: 146, dst_bytes: 0, count: 13, srv_count: 1, label: "normal", difficulty: 15 },
  { duration: 0, protocol_type: "tcp", service: "private", flag: "S0", src_bytes: 0, dst_bytes: 0, count: 123, srv_count: 6, label: "neptune", difficulty: 19 },
  { duration: 0, protocol_type: "tcp", service: "http", flag: "SF", src_bytes: 232, dst_bytes: 8153, count: 5, srv_count: 5, label: "normal", difficulty: 21 },
  { duration: 0, protocol_type: "tcp", service: "http", flag: "SF", src_bytes: 199, dst_bytes: 420, count: 30, srv_count: 32, label: "normal", difficulty: 21 },
];

export const FEATURE_MEANINGS: Record<string, { type: "categorical" | "numerical" | "binary"; meaning: string }> = {
  duration: { type: "numerical", meaning: "Length of the connection, in seconds." },
  protocol_type: { type: "categorical", meaning: "Transport protocol used, e.g. tcp, udp, icmp." },
  service: { type: "categorical", meaning: "Destination network service, e.g. http, ftp_data, private." },
  flag: { type: "categorical", meaning: "Normal or error status of the connection (e.g. SF = normal completion, S0 = no reply)." },
  src_bytes: { type: "numerical", meaning: "Bytes sent from source to destination." },
  dst_bytes: { type: "numerical", meaning: "Bytes sent from destination to source." },
  land: { type: "binary", meaning: "1 if source and destination IP/port are identical, else 0." },
  wrong_fragment: { type: "numerical", meaning: "Number of malformed fragments in the connection." },
  urgent: { type: "numerical", meaning: "Number of urgent-flagged packets." },
  hot: { type: "numerical", meaning: "Count of 'hot' indicators (e.g. entering a system directory)." },
  num_failed_logins: { type: "numerical", meaning: "Count of failed login attempts." },
  logged_in: { type: "binary", meaning: "1 if the login succeeded, else 0." },
  count: { type: "numerical", meaning: "Connections to the same host in the last 2 seconds." },
  srv_count: { type: "numerical", meaning: "Connections to the same service in the last 2 seconds." },
  label: { type: "categorical", meaning: "Original NSL-KDD label, e.g. normal, neptune, satan — collapsed to binary in this project." },
  difficulty: { type: "numerical", meaning: "NSL-KDD difficulty score for the row; dropped before modeling in this project." },
};

// ---------------------------------------------------------------------------
// Preprocessing — src/training/train.py
// ---------------------------------------------------------------------------
export const TRAIN_TEST_SPLIT = { test_size: 0.2, random_state: 42 };
export const IS_BINARY_CLASSIFICATION = true; // df['label'] mapped to 0 (normal) / 1 (attack)

export const CODE_TRAIN_PY = `df = pd.read_csv("KDDTrain+.txt", names=columns)

df = df.drop('difficulty', axis=1)

df['label'] = df['label'].apply(lambda x: 0 if x == 'normal' else 1)

encoder = LabelEncoder()
df['protocol_type'] = encoder.fit_transform(df['protocol_type'])
df['service']        = encoder.fit_transform(df['service'])
df['flag']           = encoder.fit_transform(df['flag'])

X = df.drop('label', axis=1)
y = df['label']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = MinMaxScaler()
X_train = scaler.fit_transform(X_train)
X_test  = scaler.transform(X_test)`;

// ---------------------------------------------------------------------------
// PCA — src/preprocessing/pca_reduction.py
// ---------------------------------------------------------------------------
export const PCA_N_COMPONENTS = 4;
export const ORIGINAL_FEATURE_COUNT = 41; // after dropping label & difficulty

export const CODE_PCA_PY = `pca = PCA(n_components=4)

X_train_pca = pca.fit_transform(X_train)
X_test_pca  = pca.transform(X_test)`;

// ---------------------------------------------------------------------------
// Classical SVM — src/models/classical_model.py
// ---------------------------------------------------------------------------
export const CODE_SVM_PY = `model = SVC(kernel='rbf')
model.fit(X_train, y_train)

y_pred = model.predict(X_test)`;

// Confusion matrix transcribed from results/svm.png (0=normal, 1=attack)
export const SVM_CONFUSION = { tn: 13135, fp: 287, fn: 723, tp: 11050 };

// ---------------------------------------------------------------------------
// QSVM — src/models/qsvm_model.py
// ---------------------------------------------------------------------------
export const CODE_QSVM_PY = `feature_map = ZZFeatureMap(feature_dimension=num_qubits, reps=2)

quantum_kernel = FidelityQuantumKernel(feature_map=feature_map)

kernel_train = quantum_kernel.evaluate(x_vec=X_train)
kernel_test  = quantum_kernel.evaluate(x_vec=X_test, y_vec=X_train)

model = SVC(kernel="precomputed")
model.fit(kernel_train, y_train)

y_pred = model.predict(kernel_test)`;

export const QSVM_TRAIN_SUBSAMPLE = 300;
export const QSVM_TEST_SUBSAMPLE = 150;
export const QSVM_REPS = 2;
// Confusion matrix transcribed from results/qsvm.png
export const QSVM_CONFUSION = { tn: 86, fp: 4, fn: 9, tp: 51 };

// ---------------------------------------------------------------------------
// VQC — src/models/vqc_model.py
// ---------------------------------------------------------------------------
export const CODE_VQC_PY = `feature_map = ZZFeatureMap(feature_dimension=num_qubits, reps=2)
ansatz      = RealAmplitudes(num_qubits, reps=2)
optimizer   = COBYLA(maxiter=100)

vqc = VQC(feature_map=feature_map, ansatz=ansatz, optimizer=optimizer)
vqc.fit(X_train, y_train)

y_pred = vqc.predict(X_test)`;

export const VQC_TRAIN_SUBSAMPLE = 200;
export const VQC_TEST_SUBSAMPLE = 100;
export const VQC_REPS = 2;
export const VQC_OPTIMIZER_DEFAULT = "COBYLA (maxiter=100)";
// Confusion matrix transcribed from results/vcq.png
export const VQC_CONFUSION = { tn: 38, fp: 20, fn: 6, tp: 36 };

// ---------------------------------------------------------------------------
// Experiments — experiments/*.py
// ---------------------------------------------------------------------------
export const CODE_FEATUREMAP_EXPERIMENT = `feature_maps = {
    "ZZFeatureMap": ZZFeatureMap(feature_dimension=num_qubits, reps=2),
    "ZFeatureMap":  ZFeatureMap(feature_dimension=num_qubits, reps=2),
    "PauliFeatureMap": PauliFeatureMap(feature_dimension=num_qubits, reps=2),
}

for name, fmap in feature_maps.items():
    kernel = FidelityQuantumKernel(feature_map=fmap)
    kernel_train = kernel.evaluate(x_vec=X_train)
    kernel_test  = kernel.evaluate(x_vec=X_test, y_vec=X_train)
    model = SVC(kernel="precomputed").fit(kernel_train, y_train)
    acc = accuracy_score(y_test, model.predict(kernel_test))`;

export const CODE_OPTIMIZER_EXPERIMENT = `optimizers = {
    "COBYLA": COBYLA(maxiter=100),
    "SPSA":   SPSA(maxiter=100),
    "ADAM":   ADAM(maxiter=40),
}

for name, opt in optimizers.items():
    model = VQC(feature_map=feature_map, ansatz=ansatz, optimizer=opt)
    model.fit(X_train, y_train)
    acc = accuracy_score(y_test, model.predict(X_test))`;

// The experiment scripts print results to stdout but do not persist them to
// a file in the repository, so per-featuremap / per-optimizer accuracy
// values are not retrievable from the repo as committed.
export const FEATUREMAP_EXPERIMENT_RESULTS = null; // -> NOT_AVAILABLE
export const OPTIMIZER_EXPERIMENT_RESULTS = null; // -> NOT_AVAILABLE

// ---------------------------------------------------------------------------
// Model comparison — results/comparison_graph.py (hardcoded summary figure)
// ---------------------------------------------------------------------------
export const COMPARISON_GRAPH_ACCURACY = {
  "Classical SVM": 0.96,
  QSVM: 0.913,
  VQC: 0.71,
};
// Note: these are transcribed from results/comparison_graph.py. The VQC
// figure there (0.71) differs slightly from what results/vcq.png's confusion
// matrix implies (74/100 = 0.74) — consistent with VQC training being
// stochastic (COBYLA is a local, non-convex optimizer over random initial
// parameters), so different runs produce different numbers. Both are shown
// in the app rather than silently picking one.

// ---------------------------------------------------------------------------
// Contracts — defined but NOT wired into an executable pipeline in this repo
// ---------------------------------------------------------------------------
export const CONTRACTS_STATUS = `The repository defines forward-looking data contracts
(src/contracts/detection_result.py, hybrid_decision.py, defense_result.py)
for a 4-part architecture: classical detection -> hybrid quantum verification
-> autonomous defense/self-healing -> reporting. Only Part 1 (classical +
quantum classification: preprocessing -> PCA -> SVM/QSVM/VQC) is implemented
with runnable model code. The hybrid-decision, autonomous-defense and
self-healing stages currently exist only as dataclass contracts and mock
JSON test fixtures — there is no implemented decision or defense logic in
the repository yet.`;

export const requirementsTxt = `numpy>=1.23
scipy>=1.10
scikit-learn>=1.3
joblib>=1.3
qiskit>=1.0.0
qiskit-machine-learning>=0.7.0
qiskit-aer>=0.13.0
matplotlib>=3.7
pandas>=2.0
tqdm>=4.65`;

// ---------------------------------------------------------------------------
// Metric helpers
// ---------------------------------------------------------------------------
export function metricsFromConfusion(c: { tn: number; fp: number; fn: number; tp: number }) {
  const { tn, fp, fn, tp } = c;
  const total = tn + fp + fn + tp;
  const accuracy = (tp + tn) / total;
  const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
  const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);
  return { total, accuracy, precision, recall, f1 };
}
