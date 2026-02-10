import { useState, useEffect } from "react";
import { InputCustom } from "./InputCustom";

export const FormConvidado = ({
  convidadoInicial,
  botaoLabel,
  rooms,
  onSubmit,
}: any) => {
  const [visitorEmail, setVisitorEmail] = useState("");
  const [visitorPassword, setVisitorPassword] = useState("");
  const [visitorStatus, setVisitorStatus] = useState("ativo");
  const [roomId, setRoomId] = useState<number | "">("");

  // Sincroniza e LIMPA o formulário
  useEffect(() => {
    if (convidadoInicial) {
      setVisitorEmail(convidadoInicial.visitorEmail || "");
      setVisitorStatus(convidadoInicial.visitorStatus || "ativo");
      setRoomId(convidadoInicial.roomId || "");
    } else {

      setVisitorEmail("");
      setVisitorPassword("");
      setVisitorStatus("ativo");
      setRoomId("");
    }
  }, [convidadoInicial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      visitorEmail,
      visitorStatus,
      roomId: Number(roomId),
    };

    if (visitorPassword) payload.visitorPassword = visitorPassword;

    try {
      await onSubmit(payload);

      if (!convidadoInicial) {
        setVisitorEmail("");
        setVisitorPassword("");
        setVisitorStatus("ativo");
        setRoomId("");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      {/* ... (campos de input permanecem iguais) ... */}

      <div className="mb-4">
        <InputCustom
          label="E-mail do Convidado"
          type="email"
          value={visitorEmail}
          placeholder="emailexemplo@gmail.com"
          onChange={(e) => setVisitorEmail(e.target.value)}
          required
        />
      </div>

      {!convidadoInicial && (
        <div className="mb-4">
          <InputCustom
            label="Senha do Convidado"
            type="password"
            value={visitorPassword}
            placeholder="********"
            onChange={(e) => setVisitorPassword(e.target.value)}
            required={true}
          />
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-4">
          <label className="status-label-refined mb-2 d-block opacity-75">
            Sala de Acesso
          </label>
          <select
            className="form-select-tech w-100"
            value={roomId}
            onChange={(e) => setRoomId(Number(e.target.value))}
            required
          >
            <option value="">Selecionar...</option>
            {rooms.map((room: any) => (
              <option key={room.roomId} value={room.roomId}>
                {room.roomName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-4">
          <label className="status-label-refined mb-2 d-block opacity-75">
            Status
          </label>
          <select
            className="form-select-tech w-100"
            value={visitorStatus}
            onChange={(e) => setVisitorStatus(e.target.value)}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="modal-footer border-top border-secondary border-opacity-10 p-0 pt-4 mt-2 d-flex gap-3">
        <button
          type="button"
          className="btn btn-action-sutil px-4"
          data-bs-dismiss="modal"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary-tech flex-grow-1"
          /* Adicione o data-bs-dismiss para fechar o modal no sucesso se desejar */
          data-bs-dismiss={visitorEmail && roomId ? "modal" : ""}
        >
          {botaoLabel}
        </button>
      </div>
    </form>
  );
};
