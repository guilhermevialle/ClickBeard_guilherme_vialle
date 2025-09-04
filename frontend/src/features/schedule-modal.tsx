import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  addWeeks,
  format,
  isBefore,
  isSameDay,
  startOfDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { getAllBarbers } from "../services/api/barber";

interface ScheduleModalProps {
  specialties: Specialty[];
}

interface Specialty {
  id: string;
  name: string;
  durationInMinutes: number;
}

interface ScheduleModalProps {
  specialties: Specialty[];
}

export default function ScheduleModal({ specialties }: ScheduleModalProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );
  const [selectedDate, setSelectedDate] = useState(() => {
    // Set initial selected date to tomorrow
    return addDays(new Date(), 1);
  });

  const today = startOfDay(new Date());

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

  const getWeekDays = () => {
    return Array.from({ length: 7 }).map((_, index) =>
      addDays(currentWeekStart, index),
    );
  };

  const weekDays = getWeekDays();

  useEffect(() => console.log(selectedDate), [selectedDate]);

  const { data: barbers } = useQuery({
    queryFn: getAllBarbers,
    queryKey: ["barbers"],
  });

  const [activeBarber, setActiveBarber] = useState<number | null>(null);

  return specialties?.map((specialty) => {
    return (
      <DialogTrigger key={specialty.id}>
        <Button className="flex w-full cursor-pointer items-center justify-between px-6 py-2 transition-all hover:bg-[#2d2d2f]">
          <p className="font-medium tracking-tight text-neutral-300">
            {specialty.name}
          </p>
          <p className="font-medium tracking-tight text-neutral-400">
            {specialty.durationInMinutes} minutos
          </p>
        </Button>
        <ModalOverlay
          isDismissable
          className="absolute inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <Modal
            isDismissable
            className="aspect-[16/11] w-[900px] rounded-4xl bg-[#1d1d1d] px-10 py-8"
          >
            <Dialog>
              <div className="mb-6 flex items-center justify-between">
                <Button
                  onPress={goToPreviousWeek}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#2d2d2d] transition-colors hover:bg-[#2d2d2d]"
                >
                  <LucideChevronLeft className="h-4 w-4 text-neutral-300" />
                </Button>

                <h4 className="text-center text-2xl font-semibold tracking-tight text-neutral-300 capitalize">
                  {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </h4>

                <Button
                  onPress={goToNextWeek}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#2d2d2d] transition-colors hover:bg-[#2d2d2d]"
                >
                  <LucideChevronRight className="h-4 w-4 text-neutral-300" />
                </Button>
              </div>
              <div className="flex h-24 items-center justify-between gap-3 px-2">
                {weekDays.map((date) => {
                  const isSelected = isSameDay(date, selectedDate);
                  const isPastDate = isBefore(startOfDay(date), today);

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      disabled={isPastDate}
                      className={twMerge(
                        "flex h-full w-full cursor-pointer flex-col items-center justify-between gap-3 rounded-2xl border border-[#2d2d2d] py-2 transition-all hover:bg-[#2d2d2d]",
                        isSelected && "border-[#404040] bg-[#2d2d2d]",
                        isPastDate &&
                          "cursor-not-allowed opacity-30 hover:bg-transparent",
                      )}
                    >
                      <span className="text-2xl font-semibold text-neutral-300">
                        {format(date, "d")}
                      </span>
                      <span className="text-sm font-semibold text-neutral-400">
                        {format(date, "EEE", { locale: ptBR })}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-500">
                  {format(weekDays[0], "d MMM", { locale: ptBR })} -{" "}
                  {format(weekDays[6], "d MMM yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="mt-8">
                <h4 className="text-xl font-medium tracking-tight text-neutral-200">
                  Selecione um barbeiro para fazer {specialty.name}:
                </h4>
                <div className="mt-4 flex items-center gap-3">
                  {barbers &&
                    barbers
                      .filter((s) =>
                        s.specialties.some((sp) => sp.id === specialty.id),
                      )
                      .map((barber, index) => {
                        const isActive = index === activeBarber;

                        return (
                          <button
                            onClick={() => setActiveBarber(index)}
                            key={barber.id}
                            className={twMerge(
                              "flex h-[114px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl px-4 transition-all",
                              isActive ? "bg-blue-500" : "hover:bg-[#2d2d2d]",
                            )}
                          >
                            <img
                              src="/barber.jpg"
                              alt="Barbeiro"
                              className="size-16 rounded-full"
                            />
                            <span
                              className={twMerge(
                                "text-sm font-medium tracking-tight text-balance text-neutral-300",
                                isActive && "text-white",
                              )}
                            >
                              {barber.name.split(" ")[0]}
                            </span>
                          </button>
                        );
                      })}
                </div>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    );
  });
}
