import { BookOpen, MoreVertical, Edit3, Trash2 } from "lucide-react";

interface TurmaProps {
  nome: string;
  descricao: string;
  // Ajustado para aceitar tanto o padrão do banco quanto o do front
  status: "ativa" | "inativa" | "active" | "inactive";
  onEdit: () => void;
  onDelete: () => void;
}

export const TurmaCard = ({
  nome,
  descricao,
  status,
  onEdit,
  onDelete,
}: TurmaProps) => {
  const isActive = status === "ativa" || status === "active";

  return (
    <div className="card tech-card h-100 overflow-hidden">
      <div className="card-body p-4 d-flex flex-column">
        {/* Topo: Ícone e Ações */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="icon-box-refined">
            <BookOpen size={20} className="text-cyan" />
          </div>

          <div className="dropdown">
            <button className="btn btn-action-sutil" data-bs-toggle="dropdown">
              <MoreVertical size={18} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-secondary">
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2"
                  onClick={onEdit}
                  data-bs-toggle="modal"
                  data-bs-target="#modalTurma"
                >
                  <Edit3 size={16} className="text-warning" />{" "}
                  <span>Editar Turma</span>
                </button>
              </li>
              <li>
                <hr className="dropdown-divider border-secondary opacity-50" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger d-flex align-items-center gap-2"
                  onClick={onDelete}
                >
                  <Trash2 size={16} /> <span>Remover</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Conteúdo Principal: Título e Descrição */}
        <div className="mb-4">
          <h5 className="text-white fw-bold mb-2 tracking-tight">{nome}</h5>
          <p className="text-muted-custom small mb-0 lh-base">
            {descricao || "Sem descrição definida para esta turma."}
          </p>
        </div>

        {/* Rodapé: Status e Botão de Acesso */}
        <div className="mt-auto pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span
              className={`status-dot-pulse ${isActive ? "active" : "inactive"}`}
            ></span>
            <span className="status-label-refined">
              {isActive ? "Sistema Ativo" : "Offline"}
            </span>
          </div>

          <button className="btn-entrar-seta">
            Obj da Sala<span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};