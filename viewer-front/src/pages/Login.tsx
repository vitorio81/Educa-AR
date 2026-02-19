import React, { useState } from "react";
import { Box, Lock, Mail } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export const Login = () => {
  const { userId, roomId, objectId } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

async function handleLogin(e: React.FormEvent) {
  e.preventDefault();

  if (!userId || !roomId || !objectId) {
    alert("Link inválido");
    return;
  }

  setLoading(true);

  try {
    const apiUrl = import.meta.env.VITE_API_URL_LOGIN;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: Number(userId),
        roomId: Number(roomId),
        objectId: Number(objectId),
        email,
        password,
      }),
    });

    console.log(userId, roomId, objectId, email, password);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erro ao autenticar");
    }

    console.log("Login realizado:", data);

    // ✅ SALVA TOKEN
    localStorage.setItem("token", data.data.token);

    // contexto viewer
    localStorage.setItem(
      "viewerContext",
      JSON.stringify({ userId, roomId, objectId }),
    );

    navigate("/viewer");
  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-dark px-3">
      <div
        className="tech-card p-4 shadow-lg glass-effect"
        style={{ width: "100%", maxWidth: "420px", borderRadius: "16px" }}
      >
        <div className="text-center mb-4">
          <div
            className="icon-box-refined d-inline-block p-3 rounded-circle mb-3"
            style={{ background: "rgba(0, 243, 255, 0.05)" }}
          >
            <Box size={32} className="text-cyan" />
          </div>

          <h2 className="text-white fw-bold">Visualizador 3D</h2>

          <p className="text-muted-custom small">
            Acesse o conteúdo da sala {roomId}
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label status-label-refined">E-mail</label>

            <div className="position-relative">
              <Mail
                size={18}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              />

              <input
                type="email"
                className="form-control ps-5"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* SENHA */}
          <div className="mb-4">
            <label className="form-label status-label-refined">Senha</label>

            <div className="position-relative">
              <Lock
                size={18}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
              />

              <input
                type="password"
                className="form-control ps-5"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-tech w-100 py-2"
            disabled={loading}
          >
            {loading ? "Validando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <small className="text-muted">Objeto: {objectId}</small>
        </div>
      </div>
    </div>
  );
};
