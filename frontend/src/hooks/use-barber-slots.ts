import { useQuery } from "@tanstack/react-query";
import { findBarberSlotsByDate } from "../services/api/barber";

export function useBarberSlots(barberId: string | null, date: Date | null) {
  const { data: slots = [] } = useQuery<number[]>({
    queryKey: ["barberSlots", barberId, date],
    queryFn: () =>
      barberId && date
        ? findBarberSlotsByDate({ barberId, date })
        : Promise.resolve([]),
    placeholderData: [],
  });

  return slots;
}
