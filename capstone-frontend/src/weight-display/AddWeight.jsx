import { useState } from "react";
import { useNavigate } from "react-router";
import { createWeight } from "../api/weight";
import { useAuth } from "../auth/AuthContext";

export default function AddWeight() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onAddWeight = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const weight = formData.get("weight");
    const date = formData.get("date");

    try {
      await createWeight(token, { weight, date });
      navigate("/weightlibrary");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h1>Add Weight</h1>
      <form onSubmit={onAddWeight}>
        <label>
          Weight
          <input type="number" name="weight" required />
        </label>

        <label>
          Date
          <input type="date" name="date" required />
        </label>

        <button>Add</button>
        {error && <p>{error}</p>}
      </form>
    </>
  );
}
