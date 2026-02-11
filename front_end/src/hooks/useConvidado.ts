import { useEffect, useState } from "react";
import { convidadoService } from "../services/convidadosService";

export interface Convidado {
  visitorId: number; // Antes era 'id'
  visitorEmail: string; // Antes era 'email'
  visitorStatus: "ativo" | "inativo"; // Antes era 'status'
  roomIds: number[];
}
export const useConvidados = (userId: number | string) => {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [loading, setLoading] = useState(false);

  const carregarConvidados = async () => {
    try {
      setLoading(true);
      const data = await convidadoService.getByUser(userId);
      setConvidados(data); // A API retorna Visitor[]
    } finally {
      setLoading(false);
    }
  };

  const criarConvidado = async (data: any) => {
    await convidadoService.create(data);
    await carregarConvidados();
    console.log("Convidado criado com sucesso:", data); // 👈 debug
  };

  const atualizarConvidado = async (id: number, data: any) => {
    console.log("Atualizando convidado:", data); // 👈 debug
     await convidadoService.update(id, data);

    await carregarConvidados();
  };


  const excluirConvidado = async (id: number) => {
    await convidadoService.delete(id);
    await carregarConvidados();
  };

  useEffect(() => {
    if (userId) carregarConvidados();
  }, [userId]);

  return {
    convidados,
    loading,
    criarConvidado,
    atualizarConvidado,
    excluirConvidado,
  };
};
