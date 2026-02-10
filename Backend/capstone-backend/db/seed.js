import db from "#db/client";

import { createUser } from "#db/queries/users";
import { createLift } from "#db/queries/lifts";
import { createWorkout } from "#db/queries/workouts";
import { createWorkoutLift } from "#db/queries/workout-lifts";
import { enterWeight } from "#db/queries/weight";
import { newNutrition } from "#db/queries/nutrition";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const users = [];
  const lifts = [];
  const workouts = [];

  const today = new Date().toISOString().split("T")[0];

  // --------------------
  // USERS
  // --------------------
  for (let i = 1; i <= 2; i++) {
    users.push(
      await createUser({
        username: `user${i}`,
        password: `password${i}`,
        role: "user",
        birthday: "1995-01-01",
      })
    );
  }

  // --------------------
  // LIFTS
  // --------------------
  for (let i = 1; i <= 5; i++) {
    lifts.push(
      await createLift({
        name: `Lift ${i}`,
        description: `Description for Lift ${i}`,
        target_muscle: `Target Muscle ${i}`,
      })
    );
  }

  // --------------------
  // WORKOUTS
  // --------------------
  for (const user of users) {
    workouts.push(
      await createWorkout({
        userId: user.id,
      })
    );
  }

  // --------------------
  // WORKOUT_LIFTS
  // (one row = one lift in one workout)
  // --------------------
  for (const workout of workouts) {
    for (let i = 0; i < 3; i++) {
      const lift = lifts[i % lifts.length];

      await createWorkoutLift({
        workoutId: workout.id,
        liftId: lift.id,
        sets: 3,
        reps: 10,
        weight: 100,
        proximityToFailure: 2,
      });
    }
  }

  // --------------------
  // WEIGHT (1 per user per day)
  // --------------------
  for (const user of users) {
    await enterWeight({
      userId: user.id,
      date: today,
      weight: 180,
    });
  }

  // --------------------
  // NUTRITION (1 per user per day)
  // --------------------
  for (const user of users) {
    await newNutrition({
      userId: user.id,
      date: today,
      calories: 2200,
      protein: 160,
      carbs: 250,
      fats: 70,
    });
  }
}

