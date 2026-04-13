import db from "#db/client";

//Get questions

export async function getQuestions() {
const sql = `
SELECT *
FROM questions
`;

const { rows: questions } = await db.query(sql);
return questions
}

//Get answers

export async function getAnswers(question_id) {
    const sql = `
    SELECT *
    FROM answers
    WHERE question_id = $1
    `;
    const { rows: answers } = await db.query(sql, [question_id]);
    return answers;
}

//Post question

export async function createQuestion({ question }) {
if (!question) {
    throw new Error("Question text is required");
}
const sql = `
INSERT INTO questions (question)
VALUES ($1)
RETURNING *;
`;

const { rows: [question] } = await db.query(sql, [question]);
return question;
}

//Post answers

export async function createAnswer({ question_id, answer }) {
if (!question_id || !answer) {
    throw new Error("Question ID and answer text are required");
}
const sql = `
INSERT INTO answers (question_id, answer)
VALUES ($1, $2)
RETURNING *;
`;

const { rows: [answer] } = await db.query(sql, [question_id, answer]);
return answer;
}