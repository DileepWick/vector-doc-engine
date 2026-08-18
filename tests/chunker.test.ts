import { recursiveChunkText } from "../src/chunker";

describe("recursiveChunkText Utility", () => {
  it("should return an empty array for empty or whitespace-only input", () => {
    expect(recursiveChunkText("")).toEqual([]);
    expect(recursiveChunkText("   \n\r  ")).toEqual([]);
  });

  it("should return a single chunk when text length is within chunkSize", () => {
    const text = "This is a short document text.";
    const chunks = recursiveChunkText(text, 800, 100);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toBe(text);
  });

  it("should split text recursively on paragraph boundaries (\\n\\n)", () => {
    const paragraph1 = "Paragraph 1: ".repeat(20);
    const paragraph2 = "Paragraph 2: ".repeat(20);
    const fullText = `${paragraph1}\n\n${paragraph2}`;

    const chunks = recursiveChunkText(fullText, 250, 20);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0]).toContain("Paragraph 1:");
  });

  it("should preserve overlapping context across adjacent chunks", () => {
    const p1 = "A".repeat(150);
    const p2 = "B".repeat(150);
    const fullText = `${p1}\n\n${p2}`;

    const chunks = recursiveChunkText(fullText, 180, 30);
    expect(chunks.length).toBeGreaterThan(1);
    // Overlapping tail of chunk 0 should appear at the head of chunk 1
    const tailChunk0 = chunks[0].slice(-30);
    expect(chunks[1]).toContain(tailChunk0.trim());
  });
});
