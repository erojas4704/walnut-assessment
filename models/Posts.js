const { default: axios } = require("axios");
const baseURL =
  process.env.BASE_URL || "https://api.hatchways.io/assessment/blog";

/**
 * Posts class simulates data access layer.
 */
class Posts {
  static async getPostsByTag(tag) {
    const response = await axios.get(`${baseURL}/posts`, { params: { tag } });
    return response.data.posts;
  }
}

module.exports = Posts;
