"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import UserProfile from "@/app/components/UserProfile";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/app/components/ui/hover-card";
import { Database } from "@/database.types";

export default function TasksTable({
  tasks,
}: {
  tasks: Database["public"]["Tables"]["tasks"]["Row"][] | null;
}) {
  if (!tasks) {
    return (
      <p className="my-8 text-xl italic w-full text-center">
        No Tasks Are Assigned
      </p>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead className="w-[300px]">
              Description - (
              <span className="text-xs italic mx-0.5">
                hover for full display
              </span>
              )
            </TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, _i) => {
            return (
              <TableRow key={_i}>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <HoverCard>
                    <HoverCardTrigger>
                      <span className="line-clamp-1 overflow-hidden">
                        {task.description}
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent>{task.description}</HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  {/* @ts-expect-error: need to adjust the type chack later */}
                  <UserProfile user={task.assigend_to} />
                </TableCell>
                <TableCell>
                  <span
                    className={`font-semibold rounded-full ${
                      task.status === "pending"
                        ? "text-amber-400"
                        : task.status === "done"
                        ? "text-emerald-400"
                        : "text-white"
                    }`}
                  >
                    {task.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1.5 font-semibold rounded-full ${
                      task.priority === "high"
                        ? "bg-red-700"
                        : task.priority === "medium"
                        ? "bg-yellow-700"
                        : "bg-cyan-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </TableCell>
                <TableCell>{task.deadline}</TableCell>
                {/* @ts-expect-error: need to adjust the type chack later */}
                <TableCell>{task.department.name}</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
