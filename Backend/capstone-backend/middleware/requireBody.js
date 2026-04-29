/** Checks if the request body contains the required fields */
export default function requireBody(fields = []) {
  return (req, res, next) => {
    if (!req.body) {
      console.error("requireBody: request body missing", {
        path: req.path,
        method: req.method,
        headers: {
          authorization: req.get("authorization"),
          contentType: req.get("content-type")
        }
      });

      return res.status(400).json({ error: "Request body is required." });
    }

    const missing = fields.filter((field) => !(field in req.body));
    if (missing.length > 0) {
      console.error("requireBody: missing fields", {
        path: req.path,
        method: req.method,
        missing,
        body: req.body
      });

      return res.status(400).json({ error: `Missing fields: ${missing.join(", ")}` });
    }

    next();
  };
}
