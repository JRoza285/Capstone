const API = import.meta.env.VITE_API;

//get weight

export async function getWeight(token) {
    if (!token) {
        throw new Error("Token is required to fetch weight entries");
    }
    const response = await fetch(API + "/api/weight", {
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

//get weight history

export async function getWeightHistory(token) {
    if (!token) {
        throw new Error("Token is required to fetch weight history");
    }
    const response = await fetch(API + "/api/weight/history", {
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

//new weight entry

export async function createWeight(token, body) {
    if (!token) {
        throw new Error("Token is required to create a weight entry");
    }
    const response = await fetch(API + "/api/weight", {
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

// for graphing page

export async function getWeightGraph(token) {
  if (!token) {
    throw new Error("Token is required to fetch weight graph");
  }
  const response = await fetch(`${API}/api/weight/graph`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch weight history");
  }

  return await response.json();
}
