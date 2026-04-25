/**
 * Lightweight fuzzy search and highlighting helpers.
 *
 * No external deps. Designed for small in-memory collections (stories,
 * characters, worlds, templates) — not for large-scale indexing. We score
 * each candidate by how well its fields match the query and return them
 * sorted, alongside highlighted segments suitable for rendering.
 */

export type Highlighted = Array<{ text: string; match: boolean }>;

export type ScoredItem<T> = {
  item: T;
  score: number;
  highlights: Record<string, Highlighted>;
};

const WORD_RE = /\s+/;

export function normalize(value: string): string {
  return value.toLocaleLowerCase("ru").trim();
}

/**
 * Score a single field against a query. Combines:
 *   - word-prefix matches (high weight)
 *   - substring matches (medium weight)
 *   - subsequence/fuzzy matches (low weight)
 * Returns 0 if nothing matched.
 */
export function fieldScore(field: string, queryWords: string[]): number {
  if (queryWords.length === 0) {
    return 0;
  }

  const haystack = normalize(field);
  if (!haystack) {
    return 0;
  }

  let total = 0;

  for (const word of queryWords) {
    const w = normalize(word);
    if (!w) continue;

    if (haystack === w) {
      total += 10;
      continue;
    }

    const tokens = haystack.split(WORD_RE);
    const startsWithToken = tokens.some((token) => token.startsWith(w));
    if (startsWithToken) {
      total += 6;
      continue;
    }

    const idx = haystack.indexOf(w);
    if (idx !== -1) {
      total += 3 + (idx === 0 ? 2 : 0);
      continue;
    }

    // subsequence (fuzzy): all chars of w appear in order
    let cursor = 0;
    let last = -1;
    let gaps = 0;
    for (let i = 0; i < haystack.length && cursor < w.length; i += 1) {
      if (haystack[i] === w[cursor]) {
        if (last !== -1) gaps += i - last - 1;
        last = i;
        cursor += 1;
      }
    }
    if (cursor === w.length) {
      total += Math.max(0.4, 1.5 - gaps * 0.05);
    }
  }

  return total;
}

/**
 * Highlight matches inside text. We highlight any word/substring match for
 * each query word (case-insensitive). For pure subsequence-only matches we
 * skip highlighting to avoid scattered single-letter highlights.
 */
export function highlight(text: string, query: string): Highlighted {
  if (!query.trim()) {
    return [{ text, match: false }];
  }

  const words = query
    .split(WORD_RE)
    .map((w) => w.trim())
    .filter(Boolean)
    .map(normalize);

  if (words.length === 0) {
    return [{ text, match: false }];
  }

  const lower = normalize(text);
  const ranges: Array<[number, number]> = [];

  for (const w of words) {
    if (!w) continue;
    let from = 0;
    while (from <= lower.length) {
      const idx = lower.indexOf(w, from);
      if (idx === -1) break;
      ranges.push([idx, idx + w.length]);
      from = idx + w.length;
    }
  }

  if (ranges.length === 0) {
    return [{ text, match: false }];
  }

  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }

  const out: Highlighted = [];
  let cursor = 0;
  for (const [start, end] of merged) {
    if (cursor < start) {
      out.push({ text: text.slice(cursor, start), match: false });
    }
    out.push({ text: text.slice(start, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) {
    out.push({ text: text.slice(cursor), match: false });
  }
  return out;
}

export type FieldsFn<T> = (item: T) => Record<string, string | undefined>;

/**
 * Fuzzy filter and sort a collection by a query.
 *
 * Each item is scored across its fields (weighted by `weights`, default 1).
 * Items with score 0 are dropped. The top items are returned with their
 * highlighted fields ready for rendering.
 */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  getFields: FieldsFn<T>,
  options?: {
    weights?: Record<string, number>;
    limit?: number;
  }
): ScoredItem<T>[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return items.map((item) => ({ item, score: 0, highlights: {} }));
  }

  const words = trimmed.split(WORD_RE).filter(Boolean);
  const weights = options?.weights ?? {};

  const scored = items
    .map((item) => {
      const fields = getFields(item);
      let total = 0;
      const highlights: Record<string, Highlighted> = {};
      for (const [name, value] of Object.entries(fields)) {
        if (!value) continue;
        const w = weights[name] ?? 1;
        const s = fieldScore(value, words);
        if (s > 0) {
          total += s * w;
          highlights[name] = highlight(value, trimmed);
        }
      }
      return { item, score: total, highlights };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return options?.limit ? scored.slice(0, options.limit) : scored;
}
