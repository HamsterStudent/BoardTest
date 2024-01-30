"use client";
import { createClient } from "@supabase/supabase-js";
import React from "react";

export default function Hamster() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const onClick = async () => {
    const { error } = await supabase
      .from("notes")
      .insert({ id: Date.now(), title: "ram" });
    console.log("hamster");
  };
  return <button onClick={onClick}>Hamster</button>;
}
