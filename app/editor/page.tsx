"use client";
import { supabase } from "@/utils/supabase/supabase";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";

export default function Editor() {
  const [value, setValue] = useState("");
  const uuid = uuidv4();
  console.log(uuid);
  const submitDB = async () => {
    const { error } = await supabase
      .from("hamster")
      .insert({ id: uuid, text: value });
  };

  return (
    <div>
      <ReactQuill theme="snow" value={value} onChange={setValue} />
      <button onClick={submitDB}>submit</button>
    </div>
  );
}
