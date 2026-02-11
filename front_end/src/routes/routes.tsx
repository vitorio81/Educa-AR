import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { Login } from "../pages/Login/Login";
import { Register } from "../pages/User/User";
import { Home } from "../pages/Home/Home";
import { Rooms } from "../pages/Room/Room";
import { Convidados } from "../pages/Convidados/Convidados";
import Objetos from "../pages/Objetos/Objetos";

import { Navbar } from "../layout/Navbar";
import { Sidebar } from "../layout/Sidebar";

import { PrivateRoute } from "./PrivateRoute";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { useAuthListener } from "../hooks/useAuthListener";

const LayoutComMenu = () => {
  useAuthListener();

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const InitialRedirect = () => {
  const { isAuthenticated } = useAuth();

  return <Navigate to={isAuthenticated ? "/home" : "/login"} replace />;
};

// Localize este bloco no seu arquivo de rotas:

const LoginRoute = () => {
  const { isAuthenticated, loading } = useAuth(); 

  if (loading) return null; 
  return isAuthenticated ? <Navigate to="/home" replace /> : <Login />;
};

const RegisterRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" replace /> : <Register />;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<InitialRedirect />} />

          <Route path="/login" element={<LoginRoute />} />
          <Route path="/register" element={<RegisterRoute />} />

          <Route element={<PrivateRoute />}>
            <Route element={<LayoutComMenu />}>
              <Route path="/home" element={<Home />} />
              <Route path="/salas" element={<Rooms />} />
              <Route path="/convidados" element={<Convidados />} />
              <Route path="/objetos" element={<Objetos />} />
              <Route path="/convidados/:roomId" element={<Convidados />} />
              <Route path="/objetos/:roomId" element={<Objetos />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
