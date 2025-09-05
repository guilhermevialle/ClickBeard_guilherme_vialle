import { useQuery } from "@tanstack/react-query";
import PageLayout from "../../lib/components/page-layout";
import { getAllAppointments } from "../../services/api/appointment";
import AppointmentCard from "../appointment-card";
import Navbar from "../navbar";

export default function AppointmentsPage() {
  const { data: appointments } = useQuery({
    queryFn: getAllAppointments,
    queryKey: ["customer-appointments"],
  });

  return (
    <main className="h-screen w-full bg-[#0d0d0d]">
      <div className="absolute z-0 h-full w-full bg-[radial-gradient(#1d1d1d_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px]"></div>
      <PageLayout>
        <Navbar />
        <div className="flex h-full w-full flex-wrap items-center justify-center gap-5 overflow-y-auto py-32">
          {appointments &&
            appointments.map((ap) => (
              <AppointmentCard key={ap.id} appointment={ap} />
            ))}
        </div>
      </PageLayout>
    </main>
  );
}
