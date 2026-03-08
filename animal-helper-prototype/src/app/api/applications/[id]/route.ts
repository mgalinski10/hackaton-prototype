import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "applications.json");

function readAll(): Array<Record<string, unknown>> {
  if (!fs.existsSync(DATA_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")); } catch { return []; }
}

function writeAll(data: unknown) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as { status: string; rejectionNote?: string };

  const all = readAll();
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  all[idx] = { ...all[idx], status: body.status, rejectionNote: body.rejectionNote ?? null };
  writeAll(all);

  return NextResponse.json(all[idx]);
}
