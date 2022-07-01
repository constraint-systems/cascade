import React, { useCallback, useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

const prefix =
  process.env.NODE_ENV === "production"
    ? "https://cascade.constraint.systems"
    : "http://localhost:3000";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(min, value), max);
}

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
  const [headerHeight, setHeaderHeight] = useState(32);
  const headerRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const handleResize = () => {
      const box = headerRef.current.getBoundingClientRect();
      setHeaderHeight(box.height);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [headerRef]);

  const handleForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlaying(false);
    // @ts-ignore
    const clamped = clamp(e.target.elements.pageInput.value, 0, postCount);
    setPageInput(clamped.toString());
    router.push("/history/" + clamped);
  };

  const pushClamped = (value: number) => {
    setIsPlaying(false);
    const clamped = clamp(value, 0, postCount);
    router.push("/history/" + clamped);
  };

  return (
    <div>
      <Head>
        <title>Cascade History {postNum}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="An experiment in collaborative CSS. Style is determined by the most recent 32 posts."
        />
        <meta property="og:title" content="Cascade" />
        <meta
          property="og:description"
          content="An experiment in collaborative CSS. Style is determined by the most recent 32 posts."
        />
        <meta
          property="og:image"
          content={
            "https://api.apiflash.com/v1/urltoimage?access_key=8869f084c4454b098ba777233e7f16b0&format=jpeg&height=800&ttl=43200&url=https%3A%2F%2Fcascade.constraint.systems%2Fraw%2f" +
            postNum +
            "&width=1200&wait_for=.page-wrapper"
          }
        />
        <meta property="og:url" content="https://cascade.constraint.systems" />
        <meta name="twitter:card" content="summary_large_image" />
        <style>{"body { margin: 0; overflow: hidden; }"}</style>
      </Head>

      <div
        ref={headerRef}
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 3,
          justifyContent: "center",
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        <div
          style={{
            height: 32,
            display: "flex",
            alignItems: "center",
            gap: "1ch",
          }}
        >
          <Link href="/">
            <a>Cascade</a>
          </Link>{" "}
          <div>History</div>
        </div>
        <div
          style={{
            height: 32,
            display: "flex",
            alignItems: "center",
            gap: "1ch",
            flexGrow: 1,
            justifyContent: headerHeight > 32 ? "end" : "center",
          }}
        >
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
        </div>
        <div
          style={{
            height: 32,
            display: "flex",
            gap: "1ch",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => {
              pushClamped(0);
            }}
          >{`0`}</button>
          <button
            onClick={() => {
              pushClamped(postNum - 25);
            }}
          >{`< 25`}</button>
          <button
            onClick={() => {
              pushClamped(postNum - 1);
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
          <div>of {postCount}</div>
          <button
            onClick={() => {
              pushClamped(postNum + 1);
            }}
          >{`>`}</button>
          <button
            onClick={() => {
              pushClamped(postNum + 25);
            }}
          >{`25 >`}</button>
          <button
            onClick={() => {
              pushClamped(postCount);
            }}
          >
            {postCount}
          </button>
        </div>
      </div>
      <iframe
        ref={frameRef}
        src={"/raw/" + loadedPostNum}
        style={{
          width: "100%",
          border: "none",
          height: "calc(100vh - " + headerHeight + "px)",
        }}
      ></iframe>
    </div>
  );
};

export default App;
