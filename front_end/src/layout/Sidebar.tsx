import { Link, useLocation} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutGrid,
  Users,
  Box,
  LogOut,
  Home as HomeIcon,
  ChevronRight,
} from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();

  // Função para verificar se a rota está ativa
  const isActive = (path: string) => location.pathname === path;
  const { logout, user } = useAuth();
  
  const name = user?.userName || user?.name || "Usuário";

  const handleLogout = () => {
    if (confirm("Deseja realmente encerrar a sessão?")) {
      logout();
    }
  };

  return (
    <aside className="sidebar-tech vh-100 d-flex flex-column border-end border-secondary border-opacity-25">
      {/* 1. Header da Sidebar: Logo ou Título de Seção */}
      <div className="p-4">
        <small
          className="text-uppercase tracking-wider text-muted fw-bold mb-3 d-block"
          style={{ fontSize: "0.65rem" }}
        >
          Menu Principal
        </small>

        <ul className="nav flex-column gap-1">
          <li className="nav-item">
            <Link
              to="/home"
              className={`nav-link-custom ${isActive("/home") ? "active" : ""}`}
            >
              <HomeIcon size={18} />
              <span>Dashboard</span>
              {isActive("/home") && (
                <ChevronRight size={14} className="ms-auto" />
              )}
            </Link>
          </li>
        </ul>
      </div>

      {/* 2. Navegação de Gestão */}
      <div className="px-4 flex-grow-1">
        <small
          className="text-uppercase tracking-wider text-muted fw-bold mb-3 d-block"
          style={{ fontSize: "0.65rem" }}
        >
          Gerenciamento
        </small>
        <ul className="nav flex-column gap-1">
          <li>
            <Link
              to="/salas"
              className={`nav-link-custom ${isActive("/salas") ? "active" : ""}`}
            >
              <LayoutGrid size={18} />
              <span>Turmas</span>
              {isActive("/salas") && (
                <ChevronRight size={14} className="ms-auto" />
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/convidados"
              className={`nav-link-custom ${isActive("/convidados") ? "active" : ""}`}
            >
              <Users size={18} />
              <span>Convidados</span>
            </Link>
          </li>
          <li>
            <Link
              to="/objetos"
              className={`nav-link-custom ${isActive("/objetos") ? "active" : ""}`}
            >
              <Box size={18} />
              <span>Objetos 3D</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* 3. Rodapé do Usuário: Estilo "Card Flutuante" */}
      <div className="p-3 mt-auto border-top border-secondary border-opacity-10">
        <div className="user-card-sidebar mb-3">
          <div className="user-info">
            <span className="user-name">{name || "Admin"}</span>
            <span className="user-role"> Admin</span>
          </div>
        </div>

        <Link to="/login" className="nav-link-custom logout-link">
          <LogOut size={18} />
          <span onClick={handleLogout}>Encerrar Sessão</span>
        </Link>
      </div>
    </aside>
  );
};
