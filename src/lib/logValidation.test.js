import test from "node:test";
import assert from "node:assert/strict";
import { logFieldError } from "./logValidation.js";

test("blank is allowed (logging is optional)", () => {
  for (const field of ["sets", "reps", "seconds", "weight"]) {
    assert.equal(logFieldError(field, ""), "");
    assert.equal(logFieldError(field, "   "), "");
    assert.equal(logFieldError(field, undefined), "");
  }
});

test("valid numbers are accepted", () => {
  assert.equal(logFieldError("sets", "3"), "");
  assert.equal(logFieldError("sets", "0"), "");
  assert.equal(logFieldError("reps", "12"), "");
  assert.equal(logFieldError("seconds", "45"), "");
  assert.equal(logFieldError("weight", "135"), "");
  assert.equal(logFieldError("weight", "22.5"), "");
  assert.equal(logFieldError("weight", "2000"), "");
});

test("negative, fractional, and non-numeric values are rejected", () => {
  for (const value of ["-5", "2.5", "abc", "1e3", "3 sets", "+3", "-"]) {
    assert.match(logFieldError("reps", value), /whole number/, `reps ${value}`);
  }
  for (const value of ["-10", "abc", "12.345", "1e2", "."]) {
    assert.match(logFieldError("weight", value), /must be a number/, `weight ${value}`);
  }
});

test("values above the limit are rejected with the range", () => {
  assert.equal(logFieldError("sets", "51"), "Sets must be from 0 to 50.");
  assert.equal(logFieldError("weight", "2000.5"), "Weight must be from 0 to 2,000 lb.");
  assert.equal(logFieldError("seconds", "3601"), "Seconds must be from 0 to 3,600.");
});
