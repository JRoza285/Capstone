const API = import.meta.env.VITE_API;

// get all nutrition entries

export async function getNutrition(token) {
    if (!token) {
        throw new Error("Token is required to fetch nutrition entries");
    }
    const response = await fetch(API + "/api/nutrition", {
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

//get calories

export async function getCalories(token) {
    if (!token) {
        throw new Error("Token is required to fetch calories");
    }
    const response = await fetch(API + "/api/nutrition/calories", {
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

//new nutrition

export async function createNutrition(token, body) {
    if (!token) {
        throw new Error("Token is required to create a nutrition entry");
    }
    const response = await fetch(API + "/api/nutrition", {
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

//update nutrition

export async function updateNutrition(token, id, body) {
    if (!token) {
        throw new Error("Token is required to update a nutrition entry");
    }
    const response = await fetch(API + `/api/nutrition/${id}`, {
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

//delete nutrition

export async function deleteNutrition(token, id) {
    if (!token) {
        throw new Error("Token is required to delete a nutrition entry");
    }
    const response = await fetch(API + `/api/nutrition/${id}`, {
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

// Graph data for nutrition
export async function getNutritionGraph(token) {
  if (!token) throw new Error("Token is required to fetch nutrition graph");

  const response = await fetch(`${API}/api/nutrition/graph`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to fetch nutrition graph");
  }

  return await response.json(); // should return an array of nutrition entries
}