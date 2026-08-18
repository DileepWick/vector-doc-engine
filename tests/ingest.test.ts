import path from "path";
import fs from "fs";
import { resolveDocumentPath } from "../src/ingest";

describe("resolveDocumentPath Utility", () => {
  it("should return the exact input path if the file exists directly", () => {
    const existingFile = path.join(__dirname, "ingest.test.ts");
    expect(resolveDocumentPath(existingFile)).toBe(existingFile);
  });

  it("should resolve files inside data/documents if present", () => {
    const semRegPath = path.join(process.cwd(), "data", "documents", "sem-reg.pdf");
    if (fs.existsSync(semRegPath)) {
      expect(resolveDocumentPath("sem-reg.pdf")).toBe(semRegPath);
    }
  });

  it("should fallback to input path if file does not exist anywhere", () => {
    const missing = "non_existent_file.pdf";
    expect(resolveDocumentPath(missing)).toBe(missing);
  });
});
