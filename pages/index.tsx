import React, { useCallback, useEffect, useState, useRef } from "react";
import Head from "next/head";
import { timeSince } from "../utils";

export type PostProps = {
  id: number;
  content: string;
  createdAt: number;
};

const App = () => {
  const [posts, setPosts] = React.useState(null);

  const refreshPosts = useCallback(async () => {
    const posts = await fetch("api/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const postsJSON = await posts.json();
    setPosts(postsJSON);
  }, [setPosts]);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  return (
    <>
      <Head>
        <title>Cascade</title>
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
          content="https://api.apiflash.com/v1/urltoimage?access_key=8869f084c4454b098ba777233e7f16b0&format=jpeg&height=800&ttl=43200&url=https%3A%2F%2Fcascade.constraint.systems&width=1200&wait_for=.page-wrapper"
        />
        <meta property="og:url" content="https://cascade.constraint.systems" />
        <meta name="twitter:card" content="summary_large_image" />

        {posts
          ? posts
              .slice()
              .reverse()
              .map((post: PostProps) => (
                <style key={post.id} type="text/css">
                  {post.content}
                </style>
              ))
          : null}
      </Head>

      {posts ? (
        <div className="page-wrapper">
          <style type="text/css" id="styleRef"></style>
          <div className="cascade-info">
            <h1 className="cascade-title">
              <span className="title-letter-0">C</span>
              <span className="title-letter-1">a</span>
              <span className="title-letter-2">s</span>
              <span className="title-letter-3">c</span>
              <span className="title-letter-4">a</span>
              <span className="title-letter-5">d</span>
              <span className="title-letter-6">e</span>
            </h1>
            <div className="cascade-description">
              An experiment in collaborative CSS. Style is determined by the
              most recent 32 posts.
            </div>
          </div>
          <div className="compose-and-posts-wrapper">
            <Compose refreshPosts={refreshPosts} />
            <div className="posts-container">
              {posts.map((post: PostProps) => (
                <div key={post.id} className={`post post-${post.id}`}>
                  <div className="post-content">
                    <span className="post-content-span">{post.content}</span>
                  </div>
                  <div className="post-timestamp">
                    <span className="post-timestamp-span">
                      {timeSince(post.createdAt)} ago
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="footer">
            <span className="footer-text-span">
              from{" "}
              <a href="https://constraint.systems" target="_blank">
                Constraint Systems
              </a>
            </span>
          </div>
        </div>
      ) : (
        <div
          className="loading-container"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="loading-text">loading...</div>
        </div>
      )}
    </>
  );
};

const Compose = ({ refreshPosts }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const styleRef = useRef(null);

  useEffect(() => {
    styleRef.current = document.querySelector("#styleRef");
  }, [styleRef]);

  const sendPost = async () => {
    if (!loading) {
      if (content.trim().length > 0) {
        setLoading(true);
        await fetch("api/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content,
          }),
        });
        refreshPosts();
        setTimeout(() => {
          setContent("");
          styleRef.current.innerText = "";
          setLoading(false);
        }, 300);
      }
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    styleRef.current.innerText = e.target.value;
  };

  return (
    <div className="compose-box">
      <div className="compose-text-container">
        <textarea
          className="compose-textarea"
          onChange={handleChange}
          value={content}
          spellCheck="false"
        ></textarea>
      </div>
      <div className="compose-button-container">
        <button
          className="compose-button"
          disabled={loading}
          onClick={sendPost}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default App;
