import { useState, useRef, useEffect } from "react";

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

export default Compose;
