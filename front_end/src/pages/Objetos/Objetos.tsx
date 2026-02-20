import { useMemo, useState } from "react";
import { useObjetos } from "../../hooks/userObjetos";
import { useRooms } from "../../hooks/useRooms";
import { ObjetoRow } from "../../components/ObjetoRow";
import { FormObjeto } from "../../components/FormObjeto";
import { PackagePlus, Box, Filter } from "lucide-react";

interface UserStorage {
  userId: number;
}

const Objetos = () => {
  const user: UserStorage | null = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("@EducaAR:user") || "null");
    } catch {
      return null;
    }
  }, []);

  const userId = user?.userId;
  const [selectedRoom, setSelectedRoom] = useState<number | undefined>();
  const [objetoSelecionado, setObjetoSelecionado] = useState<any>(null);
  const isEditing = !!objetoSelecionado;

  const { objetos, loading, error, handleCreate, handleUpdate, handleDelete } =
    useObjetos(userId!, selectedRoom);

  const { rooms, loading: loadingRooms } = useRooms(userId!);

  if (!userId)
    return <p className="text-white p-5">Usuário não autenticado.</p>;

  const fecharModal = () => {
    setObjetoSelecionado(null);
    const modal = document.getElementById("modalObjeto");
    if (modal) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
      bootstrapModal?.hide();
    }
  };

  return (
    <div className="container-fluid p-0 fade-in">
      {/* HEADER REFINADO */}
      <div className="d-flex justify-content-between align-items-end mb-5 px-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Box size={20} className="text-cyan" />
            <h2 className="text-white fw-bold m-0 tracking-tight">
              Meus Objetos 3D
            </h2>
          </div>
          <p className="text-muted-custom small m-0">
            Gerencie sua biblioteca de modelos para Realidade Aumentada.
          </p>
        </div>

        <button
          className="btn btn-primary-tech d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#modalObjeto"
          onClick={() => setObjetoSelecionado(null)}
        >
          <PackagePlus size={18} />
          <span>Novo Objeto</span>
        </button>
      </div>

      {/* FILTRO TECH */}
      <div className="row mb-4 px-2">
        <div className="col-md-4 col-lg-3">
          <div className="position-relative">
            <label className="status-label-refined mb-2 d-block opacity-75">
              <Filter size={12} className="me-1" /> Filtrar por Sala
            </label>
            <select
              className="form-select-tech shadow-none w-100"
              value={selectedRoom ?? ""}
              onChange={(e) =>
                setSelectedRoom(
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              disabled={loadingRooms}
            >
              <option value="">Todas as salas</option>
              {rooms?.map((room) => (
                <option key={room.roomId} value={room.roomId}>
                  {room.roomName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CONTEÚDO / TABELA */}
      <div className="card tech-card border-0 overflow-hidden w-100 shadow-lg">
        {loading ? (
          <div className="p-5 text-center">
            <div
              className="spinner-border text-cyan opacity-50"
              role="status"
            ></div>
            <p className="text-muted-custom mt-3 small">
              Sincronizando biblioteca...
            </p>
          </div>
        ) : error ? (
          <div className="p-5 text-center text-danger small">{error}</div>
        ) : objetos.length === 0 ? (
          <div className="p-5 text-center text-muted-custom small">
            Nenhum objeto encontrado nesta categoria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark-refined mb-0 w-100">
              <thead>
                <tr>
                  <th className="ps-4 py-3">Modelo e Atributos</th>
                  <th className="pe-4 py-3 text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {objetos.map((obj) => (
                  <ObjetoRow
                    key={obj.objectId}
                    objeto={obj}
                    onDelete={handleDelete}
                    onEdit={(objeto) => setObjetoSelecionado(objeto)}
                    userId={userId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL GLASSMORPHISM */}
      <div
        className="modal fade"
        id="modalObjeto"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content glass-effect p-2">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title text-white fw-bold">
                {isEditing ? "Editar Configurações" : "Novo Objeto 3D"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white shadow-none"
                data-bs-dismiss="modal"
                onClick={() => setObjetoSelecionado(null)}
              ></button>
            </div>
            <div className="modal-body">
              <FormObjeto
                botaoLabel={
                  isEditing ? "Salvar Alterações" : "Cadastrar Modelo"
                }
                rooms={rooms}
                initialData={objetoSelecionado || undefined}
                onSubmit={async (formData) => {
                  isEditing
                    ? await handleUpdate(objetoSelecionado.objectId, formData)
                    : await handleCreate(formData);
                  fecharModal();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Objetos;
