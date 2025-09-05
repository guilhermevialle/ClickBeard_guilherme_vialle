import { addMinutes, startOfDay } from "date-fns";

export const setDateMinutes = (date: Date, minutes: number) => {
  return addMinutes(startOfDay(date), minutes);
};
