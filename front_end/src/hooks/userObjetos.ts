import { useState, useEffect, useCallback } from "react";
import { objetoService } from "../services/objetoService";

export interface Objeto {
  objectId: number;
  roomId: number;
  objectName: string;
  objectDescription: string;
  objectUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useObjetos = (
  userId?: number | string,
  roomId?: number | string,
) => {
  const [objetos, setObjetos] = useState<Objeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔍 Busca objetos
  const fetchObjetos = useCallback(async () => {
    if (!userId && !roomId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;

      if (roomId) {
        data = await objetoService.getByRoom(roomId);
      } else {
        data = await objetoService.getByUser(userId!);
      }

      setObjetos(data);
    } catch (err) {
      console.error("Erro ao buscar objetos:", err);
      setError("Não foi possível carregar os objetos.");
    } finally {
      setLoading(false);
    }
  }, [userId, roomId]);

  useEffect(() => {
    fetchObjetos();
  }, [fetchObjetos]);

  // ✅ Criar Objeto
  const handleCreate = async (data: FormData) => {
    try {
      setError(null);

      await objetoService.create(data);

      await fetchObjetos();
    } catch (err) {
      console.error("Erro ao criar objeto:", err);
      setError("Erro ao cadastrar o objeto.");
      throw err;
    }
  };

  // ✅ Atualizar Objeto
  const handleUpdate = async (objectId: number, data: FormData) => {
    try {
      setError(null);

      await objetoService.update(objectId, data);

      await fetchObjetos();
    } catch (err) {
      console.error("Erro ao atualizar objeto:", err);
      setError("Erro ao atualizar o objeto.");
      throw err;
    }
  };

  // ✅ Deletar Objeto
  const handleDelete = async (objectId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este objeto?")) return;

    try {
      setError(null);

      await objetoService.delete(objectId);

      await fetchObjetos();
    } catch (err) {
      console.error("Erro ao deletar objeto:", err);
      setError("Não foi possível excluir o objeto.");
    }
  };

  return {
    objetos,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    refresh: fetchObjetos,
  };
};
