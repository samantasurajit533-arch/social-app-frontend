import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMoodAction } from "../pages/Redux/Post/post.action";

const MoodSelector = ({ userId }) => {

  const dispatch = useDispatch();
  const mood = useSelector(state => state.post.mood);

  const getStyle = (btnMood) => ({
    marginRight: "10px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: mood === btnMood ? "#007bff" : "#eee",
    color: mood === btnMood ? "#fff" : "#000"
  });

  return (
    <div>
      <button style={getStyle("HAPPY")} onClick={() => dispatch(setMoodAction("HAPPY", userId))}>
        😄 Happy
      </button>

      <button style={getStyle("STUDY")} onClick={() => dispatch(setMoodAction("STUDY", userId))}>
        📚 Study
      </button>

      <button style={getStyle("CODING")} onClick={() => dispatch(setMoodAction("CODING", userId))}>
        💻 Coding
      </button>
    </div>
  );
};

export default MoodSelector;