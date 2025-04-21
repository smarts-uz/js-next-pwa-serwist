import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileId = formData.get("fileId") as string;
    const fileName = formData.get("fileName") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    console.log("File received:", {
      id: fileId,
      name: fileName,
      size: file.size,
      type: file.type,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      file: {
        id: fileId,
        name: fileName,
        size: file.size,
        type: file.type,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
