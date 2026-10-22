import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Clientes } from "./pages/Clientes";
import { Processos } from "./pages/Processos";
import { Licencas } from "./pages/Licencas";
import { Documentos } from "./pages/Documentos";
import { Mtrs } from "./pages/Mtrs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="processos" element={<Processos />} />
          <Route path="licencas" element={<Licencas />} />
          <Route path="documentos" element={<Documentos />} />
          <Route path="mtrs" element={<Mtrs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
