export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    console.warn("Token inválido ou expirado");

    localStorage.removeItem("token");

    // 🔥 Captura parâmetros atuais da URL
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;

    const userId = searchParams.get("userId") || "0";
    const roomId = searchParams.get("roomId") || "0";
    const objectId = searchParams.get("objectId") || "0";

    if (!window.location.pathname.startsWith("/login")) {
      window.location.href = `/login/${userId}/${roomId}/${objectId}`;
    }

    return Promise.reject("Unauthorized");
  }

  return response;
}
