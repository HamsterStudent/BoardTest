"use client";
import { supabase } from "@/utils/supabase/supabase";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";

export default function Editor() {
  const router = useRouter();
  const quillRef: React.RefObject<any> = useRef(null);
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const uuid = uuidv4();

  const submitDB = async () => {
    const { error } = await supabase
      .from("hamster")
      .insert({ id: uuid, title: title, text: value });
    router.push(`/note/${uuid}`);
  };
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", async () => {
      const file = input.files![0];
      try {
        const { data, error } = await supabase.storage
          .from("ham")
          .upload(`public/${Date.now()}.jpg`, file);
        const imgUrl = supabase.storage
          .from("ham")
          .getPublicUrl(`${data?.path}`).data.publicUrl;

        if (!quillRef.current) return;
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, "image", imgUrl);
        editor.setSelection(range.index + 1);
        if (error) {
          console.error("Supabase Storage 업로드 오류:", error.message);
        } else {
          console.log("Supabase Storage에 성공적으로 업로드되었습니다.", data);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { align: [] }],
          ["image"],
        ],
        handlers: { image: imageHandler },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "image",
  ];

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="타이틀"
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
        />
      </div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        modules={modules}
        formats={formats}
        onChange={setValue}
      />
      <button onClick={submitDB}>submit</button>
    </div>
  );
}
