import { BookOpen, MoreVertical, Edit3, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type Room } from "../types/room";

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: number) => void;
}

export const RoomCard = ({ room, onEdit, onDelete }: RoomCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="card tech-card h-100 overflow-hidden bg-surface border-secondary">
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="icon-box-refined">
            <BookOpen size={20} className="text-cyan" />
          </div>

          <div className="dropdown">
            <button className="btn btn-action-sutil" data-bs-toggle="dropdown">
              <MoreVertical size={18} className="text-white" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-secondary bg-dark">
              <li>
                <button
                  className="dropdown-item text-white d-flex align-items-center gap-2"
                  data-bs-toggle="modal"
                  data-bs-target="#modalRoom"
                  onClick={() => onEdit(room)}
                >
                  <Edit3 size={16} className="text-warning" /> Editar
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item text-white d-flex align-items-center gap-2"
                  onClick={() => navigate(`/convidados/${room.roomId}`)}
                >
                  <Edit3 size={16} className="text-warning" /> Ver Convidados
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item text-white d-flex align-items-center gap-2"
                  onClick={() => navigate(`/objetos/${room.roomId}`)}
                >
                  <Edit3 size={16} className="text-warning" /> Ver Objetos
                </button>
              </li>
              <li>
                <hr className="dropdown-divider border-secondary" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger d-flex align-items-center gap-2"
                  onClick={() => onDelete(room.roomId)}
                >
                  <Trash2 size={16} /> Remover
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="text-white fw-bold mb-2 text-uppercase">
            {room.roomName}
          </h5>
          <p className="text-muted small mb-0 text-uppercase">
            {room.roomDescription || "Sem descrição definida."}
          </p>
        </div>

        <div className="mt-auto pt-3 border-top border-secondary border-opacity-25 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 text-uppercase">
            <span className={`status-dot-pulse ${room.roomStatus}`}></span>
            <span className="text-white-50 small">{room.roomStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
