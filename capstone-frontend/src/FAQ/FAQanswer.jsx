import { useEffect, useState } from "react";
import { getAnswers, createAnswer } from "../api/FAQ";
import { useAuth } from "../auth/AuthContext";
import { useParams } from "react-router";

export default function FAQAnswer() {
    const { question_id } = useParams();

    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const { token } = useAuth();

    const fetchAnswers = async () => {
        try {
            const fetchedAnswers = await getAnswers(question_id);
            setAnswers(fetchedAnswers);
        } catch (error) {
            console.error("Error fetching answers:", error);
        }
    };

    const handlePostAnswer = async () => {
        if (!token) {
            alert("You must be logged in to post an answer.");
            return;
        }

        try {
            await createAnswer(question_id, answer, token);
            setAnswer("");
            fetchAnswers();
        } catch (error) {
            console.error("Error posting answer:", error);
        }
    };

    useEffect(() => {
        if (question_id) {
            fetchAnswers();
        }
    }, [question_id]);

    return (
        <div>
            <h2>Answers</h2>

            {answers.length === 0 ? (
                <p>No answers yet.</p>
            ) : (
                answers.map((ans) => (
                    <div key={ans.id}>
                        <p>{ans.answer}</p>
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