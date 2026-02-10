const API = import.meta.env.VITE_API;

//get all lifts

export async function getLifts() {
    try {
        const response = await fetch( API + "/api/lifts" );
        const result = await response.json();
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}

// get lifts by id

export async function getLiftById(id) {
    try {
        const response = await fetch( API + `/api/lifts/${id}` );
        const result = await response.json();
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
}

// get lifts by target

export async function getLiftsByTarget(target) {
    try {
        const response = await fetch( API + `/api/lifts/target/${target}` );
        const result = await response.json();
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}

// get list of target muscles
export async function getTargetMuscles() {
    try {
        const response = await fetch(API + "/api/lifts/targets");
        if (!response.ok) {
            const result = await response.json().catch(() => ({}));
            throw new Error(result.message || "Failed to load target muscles");
        }
        const result = await response.json();
        // normalize to array of strings if backend returns objects
        if (Array.isArray(result) && result.length && typeof result[0] === "object") {
            return result.map((r) => r.target_muscle ?? r);
        }
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}

// create a new target muscle (protected)
export async function createTargetMuscle(token, target) {
    if (!token) throw new Error("Token is required to create a target muscle");
    const response = await fetch(API + "/api/lifts/targets", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ target_muscle: target }),
    });
    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message);
    }
    const result = await response.json();
    return result.target_muscle ?? result;
}

// create a new lift

export async function createLift(token, body) {
    if (!token) {
        throw new Error("Token is required to create a lift");
    }
    const response = await fetch(API + "/api/lifts", {
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

//update a lift

export async function updateLift(token, id, body) {
    if (!token) {
        throw new Error("Token is required to update a lift");
    }
    const response = await fetch(API + `/api/lifts/${id}`, {
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

//delete a lift

export async function deleteLift(token, id) {
    if (!token) {
        throw new Error("Token is required to delete a lift");
    }
    const response = await fetch(API + `/api/lifts/${id}`, {
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