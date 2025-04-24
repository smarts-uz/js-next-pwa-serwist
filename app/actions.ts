"use server";

import { revalidatePath } from "next/cache";

type FormData = {
  title: string;
  content: string;
};

export async function submitData(data: FormData) {
  try {
    if (!data.title || !data.content) {
      throw new Error("Title and content are required");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    revalidatePath("/");

    return { success: true, message: "Data submitted successfully" };
  } catch (error) {
    console.error("Error submitting data:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
