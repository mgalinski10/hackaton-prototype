import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { FlaggedReview } from "@/types";

const FLAGS_FILE = path.join(process.cwd(), "data", "flagged-reviews.json");
const REVIEWS_FILE = path.join(process.cwd(), "data", "reviews.json");

function readFlags(): FlaggedReview[] {
  if (!fs.existsSync(FLAGS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(FLAGS_FILE, "utf-8")); } catch { return []; }
}

function writeFlags(data: FlaggedReview[]) {
  fs.writeFileSync(FLAGS_FILE, JSON.stringify(data, null, 2));
}

function readReviews(): Array<Record<string, unknown>> {
  if (!fs.existsSync(REVIEWS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8")); } catch { return []; }
}

function writeReviews(data: unknown) {
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(data, null, 2));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: { status: "DISMISSED" | "HIDDEN" } = await request.json();

  const flags = readFlags();
  const idx = flags.findIndex((f) => f.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated: FlaggedReview = {
    ...flags[idx],
    status: body.status,
    resolvedAt: new Date().toISOString(),
  };
  flags[idx] = updated;
  writeFlags(flags);

  // If hidden — also mark the review as hidden in reviews.json
  if (body.status === "HIDDEN") {
    const reviews = readReviews();
    const rIdx = reviews.findIndex((r) => r.id === updated.reviewId);
    if (rIdx !== -1) {
      reviews[rIdx] = { ...reviews[rIdx], isHidden: true };
      writeReviews(reviews);
    }
  }

  return NextResponse.json(updated);
}
