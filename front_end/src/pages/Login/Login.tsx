import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";

export const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    loading,
    error,
  } = useLogin();

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div
        className="card p-4 shadow"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold">EducaAR</h2>
          <p className="text-muted">Entre com suas credenciais</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 text-center">{error}</div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input
              type="email"
              className="form-control"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-control"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Acessando..." : "Entrar"}
          </button>
        </form>

        <hr className="my-4" />

        <div className="text-center">
          <span className="text-muted">Ainda não tem conta?</span>
          <br />
          <Link to="/register" className="text-decoration-none fw-bold">
            Cadastre-se agora
          </Link>
        </div>
      </div>
    </div>
  );
};
