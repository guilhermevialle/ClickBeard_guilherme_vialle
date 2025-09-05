export function getToken(): string {
  try {
    const json = localStorage.getItem("userSession");

    if (!json) return "";

    const session = JSON.parse(json);
    return session.session?.accessToken || "";
  } catch {
    return "";
  }
}
