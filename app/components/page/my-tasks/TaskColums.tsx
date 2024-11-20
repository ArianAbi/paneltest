"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../ui/button";
import {
  ChevronsUpDown,
  Circle,
  CircleCheckBig,
  CircleDashed,
  Timer,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TaskColumn = {
  title: string;
  description: string;
  status: "pending" | "not-started" | "done";
  priority: "low" | "medium" | "high";
};

const iconSize = 18;

export const taskColumns: ColumnDef<TaskColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size={"sm"}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>Status</span>
        {column.getIsSorted() === "asc" ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </Button>
    ),
    cell: ({ cell, row: { original } }) => {
      const value = cell.getValue() as string;

      const statusIcon =
        original.status === "not-started" ? (
          <CircleDashed size={iconSize} />
        ) : original.status === "pending" ? (
          <Timer size={iconSize} />
        ) : original.status === "done" ? (
          <CircleCheckBig size={iconSize} />
        ) : (
          <Circle size={iconSize} />
        );

      return (
        <div className="w-full flex gap-2 items-center pl-3">
          {statusIcon} {value}
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    header: () => (
      <Button variant="ghost" size={"sm"}>
        <span>Priority</span>
        <ChevronsUpDown size={iconSize} />
      </Button>
    ),
    cell: ({ cell, row: { original } }) => {
      const value = cell.getValue() as string;

      const PriorityIcon =
        original.priority === "low" ? (
          <ArrowDown size={iconSize} />
        ) : original.priority === "medium" ? (
          <ArrowRight size={iconSize} />
        ) : original.priority === "high" ? (
          <ArrowUp size={iconSize} />
        ) : null;

      return (
        <div className="w-full flex gap-2 items-center pl-3">
          {PriorityIcon} {value}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const Task = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
            //   onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
