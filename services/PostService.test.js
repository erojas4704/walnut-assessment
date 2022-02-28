const request = require("supertest");
const app = require("../app");

describe("GET > api", () => {
  test("Ping should return a simple JSON response", async () => {
    const response = await request(app).get("/api/ping");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
});

describe("GET > posts", () => {
  test("Get posts", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health,design,science,tech" });

    expect(response.body).toHaveProperty("posts");
    expect(response.statusCode).toBe(200);
  });

  test("Get posts without duplicates", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health,design" });

    expect(response.body).toHaveProperty("posts");
    expect(response.statusCode).toBe(200);
    expect(hasDuplicateIds(response.body.posts)).toBe(false);
  });
});

describe("GET > posts data validation", () => {
  test("Get posts sorted by id in ascending order", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health", sortBy: "id", direction: "asc" });

    expect(response.statusCode).toBe(200);
    expect(isSortedByField(response.body.posts, "id", true)).toBe(true);
  });

  test("Get posts sorted by reads in ascending order", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health", sortBy: "reads", direction: "asc" });

    expect(response.statusCode).toBe(200);
    expect(isSortedByField(response.body.posts, "reads", true)).toBe(true);
  });

  test("Get posts sorted by reads in descending order", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health", sortBy: "reads", direction: "desc" });

    expect(response.statusCode).toBe(200);
    expect(isSortedByField(response.body.posts, "reads", false)).toBe(true);
  });

  test("Get posts sorted by likes in ascending order", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health", sortBy: "likes", direction: "asc" });

    expect(response.statusCode).toBe(200);
    expect(isSortedByField(response.body.posts, "likes", true)).toBe(true);
  });

  test("Get posts sorted by likes in descending order", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health", sortBy: "likes", direction: "desc" });

    expect(response.statusCode).toBe(200);
    expect(isSortedByField(response.body.posts, "likes", false)).toBe(true);
  });

  test("Get posts sorted by popularity in ascending order", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health", sortBy: "popularity", direction: "asc" });

    expect(response.statusCode).toBe(200);
    expect(isSortedByField(response.body.posts, "popularity", true)).toBe(true);
  });

  test("Get posts sorted by popularity in descending order", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health", sortBy: "popularity", direction: "desc" });

    expect(response.statusCode).toBe(200);
    expect(isSortedByField(response.body.posts, "popularity", false)).toBe(
      true
    );
  });
});

describe("GET > posts error handling", () => {
  test("Should return a 400 error with no tags", async () => {
    const response = await request(app).get("/api/posts");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toBe("Tags parameter is required");
  });

  test("Should return a 400 error with an invalid sorting field", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health,design", sortBy: "barriguite" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toBe("sortBy parameter is invalid");
  });

  test("Should return a 400 error with an invalid ascending/descending field", async () => {
    const response = await request(app)
      .get("/api/posts")
      .query({ tags: "health,design", direction: "panchibu" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error.message).toBe("sortBy parameter is invalid");
  });
});

const hasDuplicateIds = (posts) => {
  const ids = {};
  for (const post of posts) {
    if (ids[post.id]) return true;
    ids[post.id] = true;
  }
  return false;
};

/**
 * Takes an array of posts and checks to make sure it matches with a sorted array of posts by id.
 * @param {Array} posts
 */
const isSortedByField = (posts, field = "id", ascending = true) => {
  const sortedPosts = [...posts].sort((a, b) =>
    ascending ? a[field] - b[field] : b[field] - a[field]
  );
  //   console.log(sortedPosts.map((p) => p[field]));
  return posts.every((post, i) => post[field] === sortedPosts[i][field]);
};
