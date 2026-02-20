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
  const [roomIds, setRoomIds] = useState<number[]>([]);

  useEffect(() => {
    if (convidadoInicial) {
      setVisitorEmail(convidadoInicial.visitorEmail || "");
      setVisitorStatus(convidadoInicial.visitorStatus || "ativo");
      // Mapeia os IDs vindos do back (ajuste o nome da propriedade se necessário)
      setRoomIds(
        convidadoInicial.roomIds ||
          (convidadoInicial.roomId ? [convidadoInicial.roomId] : []),
      );
    } else {
      setVisitorEmail("");
      setVisitorPassword("");
      setVisitorStatus("ativo");
      setRoomIds([]);
    }
  }, [convidadoInicial]);

  const handleCheckboxChange = (roomId: number) => {
    setRoomIds(
      (prev) =>
        prev.includes(roomId)
          ? prev.filter((id) => id !== roomId) 
          : [...prev, roomId], 
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      visitorEmail,
      visitorStatus,
      roomIds: roomIds, 
    };

    if (visitorPassword) payload.visitorPassword = visitorPassword;

    try {
      await onSubmit(payload);
      if (!convidadoInicial) {
        setVisitorEmail("");
        setVisitorPassword("");
        setVisitorStatus("ativo");
        setRoomIds([]);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      <div className="mb-4">
        <InputCustom
          label="E-mail do Convidado"
          type="email"
          value={visitorEmail}
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
            onChange={(e) => setVisitorPassword(e.target.value)}
            required={true}
          />
        </div>
      )}

      <div className="row">
        {/* CHECKLIST DE SALAS */}
        <div className="col-md-6 mb-4">
          <label className="status-label-refined mb-2 d-block opacity-75">
            Salas de Acesso
          </label>
          <div
            className="room-checklist-container border rounded p-2"
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            {rooms.map((room: any) => (
              <div key={room.roomId} className="form-check mb-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`room-${room.roomId}`}
                  checked={roomIds.includes(room.roomId)}
                  onChange={() => handleCheckboxChange(room.roomId)}
                />
                <label
                  className="form-check-label small"
                  htmlFor={`room-${room.roomId}`}
                >
                  {room.roomName}
                </label>
              </div>
            ))}
          </div>
          <small className="text-muted">{roomIds.length} selecionada(s)</small>
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
          disabled={roomIds.length === 0} // Evita salvar sem sala
          data-bs-dismiss={visitorEmail && roomIds.length > 0 ? "modal" : ""}
        >
          {botaoLabel}
        </button>
      </div>
    </form>
  );
};
