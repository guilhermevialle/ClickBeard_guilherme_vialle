import { API } from "./client";

export async function getAdminDashboardData(date: Date) {
  try {
    const { data } = await API.post<AdminDashboardData>("/admin", {
      date: date.toISOString(),
    });
    return data;
  } catch (error: unknown) {
    // @ts-expect-error no types
    throw error.response?.data || new Error("Unknown error");
  }
}
