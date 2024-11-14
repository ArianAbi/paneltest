import AddProject from "@/components/page/manage-projects/AddProject";
import ProjectCard from "@/components/page/manage-projects/ProjectCard";
import { createClient } from "@/util/supabase/SupabaseServer";

export default async function ManageProjects() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project")
    .select("*,project_members(*)");

  return (
    <>
      <main className="container mx-auto border border-edge2 rounded-xl p-6">
        <h3>Manage Project&apos;s</h3>

        <AddProject />
        {error ? (
          <div className="w-full mt-8 text-center text-xl italic font-semibold mb-12">
            No Projects Available
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-12">
            {data.map((project, _i) => {
              return <ProjectCard key={_i} project_data={project} />;
            })}
          </div>
        )}
      </main>
    </>
  );
}
