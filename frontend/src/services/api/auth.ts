import { API } from "./client";

interface AuthenticateProps {
  email: string;
  password: string;
}

export async function authenticate({
  email,
  password,
}: AuthenticateProps): Promise<UserSession> {
  try {
    const { data } = await API.post<UserSession>(
      "/auth/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } },
    );
    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}

interface RegisterProps {
  name: string;
  email: string;
  password: string;
}

export async function register({
  email,
  name,
  password,
}: RegisterProps): Promise<UserSession> {
  try {
    const { data } = await API.post<UserSession>(
      "/auth/register",
      { email, name, password },
      { headers: { "Content-Type": "application/json" } },
    );
    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}

interface RevalidateTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export async function revalidateToken(): Promise<RevalidateTokenResponse> {
  try {
    const { data } = await API.post<RevalidateTokenResponse>(
      "/auth/refresh",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Failed to revalidate token");
  }
}
