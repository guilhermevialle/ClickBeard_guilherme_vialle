import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addDays,
  format,
  isBefore,
  isSameDay,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { useWeekNavigation } from "../hooks/use-week-navigation";
import { createAppointment } from "../services/api/appointment";
import { findBarberSlotsByDate, getAllBarbers } from "../services/api/barber";
import { minutesToTimeString } from "../utils/minutes-to-date";
import { setDateMinutes } from "../utils/set-date-minutes";

interface ScheduleModalProps {
  specialties: Specialty[];
}

export default function ScheduleModal({ specialties }: ScheduleModalProps) {
  const { nextWeek, prevWeek, weekStart } = useWeekNavigation();
  const [date, setDate] = useState(() => new Date());
  const [slot, setSlot] = useState<number | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const navigate = useNavigate();

  const weekDays = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const { data: barbers } = useQuery({
    queryKey: ["barbers"],
    queryFn: getAllBarbers,
  });

  const { data: slots } = useQuery<number[]>({
    queryKey: ["barberSlots", barberId, date],
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Fetches the slots for the selected barber and date.
     * If barberId is null, returns an empty array.
     */
    /*******  c53ce150-523e-4264-901d-975363a4083d  *******/
    queryFn: () =>
      findBarberSlotsByDate({
        barberId: barberId ?? "",
        date: date,
      }),
    placeholderData: [],
  });

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: () => {
      navigate("/me/appointments");
      alert("Agendado com sucesso!");
    },
  });

  const showBarberSlots = useMemo(
    () => barberId && slots && slots.length > 0,
    [barberId, slots],
  );

  return specialties.map((specialty) => {
    const specialtyBarbers =
      barbers?.filter((b) =>
        b.specialties.some((s) => s.id === specialty.id),
      ) || [];

    return (
      <DialogTrigger key={specialty.id}>
        <Button className="flex w-full cursor-pointer justify-between px-6 py-2 hover:bg-[#2d2d2f]">
          <span className="font-medium text-neutral-300">{specialty.name}</span>
          <span className="font-medium text-neutral-400">
            {specialty.durationInMinutes} min
          </span>
        </Button>

        <ModalOverlay
          isDismissable
          className="absolute inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <Modal
            className="aspect-[16/11] w-[900px] rounded-4xl bg-[#1d1d1d] px-10 py-8"
            isDismissable
          >
            <Dialog>
              <div className="mb-6 flex items-center justify-between">
                <Button
                  onPress={prevWeek}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2d2d] hover:bg-[#2d2d2d]"
                >
                  <LucideChevronLeft className="h-4 w-4 text-neutral-300" />
                </Button>
                <h4 className="text-center text-2xl font-semibold text-neutral-300 capitalize">
                  {format(date, "EEEE, d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </h4>
                <Button
                  onPress={nextWeek}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2d2d2d] hover:bg-[#2d2d2d]"
                >
                  <LucideChevronRight className="h-4 w-4 text-neutral-300" />
                </Button>
              </div>

              <div className="flex h-24 justify-between gap-3 px-2">
                {weekDays.map((day) => {
                  const isSelected = isSameDay(day, date);
                  const cutoff = setMinutes(setHours(startOfDay(day), 18), 0);
                  const isPast = isBefore(cutoff, new Date());

                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => {
                        setSlot(null);
                        setBarberId(null);
                        setDate(day);
                      }}
                      disabled={isPast}
                      className={twMerge(
                        "flex h-full w-full cursor-pointer flex-col items-center justify-between gap-3 rounded-2xl border border-[#2d2d2d] py-2 transition hover:bg-[#2d2d2d]",
                        isSelected && "border-[#404040] bg-[#2d2d2d]",
                        isPast &&
                          "cursor-not-allowed opacity-30 hover:bg-transparent",
                      )}
                    >
                      <span className="text-2xl font-semibold text-neutral-300">
                        {format(day, "d")}
                      </span>
                      <span className="text-sm font-semibold text-neutral-400">
                        {format(day, "EEE", { locale: ptBR })}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 text-center text-sm text-neutral-500">
                {format(weekDays[0], "d MMM", { locale: ptBR })} -{" "}
                {format(weekDays[6], "d MMM yyyy", { locale: ptBR })}
              </div>

              <div className="mt-8">
                <h4 className="text-xl font-medium text-neutral-200">
                  Selecione um barbeiro para {specialty.name}
                </h4>
                <div className="mt-4 flex gap-3">
                  {specialtyBarbers.map((barber) => {
                    const isActive = barber.id === barberId;

                    return (
                      <button
                        key={barber.id}
                        onClick={() => {
                          if (barberId === barber.id) return setBarberId(null);

                          setSlot(null);
                          setBarberId(barber.id);
                        }}
                        className={twMerge(
                          "flex h-[114px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl px-4 transition",
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
                            "text-sm font-medium text-neutral-300",
                            isActive && "text-white",
                          )}
                        >
                          {barber.name.split(" ")[0]}
                        </span>
                      </button>
                    );
                  })}
                  {specialtyBarbers.length === 0 && (
                    <p className="font-medium tracking-tight text-neutral-500">
                      Nenhum barbeiro disponível
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex h-64 items-center justify-center">
                {showBarberSlots ? (
                  <div className="mt-6 grid size-full grid-cols-4 gap-3">
                    {slots?.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSlot(s)}
                        className={twMerge(
                          "cursor-pointer rounded-lg border border-[#2d2d2d] px-4 py-2 text-center text-neutral-300 transition hover:bg-[#2d2d2d]",
                          s === slot && "bg-[#2d2d2d] text-white",
                        )}
                      >
                        {minutesToTimeString(s)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <p className="text-center text-xl font-medium tracking-tight text-neutral-500">
                      Escolha um barbeiro para ver as horas disponíveis
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-8 flex h-10 w-full items-center justify-end">
                {barberId && slot !== null && (
                  <button
                    className="h-fit w-fit cursor-pointer rounded-full bg-white px-6 py-2 text-center font-medium tracking-tight text-black transition hover:opacity-85"
                    onClick={() => {
                      createAppointmentMutation.mutate({
                        barberId,
                        specialtyId: specialty.id,
                        startAt: setDateMinutes(date, slot),
                      });
                    }}
                  >
                    Agendar agora
                  </button>
                )}
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    );
  });
}
