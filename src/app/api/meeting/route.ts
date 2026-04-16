import { NextResponse } from "next/server";
import { getMeetings } from "@/lib/meeting";

export async function GET() {
  const data = await getMeetings();

  return NextResponse.json(data);
}