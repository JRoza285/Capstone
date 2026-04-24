import { useEffect, useState } from "react";
import { getQuestions, createQuestion } from "../api/FAQ";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");

  // --------------------
  // Load FAQs
  // --------------------
  const syncFaqs = async () => {
    try {
      const data = await getQuestions();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => {
    syncFaqs();
  }, []);

  // --------------------
  // Post question
  // --------------------
  const handlePostQuestion = async () => {
    console.log("🔥 HANDLE POST FIRED");

    if (!newQuestion.trim()) {
      console.log("❌ Empty question blocked");
      return;
    }

    try {
      await createQuestion(newQuestion);

      setNewQuestion("");
      syncFaqs();

      console.log("✅ Question posted");
    } catch (error) {
      console.error("Error posting question:", error);
    }
  };

  return (
    <div>
      <h1>FAQ</h1>

      {/* ASK QUESTION */}
      <h2>Ask a Question</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePostQuestion();
        }}
      >
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Enter your question"
        />
        <button type="submit">Submit</button>
      </form>

      {/* FAQ LIST */}
      <h2>Questions</h2>

      <div>
        {faqs.map((faq) => (
          <div key={faq.id} style={{ marginBottom: "1rem" }}>
            <p><strong>Q:</strong> {faq.question}</p>

            {/* ANSWER */}
            {faq.answer ? (
              <p><strong>A:</strong> {faq.answer}</p>
            ) : (
              <p><em>Waiting for answer...</em></p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}