interface UserSession {
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

type Appointment = {
  id: string;
  customerId: string;
  barberId: string;
  specialtyId: string;
  startAt: Date;
  durationInMinutes: number;
  createdAt: Date;
  updatedAt: Date;
};

type AppointmentStatus = "CONFIRMED" | "CANCELLED" | "COMPLETED";

type CustomerAppointment = {
  id: string;
  barber: {
    id: string;
    name: string;
  };
  specialty: {
    id: string;
    name: string;
  };
  startAt: Date;
  durationInMinutes: number;
  createdAt: Date;
  updatedAt: Date;
  status: AppointmentStatus;
};

type CustomerAppointments = Array<CustomerAppointment>;

type AdminDashboardData = Array<{
  id: string;
  barberName: string;
  customerName: string;
  specialtyName: string;
  durationInMinutes: number;
  status: AppointmentStatus;
  startAt: string;
  createdAt: Date;
  updatedAt: Date;
}>;
