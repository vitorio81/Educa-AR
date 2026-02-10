import { Mail, Edit3, Trash2, Clock } from "lucide-react";

interface ConvidadoProps {
  convidadoId: number;
  email: string;
  status: string;
  onExcluir: (id: number) => void;
  onEditar: () => void;
}

export const ConvidadoRow = ({
  convidadoId,
  email,
  status,
  onExcluir,
  onEditar,
}: ConvidadoProps) => {

  return (
    <tr className="align-middle border-bottom border-secondary border-opacity-10 table-row-hover">
      <td className="ps-4 py-4">
        <div className="d-flex align-items-center gap-3">
          <div>
            <span className="text-white fw-medium d-block tracking-tight">
              {email}
            </span>
          </div>
        </div>
      </td>

      <td className="py-4">
        <div className="d-flex align-items-center gap-2">
          {/* Aplica 'active' se for ativo, 'inactive' caso contrário */}
          <span
            className={`status-dot-pulse ${status === "ativo" ? "active" : "inactive"}`}
          ></span>
          <span className="status-label-refined">
            {status === "ativo" ? "Acesso Liberado" : "Bloqueado"}
          </span>
        </div>
      </td>

      <td className="text-end pe-4 py-4">
        <div className="d-flex justify-content-end gap-2">
          <button
            className="btn-action-sutil"
            title="Editar"
            onClick={onEditar}
            data-bs-toggle="modal"
            data-bs-target="#modalConvidado"
          >
            <Edit3 size={16} />
          </button>
          <button
            className="btn-action-sutil"
            title="Excluir"
            onClick={() => onExcluir(convidadoId)}
          >
            <Trash2 size={16} className="text-danger" />
          </button>
        </div>
      </td>
    </tr>
  );
};
