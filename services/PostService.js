const Posts = require("../models/Posts");
const ExpressError = require("../ExpressError");
const sortableColumns = ["id", "reads", "likes", "popularity"];

class PostService {
  /**
   *
   * @param {Array} tags An array of tags to search for.
   * @param {string} sortBy What column to sort by, one of id, reads, likes, or popularity.
   * @param {string} direction Direction to sort in, either asc or desc.
   */
  static async getPosts(tags, sortBy = "", direction = "desc") {
    this.validateParams(tags, sortBy, direction);
    const requests = tags.map((tag) => Posts.getPostsByTag(tag));
    const allPosts = (await Promise.all(requests)).flat();

    //Merge duplicates into a hashmap by postId.
    const postHash = allPosts.reduce((acc, post) => {
      acc[post.id] = post;
      return acc;
    }, {});

    const posts = Object.values(postHash);
    if (sortBy)
      posts.sort((a, b) => {
        if (direction === "asc") return a[sortBy] - b[sortBy];
        return b[sortBy] - a[sortBy];
      });
    return posts;
  }

  static validateParams = (tags, sortBy, direction) => {
    if (tags.length === 0)
      throw new ExpressError("Tags parameter is required", 400);
    if (sortBy && !sortableColumns.includes(sortBy))
      throw new ExpressError("sortBy parameter is invalid", 400);
    if (!["desc", "asc"].includes(direction))
      throw new ExpressError("sortBy parameter is invalid", 400);

    return true;
  };
}

module.exports = PostService;
