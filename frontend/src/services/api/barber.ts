import { API } from "./client";

interface CreateBarberProps {
  name: string;
  age: number;
  hiredAt: Date;
  specialtyIds: string[];
}

export async function createBarber({
  age,
  hiredAt,
  name,
  specialtyIds,
}: CreateBarberProps): Promise<Barber | ErrorResponse> {
  try {
    const { data } = await API.post<Barber>("/barbers/new", {
      age,
      hiredAt,
      name,
      specialtyIds,
    });

    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}

export async function getAllBarbers() {
  try {
    const { data } = await API.get<Barber[]>("/barbers/bff");
    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}

interface FindBarberSlotsByDateProps {
  barberId: string;
  date: Date;
}

export async function findBarberSlotsByDate({
  barberId,
  date,
}: FindBarberSlotsByDateProps) {
  try {
    const { data } = await API.post<number[]>(`/barbers/slots`, {
      barberId,
      date,
    });
    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}
