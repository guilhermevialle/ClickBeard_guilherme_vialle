import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import PageLayout from "../../lib/components/page-layout";
import { getAdminDashboardData } from "../../services/api/admin";
import Navbar from "../navbar";

const STATUS_STYLES = {
  CONFIRMED: "bg-green-800/20 text-green-300",
  COMPLETED: "bg-orange-800/20 text-orange-300",
  CANCELLED: "bg-red-800/20 text-red-300",
};

const STATUS_LABELS = {
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

type Status = "ALL" | AppointmentStatus;

export default function AdminPage() {
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const { data } = useQuery({
    queryFn: () => {
      const [year, month, day] = date.split("-").map(Number);
      const localDate = new Date(year, month - 1, day);
      return getAdminDashboardData(new Date());
    },
    queryKey: ["admin-dashboard", date],
  });

  const [status, setStatus] = useState<Status>("ALL");

  const filteredAppointments = useMemo(() => {
    if (status === "ALL") return data;

    return data?.filter((ap) => ap.status === status);
  }, [data, status]);

  const isEmpty = !filteredAppointments || filteredAppointments.length === 0;

  return (
    <main className="h-screen w-full bg-[#0d0d0d]">
      <div className="absolute z-0 h-full w-full bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px]"></div>
      <PageLayout className="flex flex-col">
        <Navbar />
        <div className="w-full cursor-pointer pt-40 pb-10 text-neutral-300">
          <input
            type="date"
            value={date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            name="status"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option className="bg-black" value="ALL">
              Todos
            </option>
            <option className="bg-black" value="CONFIRMED">
              Confirmados
            </option>
            <option className="bg-black" value="COMPLETED">
              Concluídos
            </option>
            <option className="bg-black" value="CANCELLED">
              Cancelados
            </option>
          </select>
        </div>
        <div className="flex w-full grow flex-wrap justify-center gap-6 overflow-y-auto">
          {!isEmpty ? (
            filteredAppointments.map((appointment) => {
              const {
                id,
                barberName,
                customerName,
                specialtyName,
                durationInMinutes,
                status,
                startAt,
              } = appointment;
              const startDate = new Date(startAt).toLocaleDateString();
              const startTime = new Date(startAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={id}
                  className={twMerge(
                    "flex h-80 w-96 flex-col rounded-2xl border border-neutral-800 bg-[#1d1d1d] px-5 py-5 tracking-tight shadow-lg shadow-black/40 transition-all duration-200 hover:shadow-xl hover:shadow-black/50",
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
                        <span className="font-medium text-neutral-200">
                          {barberName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[60px] font-medium text-neutral-400">
                          Cliente:
                        </span>
                        <span className="text-neutral-200">{customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="min-w-[60px] font-medium text-neutral-400">
                          Serviço:
                        </span>
                        <span className="text-neutral-200">
                          {specialtyName}
                        </span>
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
                          STATUS_STYLES[status],
                        )}
                      >
                        {STATUS_LABELS[status]}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h2 className="text-2xl font-medium tracking-tight text-neutral-400">
              Nenhum agendamento encontrado
            </h2>
          )}
        </div>
      </PageLayout>
    </main>
  );
}
