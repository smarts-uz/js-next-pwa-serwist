import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = parseInt(searchParams.get("status") || "200");
  const requestUrl = request.url;

  console.log(`Processing request to ${requestUrl} with status ${status}`);

  const messages = {
    200: "This is a successful response with a valid API key that will be cached",
    404: "This response will not be cached because it is a 404 error",
    500: "This response will not be cached because it is a server error",
  };

  const apiKey = `api_${Math.random()
    .toString(36)
    .substring(2, 15)}_${Date.now()}`;

  // Calculate timestamp and expiration time
  const timestamp = Date.now();
  const expiresAt = timestamp + 60 * 1000; // 1 minute from now

  const responseBody = {
    status,
    message: messages[status as keyof typeof messages] || "Unknown status",
    timestamp,
    expiresAt,
    cached: false, // This will be set by the service worker
    apiKey: status === 200 ? apiKey : null,
    expiresIn: status === 200 ? "1 minute" : null,
    isExpired: false,
    requestUrl,
    cacheInfo: {
      isCacheable: status === 200,
      possibleCacheKey: "/api/test-response?status=200"
    }
  };

  console.log(`Responding with status ${status}, timestamp ${timestamp}`);

  return NextResponse.json(responseBody, {
    status,
    headers: {
      "X-Serwist-Broadcast-Update": "true",
      "X-Is-Cacheable": status === 200 ? "true" : "false",
      "X-Response-Status": status.toString(),
      "X-API-Key": responseBody.apiKey || "",
      "X-Timestamp": timestamp.toString(),
      "X-Expires-At": expiresAt.toString(),
      "Cache-Control": status === 200 ? "max-age=60" : "no-store"
    },
  });
}
