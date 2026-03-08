import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "applications.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "applications");

function ensureDirs() {
  if (!fs.existsSync(path.dirname(DATA_FILE))) fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function readAll(): Array<Record<string, unknown>> {
  ensureDirs();
  if (!fs.existsSync(DATA_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")); } catch { return []; }
}

function writeAll(data: unknown) {
  ensureDirs();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(readAll());
}

export async function POST(request: NextRequest) {
  const fd = await request.formData();

  const name = fd.get("name") as string;
  const surname = fd.get("surname") as string;
  const email = fd.get("email") as string;
  const motivation = fd.get("motivation") as string;
  const document = fd.get("document") as File | null;

  let documentName = "";
  let documentPath = "";

  if (document && document.size > 0) {
    ensureDirs();
    const ext = document.name.split(".").pop() ?? "pdf";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(await document.arrayBuffer()));
    documentName = document.name;
    documentPath = `/uploads/applications/${filename}`;
  }

  const application = {
    id: `app-${Date.now()}`,
    name,
    surname,
    email,
    motivation,
    documentName,
    documentPath,
    status: "pending",
    submittedAt: new Date().toISOString(),
    rejectionNote: null,
  };

  const all = readAll();
  all.unshift(application);
  writeAll(all);

  return NextResponse.json(application, { status: 201 });
}
