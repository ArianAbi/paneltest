"use client";

import { Database } from "../../database.types";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { createClient } from "@/util/supabase/SupabaseClient";
import { useEffect, useState } from "react";

export default function UserProfile({
  user,
  text = true,
  size = "small",
}: {
  user: Database["public"]["Tables"]["users"]["Row"];
  text?: boolean;
  size?: "small" | "medium" | "large";
}) {
  const [profileImg, setProfileImg] = useState<string | null>(null);

  function returnRandomBGColor() {
    const random = Math.random();

    if (random > 0 && random < 0.2) {
      return " bg-red-500 ";
    }
    if (random > 0.2 && random < 0.4) {
      return " bg-emerald-500 ";
    }
    if (random > 0.4 && random < 0.6) {
      return " bg-fuchsia-500 ";
    }
    if (random > 0.6 && random < 0.8) {
      return " bg-amber-500 ";
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
    } catch (err) {
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
    <HoverCard>
      <HoverCardTrigger>
        <div className="flex items-center underline cursor-pointer">
          {/* profile */}
          <div
            className={`aspect-square relative rounded-full overflow-hidden ${
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
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
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
          {text && <p className="my-0 ml-2">{user.first_name}</p>}
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
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
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
              <span>{user.last_name ? user.last_name : "_no_last_name_"}</span>
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
  );
}
