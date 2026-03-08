import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { FlaggedReview } from "@/types";

const DATA_FILE = path.join(process.cwd(), "data", "flagged-reviews.json");

function readAll(): FlaggedReview[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeAll(data: FlaggedReview[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  const flaggedBy = request.nextUrl.searchParams.get("flaggedBy");
  const all = readAll();
  const filtered = flaggedBy
    ? all.filter((f) => f.flaggedByEmail === flaggedBy)
    : all;
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const flag: FlaggedReview = {
    ...body,
    id: `flag-${Date.now()}`,
    status: "PENDING",
    flaggedAt: new Date().toISOString(),
  };
  const all = readAll();
  all.unshift(flag);
  writeAll(all);
  return NextResponse.json(flag, { status: 201 });
}
