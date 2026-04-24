import { useState } from "react";
import { createAnswer } from "../api/FAQ";
import { useAuth } from "../auth/AuthContext";
import { useParams } from "react-router";

export default function FAQAnswer() {
  const { id } = useParams(); // NOTE: now it's FAQ id
  const [answer, setAnswer] = useState("");
  const { token } = useAuth();

  const handlePostAnswer = async () => {
    if (!token) {
      alert("You must be logged in to post an answer.");
      return;
    }

    if (!answer.trim()) return;

    try {
      await createAnswer(id, answer, token);

      setAnswer("");
      alert("Answer posted!");
    } catch (error) {
      console.error("Error posting answer:", error);
    }
  };

  return (
    <div>
      <h2>Answer FAQ</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePostAnswer();
        }}
      >
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
