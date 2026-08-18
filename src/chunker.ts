/**
 * Recursive sentence & paragraph aware chunker.
 * Splits on high-level structural boundaries (\n\n, \n, . , space) before falling back to character limits.
 */
export function recursiveChunkText(
  text: string,
  chunkSize = 800,
  overlap = 100,
  separators: string[] = ["\n\n", "\n", ". ", " "]
): string[] {
  const cleanText = text.replace(/\r\n/g, "\n").trim();
  if (!cleanText) return [];

  function splitRecursively(content: string, sepIndex: number): string[] {
    if (content.length <= chunkSize) {
      return [content];
    }

    if (sepIndex >= separators.length) {
      const slices: string[] = [];
      let start = 0;
      while (start < content.length) {
        slices.push(content.slice(start, start + chunkSize));
        start += chunkSize - overlap;
      }
      return slices;
    }

    const separator = separators[sepIndex];
    const rawSplits = content.split(separator);

    const mergedChunks: string[] = [];
    let currentChunk = "";

    for (const split of rawSplits) {
      const piece = currentChunk ? currentChunk + separator + split : split;
      if (piece.length <= chunkSize) {
        currentChunk = piece;
      } else {
        if (currentChunk) {
          mergedChunks.push(currentChunk);
        }
        if (split.length > chunkSize) {
          const subSplits = splitRecursively(split, sepIndex + 1);
          mergedChunks.push(...subSplits);
          currentChunk = "";
        } else {
          currentChunk = split;
        }
      }
    }

    if (currentChunk) {
      mergedChunks.push(currentChunk);
    }

    return mergedChunks;
  }

  const rawChunks = splitRecursively(cleanText, 0);

  const overlappedChunks: string[] = [];
  for (let i = 0; i < rawChunks.length; i++) {
    if (i === 0) {
      overlappedChunks.push(rawChunks[i]);
    } else {
      const prevChunk = rawChunks[i - 1];
      const overlapPrefix = prevChunk.slice(Math.max(0, prevChunk.length - overlap));
      overlappedChunks.push(overlapPrefix + " " + rawChunks[i]);
    }
  }

  return overlappedChunks;
}
