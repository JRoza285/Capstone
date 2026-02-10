import db from "#db/client";

//Get lifts

export async function getLifts() {
const sql = `
SELECT *
FROM lifts
`;

const { rows: lifts } = await db.query(sql);
return lifts
}

export async function getLiftById(id) {
if (!id) {
    throw new Error("Lift ID is required");
}

const sql = `
SELECT *
FROM lifts
WHERE id = $1
`;

const { rows: [lift] } = await db.query(sql, [id]);
return lift;
}

export async function getLiftsByTarget(target) {
if (!target) {
    throw new Error("Target muscle group is required"); 
}
const sql = `
SELECT *
FROM lifts
WHERE target_muscle = $1
`;

const { rows: lifts } = await db.query(sql, [target]);
return lifts;
}


//Post lifts

export async function createLift({ name, description, target_muscle }) {
if (!name || !description || !target_muscle) {
    throw new Error("Name, description, and target muscle group are required");
}
const sql = `
INSERT INTO lifts (name, description, target_muscle)
VALUES ($1, $2, $3)
RETURNING *;
`;

const { rows: [lift] } = await db.query(sql, [name, description, target_muscle]);
return lift;
}

//delete lifts

export async function deleteLift(id) {
if (!id) {
    throw new Error("Lift ID is required");
}
const sql = `
DELETE FROM lifts
WHERE id = $1
RETURNING *;
`;

const { rows: [lift] } = await db.query(sql, [id]);
return lift;
}

//Put lifts

export async function updateLift({ id, name, description, target_muscle }) {
  if (!id) throw new Error("Lift ID is required");

  const sql = `
    UPDATE lifts
    SET name = $1, description = $2, target_muscle = $3
    WHERE id = $4
    RETURNING *;
  `;

  const { rows: [lift] } = await db.query(sql, [name, description, target_muscle, id]);
  return lift;
}


//get target muscles

export async function getTargetMuscles() {
const sql = `SELECT * FROM target_muscles`;

const { rows: targetMuscles } = await db.query(sql);
return targetMuscles;
}


//post target muscles

export async function createTargetMuscle(target_muscle) {
if (!target_muscle) {
    throw new Error("Target muscle group is required");
}
const sql = `
INSERT INTO target_muscles (target_muscle)
VALUES ($1)
RETURNING *;
`;

const { rows: [targetMuscle] } = await db.query(sql, [target_muscle]);
return targetMuscle;
}