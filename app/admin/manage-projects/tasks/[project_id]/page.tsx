import AddTask from "@/app/components/page/manage-projects/tasks/AddTask";
import TasksTable from "@/app/components/page/manage-projects/tasks/TasksTable";
import { createClient } from "@/util/supabase/SupabaseServer";

export default async function ManageTasks({
  params: { project_id },
}: {
  params: { project_id: string };
}) {
  const supabase = await createClient();

  const { data: _tasks, error: _tasks_error } = await supabase
    .from("tasks")
    .select(
      `*,
      project_id(*),
      assigend_to(*),
      department(id,name)`
    )
    .eq("project_id", project_id);

  const { data: project_name } = await supabase
    .from("project")
    .select("title")
    .eq("id", project_id)
    .single();

  return (
    <main className="container mx-auto border border-edge2 rounded-xl p-6">
      <h3>{project_name ? project_name.title : "_failed_to_get_the_name_"}</h3>

      <AddTask project_id={project_id} />
      <TasksTable tasks={_tasks} />
    </main>
  );
}
