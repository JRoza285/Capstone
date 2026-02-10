// displays all of the previous meals in your plan

import { useEffect, useState } from "react";
import { getNutrition } from "../api/nutrition";
import NutritionList from "./NutritionList";

export default function NutritionLibrary() {
    const [nutrition, setNutrition] = useState([]);
const [token] = useState(localStorage.getItem("token"));

const syncNutrition = async () => {
  const diet = await getNutrition(token);
  setNutrition(diet);
};


    useEffect(() => {
        syncNutrition();
    }, []);

return (
    <>
    <h1>Nutrition Library</h1>
    <NutritionList nutrition={nutrition} />
    </>
)
}