import { createContext } from "react";

export const UserContext = createContext({
  user: { id: undefined, role: undefined, user: undefined },
  setUser: () => {},
});
