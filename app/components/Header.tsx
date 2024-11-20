"use client";

import { signOutAction } from "@/util/actions/GeneralActions";
import { Button } from "./ui/button";
import Link from "next/link";
import { Database } from "@/database.types";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import BellIcon from "@/icons/Bell";
import { useContext, useEffect, useState } from "react";
import { notificationProvideCTX } from "./ContextProvider/Notification/NotificationProvider";
import Notification from "./Notifications";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function Header({
  user,
}: {
  user: Database["public"]["Tables"]["users"]["Row"] | null;
}) {
  const useCTXNotifications = useContext(notificationProvideCTX);

  const [notifications, setNotifications] = useState<null | any[]>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [hasUnseenNotif, setHasUnseenNotif] = useState(false);

  useEffect(() => {
    if (useCTXNotifications) {
      setNotifications(useCTXNotifications);

      setHasUnseenNotif(
        useCTXNotifications.some((notif) => notif.seen === false)
      );
    }
  }, [useCTXNotifications]);

  return (
    <>
      <header className="h-[70px] border-b-2 border-edge px-5 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!user && (
            <>
              <Button className="font-semibold" asChild>
                <Link href={"/login"}>Login</Link>
              </Button>
              <Button variant={"ghost"} className="font-semibold">
                <Link href={"/register"}>Register</Link>
              </Button>
            </>
          )}

          {user && (
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="border-2 font-semibold border-gray-400 rounded-xl px-3 h-full hover:bg-gray-100 hover:border-gray-100 hover:text-black transition-colors"
                >
                  Logout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>
                  <p>Are You Sure?</p>
                </DialogTitle>

                <div className="w-full flex gap-2 items-center justify-between mt-4">
                  <DialogClose asChild>
                    <Button variant="ghost" className="w-full" type="button">
                      Cancle
                    </Button>
                  </DialogClose>

                  <form
                    className="inline border-none w-full"
                    action={signOutAction}
                  >
                    <Button
                      variant="destructive"
                      type="submit"
                      className="w-full font-semibold"
                    >
                      Logout
                    </Button>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* notifications */}
        <HoverCard
          open={notificationOpen}
          onOpenChange={(open) => setNotificationOpen(open)}
        >
          <HoverCardTrigger>
            <button
              onClick={() => setNotificationOpen((prev) => !prev)}
              disabled={!notifications}
              className="relative aspect-square size-10 border border-white rounded-xl flex items-center justify-center cursor-pointer transition-all hover:bg-[#2a2a2a] hover:scale-110 disabled:bg-gray-600 disabled:brightness-50 disabled:hover:scale-100"
            >
              {/* unseen notification badge */}
              {hasUnseenNotif && (
                <motion.div
                  initial={{ opacity: 0.2, scale: 0 }}
                  animate={{ opacity: 1, scale: [3, 1] }}
                  className="absolute size-3 -right-0.5 -top-0.5 bg-red-500 border-2 border-red-400 rounded-full"
                ></motion.div>
              )}

              <BellIcon />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="px-0 py-0 divide-y bg-[#151515] border-edge2 divide-gray-500 overflow-hidden">
            {notifications &&
              notifications.map((notif) => {
                return (
                  <Notification
                    title={notif.title}
                    description={notif.description}
                    key={notif.notification_id}
                  />
                );
              })}
          </HoverCardContent>
        </HoverCard>
      </header>
    </>
  );
}
