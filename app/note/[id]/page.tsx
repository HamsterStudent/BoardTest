"use client";
import { supabase } from "@/utils/supabase/supabase";
import { UUID } from "crypto";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface IPost {
  id: UUID;
  text: string;
  title: string;
  created_at: any;
}

interface IReply {
  id: UUID;
  text: string;
  post_key: UUID;
  user: string;
}

export default function Note() {
  const router = useRouter();
  const pathnName = usePathname();
  const [post, setPost] = useState<IPost>();
  const [replyData, setReplyData] = useState<IReply[]>();
  const [reply, setReply] = useState("");
  let postId = pathnName.replace("/note/", "");

  useEffect(() => {
    getData();
    getReplyData();
  }, []);

  const getData = async () => {
    const { data, error } = await supabase
      .from("hamster")
      .select()
      .eq("id", `${postId}`);
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }
    if (data && data.length > 0) {
      setPost(data[0]);
    }
  };

  const getReplyData = async () => {
    const { data, error } = await supabase
      .from("reply")
      .select()
      .eq("post_key", `${postId}`);
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }
    if (data && data.length > 0) {
      setReplyData(data);
    }
  };

  const insertReply = async () => {
    if (!reply) return;
    const { error } = await supabase.from("reply").insert({
      id: uuidv4,
      text: reply,
      post_key: post?.id,
      user: "hamster",
    });
    setReply("");
    getReplyData();
  };

  const replyDelete = async (key: UUID) => {
    const { error } = await supabase.from("reply").delete().eq("id", key);
    getReplyData();
  };

  const postDelete = async (key: UUID) => {
    const { data } = await supabase.from("reply").delete().eq("post_key", key);
    const { error } = await supabase.from("hamster").delete().eq("id", key);

    // await supabase.storage.from("ham").remove([`public/avatar1.png`]);
    router.push("/notes");
  };

  return (
    <div>
      <h1>{post?.title}</h1>
      {post ? (
        <>
          <div
            onClick={() => {
              postDelete(post.id);
            }}
            style={{ backgroundColor: "plum" }}
          >
            PostDelete
          </div>
          <div dangerouslySetInnerHTML={{ __html: post?.text }}></div>
        </>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="reply"
      >
        <input
          type="text"
          value={reply}
          onChange={(e) => {
            setReply(e.currentTarget.value);
          }}
          placeholder="댓글"
        />
        <input type="submit" value={"전송"} onClick={insertReply} />
        {replyData
          ? replyData.map((x) => {
              return (
                <div key={x.id}>
                  {x.text}
                  <div
                    onClick={() => {
                      replyDelete(x.id);
                    }}
                    style={{ backgroundColor: "pink", display: "inline" }}
                  >
                    delete
                  </div>
                </div>
              );
            })
          : null}
      </form>
    </div>
  );
}
