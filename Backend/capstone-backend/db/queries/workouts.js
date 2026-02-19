import db from "#db/client";

// -------------------- GET WORKOUTS --------------------
export async function getWorkouts(user_id) {
  if (!user_id) throw new Error("User ID is required");

  const workoutsResult = await db.query(
    `SELECT * FROM workouts WHERE user_id = $1 ORDER BY id DESC`,
    [user_id]
  );

  const workouts = [];

  for (const workout of workoutsResult.rows) {
    const liftsResult = await db.query(
      `SELECT wl.id, wl.sets, wl.reps, wl.proximity_to_failure, l.name, l.target_muscle
       FROM workout_lifts wl
       JOIN lifts l ON wl.lift_id = l.id
       WHERE wl.workout_id = $1`,
      [workout.id]
    );

    workouts.push({
      ...workout,
      lifts: liftsResult.rows
    });
  }

  return workouts;
}

// -------------------- CREATE WORKOUT --------------------
export async function createWorkout({ user_id, name, lifts }) {
  if (!user_id || !name || !lifts || !Array.isArray(lifts) || lifts.length === 0) {
    throw new Error("User ID, workout name, and at least one lift are required");
  }

  // Insert workout
  const { rows: [workout] } = await db.query(
    `INSERT INTO workouts (user_id, name) VALUES ($1, $2) RETURNING *`,
    [user_id, name]
  );

  // Insert lifts into workout_lifts
  for (const lift of lifts) {
    const { lift_id, sets, reps_min, reps_max, proximity_to_failure } = lift;

    if (sets == null || reps_min == null || reps_max == null || proximity_to_failure == null) {
      throw new Error("All lift fields are required");
    }

    await db.query(
      `INSERT INTO workout_lifts (workout_id, lift_id, sets, reps, proximity_to_failure)
       VALUES ($1, $2, $3, $4, $5)`,
      [workout.id, lift_id, sets, `${reps_min}-${reps_max}`, proximity_to_failure]
    );
  }

  return workout;
}

// -------------------- DELETE WORKOUT --------------------
export async function deleteWorkout({ id, user_id }) {
  if (!id || !user_id) throw new Error("Workout ID and User ID are required");

  // Delete associated lifts first
  await db.query(`DELETE FROM workout_lifts WHERE workout_id = $1`, [id]);

  // Then delete the workout
  const { rows: [workout] } = await db.query(
    `DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, user_id]
  );

  return workout;
}


// -------------------- UPDATE WORKOUT --------------------
export async function updateWorkout({ id, user_id, name, lifts }) {
  if (!id || !user_id || !name) throw new Error("Workout ID, User ID, and name are required");

  // Update workout name
  const { rows: [workout] } = await db.query(
    `UPDATE workouts SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
    [name, id, user_id]
  );

  // Optional: if lifts are provided, remove old lifts and add new ones
  if (lifts && Array.isArray(lifts)) {
    // Delete old lifts
    await db.query(`DELETE FROM workout_lifts WHERE workout_id = $1`, [id]);

    // Insert new lifts
    for (const lift of lifts) {
      const { lift_id, sets, reps_min, reps_max, proximity_to_failure } = lift;
      await db.query(
        `INSERT INTO workout_lifts (workout_id, lift_id, sets, reps, proximity_to_failure)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, lift_id, sets, `${reps_min}-${reps_max}`, proximity_to_failure]
      );
    }
  }

  return workout;
}
