import { useEffect, useState } from "react";
import { getQuestions, getAnswers, createQuestion } from "../api/FAQ";
import { useAuth } from "../auth/AuthContext";

export default function FAQ() {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [newQuestion, setNewQuestion] = useState("");
    const { token } = useAuth();

    const syncQuestions = async () => {
        try {
            const fetchedQuestions = await getQuestions();
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const syncAnswers = async (question_id) => {
        try {
            const fetchedAnswers = await getAnswers(question_id);
            setAnswers((prev) => ({ ...prev, [question_id]: fetchedAnswers }));
        } catch (error) {
            console.error("Error fetching answers:", error);
        }
    };

const handlePostQuestion = async () => {
    console.log("🔥 HANDLE POST FIRED");

    if (!newQuestion.trim()) {
        console.log("❌ Empty question blocked");
        return;
    }

    console.log("📤 Sending:", newQuestion);

    try {
        await createQuestion(newQuestion);
        console.log("✅ API call finished");

        setNewQuestion("");
        syncQuestions();
    } catch (error) {
        console.error("Error posting question:", error);
    }
};

    return (
        <div>
            <h1>FAQ</h1>

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

            <h2>Questions</h2>
            <div>
                {questions.map((question) => (
                    <div key={question.id}>
                        <p>{question.question}</p>
                        <button onClick={() => syncAnswers(question.id)}>
                            View Answers
                        </button>

                        {answers[question.id] && (
                            <div>
                                <h3>Answers:</h3>
                                {answers[question.id].map((answer) => (
                                    <p key={answer.id}>{answer.answer}</p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}