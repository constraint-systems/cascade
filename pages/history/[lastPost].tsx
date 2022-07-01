import React, { useCallback, useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

const prefix =
  process.env.NODE_ENV === "production"
    ? "https://cascade.constraint.systems"
    : "http://localhost:3000";

export async function getServerSideProps(context: any) {
  const postCount = await fetch(prefix + "/api/postCount/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const postCountJSON = await postCount.json();
  return { props: { postCount: postCountJSON } };
}

const App = ({ postCount }) => {
  const router = useRouter();
  const { lastPost } = router.query;
  const postNum = parseInt(lastPost as string);
  const [loadedPostNum, setLoadedPostNum] = useState(lastPost);
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playingRef = useRef(null);
  const postNumRef = useRef(postNum);
  const [pageInput, setPageInput] = useState(lastPost);
  postNumRef.current = postNum;

  useEffect(() => {
    if (frameRef.current) {
      setTimeout(() => {
        frameRef.current.contentWindow.postMessage(lastPost, window.origin);
      }, 0);
    }
    setPageInput(lastPost);
  }, [lastPost]);

  useEffect(() => {
    if (isPlaying) {
      playingRef.current = setInterval(() => {
        router.push("/history/" + (postNumRef.current + 1));
      }, 800);
    } else {
      clearInterval(playingRef.current);
    }
    return () => {
      clearInterval(playingRef.current);
    };
  }, [isPlaying, playingRef]);

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    router.push("/history/" + e.target.elements.pageInput.value);
  };

  return (
    <div>
      <style>{"body { margin: 0; overflow: hidden; }"}</style>
      <div
        style={{
          height: 32,
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 3,
          justifyContent: "space-between",
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        <div>
          <Link href="/">
            <a>Cascade</a>
          </Link>{" "}
          History
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {isPlaying ? (
            <button
              onClick={() => {
                setIsPlaying(false);
              }}
            >
              pause
            </button>
          ) : (
            <button
              onClick={() => {
                setIsPlaying(true);
              }}
            >
              play
            </button>
          )}
          <button
            onClick={() => {
              router.push("/history/0");
            }}
          >{`start`}</button>
          <button
            onClick={() => {
              router.push("/history/" + (postNum - 25));
            }}
          >{`< 25`}</button>
          <button
            onClick={() => {
              router.push("/history/" + (postNum - 1));
            }}
          >{`<`}</button>
          <form onSubmit={handleForm}>
            <input
              name="pageInput"
              type="number"
              style={{ width: "6ch" }}
              value={pageInput}
              onChange={(e) => {
                setPageInput(e.target.value);
              }}
            />
          </form>
          <div>of {postCount - 1}</div>
          <button
            onClick={() => {
              router.push("/history/" + (postNum + 1));
            }}
          >{`>`}</button>
          <button
            onClick={() => {
              router.push("/history/" + (postNum + 25));
            }}
          >{`25 >`}</button>
          <button
            onClick={() => {
              router.push("/history/" + (postCount - 1));
            }}
          >{`end`}</button>
        </div>
      </div>
      <iframe
        ref={frameRef}
        src={"/raw/" + loadedPostNum}
        style={{
          width: "100%",
          border: "none",
          height: "calc(100vh - 32px)",
        }}
      ></iframe>
    </div>
  );
};

export default App;
