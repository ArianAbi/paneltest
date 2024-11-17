"use client";

import { Database } from "@/database.types";
import { createClient } from "@/util/supabase/SupabaseClient";
import { createContext, useEffect, useState } from "react";

export const allUsersContext = createContext<
  Database["public"]["Tables"]["users"]["Row"][] | null
>(null);

export default function AdminUsersListContext({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseAdmin = createClient();

  const [allUsers, setAllUsers] = useState<
    null | Database["public"]["Tables"]["users"]["Row"][]
  >(null);

  async function checkForAdminRole() {
    try {
      const {
        data: { user },
        error: user_error,
      } = await supabaseAdmin.auth.getUser();

      if (!user) {
        throw "not logged in";
      }

      if (user_error) {
        throw user_error.message;
      }

      const { data: public_user, error: public_user_error } =
        await supabaseAdmin
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

      if (!public_user || public_user_error) {
        throw "user could not be fetched";
      }

      if (public_user.role !== "admin") {
        throw "user does not have permission";
      }

      return true;
    } catch (err: any) {
      console.log(err);
      return false;
    }
  }

  async function fetchUsersAndProfiles() {
    try {
      const { data: _user, error: _users_error } = await supabaseAdmin
        .from("users")
        .select("*");

      if (_users_error) {
        throw _users_error.message;
      }

      return _user;
    } catch (err: any) {
      console.log(err.message);
      throw err.message;
    }
  }

  useEffect(() => {
    (async () => {
      const hasPermission = await checkForAdminRole();

      if (hasPermission) {
        const users = await fetchUsersAndProfiles();

        setAllUsers(users);
      }
    })();
  }, []);

  return (
    <allUsersContext.Provider value={allUsers}>
      {children}
    </allUsersContext.Provider>
  );
}
