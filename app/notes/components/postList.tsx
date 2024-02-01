"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function PostList({ data }: { data: any[] | null }) {
  const [postData, setPostData] = useState(JSON.stringify(data));

  return (
    <div>
      {data!.map((x, idx) => {
        return (
          <div key={x.id}>
            <Link href={`/note/${x.id}`}>
              <p>{idx + 1}</p>
              <p>{x.title}</p>
              <p>
                <span>{new Date(x.created_at).getFullYear()}</span>{" "}
                <span>{new Date(x.created_at).getMonth() + 1}</span>{" "}
                <span>{new Date(x.created_at).getDate()}</span>
              </p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
