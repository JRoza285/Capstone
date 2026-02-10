// displays steails about each diet
// possibly not used------------------------

export default function NutritionDetails({ meal }) {
    if (!meal) return <p>Meal not found.</p>;
    return (
<article>
    <h1>{meal.id}</h1>
    <p>Calories: {meal.calories}</p>
    <p>Description: {meal.description}</p> 
    <p>Protein: {meal.protein}g</p>
    <p>Carbohydrates: {meal.carbs}g</p>
    <p>Fat: {meal.fat}g</p>
</article>

    );
}