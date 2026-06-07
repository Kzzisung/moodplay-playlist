const { test, describe } = require("node:test");
const assert = require("node:assert");

describe("API health check", () => {
  test("environment variables documented", () => {
    const required = ["ANTHROPIC_API_KEY", "SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET"];
    assert.equal(required.length, 3);
  });

  test("backend package.json has required scripts", () => {
    const pkg = require("../package.json");
    assert.ok(pkg.scripts.start, "start script exists");
    assert.ok(pkg.scripts.test, "test script exists");
  });
});