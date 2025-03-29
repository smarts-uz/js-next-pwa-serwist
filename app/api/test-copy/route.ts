import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 200,
    message: 'This is the original response with original headers',
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'x-original-header': 'original-value',
      'x-custom-header': 'custom-value',
      'content-type': 'application/json'
    }
  });
} 