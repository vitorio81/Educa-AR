import { useRooms } from "../../hooks/useRooms";
import { BookOpen } from "lucide-react";

export const Home = () => {
  const storedUser = localStorage.getItem("@EducaAR:user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { rooms, loading } = useRooms(user?.userId);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-grow text-cyan" role="status"></div>
      </div>
    );

  return (
    <div className="container py-4">
      {/* Header com estilo 'Glass' */}
      <header className="mb-5 pb-3 border-bottom border-secondary border-opacity-25">
        <h1 className="text-white fw-bold h3 mb-1">Painel de Controle</h1>
        <p className="text-muted">
          Explore e gerencie suas turmas de Realidade Aumentada.
        </p>
      </header>

      <div className="row g-4">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div className="col-12 col-md-6 col-lg-4" key={room.roomId}>
              {/* Card Simplificado e Tecnológico */}
              <div className="card bg-surface border-secondary h-100 tech-card">
                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="icon-box">
                      <BookOpen size={20} className="text-cyan" />
                    </div>
                    <h5 className="text-white fw-bold mb-0 text-truncate text-uppercase">
                      {room.roomName}
                    </h5>
                  </div>

                  <p className="text-muted small flex-grow-1 mb-4 text-uppercase">
                    {room.roomDescription ||
                      "Sem descrição disponível para esta turma."}
                  </p>

                  <div className="d-flex align-items-center justify-content-between mt-auto pt-3 border-top border-secondary border-opacity-50">
                    <div className="status-indicator text-uppercase">
                      <span className={`status-dot ${room.roomStatus}`}></span>
                      <span className="status-text">{room.roomStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-secondary italic">
              Nenhum sinal de turmas por aqui...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
