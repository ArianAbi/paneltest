"use client";

import { Database } from "@/database.types";
import { createContext, ReactNode, useEffect, useState } from "react";

export const currentUserCTX = createContext<
  undefined | null | Database["public"]["Tables"]["users"]["Row"]
>(undefined);

export default function CurrectUserContext({
  children,
  user,
}: {
  children: ReactNode;
  user: Database["public"]["Tables"]["users"]["Row"] | null;
}) {
  const [currectUserState, setCurrectUserState] = useState<
    undefined | null | Database["public"]["Tables"]["users"]["Row"]
  >(undefined);

  useEffect(() => {
    if (user) {
      setCurrectUserState(user);
    }
  }, []);

  return (
    <currentUserCTX.Provider value={currectUserState}>
      {children}
    </currentUserCTX.Provider>
  );
}
