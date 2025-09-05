import { useAtom } from "jotai";
import { userSessionAtom } from "../contexts/atoms/user-session";

export function useUserSession() {
  const [session, setSession] = useAtom(userSessionAtom);

  const saveSession = (newSession: UserSession) => setSession(newSession);
  const clearSession = () => setSession(null);

  const updateToken = ({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) => {
    if (session) {
      setSession(() => ({
        ...session,
        session: {
          accessToken,
          refreshToken,
        },
      }));
    }
  };

  return {
    session,
    saveSession,
    clearSession,
    updateToken,
  };
}
