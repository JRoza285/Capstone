const API = import.meta.env.VITE_API;
console.log("INIT API =", API);

// --------------------
// Get all FAQs (PUBLIC)
// --------------------
export async function getQuestions() {
  const response = await fetch(API + "/api/faq");

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return await response.json();
}

// --------------------
// Get unanswered FAQs (ADMIN ONLY)
// --------------------
export async function getUnanswered(token) {
  const response = await fetch(API + "/api/faq/unanswered", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

// --------------------
// Get single FAQ by id (PUBLIC)
// --------------------
export async function getQuestion(id) {
  const response = await fetch(API + `/api/faq/${id}`);

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

// --------------------
// Create question (USER or ADMIN depending on backend rules)
// --------------------
export async function createQuestion(question, token) {
  const response = await fetch(API + "/api/faq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({ question })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}

// --------------------
// Add answer (ADMIN ONLY)
// --------------------
export async function createAnswer(id, answer, token) {
  const response = await fetch(API + `/api/faq/${id}/answer`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ answer })
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}
