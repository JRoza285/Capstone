import { useEffect, useState } from "react";
import { getUnanswered } from "../api/FAQ";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router";

export default function FAQAnswersList() {
  const { token } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUnanswered(token);
        setFaqs(data);
      } catch (err) {
        console.error("Failed to load unanswered FAQs:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  if (loading) return <p>Loading unanswered questions...</p>;

  if (!faqs || faqs.length === 0) return <p>No unanswered questions.</p>;

  return (
    <div>
      <h2>Unanswered FAQs</h2>
      <ul>
        {faqs.map((faq) => (
          <li key={faq.id}>
            <Link to={`/FAQanswers/${faq.id}`}>{faq.question}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
