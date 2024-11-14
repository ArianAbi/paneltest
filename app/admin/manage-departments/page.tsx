import AddDeparment from "@/components/page/manage-departments/AddDeparment";
import ManageDepartmentTable from "@/components/page/manage-departments/ManageDepartmentTable";
import { createClient } from "@/util/supabase/SupabaseServer";

export default async function ManageDepartments() {
  const supabase = await createClient();

  const { data: _departments, error: _department_error } = await supabase
    .from("department")
    .select("*");

  if (_department_error) {
    throw _department_error.message;
  }

  return (
    <>
      <main className="container mx-auto border border-edge2 rounded-xl p-6">
        <h3>Manage Department&apos;s</h3>

        <AddDeparment />
        <ManageDepartmentTable departments={_departments} />
      </main>
    </>
  );
}
