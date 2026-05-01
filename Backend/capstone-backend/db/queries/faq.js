import db from "#db/client";

// --------------------
// Get all FAQ entries
// --------------------
export async function getFaqs() {
  const sql = `
    SELECT *
    FROM faq
    ORDER BY id ASC;
  `;

  const { rows: faqs } = await db.query(sql);
  return faqs;
}

// --------------------
// Get unanswered FAQ entries (useful for admin)
// --------------------
export async function getUnansweredFaqs() {
  const sql = `
    SELECT *
    FROM faq
    WHERE answer IS NULL
    ORDER BY id ASC;
  `;

  const { rows: faqs } = await db.query(sql);
  return faqs;
}

// --------------------
// Create a question (no answer yet)
// --------------------
export async function createQuestion({ question }) {
  if (!question) {
    throw new Error("Question text is required");
  }

  const sql = `
    INSERT INTO faq (question)
    VALUES ($1)
    RETURNING *;
  `;

  const { rows: [newFaq] } = await db.query(sql, [question]);
  return newFaq;
}

// --------------------
// Add / update an answer
// --------------------
export async function addAnswer({ id, answer }) {
  if (!id || !answer) {
    throw new Error("FAQ id and answer text are required");
  }

  const sql = `
    UPDATE faq
    SET answer = $1,
        answered_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;

  const { rows: [updatedFaq] } = await db.query(sql, [answer, id]);
  return updatedFaq;
}

// --------------------
// Get single FAQ entry by ID
// --------------------
export async function getFaqById(id) {
  const sql = `
    SELECT *
    FROM faq
    WHERE id = $1;
  `;

  const { rows: [faq] } = await db.query(sql, [id]);
  return faq;
}