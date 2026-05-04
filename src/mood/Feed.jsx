import React from "react";
import { useSelector } from "react-redux";

const Feed = () => {

  const { posts, loading } = useSelector(state => state.post);

  return (
    <div>
      <h2>Feed</h2>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        posts.map(post => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              margin: "10px",
              borderRadius: "10px"
            }}
          >
            <p>{post.content}</p>
            <small>{post.tags}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;