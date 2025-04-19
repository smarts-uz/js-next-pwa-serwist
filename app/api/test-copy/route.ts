import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const shouldChange = searchParams.get("change") === "true";
  const isBodyChange = searchParams.get("changeType") === "body";

  const message =
    isBodyChange && shouldChange
      ? `Response body changed at ${new Date().toISOString()}`
      : "This is a stable response body";

  const responseBody = {
    status: 200,
    message,
    timestamp: new Date().toISOString(),
  };

  const headers = {
    "content-type": "application/json",
    "content-length": new TextEncoder()
      .encode(JSON.stringify(responseBody))
      .length.toString(),
    "cache-control": "no-cache",
    etag:
      shouldChange && !isBodyChange
        ? `"etag-${Date.now()}"`
        : `"etag-static-value"`,
    "last-modified":
      shouldChange && !isBodyChange
        ? new Date().toUTCString()
        : new Date(2023, 0, 1).toUTCString(),
  };

  return NextResponse.json(responseBody, { headers });
}
