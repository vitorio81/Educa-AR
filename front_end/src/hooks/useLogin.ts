import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authApi } from "../services/authService";

export const useLogin = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // No useLogin.ts
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authApi.post("/login", {
        userEmail: email,
        userSecret: password, 
      });

      login(response.data.token, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "E-mail ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    loading,
    error,
  };
};;
