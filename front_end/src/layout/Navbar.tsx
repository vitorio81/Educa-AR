import { Link } from "react-router-dom"; // Importação necessária
import { SearchInput } from "../components/SearchInput";
import { HelpCircle, Settings, Bell } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand navbar-dark glass-effect sticky-top px-4 py-3 border-bottom border-secondary border-opacity-25">
      <div className="container-fluid p-0 d-flex justify-content-between align-items-center">
        {/* Lado Esquerdo: Nome com Link para Home */}
        <Link
          to="/home"
          className="d-flex align-items-center gap-2 text-decoration-none transition-opacity"
          style={{ cursor: "pointer" }}
        >
          <div className="bg-cyan rounded-2 p-1 d-flex align-items-center justify-content-center shadow-cyan-sm">
            <div
              className="bg-dark rounded-1"
              style={{ width: "12px", height: "12px" }}
            ></div>
          </div>
          <h5 className="text-white m-0 fw-bold tracking-tight hover-cyan-text">
            Educa<span className="text-cyan">AR</span>
          </h5>
        </Link>

        {/* Meio: Busca */}
        <div
          className="flex-grow-1 d-flex justify-content-center mx-4"
          style={{ maxWidth: "600px" }}
        >
          <SearchInput />
        </div>

        {/* Lado Direito: Ações */}
        <div className="d-flex gap-3 align-items-center">
          <div className="d-flex gap-1 border-end border-secondary border-opacity-50 pe-3 me-2">
            <button className="btn btn-nav-action" title="Notificações">
              <Bell size={19} strokeWidth={1.5} />
            </button>
            <button className="btn btn-nav-action" title="Ajuda">
              <HelpCircle size={19} strokeWidth={1.5} />
            </button>
          </div>

          <button className="btn btn-nav-profile d-flex align-items-center gap-2">
            <Settings size={18} strokeWidth={1.5} className="text-muted" />
            <div className="avatar-placeholder"></div>
          </button>
        </div>
      </div>
    </nav>
  );
};
