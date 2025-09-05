import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserSession } from "../../hooks/use-user-session";
import PageLayout from "../../lib/components/page-layout";
import { getAllSpecialties } from "../../services/api/specialty";
import Navbar from "../navbar";
import ScheduleModal from "../schedule-modal";

const WEEK_DAYS = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
];

const today = new Date();
const todayWeekday = today.getDay();

export default function SchedulePage() {
  const { session } = useUserSession();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryFn: getAllSpecialties,
    queryKey: ["specialties"],
  });

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session]);

  return (
    <main className="h-screen w-full bg-[#0d0d0d]">
      <div className="absolute z-0 h-full w-full bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px]"></div>
      <PageLayout>
        <Navbar />
        <div className="relative flex h-full w-full items-center justify-center gap-28 py-32">
          <div className="h-fit w-96 rounded-3xl bg-[#1d1d1d] px-6 py-4">
            <h3 className="text-lg font-semibold tracking-tight text-neutral-200">
              Dias de atendimento
            </h3>

            <div className="mt-5 flex flex-col gap-3">
              {Array.from({
                length: 7,
              }).map((_, index) => {
                return (
                  <div
                    key={index}
                    className="flex w-full items-center justify-between px-3"
                  >
                    <div>
                      <p className="font-medium tracking-tight text-neutral-300">
                        {WEEK_DAYS[index]}
                        {index === todayWeekday && (
                          <span className="ml-2 rounded-full bg-blue-800/20 px-3 py-1 text-sm font-semibold tracking-tight text-blue-400">
                            Hoje
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="font-medium tracking-tight text-neutral-400">
                      08:00 - 18:00
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="size-96 rounded-3xl bg-[#1d1d1d]">
            <h3 className="px-6 py-4 text-lg font-semibold tracking-tight text-neutral-200">
              Selecione um serviço disponível
            </h3>
            {data && <ScheduleModal specialties={data} />}
          </div>
        </div>
      </PageLayout>
    </main>
  );
}
