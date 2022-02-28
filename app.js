const express = require("express");
const res = require("express/lib/response");
const api = require("./routes/api");
const app = express();
const posts = require("./routes/posts");

module.exports = app;

//Middleware
app.use(express.json());
app.use("/api/posts", posts);
app.use("/api", api);

/** Generic error handler */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message },
  });
});
