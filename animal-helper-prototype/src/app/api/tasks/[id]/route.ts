import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { InspectionTask, TaskStatus } from "@/types";

const DATA_FILE = path.join(process.cwd(), "data", "tasks.json");

function readAll(): InspectionTask[] {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeAll(data: InspectionTask[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body: { status: TaskStatus; linkedReviewId?: string } = await request.json();
  const all = readAll();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const now = new Date().toISOString();
  const updated: InspectionTask = {
    ...all[idx],
    status: body.status,
    ...(body.status === "ACCEPTED" ? { acceptedAt: now } : {}),
    ...(body.status === "COMPLETED" ? { completedAt: now } : {}),
    ...(body.linkedReviewId ? { linkedReviewId: body.linkedReviewId } : {}),
  };

  all[idx] = updated;
  writeAll(all);
  return NextResponse.json(updated);
}
