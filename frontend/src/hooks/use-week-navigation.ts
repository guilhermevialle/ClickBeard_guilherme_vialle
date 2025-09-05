import { addWeeks, startOfWeek, subWeeks } from "date-fns";
import { useState } from "react";

export function useWeekNavigation() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );

  const prevWeek = () => setWeekStart((w) => subWeeks(w, 1));
  const nextWeek = () => setWeekStart((w) => addWeeks(w, 1));

  return { weekStart, prevWeek, nextWeek, setWeekStart };
}
