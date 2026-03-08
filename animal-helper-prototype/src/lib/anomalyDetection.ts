import { AnomalyType } from "@/types";

export interface AnomalyResult {
  type: AnomalyType;
  avgBefore: number;
  avgAfter: number;
}

/**
 * Detects sudden rating anomalies for a shelter.
 * Compares the newest review rating against the average of up to 4 previous reviews.
 * Returns an anomaly if the difference is >= 2 stars in either direction.
 *
 * Reviews must be sorted newest-first (reviews[0] is the most recent).
 * Requires at least 2 reviews (1 new + at least 1 previous).
 */
export function detectAnomaly(
  reviews: Array<{ rating: number }>
): AnomalyResult | null {
  if (reviews.length < 2) return null;

  const newestRating = reviews[0].rating;
  const previous = reviews.slice(1, 5); // up to 4 previous
  const avgBefore =
    previous.reduce((sum, r) => sum + r.rating, 0) / previous.length;
  const avgBeforeRounded = Math.round(avgBefore * 10) / 10;

  const diff = newestRating - avgBefore;

  if (diff <= -2) {
    return { type: "SUDDEN_DROP", avgBefore: avgBeforeRounded, avgAfter: newestRating };
  }
  if (diff >= 2) {
    return { type: "SUDDEN_SPIKE", avgBefore: avgBeforeRounded, avgAfter: newestRating };
  }

  return null;
}

/**
 * Picks the nearest volunteer to a shelter using simple Euclidean distance on lat/lon.
 */
export function pickNearestVolunteer<T extends { lat: number; lon: number }>(
  volunteers: T[],
  shelterLat: number,
  shelterLon: number
): T | null {
  if (volunteers.length === 0) return null;

  return volunteers.reduce((nearest, v) => {
    const distV = Math.sqrt(
      (v.lat - shelterLat) ** 2 + (v.lon - shelterLon) ** 2
    );
    const distN = Math.sqrt(
      (nearest.lat - shelterLat) ** 2 + (nearest.lon - shelterLon) ** 2
    );
    return distV < distN ? v : nearest;
  });
}
