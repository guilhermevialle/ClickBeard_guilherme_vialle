interface UserSession {
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

interface ErrorResponse {
  error: string;
  message: string;
}
