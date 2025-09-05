import { API } from "./client";
import { getAccessToken } from "./get-token";

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
          Authorization: `Bearer ${getAccessToken()}`,
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
  const accessToken = getAccessToken();

  try {
    const { data } = await API.get<CustomerAppointments>("/appointments/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}

export async function cancelAppointment(id: string) {
  const accessToken = getAccessToken();

  try {
    const { data } = await API.patch<{
      message: string;
      statusCode: number;
    }>(
      `/appointments/${id}`,
      {}, // body vazio, já que só precisa do header
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}
