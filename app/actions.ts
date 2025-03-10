"use server";

import { revalidatePath } from "next/cache";

type FormData = {
  title: string;
  content: string;
};

export async function submitData(data: FormData) {
  try {
    // Validate the data
    if (!data.title || !data.content) {
      throw new Error("Title and content are required");
    }

    // In a real application, you would save this data to a database
    console.log("Received data:", data);

    // Simulate a delay to mimic a database operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Revalidate the path to update any cached data
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

export async function testNotification() {
  try {
    // This is a server action that would trigger a push notification
    // In a real application, you would use a push notification service

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true, message: "Test notification sent" };
  } catch (error) {
    console.error("Error sending test notification:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
