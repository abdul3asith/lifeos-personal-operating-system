import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) redirect("/login");

  const { data: tasks, error } = await (await supabase)
    .from("tasks")
    .select("id,title,status,priority,due_date,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <form action="/api/logout" method="post">
          <button className="text-sm underline opacity-80">Logout</button>
        </form>
      </header>

      <div className="mt-6 border rounded-xl p-4">
        <h2 className="font-medium">Add task</h2>
        <form action="/api/tasks/create" method="post" className="mt-3 flex gap-2">
          <input
            name="title"
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="e.g., Build Day Plan Agent"
            required
          />
          <button className="border rounded-lg px-3 py-2 font-medium">
            Add
          </button>
        </form>
      </div>

      <div className="mt-6">
        <h2 className="font-medium">Your tasks</h2>
        <div className="mt-3 space-y-2">
          {(tasks ?? []).map((t) => (
            <div key={t.id} className="border rounded-xl p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{t.title}</p>
                <span className="text-xs opacity-70">
                  P{t.priority} • {t.status}
                </span>
              </div>
              {t.due_date && (
                <p className="text-xs opacity-70 mt-1">Due: {t.due_date}</p>
              )}
            </div>
          ))}
          {(tasks ?? []).length === 0 && (
            <p className="text-sm opacity-70">No tasks yet. Add one above.</p>
          )}
        </div>
      </div>

      <div className="mt-6 border rounded-xl p-4">
        <h2 className="font-medium">Agent</h2>
        <form action="/api/agent/plan" method="post" className="mt-3">
          <button className="border rounded-lg px-3 py-2 font-medium">
            Generate Today’s Plan (stub)
          </button>
        </form>
      </div>
    </div>
  );
}