import { atomWithStorage } from "jotai/utils";

export const userSessionAtom = atomWithStorage<UserSession | null>(
  "userSession",
  null,
);
