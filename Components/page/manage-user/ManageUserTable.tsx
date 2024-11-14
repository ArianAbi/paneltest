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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdminDeleteAccount } from "@/util/actions/Admin/ManageUserActions";
import { PopoverClose } from "@radix-ui/react-popover";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/database.types";
import { useRouter } from "next/navigation";
// import AdminEditUser from "./AdminEditUser";
import TrashIcon from "@/icons/Trash";

export default function ManageUserTable({
  users,
}: {
  users: Database["public"]["Tables"]["users"]["Row"][] | null;
}) {
  const router = useRouter();

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

      router.refresh();
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!users) {
    return (
      <p className="my-8 text-xl italic w-full text-center">
        No Users Could be Fetched
      </p>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Employee Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, _i) => {
            if (!user) {
              return;
            }

            return (
              <TableRow key={_i}>
                <TableCell>
                  {user.first_name ? user.first_name : "_unnamed_"}
                </TableCell>
                <TableCell>
                  {user.last_name ? user.last_name : "_unnamed_"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.phone ? user.phone : "_not_provided_"}
                </TableCell>
                <TableCell
                  className={
                    user.role === "admin" ? "text-emerald-500 font-bold" : ""
                  }
                >
                  {user.employeeType}
                </TableCell>

                <TableCell className="flex">
                  {user.role !== "admin" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="font-semibold" variant="destructive">
                          <TrashIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="w-full text-center">
                          <h4 className="text-base mt-2">
                            Delete {user.first_name + " " + user.last_name}?
                          </h4>
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

                  {/* <AdminEditUser user={user} /> */}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
