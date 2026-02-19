import { Link } from "react-router";

export default function NutritionList({ nutrition }) {
    return (
        <ul className="nutrition-list">
            {nutrition.map((meal) => (
                <NutritionListItem key={meal.id} meal={meal} />
            ))}
        </ul>
    );
}

function NutritionListItem({ meal }) {
    return (
        <li className="nutrition-list-item">
            <div className="nutrition-info">
                <h3>
                    <Link to={"/nutrition/" + meal.id}>{meal.name}</Link>
                </h3>
                <p className="date">Date: {new Date(meal.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                <p className="calories">Calories: {meal.calories}</p>
                <p className="protein">Protein: {meal.protein}g</p>
                <p className="carbs">Carbohydrates: {meal.carbs}g</p>
                <p className="fats">Fats: {meal.fats}g</p>
            </div>
        </li>
    );
}
