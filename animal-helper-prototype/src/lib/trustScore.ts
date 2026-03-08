/**
 * Mock AI Trust Score — heuristic approximation of what an LLM would compute.
 * Scores 0-100. High score = trustworthy review, low = suspected manipulation/trolling.
 */

const SPECIFIC_KEYWORDS = [
  "pies", "psy", "piesek", "kot", "koty", "kotek",
  "adopcja", "adopcję", "adoptował", "adoptowałam",
  "personel", "pracownicy", "pracownik",
  "wolontariusz", "boksy", "boks", "wybiegi", "wybieg",
  "warunki", "czysto", "czystość", "zadbane", "zadbany",
  "weterynarz", "weterynaryjny", "opieka",
  "schronisko", "zwierzęta", "zwierzę",
  "rehabilitacja", "socjalizacja", "sterylizacja",
  "program", "adopcyjny", "fundacja", "stowarzyszenie",
];

export function computeTrustScore(
  rating: number,
  comment: string
): { score: number; reason: string } {
  const trimmed = comment.trim();
  const len = trimmed.length;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  if (len === 0) {
    return {
      score: 18,
      reason: "Brak komentarza — ocena bez uzasadnienia",
    };
  }

  let score = 60;

  // Length
  if (len < 15) score -= 35;
  else if (len < 30) score -= 15;
  else if (len >= 60) score += 12;
  if (len >= 120) score += 8;

  // Extreme rating + short comment
  if ((rating === 1 || rating === 5) && len < 25) score -= 20;

  // Specific keyword bonus
  const lower = trimmed.toLowerCase();
  const hits = SPECIFIC_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  score += Math.min(hits * 7, 22);

  // Repetition penalty
  if (wordCount > 3) {
    const unique = new Set(words.map((w) => w.toLowerCase())).size;
    const ratio = unique / wordCount;
    if (ratio < 0.45) score -= 28;
    else if (ratio < 0.6) score -= 10;
  }

  // ALL CAPS penalty
  const letters = (trimmed.match(/[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g) ?? []).length;
  const upper = (trimmed.match(/[A-ZŁŚŻŹĆŃÓĄ]/g) ?? []).length;
  if (letters > 5 && upper / letters > 0.6) score -= 18;

  // Gibberish / excessive punctuation
  const gibberish = (trimmed.match(/[!?]{2,}|[a-ząćęłńóśźż]{15,}/gi) ?? []).length;
  if (gibberish > 0) score -= 12;

  score = Math.max(5, Math.min(97, score));

  const reason =
    score >= 80
      ? "Komentarz szczegółowy i merytoryczny — wysoka wiarygodność"
      : score >= 65
      ? "Komentarz ogólny, bez wyraźnych oznak manipulacji"
      : score >= 45
      ? "Krótki lub mało konkretny komentarz przy skrajnej ocenie"
      : "Podejrzany wzorzec — możliwy trolling lub fałszywa recenzja";

  return { score, reason };
}
