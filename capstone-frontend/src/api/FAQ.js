const API = import.meta.env.VITE_API;

//Get all FAQ

export async function getQuestions() {
    try {
        const response = await fetch(API + "/api/faq/questions");
        const result = await response.json();
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}

//Get all answers

export async function getAnswers(question_id) {
    try {
        const response = await fetch(API + `/api/faq/answers/${question_id}`);
        const result = await response.json();
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}

//Post answer

export async function createAnswer(question_id, answer, token) {
    try {
        const response = await fetch(API + `/api/faq/answers/${question_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ answer })
        });

        const result = await response.json();
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}

//Post question

export async function createQuestion(question) {
    try {
        const response = await fetch(API + "/api/faq/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });
        const result = await response.json();
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}
