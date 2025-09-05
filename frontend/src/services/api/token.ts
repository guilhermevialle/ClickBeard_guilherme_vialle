import { API } from "./client";
import { getRefreshToken } from "./get-token";

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export async function refreshToken() {
  const refreshToken = getRefreshToken();

  try {
    const { data } = await API.post<RefreshTokenResponse>("/auth/refresh", {
      refreshToken,
    });

    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}
