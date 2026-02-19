import { useState } from "react";
import { useNavigate } from "react-router";
import { createWeight } from "../api/weight";
import { useAuth } from "../auth/AuthContext";

export default function AddWeight() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onAddWeight = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    let weight = parseFloat(formData.get("weight"));
    const date = formData.get("date");

    if (isNaN(weight)) {
      setError("Please enter a valid weight");
      setLoading(false);
      return;
    }

    // Round to 1 decimal place
    weight = Math.round(weight * 10) / 10;

    try {
      await createWeight(token, { weight, date });
      // Redirect to home page after adding weight
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

return (
  <>
    <h1>Add Weight</h1>
    <form className="add-weight-form" onSubmit={onAddWeight}>
      <label>
        Weight
        <input type="number" step="0.1" name="weight" required />
      </label>

      <label>
        Date
        <input
          type="date"
          name="date"
          required
          defaultValue={new Date().toISOString().split("T")[0]}
        />
      </label>

      <button disabled={loading}>{loading ? "Adding..." : "Add"}</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  </>
);
}

