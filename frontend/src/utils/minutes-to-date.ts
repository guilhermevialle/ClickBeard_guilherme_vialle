import { format, setHours, setMinutes, startOfDay } from "date-fns";

export const minutesToTimeString = (minutes: number) => {
  const date = startOfDay(new Date()); // today at 00:00
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const withHours = setHours(date, hours);
  const withMinutes = setMinutes(withHours, mins);
  return format(withMinutes, "HH:mm");
};
