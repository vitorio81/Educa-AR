import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registroService } from "../../services/registro";
import type { CreateUserData } from "../../services/registro";

export const Register = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userSecret, setUserSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registroService.create({
        userName,
        userEmail,
        userSecret,
      });

      alert("Conta criada com sucesso!");
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao realizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* container-login com $bg-dark */
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#121212" }} // Simulação do seu $bg-dark
    >
      <div
        className="card p-4 shadow border-0"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "8px",
          backgroundColor: "#1e1e1e", // Simulação do seu $surface-dark
          border: "1px solid #333", // Conforme seu SCSS
          color: "#ffffff", // Simulação do seu $text-main
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-white">EducaAR</h2>
          <p style={{ color: "#b0b0b0" }}>Crie sua conta para acessar</p>
        </div>

        {error && (
          <div
            className="alert alert-danger py-2 text-center"
            role="alert"
            style={{ fontSize: "0.85rem" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label text-white">Nome de Usuário</label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Seu Primeiro nome"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">E-mail</label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              placeholder="seu@email.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-white">Senha</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              placeholder="******"
              value={userSecret}
              onChange={(e) => setUserSecret(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <hr style={{ borderColor: "#333" }} className="my-4" />

        <div className="text-center">
          <span style={{ color: "#b0b0b0" }}>Já tem uma conta? </span>
          <br />
          <Link
            to="/login"
            className="text-decoration-none fw-bold text-primary"
          >
            Faça login aqui
          </Link>
        </div>
      </div>
    </div>
  );
};
