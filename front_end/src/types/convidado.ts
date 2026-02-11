export interface Convidado {
  visitorId: number;
  visitorEmail: string;
  visitorStatus: "ativo" | "inativo";
  roomIds: number[];
  visitedAt?: string | Date;
}

// O que o Back-end espera no POST
export type CreateVisitorData = Omit<Convidado, "visitorId" | "visitedAt"> & {
  visitorPassword?: string;
};
