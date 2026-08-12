export interface VivaQuestion {
  id: string;
  topic: string;
  question: string;
  answer: string;
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: "q1",
    topic: "Preprocessing",
    question: "Why do we need feature scaling before PCA and the SVM models?",
    answer:
      "The 41 features live on very different numeric ranges — src_bytes can be in the tens of thousands while rates like same_srv_rate sit between 0 and 1. PCA looks for directions of maximum variance, so an unscaled large-magnitude feature would dominate the components purely because of its units, not because it's actually more informative. MinMaxScaler rescales every feature to [0, 1] so each contributes on comparable terms, and — for the quantum stages — bounded values are also easier to encode as rotation angles.",
  },
  {
    id: "q2",
    topic: "Preprocessing",
    question: "Is this project doing binary or multiclass classification?",
    answer:
      "Binary. train.py maps the label column with `0 if x == 'normal' else 1`, collapsing every attack type (neptune, satan, ipsweep, ...) into a single 'attack' class. The models only ever see two classes: normal vs attack.",
  },
  {
    id: "q3",
    topic: "PCA",
    question: "Why did you use PCA, and why exactly 4 components?",
    answer:
      "Two reasons. First, dimensionality reduction removes redundancy among the 41 features before modeling. Second — and specifically for the quantum stages — each PCA component is mapped to one qubit in the feature map, and simulating many qubits is expensive on a classical simulator. pca_reduction.py fixes n_components=4, so the quantum circuits in this project use 4 qubits.",
  },
  {
    id: "q4",
    topic: "PCA",
    question: "What are eigenvectors and eigenvalues doing inside PCA?",
    answer:
      "PCA finds the covariance matrix of the (scaled) features, then computes its eigenvectors and eigenvalues. Each eigenvector is a direction in feature space (a principal component); its corresponding eigenvalue is the amount of variance the data has along that direction. Sorting by eigenvalue and keeping the top 4 eigenvectors gives the directions that preserve the most spread in the data using the fewest dimensions.",
  },
  {
    id: "q5",
    topic: "Classical SVM",
    question: "Why use a classical SVM at all if the project is about quantum ML?",
    answer:
      "The classical RBF-kernel SVM (SVC(kernel='rbf')) is the baseline. It shows what a well-understood classical model achieves on the same PCA-reduced features, so QSVM and VQC results can be judged against something concrete rather than in isolation.",
  },
  {
    id: "q6",
    topic: "Quantum basics",
    question: "What does a qubit represent that a classical bit can't?",
    answer:
      "A classical bit is definitely 0 or 1. A qubit's state |ψ⟩ = α|0⟩ + β|1⟩ is a superposition of both, weighted by complex amplitudes with |α|² + |β|² = 1. Measuring it collapses the superposition and returns 0 with probability |α|² or 1 with probability |β|² — the superposition itself isn't directly observed, only its measurement statistics are.",
  },
  {
    id: "q7",
    topic: "Feature maps",
    question: "What is a quantum feature map actually doing?",
    answer:
      "It's a fixed (non-trained) quantum circuit that turns a classical vector x into a quantum state |φ(x)⟩ by using the entries of x as rotation-gate angles. The idea is that two classically similar inputs should also end up as similar quantum states, and — for feature maps like ZZFeatureMap — the entangling gates let the encoding capture interactions between features that a purely classical kernel might not reach easily.",
  },
  {
    id: "q8",
    topic: "Feature maps",
    question: "What's the difference between ZFeatureMap, ZZFeatureMap and PauliFeatureMap?",
    answer:
      "ZFeatureMap applies single-qubit Z-rotations per feature with no entanglement between qubits. ZZFeatureMap adds a second layer of two-qubit ZZ-interaction gates between qubits, encoding pairwise feature correlations. PauliFeatureMap generalizes further, letting you choose which Pauli terms (Z, ZZ, XX, YY, ...) are used for the entangling layer. This project's experiment script (qsvm_featuremap_experiment.py) compares all three on identical data.",
  },
  {
    id: "q9",
    topic: "QSVM",
    question: "Is QSVM 'fully quantum'?",
    answer:
      "No — and this project is explicit about that boundary. The quantum computer (simulated, here) is only used for two things: encoding data into quantum states via the feature map, and evaluating the kernel — the pairwise similarity |⟨φ(x)|φ(z)⟩|² between encoded states. Once the kernel matrix is built, it's handed to a completely classical SVC(kernel='precomputed'), which does the actual optimization and decision-boundary fitting.",
  },
  {
    id: "q10",
    topic: "QSVM",
    question: "Why does QSVM use a smaller sample size than the classical SVM?",
    answer:
      "Evaluating a quantum kernel means computing a fidelity between quantum states for every pair of samples — an O(n²) cost, and each fidelity is itself expensive to simulate. qsvm_model.py subsamples the training set to 300 points and the test set to 150 to keep kernel computation tractable on a classical simulator, versus the full ~100k-row training set the classical SVM uses.",
  },
  {
    id: "q11",
    topic: "VQC",
    question: "What is a Variational Quantum Classifier, in one sentence?",
    answer:
      "A VQC is a quantum circuit with trainable parameters θ (here, a RealAmplitudes ansatz) that sits after the feature map; measurement outcomes are converted to a prediction, a loss is computed against the true label, and a classical optimizer (COBYLA in this project) updates θ to reduce that loss — repeating until convergence or a max iteration count.",
  },
  {
    id: "q12",
    topic: "VQC",
    question: "What's the core difference between QSVM and VQC?",
    answer:
      "QSVM uses the quantum circuit only to compute a fixed kernel/similarity, then a classical SVM does the learning — the quantum part has no trainable parameters. VQC's quantum circuit itself has trainable parameters (the ansatz weights), and those are what a classical optimizer updates during training. So QSVM is 'quantum kernel + classical learner'; VQC is 'quantum model trained end-to-end with a classical optimizer in the loop'.",
  },
  {
    id: "q13",
    topic: "Optimizers",
    question: "Why does VQC need a classical optimizer at all?",
    answer:
      "The ansatz parameters θ have to be tuned to minimize a loss function, and there's no closed-form solution — this is a black-box optimization problem over the circuit's output. COBYLA (used here), SPSA, and ADAM are three different classical strategies for iteratively updating θ using evaluations of the loss (and, for ADAM, gradient-like estimates), the same role an optimizer plays in classical neural network training.",
  },
  {
    id: "q14",
    topic: "Evaluation",
    question: "Why is recall particularly important for an intrusion detection system?",
    answer:
      "Recall measures how many actual attacks were caught: TP / (TP + FN). A false negative in an IDS means a real attack was labeled 'normal' and let through — the costly failure mode. A false positive just means a benign connection gets a second look. So even at some cost to precision, IDS design generally favors not missing attacks, which is why recall gets particular attention here.",
  },
  {
    id: "q15",
    topic: "Model comparison",
    question: "Does higher accuracy mean 'quantum advantage'?",
    answer:
      "No. In this project the classical SVM (~0.96 accuracy on the full test set) outperforms QSVM (~0.91) and VQC (~0.71-0.74), which themselves were evaluated on much smaller subsampled sets for tractability reasons — so the comparison isn't even on equal footing. 'Quantum advantage' is a specific, narrower claim about a quantum algorithm solving a problem faster or better than any known classical algorithm at scale, which this project does not attempt to demonstrate.",
  },
  {
    id: "q16",
    topic: "Architecture",
    question: "Is the 'autonomous' part of the project — self-healing, hybrid decisions — implemented?",
    answer:
      "Not yet. The repository defines data contracts for it (DetectionResult, HybridDecision, DefenseResult as Python dataclasses, with mock JSON test fixtures), which describes the intended interface between a classical detector, a quantum-verification stage, and an autonomous defense/self-healing stage. But there is no implemented decision logic or defense automation in the repo currently — only the classification pipeline (preprocessing → PCA → SVM/QSVM/VQC → evaluation) is runnable end-to-end.",
  },
];
