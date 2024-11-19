import { getCurrentUserFromCookieAction } from "@/util/actions/CurrentUserAction";
import { createClient } from "@/util/supabase/SupabaseServer";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const user = await getCurrentUserFromCookieAction();

  // display another ui if user is not logged in
  if (!user) {
    return <h2>Login to Proceed</h2>;
  }

  getNewTasks(user.id);

  return (
    <div>
      <h2>
        Welcome{" "}
        <span className="font-bold underline underline-offset-2">
          {user.first_name}
        </span>
      </h2>
    </div>
  );
}

async function getNewTasks(user_id: string) {
  "use server";

  const supabase = await createClient();

  const { data: _unseen_tasks } = await supabase
    .from("tasks")
    .select("id,title,seen")
    .eq("assigend_to", user_id)
    .eq("seen", false);

  if (_unseen_tasks) {
    const notifsToInsert = _unseen_tasks.map((task) => {
      return {
        user_id: user_id,
        title: task.title,
        notification_id: task.id,
        seen: task.seen,
      };
    });

    const { data: _notif_insert } = await supabase
      .from("notifications")
      .insert(notifsToInsert);

    revalidatePath("/");
  }
}
