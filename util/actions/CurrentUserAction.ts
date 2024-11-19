"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { Database } from "@/database.types";

export const getCurrentUserFromCookieAction = cache(async () => {
  const cookie = await cookies();

  const rawCookie = cookie.get("currentUser");

  if (rawCookie && rawCookie.value) {
    return JSON.parse(
      rawCookie.value
    ) as Database["public"]["Tables"]["users"]["Row"];
  } else {
    return null;
  }
});
