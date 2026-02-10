// retreives and displays a list of all previous diets

import { Link } from "react-router";

export default function NutritionList({ nutrition }) {
    return (
        <ul>
            {nutrition.map((meal) => (
                <NutritionListItem
                key={meal.id}
                meal={meal}
                />
            ))}
        </ul>
        );
}

function NutritionListItem({ meal }) {
    return (
        <li className="nutrition-list-item">
            <div className="nutrition-info">
                <h3>
                    <Link to={"/nutrition/" + meal.id}>
                    {meal.name}
                    </Link>
                </h3>
                <p className="calories">Calories: {meal.calories}</p>
                <p className="description">{meal.description}</p>
                <p className="protein">Protein: {meal.protein}g</p>
                <p className="carbs">Carbohydrates: {meal.carbs}g</p>
                <p className="fat">Fat: {meal.fat}g</p>
            </div>
            </li>
    );
    }