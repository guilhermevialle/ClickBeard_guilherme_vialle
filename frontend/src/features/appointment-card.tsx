import { useMutation } from "@tanstack/react-query";
import { addMinutes } from "date-fns";
import { twMerge } from "tailwind-merge";
import { queryClient } from "../constants/query-client";
import { cancelAppointment } from "../services/api/appointment";

interface AppointmentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  appointment: CustomerAppointment;
}

const STATUS_STYLES = {
  CONFIRMED: "bg-green-800/20 text-green-300",
  COMPLETED: "bg-orange-800/20 text-orange-300",
  CANCELLED: "bg-red-800/20 text-red-300",
};

const STATUS = {
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

export default function AppointmentCard({
  className,
  appointment,
  ...rest
}: AppointmentCardProps) {
  const { barber, durationInMinutes, startAt, id, status, specialty } =
    appointment;
  const wasFinished = addMinutes(startAt, durationInMinutes) < new Date();
  const startDate = new Date(startAt).toLocaleDateString();
  const startTime = new Date(startAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const mutation = useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: () => {
      // @ts-expect-error types mismatch
      queryClient.invalidateQueries(["customer-appointments"]);
    },
    onError: (err) => console.error(err),
  });

  return (
    <div
      {...rest}
      key={id}
      className={twMerge(
        "flex h-80 w-96 flex-col rounded-2xl border border-neutral-800 bg-[#1d1d1d] px-5 py-5 tracking-tight shadow-lg shadow-black/40 transition-all duration-200 hover:shadow-xl hover:shadow-black/50",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
          Agendamento
        </h2>
        <span className="rounded-md bg-neutral-800/50 px-2 py-1 font-mono text-xs text-neutral-500">
          #{id.slice(0, 6)}
        </span>
      </div>
      <div className="flex-1 space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="min-w-[60px] font-medium text-neutral-400">
              Barbeiro:
            </span>
            <span className="font-medium text-neutral-200">{barber.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="min-w-[60px] font-medium text-neutral-400">
              Serviço:
            </span>
            <span className="text-neutral-200">{specialty.name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-800/50 pt-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-neutral-200">
              {startDate}
            </span>
            <span className="text-lg font-semibold text-neutral-100">
              {startTime}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-blue-400">
              {durationInMinutes} min
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-3 border-t border-neutral-800/50 pt-4">
        <div className="flex items-center justify-between">
          <span
            className={twMerge(
              "rounded-full px-3 py-1 text-xs font-medium tracking-tight",
              STATUS_STYLES[status as keyof typeof STATUS_STYLES],
            )}
          >
            {STATUS[status as keyof typeof STATUS]}
          </span>
        </div>
        {!wasFinished && status === "CONFIRMED" && (
          <button
            onClick={() => mutation.mutate(id)}
            disabled={mutation.isPending}
            className="h-10 w-full cursor-pointer rounded-full bg-red-800/15 text-sm font-medium tracking-tight text-red-300 transition-colors duration-200 hover:bg-red-800/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? "Cancelando..." : "Cancelar agendamento"}
          </button>
        )}
      </div>
    </div>
  );
}
