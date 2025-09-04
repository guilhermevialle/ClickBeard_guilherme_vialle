export interface AuthenticateCustomerDto {
  email: string;
  password: string;
}

export interface RegisterCustomerDto {
  name: string;
  email: string;
  password: string;
}

export interface RegisterBarberDto {
  name: string;
  age: number;
  hiredAt: Date;
}

export interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    accessToken: string;
    refreshToken: string;
  };
}
