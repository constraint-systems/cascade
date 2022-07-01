import React, { useCallback, useEffect, useState, useRef } from "react";
import Head from "next/head";
import { timeSince } from "../utils";
import { useRouter } from "next/dist/client/router";

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
  postNumRef.current = postNum;

  useEffect(() => {
    if (frameRef.current) {
      setTimeout(() => {
        frameRef.current.contentWindow.postMessage(lastPost, window.origin);
      }, 0);
    }
  }, [lastPost]);

  useEffect(() => {
    if (isPlaying) {
      playingRef.current = setInterval(() => {
        router.push("/history/" + (postNumRef.current + 1));
      }, 600);
    } else {
      clearInterval(playingRef.current);
    }
  }, [isPlaying, playingRef]);

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
        <div>History</div>
        <div style={{ display: "flex", gap: 8 }}>
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
              router.push("/history/" + (postNum - 25));
            }}
          >{`< 25`}</button>
          <button
            onClick={() => {
              router.push("/history/" + (postNum - 1));
            }}
          >{`<`}</button>
          <form>
            <input type="number" value={lastPost} />
          </form>
          <div>of {postCount}</div>
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
