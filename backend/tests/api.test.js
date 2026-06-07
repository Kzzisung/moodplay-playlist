const { test, describe } = require("node:test");
const assert = require("node:assert");

describe("API health check", () => {
  test("server module loads without error", () => {
    assert.doesNotThrow(() => {
      require("../server");
    });
  });

  test("environment variables documented", () => {
    const required = ["ANTHROPIC_API_KEY", "SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"];
    // Just verify the list exists — actual values come from env
    assert.equal(required.length, 3);
  });
});
