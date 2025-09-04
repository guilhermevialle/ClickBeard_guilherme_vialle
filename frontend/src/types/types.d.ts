interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
  };
  session: {
    accessToken: string;
  };
}

interface ErrorResponse {
  message: string;
  errorCode: string;
}

interface Specialty {
  id: string;
  name: string;
  durationInMinutes: number;
}

type Barber = {
  id: string;
  name: string;
  hiredAt: Date;
  specialties: {
    id: string;
    name: string;
  }[];
};
