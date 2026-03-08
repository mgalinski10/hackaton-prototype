import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "reviews.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "reviews");

function ensureDirs() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readAll(): Array<Record<string, unknown>> {
  ensureDirs();
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeAll(data: unknown) {
  ensureDirs();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  const shelterId = request.nextUrl.searchParams.get("shelterId");
  const all = readAll();
  const filtered = shelterId ? all.filter((r) => r.shelterId === shelterId) : all;
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const shelterId = formData.get("shelterId") as string;
  const name = formData.get("name") as string;
  const surname = formData.get("surname") as string;
  const rating = Number(formData.get("rating"));
  const comment = (formData.get("comment") as string) ?? "";
  const isVolunteerReview = formData.get("isVolunteerReview") === "true";
  const photo = formData.get("photo") as File | null;

  let photoUrl: string | undefined;
  if (photo && photo.size > 0) {
    ensureDirs();
    const ext = photo.name.split(".").pop() ?? "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await photo.arrayBuffer());
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), buffer);
    photoUrl = `/uploads/reviews/${filename}`;
  }

  const review = {
    shelterId,
    id: `r-${Date.now()}`,
    name,
    surname,
    rating,
    comment,
    isVolunteerReview,
    photoUrl,
    createdAt: new Date().toISOString(),
  };

  const all = readAll();
  all.unshift(review);
  writeAll(all);

  return NextResponse.json(review, { status: 201 });
}
