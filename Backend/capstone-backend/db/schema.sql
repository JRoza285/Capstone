DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS lifts;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS workout_lifts;
DROP TABLE IF EXISTS weight;
DROP TABLE IF EXISTS nutrition;
DROP TABLE IF EXISTS target_muscles;

CREATE TABLE users (
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'admin')),
  birthday date NOT NULL
);

CREATE TABLE lifts (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  target_muscle text NOT NULL
);

CREATE TABLE workouts (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id),
  name text NOT NULL
);

CREATE TABLE workout_lifts (
  id serial PRIMARY KEY,
  workout_id integer REFERENCES workouts(id),
  lift_id integer REFERENCES lifts(id),
  sets integer NOT NULL,
  reps text NOT NULL,
  weight integer NULL,
  proximity_to_failure integer NOT NULL
);

CREATE TABLE weight (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id),
  date date NOT NULL,
  weight decimal NOT NULL
);

CREATE TABLE nutrition (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id),
  date date NOT NULL,
  calories integer NOT NULL,
  protein integer NOT NULL,
  carbs integer NOT NULL,
  fats integer NOT NULL
);

CREATE TABLE target_muscles (
    id serial PRIMARY KEY,
    target_muscle text NOT NULL UNIQUE
);
