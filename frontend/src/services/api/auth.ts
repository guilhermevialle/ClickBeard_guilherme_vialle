import { API } from "./client";

interface AuthenticateProps {
  email: string;
  password: string;
}

export async function authenticate({
  email,
  password,
}: AuthenticateProps): Promise<UserSession | ErrorResponse> {
  try {
    const { data } = await API.post(
      "/auth/login",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return data as UserSession;
  } catch (error: unknown) {
    return error as ErrorResponse;
  }
}

interface RegisterProps {
  name: string;
  email: string;
  password: string;
}

export async function register({ email, name, password }: RegisterProps) {
  try {
    const { data } = await API.post("/auth/register", {
      email,
      name,
      password,
    });
    return data as UserSession;
  } catch (error: unknown) {
    return error as ErrorResponse;
  }
}
