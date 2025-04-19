import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: 200,
      message: "This is the modified response with modified headers",
      timestamp: new Date().toISOString(),
      modified: true,

    },
    {
      headers: {
        "x-modified-header": "modified-value",
        "x-custom-header": "modified-custom-value",
        "content-type": "application/json, multipart/form-data",
      },
    }
  );
}
