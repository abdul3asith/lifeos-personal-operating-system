import { createSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();

  const formData = await request.formData();
  const title = String(formData.get("title") || "").trim();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!title) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title,
    status: "pending",
    priority: 3,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}