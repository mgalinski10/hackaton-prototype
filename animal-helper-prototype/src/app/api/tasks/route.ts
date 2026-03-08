import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { InspectionTask } from "@/types";

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

export async function GET(request: NextRequest) {
  const volunteerEmail = request.nextUrl.searchParams.get("volunteerEmail");
  const all = readAll();
  const filtered = volunteerEmail
    ? all.filter((t) => t.volunteerEmail === volunteerEmail)
    : all;
  return NextResponse.json(filtered);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const task: InspectionTask = {
    ...body,
    id: `task-${Date.now()}`,
    status: "PENDING_ACCEPT",
    detectedAt: new Date().toISOString(),
  };
  const all = readAll();
  all.unshift(task);
  writeAll(all);
  return NextResponse.json(task, { status: 201 });
}
