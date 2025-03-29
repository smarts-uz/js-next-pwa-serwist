import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const task = await request.json();
    
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, you would save the task to a database here
    console.log("Task received:", task);
    
    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process task" },
      { status: 500 }
    );
  }
} 