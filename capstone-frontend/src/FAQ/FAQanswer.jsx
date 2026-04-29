import { useState, useEffect } from "react";
import { createAnswer, getQuestion } from "../api/FAQ";
import { useAuth } from "../auth/AuthContext";
import { useParams } from "react-router";

export default function FAQAnswer() {
  const { id } = useParams(); // NOTE: now it's FAQ id
  const [answer, setAnswer] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const q = await getQuestion(id);
        setQuestionText(q?.question ?? "");
        setError("");
      } catch (err) {
        console.error("Failed to load question:", err);
        setError(err?.message || String(err));
        setQuestionText("");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

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

      <div style={{ marginBottom: "1rem" }}>
        {loading ? (
          <p><em>Loading question...</em></p>
        ) : error ? (
          <p style={{ color: "red" }}>Error loading question: {error}</p>
        ) : (
          <p><strong>Q:</strong> {questionText}</p>
        )}
      </div>

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
