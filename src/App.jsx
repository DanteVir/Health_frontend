import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { Registrar } from "./pages/Registrar"
import { Citas } from "./pages/Citas"
import { Navbar } from "./components/navbar"
import { AjustesPerfil } from "./pages/Ajustesperfil"
import { Cliente } from "./pages/Cliente"


function App() {
  const currentPath = window.location.pathname;

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registrar" element={<Registrar />} />
      </Routes>
      <div>
      </div>
      {currentPath !== "/login" && currentPath !== "/registrar" && (
        <div>
          <Navbar></Navbar>
          <Routes>
            <Route path="/citas" element={<Citas />} />
            <Route path="/ajustes" element={<AjustesPerfil />} />
            <Route path="/cliente" element={<Cliente />} />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App