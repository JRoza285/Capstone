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

export async function createWorkout(token, body) {
    if (!token) {
        throw new Error("Token is required to create a workout");
    }
    const response = await fetch(API + "/api/workouts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
    }
    return await response.json();
}

//update workout

export async function updateWorkout(token, id, body) {
    if (!token) {
        throw new Error("Token is required to update a workout");
    }
    const response = await fetch(API + `/api/workouts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
    }
    return await response.json();
}

//delete workout

export async function deleteWorkout(token, id) {
    if (!token) {
        throw new Error("Token is required to delete a workout");
    }
    const response = await fetch(API + `/api/workouts/${id}`, {
        method: "DELETE",
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