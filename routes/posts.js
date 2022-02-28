const ExpressError = require("../ExpressError");
const PostService = require("../services/PostService");
const router = require("express").Router();
module.exports = router;

router.get("/", async (req, res, next) => {
  try {
    const { sortBy, direction } = req.query;
    const tags = req.query.tags?.split(",") || [];
    const posts = await PostService.getPosts(tags, sortBy, direction);

    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});
