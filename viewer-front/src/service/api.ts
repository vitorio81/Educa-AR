export async function apiFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  console.log("API Fetch called with URL:", url);
  return fetch(url, {
    ...options,
    headers,
  });
}
