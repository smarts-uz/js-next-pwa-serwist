import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    timestamp: new Date().toISOString(),
    message: "Test broadcast update",
  };

  const headers = new Headers();
  headers.set("X-My-Custom-Header", Date.now().toString());

  return NextResponse.json(data, { headers });
}
