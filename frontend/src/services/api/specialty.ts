import { API } from "./client";

export async function getAllSpecialties() {
  try {
    const { data } = await API.get<Specialty[]>("/specialties");
    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}

export async function createSpecialty({
  durationInMinutes,
  name,
}: Omit<Specialty, "id">) {
  try {
    const { data } = await API.post<Specialty>("/specialties/new", {
      durationInMinutes,
      name,
    });
    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}
