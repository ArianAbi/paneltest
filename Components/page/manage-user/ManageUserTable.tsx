"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProfilesType } from "@/types/user";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@supabase/supabase-js";
import { AdminDeleteAccount } from "@/util/actions/Admin/ManageUserActions";
import { PopoverClose } from "@radix-ui/react-popover";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { revalidatePath } from "next/cache";

interface Data {
  user: User;
  profile: ProfilesType;
}

export default function ManageUserTable({ user }: { user: Data[] }) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function onDeleteSubmit(id: string) {
    try {
      setIsSubmitting(true);

      await AdminDeleteAccount(id);
      toast({
        title: "user deleted successfully",
        className: "text-emerald-500 font-semibold",
      });

      // revalidatePath("/admin/manage-user");
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setPopoverOpen(false);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Employee Type</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user.map(({ user, profile }, _i) => {
            if (!profile) {
              return;
            }

            return (
              <TableRow key={_i}>
                <TableCell>
                  {profile.name ? profile.name : "_unnamed_"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell
                  className={
                    profile.role === "admin" ? "text-emerald-500 font-bold" : ""
                  }
                >
                  {profile.employeeType}
                </TableCell>

                <TableCell>
                  {profile.role !== "admin" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="font-semibold" variant="destructive">
                          Delete
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="w-full text-center">
                          <h4 className="text-base mt-2">Delete This User?</h4>
                          <p className="text-sm text-gray-400">
                            this action could not be undone
                          </p>
                        </div>

                        <div className="w-full flex gap-2 items-center font-semibold justify-between mt-4">
                          <PopoverClose asChild>
                            <Button className="w-full" variant={"default"}>
                              Cancel
                            </Button>
                          </PopoverClose>
                          <form
                            className="w-full"
                            onSubmit={() => onDeleteSubmit(user.id)}
                          >
                            <Button
                              type="submit"
                              className={`w-full disabled:saturate-50 ${
                                isSubmitting ? "animate-pulse" : ""
                              }`}
                              variant={"destructive"}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Deleting" : "Delete"}
                            </Button>
                          </form>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
