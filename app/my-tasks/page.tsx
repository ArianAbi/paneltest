import { getCurrentUserFromCookieAction } from "@/util/actions/CurrentUserAction";
import { createClient } from "@/util/supabase/SupabaseServer";
import { DataTable } from "../components/ui/DataTable";
import { taskColumns } from "../components/page/my-tasks/TaskColums";

export default async function TicketsPage() {
  const supabase = await createClient();
  const currentUser = await getCurrentUserFromCookieAction();

  if (!currentUser) {
    throw "failed to get needed data";
  }

  const { data: _tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("assigend_to", currentUser.id);

  return (
    <div className="container mx-auto border border-edge2 rounded-xl p-6 flex flex-col justify-center items-center overflow-x-scroll md:overflow-x-auto">
      <h3>My Tickets</h3>

      {_tasks && <DataTable columns={taskColumns} data={_tasks} />}
    </div>
  );
}
