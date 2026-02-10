import { useState } from "react";
import { Plus, LayoutGrid } from "lucide-react"; // Adicionado LayoutGrid
import { TurmaCard } from "../../components/SalaCard";
import { FormTurma } from "../../components/SalaForm";
import { useRooms, type Room } from "../../hooks/useRooms";

export const Salas = () => {
  const storedUser = localStorage.getItem("@EducaAR:user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { rooms, loading, error, handleCreate, handleUpdate, handleDelete } =
    useRooms(user?.userId);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  return (
    <div className="container py-4">
      {/* Header Refinado */}
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <LayoutGrid size={20} className="text-cyan" />
            <h2 className="text-white fw-bold mb-0">Gerenciar Turmas</h2>
          </div>
          <p className="text-muted mb-0 small">
            Crie, edite e monitore o status das suas salas de aula.
          </p>
        </div>

        <button
          className="btn btn-cyan d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
          data-bs-toggle="modal"
          data-bs-target="#modalTurma"
          onClick={() => setEditingRoom(null)}
        >
          <Plus size={18} strokeWidth={3} /> NOVA TURMA
        </button>
      </div>

      <div className="row g-4">
        {loading && (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-cyan" role="status" />
          </div>
        )}

        {error && (
          <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger">
            {error}
          </div>
        )}

        {!loading &&
          rooms.map((room) => (
            <div className="col-12 col-md-6 col-lg-4" key={room.roomId}>
              <TurmaCard
                nome={room.roomName}
                descricao={room.roomDescription}
                status={room.roomStatus || "active"}
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

      {/* Modal - Estilizado via CSS Global que já atualizamos */}
      <div
        className="modal fade"
        id="modalTurma"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-bottom border-secondary border-opacity-25">
              <h5 className="modal-title fw-bold text-white">
                {editingRoom ? "✨ Editar Turma" : "🚀 Nova Turma"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-body p-4">
              <FormTurma
                dadosIniciais={
                  editingRoom
                    ? {
                        id: editingRoom.roomId,
                        nome: editingRoom.roomName,
                        descricao: editingRoom.roomDescription,
                        status: editingRoom.roomStatus,
                      }
                    : undefined
                }
                botaoLabel={editingRoom ? "Salvar Alterações" : "Criar Turma"}
                onSubmit={
                  editingRoom
                    ? (data) => handleUpdate(editingRoom.roomId, data)
                    : handleCreate
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
