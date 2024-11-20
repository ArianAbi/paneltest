// import { Database } from "@/database.types";
// import { createClient } from "@/util/supabase/SupabaseServer";
// import { TableCell, TableRow } from "../../ui/table";
// import { Circle, CircleCheckBig, CircleDashed, Timer } from "lucide-react";

// export default async function Task({
//   task,
// }: {
//   task: Database["public"]["Tables"]["tasks"]["Row"];
// }) {
export default async function Task() {
  return null;
  // const supabase = await createClient();

  // const iconSize = 18;

  // const deadlineData = task.deadline
  //   ? new Date(task.deadline).toDateString()
  //   : "_unset_";

  // const { data: project } = await supabase
  //   .from("project")
  //   .select("*")
  //   .eq("id", task.project_id)
  //   .single();

  // const StatusIcon =
  //   task.status === "not-started" ? (
  //     <CircleDashed size={iconSize} />
  //   ) : task.status === "pending" ? (
  //     <Timer size={iconSize} />
  //   ) : task.status === "done" ? (
  //     <CircleCheckBig size={iconSize} />
  //   ) : (
  //     <Circle size={iconSize} />
  //   );

  // const PriorityIcon =
  //   task.status === "not-started" ? (
  //     <CircleDashed size={iconSize} />
  //   ) : task.status === "pending" ? (
  //     <Timer size={iconSize} />
  //   ) : task.status === "done" ? (
  //     <CircleCheckBig size={iconSize} />
  //   ) : (
  //     <Circle size={iconSize} />
  //   );
  // return (
  //   <TableRow>
  //     <TableCell>{task.title}</TableCell>
  //     <TableCell>{task.description}</TableCell>
  //     <TableCell>
  //       <div className="flex items-center gap-2 pl-2.5 w-full">
  //         {StatusIcon} {task.status}
  //       </div>
  //     </TableCell>
  //     <TableCell>
  //       <div className="flex items-center gap-2 pl-2.5 w-full">
  //         {PriorityIcon} {task.priority}
  //       </div>
  //     </TableCell>
  //   </TableRow>
  // );
}
