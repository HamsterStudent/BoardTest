import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Hamster from "./components/hamster";

export default async function Notes() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.from("hamster").select();
  return (
    <div>
      {JSON.stringify(data, null, 2)}
      <Hamster />
    </div>
  );
}
