import { Search } from "lucide-react";

export const SearchInput = () => {
  return (
    <div className="input-group" style={{ maxWidth: "500px" }}>
      <span className="input-group-text bg-dark border-secondary text-muted">
        <Search size={16} strokeWidth={1.5} />
      </span>
      <input
        type="text"
        className="form-control bg-dark text-white border-secondary shadow-none"
        placeholder="Pesquisar turmas, objetos..."
        style={{ fontSize: "0.9rem" }}
      />
    </div>
  );
};
