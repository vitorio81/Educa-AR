import { useState } from "react";
import { UserPlus, Shield } from "lucide-react";
import { useRooms } from "../../hooks/useRooms";
import { ConvidadoRow } from "../../components/ConvidadoRow";
import { FormConvidado } from "../../components/FormConvidado";
import { useConvidados, type Convidado } from "../../hooks/useConvidado";

export const Convidados = () => {
  const user = JSON.parse(localStorage.getItem("@EducaAR:user") || "{}");
  const [selecionado, setSelecionado] = useState<Convidado | null>(null);

  const { convidados, criarConvidado, excluirConvidado, atualizarConvidado } =
    useConvidados(user.userId);
  const { rooms } = useRooms(user.userId);

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

        if (data.visitorPassword && data.visitorPassword.trim() !== "") {
          updateData.visitorPassword = data.visitorPassword;
        }

        await atualizarConvidado(selecionado.visitorId, updateData);
      } else {
        await criarConvidado(data);
      }
      setSelecionado(null);
    } catch (error: any) {
      console.error("Erro ao salvar:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container-fluid p-0 fade-in">
      <div className="d-flex justify-content-between align-items-end mb-5 px-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Shield size={20} className="text-cyan" />
            <h2 className="text-white fw-bold m-0">Gestão de Convidados</h2>
          </div>
        </div>

        <button
          className="btn btn-primary-tech d-flex align-items-center gap-2"
          data-bs-toggle="modal"
          data-bs-target="#modalConvidado"
          onClick={() => setSelecionado(null)} // Reset para novo
        >
          <UserPlus size={18} />
          <span>Novo Convidado</span>
        </button>
      </div>

      <div className="card tech-card border-0 overflow-hidden w-100 shadow-lg">
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
                  key={c.visitorId} // Agora usa o nome correto do model
                  convidadoId={c.visitorId}
                  email={c.visitorEmail} // Mapeia visitorEmail para email
                  status={c.visitorStatus} // Mapeia visitorStatus para status
                  onExcluir={removerConvidado}
                  onEditar={() => setSelecionado(c)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal único para Criar/Editar */}
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
                {selecionado ? "Editar Convidado" : "Dados do Convidado"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <FormConvidado
                convidadoInicial={selecionado}
                botaoLabel={selecionado ? "Salvar Alterações" : "Criar Acesso"}
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
