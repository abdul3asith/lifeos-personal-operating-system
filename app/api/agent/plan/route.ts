import { createSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { data: tasks } = await (await supabase)
    .from("tasks")
    .select("title,priority,due_date,status")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("priority", { ascending: true })
    .limit(10);

  // Day 1: stub plan (Day 2: real OpenAI Agent)
  const plan = (tasks ?? []).map((t, i) => ({
    block: i + 1,
    task: t.title,
    suggestion: "Focus block (60 min)",
  }));

  return NextResponse.json({ plan });
}