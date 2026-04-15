import { useEffect, useState } from "react";
import { getAnswers, createAnswer } from "../api/FAQ";
import { useAuth } from "../auth/AuthContext";

export default function FAQAnswer({ question_id }) {
    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const { token } = useAuth();

    // Fetch answers for this question
    const fetchAnswers = async () => {
        try {
            const fetchedAnswers = await getAnswers(question_id);
            setAnswers(fetchedAnswers);
        } catch (error) {
            console.error("Error fetching answers:", error);
        }
    };

    // Post a new answer
    const handlePostAnswer = async () => {
        if (!token) {
            alert("You must be logged in to post an answer.");
            return;
        }
        try {
            await createAnswer(question_id, answer, token);
            setAnswer("");
            fetchAnswers(); // refresh after posting
        } catch (error) {
            console.error("Error posting answer:", error);
        }
    };

    // Load answers on mount and when question_id changes
    useEffect(() => {
        fetchAnswers();
    }, [question_id]);

    return (
        <div>
            <h2>Answers</h2>

            {/* Display answers */}
            {answers.length === 0 ? (
                <p>No answers yet.</p>
            ) : (
                answers.map((ans, index) => (
                    <div key={index}>
                        <p>{ans.text}</p>
                    </div>
                ))
            )}

            <h3>Post an Answer</h3>
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