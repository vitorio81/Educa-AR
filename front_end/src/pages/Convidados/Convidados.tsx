import { useState, useMemo } from "react";
import { UserPlus, Shield, Filter } from "lucide-react";
import { useRooms } from "../../hooks/useRooms";
import { ConvidadoRow } from "../../components/ConvidadoRow";
import { FormConvidado } from "../../components/FormConvidado";
import { useConvidados, type Convidado } from "../../hooks/useConvidado";
import { useParams } from "react-router-dom";

export const Convidados = () => {
  // Pega o roomId da URL caso o usuário venha de uma sala específica
  const { roomId: urlRoomId } = useParams();

  // Recupera dados do usuário logado
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("@EducaAR:user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const userId = user?.userId;

  // 1. Estado para controlar o filtro de sala (inicia com o ID da URL ou vazio)
  const [selectedRoom, setSelectedRoom] = useState<number | undefined>(
    urlRoomId ? Number(urlRoomId) : undefined,
  );

  const [selecionado, setSelecionado] = useState<Convidado | null>(null);

  // 2. Hook de convidados agora escuta o selectedRoom
  const {
    convidados,
    loading,
    criarConvidado,
    excluirConvidado,
    atualizarConvidado,
  } = useConvidados(userId, selectedRoom);

  // 3. Hook para listar as salas no Select do filtro
  const { rooms, loading: loadingRooms } = useRooms(userId);

  const isEditing = !!selecionado;

  const removerConvidado = (id: number) => {
    if (confirm("Deseja realmente excluir este convidado?")) {
      excluirConvidado(id);
    }
  };

  const handleSalvar = async (data: any) => {
    try {
      if (selecionado) {
        const updateData: Record<string, any> = {
          visitorEmail: data.visitorEmail,
          visitorStatus: data.visitorStatus,
          roomIds: data.roomIds,
        };

        if (data.visitorPassword?.trim()) {
          updateData.visitorPassword = data.visitorPassword;
        }

        await atualizarConvidado(selecionado.visitorId, updateData);
      } else {
        // Se estiver criando e houver uma sala filtrada, associa automaticamente se não houver rooms escolhidas
        const finalRoomIds =
          data.roomIds && data.roomIds.length > 0
            ? data.roomIds
            : selectedRoom
              ? [selectedRoom]
              : [];

        await criarConvidado({
          ...data,
          roomIds: finalRoomIds,
        });
      }

      setSelecionado(null);

      // Fecha o modal via Bootstrap
      const modalElement = document.getElementById("modalConvidado");
      if (modalElement) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(
          modalElement,
        );
        modalInstance?.hide();
      }
    } catch (error: any) {
      console.error("Erro ao salvar:", error.response?.data || error.message);
    }
  };

  if (!userId)
    return <p className="text-white p-5">Usuário não autenticado.</p>;

  return (
    <div className="container-fluid p-0 fade-in">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-end mb-5 px-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Shield size={20} className="text-cyan" />
            <h2 className="text-white fw-bold m-0 tracking-tight">
              Gestão de Convidados
            </h2>
          </div>
          <p className="text-muted-custom small m-0">
            Gerencie o acesso de usuários externos às suas salas.
          </p>
        </div>

        <button
          className="btn btn-primary-tech d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#modalConvidado"
          onClick={() => setSelecionado(null)}
        >
          <UserPlus size={18} />
          <span>Novo Convidado</span>
        </button>
      </div>

      {/* FILTRO POR SALA (Lógica replicada de Objetos) */}
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

      {/* TABELA DE CONVIDADOS */}
      <div className="card tech-card border-0 overflow-hidden w-100 shadow-lg">
        {loading ? (
          <div className="p-5 text-center">
            <div
              className="spinner-border text-cyan opacity-50"
              role="status"
            ></div>
            <p className="text-muted-custom mt-3 small">
              Buscando convidados...
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark-refined mb-0 w-100">
              <thead>
                <tr>
                  <th className="ps-4 py-3">E-mail</th>
                  <th className="py-3">Status</th>
                  <th className="pe-4 py-3 text-end">Gerenciar</th>
                </tr>
              </thead>
              <tbody>
                {convidados.map((c) => (
                  <ConvidadoRow
                    key={c.visitorId}
                    convidadoId={c.visitorId}
                    email={c.visitorEmail}
                    status={c.visitorStatus}
                    onExcluir={removerConvidado}
                    onEditar={() => {
                      setSelecionado(c);
                      // O acionamento do modal é feito via data-attributes no componente Row ou manualmente
                    }}
                  />
                ))}

                {convidados.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-5 text-muted-custom small"
                    >
                      Nenhum convidado encontrado para esta seleção.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL FORMULÁRIO */}
      <div
        className="modal fade"
        id="modalConvidado"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content glass-effect p-2">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title text-white fw-bold">
                {isEditing ? "Editar Convidado" : "Novo Acesso"}
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white shadow-none"
                data-bs-dismiss="modal"
                onClick={() => setSelecionado(null)}
              ></button>
            </div>

            <div className="modal-body">
              <FormConvidado
                convidadoInicial={selecionado}
                botaoLabel={isEditing ? "Salvar Alterações" : "Criar Acesso"}
                rooms={rooms}
                onSubmit={handleSalvar}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convidados;
