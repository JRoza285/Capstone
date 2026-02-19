import { useState } from "react";
import { useNavigate } from "react-router";
import { createNutrition } from "../api/nutrition";
import { useAuth } from "../auth/AuthContext";

export default function AddNutrition() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const onAddNutrition = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const calories = formData.get("calories");
    const date = formData.get("date");
    const protein = formData.get("protein");
    const carbs = formData.get("carbs");
    const fats = formData.get("fats");


    try {
      await createNutrition(token, { name, calories, date, protein, carbs, fats });
      navigate("/nutritionlibrary");
    } catch (err) {
      setError(err.message);
    }
  };
return (
  <>
    <h1>Add Nutrition</h1>
    <form className="add-nutrition-form" onSubmit={onAddNutrition}>
      <label>
        Name
        <input type="text" name="name" required />
      </label>

      <label>
        Calories
        <input type="number" name="calories" required />
      </label>

      <label>
        Date
        <input type="date" name="date" required />
      </label>

      <label>
        Protein
        <input type="number" name="protein" required />
      </label>

      <label>
        Carbs
        <input type="number" name="carbs" required />
      </label>

      <label>
        Fats
        <input type="number" name="fats" required />
      </label>

      <button>Add</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  </>
);

}
