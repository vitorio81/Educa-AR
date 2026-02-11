import { useState } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import { RoomCard } from "../../components/RoomCard";
import { RoomForm } from "../../components/RoomForm";
import { useRooms } from "../../hooks/useRooms";
import { type Room } from "../../types/room"; 

export const Rooms = () => {
  const storedUser = localStorage.getItem("@EducaAR:user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const { rooms, loading, error, handleCreate, handleUpdate, handleDelete } =
    useRooms(user?.userId);

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  return (
    <div className="container py-4 min-vh-100">
      {/* Header Sincronizado */}
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <LayoutGrid size={20} className="text-cyan" />
            <h2 className="text-white fw-bold mb-0">Gerenciar Salas</h2>
          </div>
          <p className="text-muted mb-0 small">
            Crie, edite e monitore o status das suas salas de aula.
          </p>
        </div>

        <button
          className="btn btn-cyan d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
          data-bs-toggle="modal"
          data-bs-target="#modalRoom"
          onClick={() => setEditingRoom(null)}
        >
          <Plus size={18} strokeWidth={3} /> NOVA SALA
        </button>
      </div>

      <div className="row g-4">
        {loading && (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-cyan" role="status" />
          </div>
        )}

        {error && (
          <div className="col-12">
            <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger">
              {error}
            </div>
          </div>
        )}

        {!loading &&
          rooms.map((room) => (
            <div className="col-12 col-md-6 col-lg-4" key={room.roomId}>
              <RoomCard
                room={room} // Passamos o objeto inteiro, o card cuida do resto
                onEdit={() => setEditingRoom(room)}
                onDelete={() => handleDelete(room.roomId)}
              />
            </div>
          ))}

        {!loading && rooms.length === 0 && (
          <div className="col-12 text-center py-5 border border-secondary border-dashed rounded-4">
            <p className="text-muted mb-0">
              Você ainda não possui turmas cadastradas.
            </p>
          </div>
        )}
      </div>

      {/* Modal Sincronizado */}
      <div
        className="modal fade"
        id="modalRoom"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark border-secondary">
            <div className="modal-header border-bottom border-secondary border-opacity-25">
              <h5 className="modal-title fw-bold text-white">
                {editingRoom ? "✨ Editar Sala" : "🚀 Nova Sala"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-4">
              <RoomForm
                dadosIniciais={editingRoom || undefined}
                botaoLabel={editingRoom ? "Salvar Alterações" : "Criar Turma"}
                onSubmit={
                  editingRoom
                    ? (data) => handleUpdate(editingRoom.roomId, data)
                    : (data) => handleCreate({ ...data, userId: user?.userId })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
