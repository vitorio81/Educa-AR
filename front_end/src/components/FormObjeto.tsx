import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { InputCustom } from "./InputCustom";
import { UploadCloud, File } from "lucide-react";

interface Room {
  roomId: number;
  roomName: string;
}

interface ObjetoFormData {
  objectName: string;
  objectDescription: string;
  objectUrl?: string;
  roomId: number;
}

interface FormObjetoProps {
  botaoLabel: string;
  rooms: Room[];
  initialData?: Partial<ObjetoFormData>;
  onSubmit: (
    data: FormData,
    onProgress: (progress: number) => void,
  ) => Promise<void>;
}

export const FormObjeto = ({
  botaoLabel,
  rooms,
  initialData,
  onSubmit,
}: FormObjetoProps) => {
  const [objectName, setObjectName] = useState("");
  const [objectDescription, setObjectDescription] = useState("");
  const [roomId, setRoomId] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (initialData) {
      setObjectName(initialData.objectName || "");
      setObjectDescription(initialData.objectDescription || "");
      setRoomId(initialData.roomId || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!roomId) return alert("Por favor, selecione uma sala para este objeto.");

    const formData = new FormData();
    formData.append("objectName", objectName);
    formData.append("objectDescription", objectDescription);
    formData.append("roomId", String(roomId));

    if (!file) {
      alert("Selecione um arquivo 3D");
      return;
    }

    formData.append("file", file);


    try {
      setLoading(true);
      await onSubmit(formData, (value) => setProgress(value));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-2" onSubmit={handleSubmit}>
      {/* Nome do Objeto */}
      <div className="mb-4">
        <InputCustom
          label="Nome do Objeto"
          type="text"
          value={objectName}
          onChange={(e: any) => setObjectName(e.target.value)}
          placeholder="Ex: Anatomia Humana - Coração"
        />
      </div>

      {/* Seleção de Sala (Estilo Tech) */}
      <div className="mb-4">
        <label className="status-label-refined mb-2 d-block opacity-75">
          Sala de Destino
        </label>
        <select
          className="form-select-tech w-100"
          value={roomId}
          onChange={(e) => setRoomId(Number(e.target.value))}
          required
        >
          <option value="">Selecione uma sala...</option>
          {rooms.map((room) => (
            <option key={room.roomId} value={room.roomId} className="bg-dark">
              {room.roomName}
            </option>
          ))}
        </select>
      </div>

      {/* Descrição */}
      <div className="mb-4">
        <label className="status-label-refined mb-2 d-block opacity-75">
          Descrição Detalhada
        </label>
        <textarea
          className="form-control bg-dark text-white border-secondary border-opacity-25 shadow-none"
          rows={3}
          value={objectDescription}
          onChange={(e) => setObjectDescription(e.target.value)}
          placeholder="Descreva brevemente o modelo 3D..."
          style={{ resize: "none", fontSize: "0.9rem" }}
        />
      </div>

      {/* Área de Upload Refinada */}
      <div className="mb-4">
        <label className="status-label-refined mb-2 d-block opacity-75">
          Arquivo 3D (.GLB, .OBJ)
        </label>
        <div className="upload-dropzone">
          <input
            type="file"
            className="d-none"
            id="upload3d"
            accept=".glb,.obj,.fbx"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="upload3d"
            className={`d-flex flex-column align-items-center gap-2 cursor-pointer w-100 p-4 rounded-3 border border-dashed border-secondary border-opacity-50 hover-cyan-border transition-all ${
              file ? "border-info border-opacity-50 bg-info bg-opacity-10" : ""
            }`}
          >
            <UploadCloud
              size={28}
              className={file ? "text-info" : "text-cyan opacity-75"}
            />

            <span
              className={`small fw-medium ${file ? "text-info" : "text-white"}`}
            >
              {file ? file.name : "Arraste o arquivo ou clique aqui"}
            </span>

            {!file && (
              <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                Máximo sugerido: 20MB
              </span>
            )}
          </label>
        </div>
      </div>

      {/* Footer com botões Tech */}
      <div className="modal-footer border-top border-secondary border-opacity-10 p-0 pt-4 mt-4 d-flex gap-3">
        <button
          type="button"
          className="btn btn-action-sutil px-4"
          data-bs-dismiss="modal"
          disabled={loading}
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary-tech flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2"
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span>Processando...</span>
            </>
          ) : (
            <span>{botaoLabel}</span>
          )}
        </button>
      </div>
      {progress > 0 && (
        <div className="progress mt-2">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </form>
  );
};