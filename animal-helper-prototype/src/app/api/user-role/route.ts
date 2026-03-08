import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "applications.json");

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ role: null });

  if (!fs.existsSync(DATA_FILE)) return NextResponse.json({ role: null });

  try {
    const apps = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as Array<Record<string, unknown>>;
    const approved = apps.find((a) => a.email === email && a.status === "approved");
    return NextResponse.json({ role: approved ? "VOLUNTEER" : null });
  } catch {
    return NextResponse.json({ role: null });
  }
}
