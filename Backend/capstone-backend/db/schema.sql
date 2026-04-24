DROP TABLE IF EXISTS workout_lifts;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS weight;
DROP TABLE IF EXISTS nutrition;
DROP TABLE IF EXISTS lifts;
DROP TABLE IF EXISTS target_muscles;
DROP TABLE IF EXISTS faq;
DROP TABLE IF EXISTS users;

-- USERS
CREATE TABLE users (
  id serial PRIMARY KEY,
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'admin')),
  birthday date NOT NULL
);

-- TARGET MUSCLES (normalized lookup table)
CREATE TABLE target_muscles (
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

-- LIFTS
CREATE TABLE lifts (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  target_muscle_id integer REFERENCES target_muscles(id)
);

-- WORKOUTS
CREATE TABLE workouts (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL
);

-- WORKOUT LIFTS (junction table)
CREATE TABLE workout_lifts (
  id serial PRIMARY KEY,
  workout_id integer NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  lift_id integer NOT NULL REFERENCES lifts(id),
  sets integer NOT NULL,
  reps text NOT NULL,
  weight integer,
  proximity_to_failure integer NOT NULL
);

-- BODY WEIGHT TRACKING
CREATE TABLE weight (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  weight decimal NOT NULL,
  UNIQUE (user_id, date)
);

-- NUTRITION TRACKING
CREATE TABLE nutrition (
  id serial PRIMARY KEY,
  user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date date NOT NULL,
  calories integer NOT NULL,
  protein integer NOT NULL,
  carbs integer NOT NULL,
  fats integer NOT NULL,
  UNIQUE (user_id, date)
);

-- FAQ (QUESTION FIRST, ANSWER LATER MODEL)
CREATE TABLE faq (
  id serial PRIMARY KEY,
  question text NOT NULL,
  answer text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'answered')),
  created_at timestamp NOT NULL DEFAULT NOW(),
  answered_at timestamp
);

