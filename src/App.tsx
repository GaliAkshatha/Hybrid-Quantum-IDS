import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Overview from "./pages/Overview";
import IdsFundamentals from "./pages/IdsFundamentals";
import Dataset from "./pages/Dataset";
import Preprocessing from "./pages/Preprocessing";
import PCA from "./pages/PCA";
import SVM from "./pages/SVM";
import QuantumBasics from "./pages/QuantumBasics";
import FeatureMaps from "./pages/FeatureMaps";
import QSVM from "./pages/QSVM";
import VQC from "./pages/VQC";
import Optimizers from "./pages/Optimizers";
import Experiments from "./pages/Experiments";
import Evaluation from "./pages/Evaluation";
import Pipeline from "./pages/Pipeline";
import Viva from "./pages/Viva";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/ids-fundamentals" element={<IdsFundamentals />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/preprocessing" element={<Preprocessing />} />
          <Route path="/pca" element={<PCA />} />
          <Route path="/svm" element={<SVM />} />
          <Route path="/quantum-basics" element={<QuantumBasics />} />
          <Route path="/feature-maps" element={<FeatureMaps />} />
          <Route path="/qsvm" element={<QSVM />} />
          <Route path="/vqc" element={<VQC />} />
          <Route path="/optimizers" element={<Optimizers />} />
          <Route path="/experiments" element={<Experiments />} />
          <Route path="/evaluation" element={<Evaluation />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/viva" element={<Viva />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
