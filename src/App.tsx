/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Iniciativas from "./pages/Iniciativas";
import Voluntarios from "./pages/Voluntarios";
import Projetos from "./pages/Projetos";
import Eventos from "./pages/Eventos";
import QuemSomos from "./pages/QuemSomos";
import ProjetoDetalhes from "./pages/ProjetoDetalhes";
import Admin from "./pages/Admin";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/quem-somos" element={<Layout><QuemSomos /></Layout>} />
          <Route path="/iniciativas" element={<Layout><Iniciativas /></Layout>} />
          <Route path="/voluntarios" element={<Layout><Voluntarios /></Layout>} />
          <Route path="/projetos" element={<Layout><Projetos /></Layout>} />
          <Route path="/projetos/:id" element={<Layout><ProjetoDetalhes /></Layout>} />
          <Route path="/eventos" element={<Layout><Eventos /></Layout>} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Layout>
                  <Perfil />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
