import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/token";

interface AuthContextType {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean; // 👈 Adicionado para controlar o estado inicial
  login: (token: string, user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("@EducaAR:token");
    const storedUser = localStorage.getItem("@EducaAR:user");
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } else {
      // Se o token expirou ou não existe, garante limpeza
      setToken(null);
      localStorage.removeItem("@EducaAR:token");
      localStorage.removeItem("@EducaAR:user");
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, user: any) => {
    localStorage.setItem("@EducaAR:token", newToken);
    localStorage.setItem("@EducaAR:user", JSON.stringify(user));
    setToken(newToken);
    setUser(user);
    navigate("/home", { replace: true });
  };

  const logout = () => {
    // 1. Limpa o localStorage primeiro
    localStorage.removeItem("@EducaAR:token");
    localStorage.removeItem("@EducaAR:user");

    // 2. Atualiza o estado para disparar o redirecionamento das rotas
    setToken(null);

    // 3. Navega para o login
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ user,token, isAuthenticated: !!token, loading, login, logout }}
    >
      {/* IMPORTANTE: Se o loading for true, não renderizamos os filhos 
          para evitar que as rotas tentem redirecionar antes de termos o token. */}
      {!loading ? (
        children
      ) : (
        <div className="loading-global">Carregando...</div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
