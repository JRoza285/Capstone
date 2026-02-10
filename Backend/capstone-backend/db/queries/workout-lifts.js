import db from "#db/client";

//Get workout-lifts

export async function getWorkoutLifts(workout_id, user_id) {
if (!workout_id || !user_id) {
    throw new Error("Workout ID and User ID are required");
}
const sql = `
SELECT *
FROM workout_lifts
JOIN workouts ON workout_lifts.workout_id = workouts.id
WHERE workout_id = $1 AND workouts.user_id = $2
`;

const { rows: workoutLifts } = await db.query(sql, [workout_id, user_id]);
return workoutLifts;
}

//Post workout-lifts

export async function createWorkoutLift({ workoutId, liftId, sets, reps, weight, proximityToFailure }) {
if (!workoutId || !liftId || !sets || !reps || !weight || !proximityToFailure) {
    throw new Error("All fields are required");
}

const sql = `
INSERT INTO workout_lifts (workout_id, lift_id, sets, reps, weight, proximity_to_failure)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;
`;

const { rows: [workoutLift] } = await db.query(sql, [workoutId, liftId, sets, reps, weight, proximityToFailure]);
return workoutLift;
}

//delete workout-lifts  

export async function deleteWorkoutLift({ id, user_id}) {
if (!id || !user_id) {
    throw new Error("Workout Lift ID and User ID are required");
}
const sql = `
DELETE FROM workout_lifts 
USING workouts
WHERE workout_lifts.workout_id = workouts.id
AND workout_lifts.id = $1 AND workouts.user_id = $2
RETURNING workout_lifts.*;
`;

const { rows: [workoutLift] } = await db.query(sql, [id, user_id]);
return workoutLift;
}

//Put workout-lifts

export async function updateWorkoutLift({ id, user_id, sets, reps, weight, proximityToFailure }) {
if (!id || !user_id || !sets || !reps || !weight || !proximityToFailure) {
    throw new Error("All fields are required");
}
const sql = `
UPDATE workout_lifts
SET sets = $1, reps = $2, weight = $3, proximity_to_failure = $4
FROM workouts
WHERE workout_lifts.workout_id = workouts.id
AND workout_lifts.id = $5 AND workouts.user_id = $6
RETURNING workout_lifts.*;
`;

const { rows: [workoutLift] } = await db.query(sql, [sets, reps, weight, proximityToFailure, id, user_id]);
return workoutLift;
}