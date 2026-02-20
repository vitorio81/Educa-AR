import { useState, useEffect } from "react";
import { InputCustom } from "./InputCustom";
import { type Room } from "../types/room"; // Importando a interface sincronizada

interface RoomFormProps {
  dadosIniciais?: Room; // Usa o formato que vem do Back-end
  botaoLabel: string;
  onSubmit: (data: any) => Promise<void>;
}

export const RoomForm = ({
  dadosIniciais,
  botaoLabel,
  onSubmit,
}: RoomFormProps) => {
  // Sincronizando estados com as chaves do Back-end
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomStatus, setRoomStatus] = useState<"ativa" | "inativa">("ativa");

  // Carrega os dados para edição
  useEffect(() => {
    if (dadosIniciais) {
      setRoomName(dadosIniciais.roomName || "");
      setRoomDescription(dadosIniciais.roomDescription || "");
      setRoomStatus(dadosIniciais.roomStatus || "ativa");
    }
  }, [dadosIniciais]);

  const resetForm = () => {
    setRoomName("");
    setRoomDescription("");
    setRoomStatus("ativa");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({
        roomId: dadosIniciais?.roomId,
        roomName,
        roomDescription,
        roomStatus,
      });

      resetForm();
    } catch (error) {
      console.error("Erro ao salvar sala:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <InputCustom
        label="Nome da Turma"
        type="text"
        placeholder="Ex: Engenharia de Software AR"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        required
      />

      <div>
        <label className="form-label text-muted small fw-bold text-uppercase">
          Descrição
        </label>
        <textarea
          className="form-control bg-dark text-white border-secondary"
          rows={3}
          placeholder="Descreva o propósito desta sala..."
          value={roomDescription}
          onChange={(e) => setRoomDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="form-label text-muted small fw-bold text-uppercase">
          Status do Sistema
        </label>
        <select
          className="form-select bg-dark text-white border-secondary"
          value={roomStatus}
          onChange={(e) => setRoomStatus(e.target.value as "ativa" | "inativa")}
        >
          <option value="ativa">Ativa (Visível para alunos)</option>
          <option value="inativa">Inativa (Oculta)</option>
        </select>
      </div>

      <div className="d-flex gap-2 mt-4">
        <button
          type="button"
          className="btn btn-outline-secondary w-100"
          data-bs-dismiss="modal"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-cyan w-100 fw-bold shadow-sm"
          data-bs-dismiss="modal"
        >
          {botaoLabel}
        </button>
      </div>
    </form>
  );
};
