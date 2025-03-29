import { NextResponse } from 'next/server';

export async function GET() {
  // Add a timestamp to ensure the response changes each time
  const data = {
    timestamp: new Date().toISOString(),
    message: 'Test broadcast update',
  };

  // Add custom header to trigger cache update
  const headers = new Headers();
  headers.set('X-My-Custom-Header', Date.now().toString());

  return NextResponse.json(data, { headers });
} 