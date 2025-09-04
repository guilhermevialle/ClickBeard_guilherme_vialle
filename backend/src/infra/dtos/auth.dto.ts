export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    token: string;
    refreshToken: string;
  };
}
