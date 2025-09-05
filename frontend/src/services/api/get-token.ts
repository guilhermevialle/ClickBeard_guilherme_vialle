export function getAccessToken(): string {
  try {
    const json = localStorage.getItem("userSession");

    if (!json) return "";

    const session = JSON.parse(json);
    return session.session?.accessToken || "";
  } catch {
    return "";
  }
}

export function getRefreshToken(): string {
  try {
    const json = localStorage.getItem("userSession");

    if (!json) return "";

    const session = JSON.parse(json);
    return session.session?.refreshToken || "";
  } catch {
    return "";
  }
}
