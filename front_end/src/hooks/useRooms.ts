import { useState, useEffect, useCallback } from "react";
import { roomService } from "../services/roomService";import { type Room } from "../types/room";


export const useRooms = (userId: number | undefined) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Busca as salas do usuário
  const fetchRooms = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getAll(userId);
      setRooms(data);
    } catch (err) {
      console.error("Erro ao buscar salas:", err);
      setError("Não foi possível carregar as turmas.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Carrega as salas assim que o userId estiver disponível
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Função para Criar Turma
  const handleCreate = async (data: any) => {
    try {
      setError(null);
      // Injeta o userId para garantir que a sala pertença ao usuário logado
      await roomService.create({ ...data, userId: Number(userId) });
      await fetchRooms();
    } catch (err) {
      console.error("Erro ao criar sala:", err);
      setError("Erro ao cadastrar a turma.");
      throw err; // Lançar o erro permite que o componente trate o fechamento do modal
    }
  };

  // Função para Atualizar Turma
  const handleUpdate = async (roomId: number, data: any) => {
    try {
      setError(null);
      // O back-end espera o ID na URL e os dados no corpo
      await roomService.update(roomId, { ...data, userId: Number(userId) });
      await fetchRooms();
    } catch (err) {
      console.error("Erro ao atualizar sala:", err);
      setError("Erro ao atualizar a turma.");
      throw err;
    }
  };

  // Função para Deletar Turma
  const handleDelete = async (roomId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta turma?\nESTA AÇÃO IRÁ ESCLUIR EM CONJUNTO OS OBJETOS QUE ESTÃO VINCULADOS A TURMA.")) return;

    try {
      setError(null);
      await roomService.delete(roomId);
      await fetchRooms();
    } catch (err) {
      console.error("Erro ao deletar sala:", err);
      setError("Não foi possível excluir a turma.");
    }
  };

  return {
    rooms,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    refresh: fetchRooms,
  };
};
