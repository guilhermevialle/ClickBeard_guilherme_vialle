import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useUserSession } from "../hooks/use-user-session";
import { refreshToken } from "../services/api/token";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, updateToken, clearSession } = useUserSession();

  const tokenMutation = useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => updateToken(data),
    onError: () => {
      clearSession();
    },
  });

  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      tokenMutation.mutate();
    }, 3600 * 1000);

    return () => clearInterval(interval);
  }, [session]);

  return <>{children}</>;
}
