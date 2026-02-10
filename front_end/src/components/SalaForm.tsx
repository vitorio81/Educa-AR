import { useState, useEffect } from "react";
import { InputCustom } from "./InputCustom";

interface FormTurmaProps {
  dadosIniciais?: {
    id?: number;
    nome: string;
    descricao: string;
    status: string;
  };
  botaoLabel: string;
  onSubmit: (data: any) => Promise<void>;
}

export const FormTurma = ({ dadosIniciais, botaoLabel, onSubmit }: FormTurmaProps) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState("ativa");

  useEffect(() => {
    setNome(dadosIniciais?.nome || "");
    setDescricao(dadosIniciais?.descricao || "");
    setStatus(dadosIniciais?.status || "ativa");
  }, [dadosIniciais]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      id: dadosIniciais?.id,
      roomName: nome,
      roomDescription: descricao,
      status: status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <InputCustom
        label="Nome da Turma"
        type="text"
        placeholder="Ex: Engenharia de Software AR"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />

      <div>
        <label className="form-label text-muted small fw-bold text-uppercase">
          Descrição
        </label>
        <textarea
          className="form-control" // Classe global já estilizada
          rows={3}
          placeholder="Descreva o propósito desta sala..."
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="form-label text-muted small fw-bold text-uppercase">
          Status do Sistema
        </label>
        <select
          className="form-select" // Classe global já estilizada
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
          className="btn btn-cyan w-100 fw-bold"
          data-bs-dismiss="modal"
        >
          {botaoLabel}
        </button>
      </div>
    </form>
  );
};