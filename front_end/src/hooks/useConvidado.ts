import { useEffect, useState, useCallback } from "react";
import { convidadoService } from "../services/convidadosService";

// Interface sincronizada com Backend
export interface Convidado {
  visitorId: number;
  visitorEmail: string;
  visitorStatus: "ativo" | "inativo";
  roomIds: number[];
  visitedAt?: string;
}

// Tipo para criação
export type CriarConvidadoData = Omit<Convidado, "visitorId" | "visitedAt"> & {
  visitorPassword?: string;
};

export const useConvidados = (userId?: number, roomId?: number | string) => {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Normaliza roomId (pode vir string da URL)
  const parsedRoomId = roomId !== undefined ? Number(roomId) : undefined;

  const carregarConvidados = useCallback(async () => {
    if (!userId && !parsedRoomId) return;

    try {
      setLoading(true);

      let data: Convidado[] = [];

      // 🔥 Prioridade: buscar pela room
      if (parsedRoomId) {
        data = await convidadoService.getByRoomId(parsedRoomId);
      } else if (userId) {
        data = await convidadoService.getByUser(userId);
      }

      setConvidados(data);
    } catch (error) {
      console.error("Erro ao carregar convidados:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, parsedRoomId]);

  // 🔥 Criar convidado
  const criarConvidado = async (data: CriarConvidadoData) => {
    try {
      await convidadoService.create(data);
      await carregarConvidados();
    } catch (error) {
      console.error("Erro ao criar convidado:", error);
      throw error;
    }
  };

  // 🔥 Atualizar convidado
  const atualizarConvidado = async (
    visitorId: number,
    data: Partial<CriarConvidadoData>,
  ) => {
    try {
      await convidadoService.update(visitorId, data);
      await carregarConvidados();
    } catch (error) {
      console.error("Erro ao atualizar convidado:", error);
      throw error;
    }
  };

  // 🔥 Excluir convidado
  const excluirConvidado = async (visitorId: number) => {
    try {
      await convidadoService.delete(visitorId);
      await carregarConvidados();
    } catch (error) {
      console.error("Erro ao excluir convidado:", error);
      throw error;
    }
  };

  // 🔥 Recarrega quando mudar user ou room
  useEffect(() => {
    carregarConvidados();
  }, [carregarConvidados]);

  return {
    convidados,
    loading,
    criarConvidado,
    atualizarConvidado,
    excluirConvidado,
    refetch: carregarConvidados,
  };
};
