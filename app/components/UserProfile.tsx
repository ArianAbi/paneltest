"use client";

import { Database } from "../../database.types";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { createClient } from "@/util/supabase/SupabaseClient";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function UserProfile({
  user,
  text = true,
  size = "small",
  absoluteText = false,
}: {
  user: Database["public"]["Tables"]["users"]["Row"];
  text?: boolean;
  size?: "small" | "medium" | "large";
  absoluteText?: boolean;
}) {
  const [profileImg, setProfileImg] = useState<string | null>(null);

  function returnRandomBGColor() {
    // Remove hyphens from the UUID for simplicity
    const strippedUuid = user.id.replace(/-/g, "");

    // Convert the UUID (hexadecimal) into a BigInt
    const bigintValue = BigInt("0x" + strippedUuid);

    // Calculate the maximum possible value for a UUID (128 bits)
    const maxUuidValue = BigInt("0xffffffffffffffffffffffffffffffff");

    // Normalize the BigInt value to a floating-point number between 0 and 1
    const random = Number(bigintValue) / Number(maxUuidValue);

    if (random > 0 && random < 0.1) {
      return " bg-red-500 ";
    }
    if (random > 0.1 && random < 0.2) {
      return " bg-blue-700 ";
    }
    if (random > 0.2 && random < 0.4) {
      return " bg-emerald-500 ";
    }
    if (random > 0.4 && random < 0.5) {
      return " bg-fuchsia-500 ";
    }
    if (random > 0.5 && random < 0.6) {
      return " bg-rose-700 ";
    }
    if (random > 0.6 && random < 0.7) {
      return " bg-rose-700 ";
    }
    if (random > 0.7 && random < 0.8) {
      return " bg-green-700 ";
    }
    if (random > 0.8) {
      return " bg-cyan-500 ";
    }
  }

  const randomColor = returnRandomBGColor();

  const supabase = createClient();

  async function getUserProfile() {
    try {
      if (user.profile_picture_path) {
        const { data } = await supabase.storage
          .from("profile_pictures")
          .createSignedUrl(user.profile_picture_path, 7);

        if (data && data.signedUrl) {
          return data.signedUrl;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (err: any) {
      console.log(err);
      return null;
    }
  }

  useEffect(() => {
    (async () => {
      const _img = await getUserProfile();

      setProfileImg(_img);
    })();
  }, [user]);

  return (
    <div key={user.id}>
      <HoverCard>
        <HoverCardTrigger>
          <div
            className={`flex items-center underline cursor-pointer relative transition-all ${
              absoluteText ? (text === true ? "w-40" : "w-[38px]") : ""
            }`}
          >
            {/* profile */}
            <div
              className={`aspect-square relative rounded-full overflow-hidden transition-all  ${
                size === "small"
                  ? "size-8"
                  : size === "medium"
                  ? "size-12"
                  : "size-20"
              }`}
            >
              {
                // profile image
                profileImg ? (
                  <Image
                    alt={user.first_name + " profile picture"}
                    src={profileImg}
                    placeholder={"blur"}
                    blurDataURL={
                      user.profile_base64_img ? user.profile_base64_img : ""
                    }
                    width={150}
                    height={150}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  // default image
                  <div
                    className={
                      `size-full rounded-full flex items-center justify-center ` +
                      randomColor
                    }
                  >
                    {user.first_name &&
                      user.last_name &&
                      user.first_name.charAt(0).toUpperCase() +
                        user.last_name.charAt(0).toUpperCase()}
                  </div>
                )
              }
            </div>
            {absoluteText && (
              <AnimatePresence>
                {text && (
                  <motion.p
                    transition={{ duration: "0.2" }}
                    initial={{ opacity: 0, left: "-3rem" }}
                    animate={{ opacity: 1, left: "2.5rem" }}
                    exit={{ opacity: 0, left: "-3rem" }}
                    className="my-0 ml-2 absolute top-2/4 -translate-y-2/4 left-10"
                  >
                    {user.first_name}
                  </motion.p>
                )}
              </AnimatePresence>
            )}

            {!absoluteText && text && (
              <motion.p
                transition={{ duration: "0.2" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="my-0 ml-2"
              >
                {user.first_name}
              </motion.p>
            )}
          </div>
        </HoverCardTrigger>

        <HoverCardContent>
          <div className="flex flex-col gap-1 items-center justify-between pr-4">
            {/* profile */}
            <div className="size-24 rounded-full overflow-hidden aspect-square">
              {
                // profile image
                profileImg ? (
                  <Image
                    alt={user.first_name + " profile picture"}
                    src={profileImg}
                    placeholder={"blur"}
                    blurDataURL={
                      user.profile_base64_img ? user.profile_base64_img : ""
                    }
                    width={150}
                    height={150}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                ) : (
                  // default image
                  <div
                    className={
                      `size-full rounded-full flex items-center justify-center` +
                      randomColor
                    }
                  >
                    {user.first_name &&
                      user.last_name &&
                      user.first_name.charAt(0).toUpperCase() +
                        user.last_name.charAt(0).toUpperCase()}
                  </div>
                )
              }
            </div>

            {/* name */}
            <div className="flex flex-col w-full items-center justify-center gap-1">
              <p className="text-lg mb-0 flex items-center gap-2 flex-wrap">
                {/* first name */}
                <span>
                  {user.first_name ? user.first_name : "_no_first_name_"}
                </span>
                <span>
                  {user.last_name ? user.last_name : "_no_last_name_"}
                </span>
              </p>

              <span className="w-full text-center text-sm italic text-gray-400">
                {user.email}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {/* phone */}
            <div>
              <span>{user.phone}</span>
            </div>

            {/* role */}
            <div>
              <span
                className={`px-3 py-1 rounded-full font-semibold ${
                  user.role === "admin" ? "bg-emerald-600" : "bg-cyan-600"
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* employee type */}
            <div>
              <span
                className={`px-3 py-1 rounded-full font-semibold bg-amber-600`}
              >
                {user.employeeType}
              </span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
