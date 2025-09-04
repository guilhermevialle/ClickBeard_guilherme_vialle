import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUserSession } from "../../hooks/use-user-session";
import PageLayout from "../../lib/components/page-layout";
import Navbar from "../navbar";

export default function SchedulePage() {
  const { session } = useUserSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session]);

  return (
    <main className="h-screen w-full bg-[#0d0d0d]">
      <PageLayout>
        <Navbar />
      </PageLayout>
    </main>
  );
}
