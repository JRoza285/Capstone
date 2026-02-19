const API = import.meta.env.VITE_API;

//get workouts

export async function getWorkouts(token) {
    if (!token) {
        throw new Error("Token is required to fetch workouts");
    }
    const response = await fetch(API + "/api/workouts", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
    }
    return await response.json();
}

//create workout



//update workout

export async function createWorkout(token, body) {
  if (!token) {
    throw new Error("Token is required to create a workout");
  }

  const response = await fetch(`${API}/api/workouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  let result;

  try {
    const text = await response.text();
    result = text ? JSON.parse(text) : {};
  } catch (err) {
    // If JSON parsing fails, fallback to text message
    result = { message: text || "Unknown error" };
  }

  if (!response.ok) {
    // Use result.error if backend returns { error: ... }
    throw new Error(result.error || result.message || "Something went wrong");
  }

  return result;
}



//delete workout

export async function deleteWorkout(token, id) {
  if (!token) throw new Error("Token is required to delete a workout");

  const response = await fetch(`${API}/api/workouts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let result;
  try {
    result = await response.json();
  } catch {
    result = {};
  }

  if (!response.ok) {
    // Use the 'error' key from backend
    throw new Error(result.error || "Failed to delete workout");
  }

  return result;
}


//get workout by id

export async function getWorkoutById(id, token) {
  if (!token) throw new Error("Token is required to fetch a workout by ID");
  if (!id) throw new Error("Workout ID is required");

  const response = await fetch(`${API}/api/workouts/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch workout");
  }

  return await response.json();
}

//update workout

export async function updateWorkout(id, body, token) {
  if (!token) throw new Error("Token is required to update a workout");
  if (!id) throw new Error("Workout ID is required to update a workout");
  if (!body || Object.keys(body).length === 0)
    throw new Error("Update data is required");

  const response = await fetch(`${API}/api/workouts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}