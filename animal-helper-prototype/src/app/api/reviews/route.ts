import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { MockVolunteer } from "@/types";
import { detectAnomaly, pickNearestVolunteer } from "@/lib/anomalyDetection";
import { computeTrustScore } from "@/lib/trustScore";

const DATA_FILE = path.join(process.cwd(), "data", "reviews.json");
const TASKS_FILE = path.join(process.cwd(), "data", "tasks.json");
const VOLUNTEERS_FILE = path.join(process.cwd(), "data", "volunteers.json");
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

function readTasks(): Array<Record<string, unknown>> {
  if (!fs.existsSync(TASKS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(TASKS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeTasks(data: unknown) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2));
}

function readVolunteers(): MockVolunteer[] {
  if (!fs.existsSync(VOLUNTEERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(VOLUNTEERS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const shelterId = request.nextUrl.searchParams.get("shelterId");
  const includeHidden = request.nextUrl.searchParams.get("includeHidden") === "true";
  const all = readAll();
  let filtered = shelterId ? all.filter((r) => r.shelterId === shelterId) : all;
  if (!includeHidden) {
    filtered = filtered.filter((r) => !r.isHidden);
  }
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const shelterId = formData.get("shelterId") as string;
  const shelterName = (formData.get("shelterName") as string) ?? "";
  const shelterLat = Number(formData.get("shelterLat") ?? 0);
  const shelterLon = Number(formData.get("shelterLon") ?? 0);
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

  // Compute trust score only for regular user reviews (not volunteer reviews)
  let trustScore: number | undefined;
  let trustReason: string | undefined;
  if (!isVolunteerReview) {
    const ts = computeTrustScore(rating, comment);
    trustScore = ts.score;
    trustReason = ts.reason;
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
    trustScore,
    trustReason,
  };

  const all = readAll();
  all.unshift(review);
  writeAll(all);

  // ── Anomaly detection ──────────────────────────────────────────────────────
  let anomalyTask = null;
  try {
    const shelterReviews = all
      .filter((r) => r.shelterId === shelterId)
      .map((r) => ({ rating: r.rating as number }));

    const anomaly = detectAnomaly(shelterReviews);

    if (anomaly) {
      const volunteers = readVolunteers();
      const nearest = pickNearestVolunteer(volunteers, shelterLat, shelterLon);

      if (nearest) {
        const task = {
          id: `task-${Date.now()}`,
          shelterId,
          shelterName,
          shelterLat,
          shelterLon,
          volunteerId: nearest.id,
          volunteerName: `${nearest.name} ${nearest.surname}`,
          volunteerEmail: nearest.email,
          status: "PENDING_ACCEPT",
          anomalyType: anomaly.type,
          avgBefore: anomaly.avgBefore,
          avgAfter: anomaly.avgAfter,
          detectedAt: new Date().toISOString(),
        };

        const tasks = readTasks();
        tasks.unshift(task);
        writeTasks(tasks);
        anomalyTask = task;
      }
    }
  } catch {
    // anomaly detection is best-effort, don't break review submission
  }

  return NextResponse.json({ review, anomalyTask }, { status: 201 });
}
