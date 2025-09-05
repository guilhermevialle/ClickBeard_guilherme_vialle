import { API } from "./client";
import { getToken } from "./get-token";

interface CreateAppointmentProps {
  barberId: string;
  specialtyId: string;
  startAt: Date;
}

export async function createAppointment({
  barberId,
  specialtyId,
  startAt,
}: CreateAppointmentProps) {
  try {
    const { data } = await API.post(
      "/appointments/new",
      {
        barberId,
        specialtyId,
        startAt,
      },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );

    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}

export async function getAllAppointments() {
  try {
    const { data } = await API.get<CustomerAppointments>("/appointments/me", {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}

export async function cancelAppointment(id: string) {
  try {
    const { data } = await API.delete<{
      message: string;
      statusCode: number;
    }>(`/appointments/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}
