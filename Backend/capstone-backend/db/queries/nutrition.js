import db from "#db/client";

//Get nutrition

export async function getNutrition(userId) {
if (!userId) {
    throw new Error("User Id is required");
}
const sql = `
SELECT *
FROM nutrition
WHERE user_id = $1
`;

const { rows } = await db.query(sql, [userId]);
return rows;
}


export async function getCalories(userId) {
if (!userId) {
    throw new Error("User ID is required");
}
const sql = `
SELECT calories
FROM nutrition
WHERE user_id = $1
`;

const { rows } = await db.query(sql, [userId]);
return rows;
}

//Post nutrition

export async function newNutrition({ userId, calories, date, protein, carbs, fats }) {
if (!userId || !calories || !date || !protein || !carbs || !fats) {
    throw new Error("All fields are required");
}
const sql = `
INSERT INTO nutrition (user_id, calories, date, protein, carbs, fats)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
`;

const { rows: [nutrition] } = await db.query(sql, [userId, calories, date, protein, carbs, fats]);
return nutrition;
}

//delete nutrition

export async function deleteNutrition(id, user_id) {
if (!id || !user_id) {
    throw new Error("Nutrition ID and User ID are required");
}
const sql = `
DELETE FROM nutrition
WHERE id = $1 AND user_id = $2
RETURNING *;
`;
const { rows: [nutrition] } = await db.query(sql, [id, user_id]);
return nutrition;
}

//Put nutrition

export async function updateNutrition({ id, user_id, calories, date, protein, carbs, fats }) {
if (!id || !user_id) {
    throw new Error("Nutrition ID and User ID are required");
}
const sql = `
UPDATE nutrition
SET calories = $3, date = $4, protein = $5, carbs = $6, fats = $7
WHERE id = $1 AND user_id = $2
RETURNING *;
`;
const { rows: [nutrition] } = await db.query(sql, [id, user_id, calories, date, protein, carbs, fats]);
return nutrition;
}

//get nutrition history for graph

export async function getNutritionGraph(user_id) {
  if (!user_id) throw new Error("User ID is required");
    const sql = `
SELECT date, calories, protein, carbs, fats
FROM nutrition
WHERE user_id = $1
ORDER BY date ASC;
`;
    const { rows } = await db.query(sql, [user_id]);
    return rows;
}