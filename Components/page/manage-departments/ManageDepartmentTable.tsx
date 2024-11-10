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
import { PopoverClose } from "@radix-ui/react-popover";
import { Database } from "@/database.types";
import BuildingIcon from "@/icons/Building";
import { useState } from "react";
import { deleteDeparmentAction } from "@/util/actions/Admin/ManageDepartmentsActions";
import { useToast } from "@/hooks/use-toast";

type DepartmentTable = Database["public"]["Tables"]["department"]["Row"];

export default function ManageDepartmentTable({
  departments,
}: {
  departments: DepartmentTable[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  async function onDeleteSubmin(id: string) {
    try {
      setIsSubmitting(true);

      await deleteDeparmentAction(id);
      toast({
        title: "Department deleted successfully",
        className: "text-emerald-500 font-semibold",
      });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map(({ name, created_at, id }, _i) => {
            return (
              <TableRow key={_i}>
                <TableCell>{name}</TableCell>
                <TableCell>{new Date(created_at).toDateString()}</TableCell>

                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="font-semibold" variant="destructive">
                        Delete
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="w-full text-center">
                        <h4 className="text-base mt-2">
                          Delete This Department?
                        </h4>
                        <p className="text-sm text-gray-400">
                          this action could not be undone.
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
                          onSubmit={() => onDeleteSubmin(id)}
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {departments.length <= 0 && (
        <div className="w-full mt-4 text-center font-bold">
          No Departments {`:(`}
        </div>
      )}
    </div>
  );
}
