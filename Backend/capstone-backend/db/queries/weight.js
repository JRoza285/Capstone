import db from "#db/client";

//Get weight

export async function getWeightHistory(user_id) {
const sql = `
SELECT *
FROM weight
WHERE user_id = $1
`;
const { rows: weightHistory } = await db.query(sql, [user_id]);
return weightHistory; 
}

export async function getWeight(user_id) {
  const sql = `
    SELECT *
    FROM weight
    WHERE user_id = $1
    ORDER BY date DESC
    LIMIT 1
  `;
  const { rows: [weight] } = await db.query(sql, [user_id]);
  return weight || null;
}


//Post weight

export async function enterWeight({ userId, weight, date }) {
if (!userId || !weight || !date) {
    throw new Error("User ID, weight, and date are required");
}
const sql = `
INSERT INTO weight (user_id, weight, date)
VALUES ($1, $2, $3)
RETURNING *;
`;  

const { rows: [row] } = await db.query(sql, [userId, weight, date]);
return row;
}
