"use client";

import { Database } from "@/database.types";
import { currentUserCTX } from "@/util/CurrentUserContext";
import { createClient } from "@/util/supabase/SupabaseClient";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const notificationProvideCTX = createContext<
  null | Database["public"]["Tables"]["notifications"]["Row"][]
>(null);

export default function NotificationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const currentUser = useContext(currentUserCTX);
  const [notifs, setNotifs] = useState<
    null | Database["public"]["Tables"]["notifications"]["Row"][]
  >(null);

  const supabase = createClient();

  useEffect(() => {
    (async () => {
      if (currentUser) {
        const { data } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", currentUser.id);

        if (data) {
          setNotifs(data);
        }
      }
    })();
  }, [currentUser]);

  return (
    <notificationProvideCTX.Provider value={notifs}>
      {children}
    </notificationProvideCTX.Provider>
  );
}
