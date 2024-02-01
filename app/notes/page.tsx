import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Hamster from "./components/hamster";
import { useState } from "react";
import PostList from "./components/postList";
import Link from "next/link";

export default async function Notes() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("hamster").select();

  return (
    <div>
      <PostList data={data} />
      <Link href={`/editor`}>글쓰기</Link>
    </div>
  );
}
