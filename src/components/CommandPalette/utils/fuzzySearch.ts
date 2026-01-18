export interface SearchResult {
  item: string; score: number; matches: boolean;
}
export function fuzzySearch(query: string, text: string): SearchResult {
  const search = query.toLowerCase();
  const target = text.toLowerCase();
  if (!search) return { item: text, score: 0, matches: true };
  
  let searchIndex = 0;
  let score = 0;
  let consecutiveMatches = 0;

  for (let i = 0; i < target.length; i++) {
    if (target[i] === search[searchIndex]) {
      score += 10 + (5 * consecutiveMatches);
      consecutiveMatches++;
      searchIndex++;
      if (searchIndex === search.length) {
        return { item: text, score: score - (target.length - search.length), matches: true };
      }
    } else {
      consecutiveMatches = 0;
      score -= 1;
    }
  }
  return { item: text, score: 0, matches: false };
}