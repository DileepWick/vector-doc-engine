import { calculateCosineSimilarity } from "../src/embedder";

describe("calculateCosineSimilarity Utility", () => {
  it("should calculate exact Cosine Similarity for valid Cosine Distance", () => {
    expect(calculateCosineSimilarity(0.0)).toBe(1.0);
    expect(calculateCosineSimilarity(1.0)).toBe(0.0);
    expect(calculateCosineSimilarity(0.45)).toBeCloseTo(0.55);
  });

  it("should clamp values between 0.0 and 1.0 for out-of-bounds distances", () => {
    expect(calculateCosineSimilarity(1.5)).toBe(0.0);
    expect(calculateCosineSimilarity(-0.2)).toBe(1.0);
  });
});
