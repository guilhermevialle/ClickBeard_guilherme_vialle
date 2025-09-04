import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../constants/query-client";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
