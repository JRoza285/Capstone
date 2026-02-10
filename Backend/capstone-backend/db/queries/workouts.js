import db from "#db/client";

//Get workouts

export async function getWorkouts(user_id) {
if (!user_id) {
    throw new Error("User ID is required");
}
const sql = `
SELECT *
FROM workouts
WHERE user_id = $1
`;

const { rows } = await db.query(sql, [user_id]);
return rows;
}

//Post workouts

export async function createWorkout({ userId }) {
if (!userId) {
    throw new Error("All fields are required");
}
const sql = `
INSERT INTO workouts (user_id)
VALUES ($1)
RETURNING *
`;

const { rows: [workout] } = await db.query(sql, [userId]);
return workout;
}

//delete workouts

export async function deleteWorkout({ id, user_id}) {
if (!id || !user_id) {
    throw new Error("Workout ID and User ID are required");
}
const sql = `
DELETE FROM workouts
WHERE id = $1 AND user_id = $2
RETURNING *;
`;

const { rows: [workout] } = await db.query(sql, [id, user_id]);
return workout;
}


//Put workouts

export async function updateWorkout({ id, user_id }) {
if (!id || !user_id) {
    throw new Error("All fields are required");
}
const sql = `
UPDATE workouts
SET user_id = $1
WHERE id = $2 AND user_id = $1
RETURNING *;
`; 
const { rows: [workout] } = await db.query(sql, [user_id, id]);
return workout;
}