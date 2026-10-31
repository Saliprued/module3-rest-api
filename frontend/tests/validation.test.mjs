import test from "node:test";
import assert from "node:assert/strict";
import { isValidTitle } from "../src/validation.mjs";

test("A normal title is accepted", () => {
  assert.equal(isValidTitle("Coding workshop"), true);
});

test("An empty string is rejected", () => {
  assert.equal(isValidTitle(""), false);
});

test("A spaces-only string is rejected", () => {
  assert.equal(isValidTitle("   "), false);
});
