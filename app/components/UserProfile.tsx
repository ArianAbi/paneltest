"use client";

import { Database } from "../../database.types";
import Image from "next/image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export default function UserProfile({
  user,
}: {
  user: Database["public"]["Tables"]["users"]["Row"];
}) {
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

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className="flex items-center underline cursor-pointer">
          {/* profile */}
          <div className="size-8 aspect-square">
            {
              // profile image
              user.profile_base64_img ? (
                <Image
                  alt={user.first_name + " profile picture"}
                  src={user.profile_base64_img}
                  width={50}
                  height={50}
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
          <p className="my-0 ml-2">{user.first_name}</p>
        </div>
      </HoverCardTrigger>

      <HoverCardContent>
        <div className="flex gap-1 items-center justify-between pr-4">
          {/* profile */}
          <div className="size-12">
            {
              // profile image
              user.profile_base64_img ? (
                <Image
                  alt={user.first_name + " profile picture"}
                  src={user.profile_base64_img}
                  width={50}
                  height={50}
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
          <div>
            <p className="text-lg flex items-center gap-2 flex-wrap">
              {/* first name */}
              <span>
                {user.first_name ? user.first_name : "_no_first_name_"}
              </span>
              <span>{user.last_name ? user.last_name : "_no_last_name_"}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {/* email */}
          <div>
            <span>email : </span>
            <span>{user.email}</span>
          </div>

          {/* phone */}
          <div>
            <span>phone : </span>
            <span>{user.phone}</span>
          </div>

          {/* role */}
          <div>
            <span>role : </span>
            <span>{user.role}</span>
          </div>

          {/* employee type */}
          <div>
            <span>employee type : </span>
            <span>{user.employeeType}</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
