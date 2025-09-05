import { useMutation } from "@tanstack/react-query";
import { addMinutes } from "date-fns";
import { twMerge } from "tailwind-merge";
import { queryClient } from "../constants/query-client";
import { cancelAppointment } from "../services/api/appointment";

interface AppointmentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  appointment: CustomerAppointment;
}

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
        "flex aspect-[16/11] w-96 flex-col gap-3 rounded-2xl border border-neutral-800 bg-[#1d1d1d] px-5 py-4 shadow-lg shadow-black/40 transition-transform",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-100">
          Agendamento
        </h2>
        <span className="text-xs text-neutral-500">#{id.slice(0, 6)}</span>
      </div>
      <div className="flex flex-col gap-1 text-sm text-neutral-300">
        <p>
          <span className="font-medium tracking-tight text-neutral-400">
            Barbeiro:
          </span>{" "}
          {barber.name}
        </p>
        <p>
          <span className="font-medium tracking-tight text-neutral-400">
            Serviço:
          </span>{" "}
          {specialty.name}
        </p>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <div>
          <p className="text-sm font-medium tracking-tight text-neutral-200">
            {startDate}
          </p>
          <p className="text-sm tracking-tight text-neutral-400">{startTime}</p>
        </div>
        <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium tracking-tight text-blue-400">
          {durationInMinutes} min
        </span>
      </div>
      {status === "CONFIRMED" && (
        <span className="w-fit rounded-xl bg-green-800/20 px-2 py-1 text-xs font-medium tracking-tight text-green-300">
          Confirmado
        </span>
      )}
      {status === "COMPLETED" && (
        <span className="w-fit rounded-xl bg-orange-800/20 px-2 py-1 text-xs font-medium tracking-tight text-orange-300">
          Concluído
        </span>
      )}
      {status === "CANCELLED" && (
        <span className="w-fit rounded-xl bg-red-800/20 px-2 py-1 text-xs font-medium tracking-tight text-red-300">
          Cancelado
        </span>
      )}
      {!wasFinished && status === "CONFIRMED" && (
        <button
          onClick={() => mutation.mutate(id)}
          className="mt-3 h-10 cursor-pointer rounded-full bg-red-800/15 text-sm font-medium tracking-tight text-red-300 hover:opacity-85"
        >
          Cancelar agendamento
        </button>
      )}
    </div>
  );
}
