"use client";

import { Database } from "@/database.types";
import { createContext, ReactNode, useEffect, useState } from "react";
import { createClient } from "./supabase/SupabaseClient";

export const currectUserCTX = createContext<
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
    <currectUserCTX.Provider value={currectUserState}>
      {children}
    </currectUserCTX.Provider>
  );
}
