import React, { memo } from "react";
import { MoreVertical, Edit3, Trash2, Package, Download } from "lucide-react";

interface Objeto {
  objectId: number;
  objectName: string;
  objectDescription?: string;
  objectUrl?: string;
}

interface ObjetoRowProps {
  objeto: Objeto;
  onDelete: (id: number) => void;
  onEdit: (objeto: Objeto) => void;
}

export const ObjetoRow = memo(
  ({ objeto, onDelete, onEdit }: ObjetoRowProps) => {
    const handleDelete = () => {
      // Usando uma confirmação simples, mas mantendo o contexto do objeto
      if (
        window.confirm(
          `Tem certeza que deseja remover o modelo "${objeto.objectName}"?`,
        )
      ) {
        onDelete(objeto.objectId);
      }
    };

    const handleDownload = () => {
      if (!objeto.objectUrl) return;
      window.open(objeto.objectUrl, "_blank");
    };

    return (
      <tr className="align-middle border-bottom border-secondary border-opacity-10 table-row-hover">
        {/* Informações do Objeto */}
        <td className="ps-4 py-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="icon-box-refined p-2 rounded-3"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <Package size={20} className="text-cyan" strokeWidth={1.5} />
            </div>

            <div className="overflow-hidden">
              <span className="text-white fw-medium d-block tracking-tight">
                {objeto.objectName}
              </span>
              {objeto.objectDescription && (
                <span
                  className="text-muted-custom small d-block text-truncate"
                  style={{ maxWidth: "450px" }}
                  title={objeto.objectDescription}
                >
                  {objeto.objectDescription}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Coluna de Ações */}
        <td className="text-end pe-4 py-4">
          <div className="d-flex justify-content-end gap-2">
            {/* Download/Abrir com visual condicional */}
            <button
              className={`btn btn-action-sutil ${!objeto.objectUrl ? "opacity-25" : ""}`}
              title={
                objeto.objectUrl ? "Baixar modelo 3D" : "Arquivo não disponível"
              }
              onClick={handleDownload}
              disabled={!objeto.objectUrl}
            >
              <Download size={18} />
            </button>

            {/* Menu Dropdown Tech */}
            <div className="dropdown">
              <button
                className="btn btn-action-sutil"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <MoreVertical size={18} />
              </button>

              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-secondary border-opacity-25 glass-effect">
                <li>
                  <button
                    className="dropdown-item d-flex align-items-center gap-2 text-white"
                    onClick={() => onEdit(objeto)}
                    data-bs-toggle="modal"
                    data-bs-target="#modalObjeto"
                  >
                    <Edit3 size={14} className="text-cyan" />
                    <span>Editar Dados</span>
                  </button>
                </li>

                <li>
                  <hr className="dropdown-divider border-secondary opacity-25" />
                </li>

                <li>
                  <button
                    className="dropdown-item text-danger d-flex align-items-center gap-2"
                    onClick={handleDelete}
                  >
                    <Trash2 size={14} />
                    <span>Remover Objeto</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </td>
      </tr>
    );
  },
);
