"use client";

// Client-side URL functions
export function getExcalidrawEditURL(drawingID: string) {
  return `/excalidraw/edit/${drawingID}`;
}

export function getExcalidrawViewURL(drawingID: string) {
  return `/excalidraw/view/${drawingID}`;
}

// Generate a unique ID for a new drawing
export function generateUniqueID(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Create a new drawing via API call
export async function createNewDrawing(): Promise<string> {
  try {
    const response = await fetch("/api/excalidraw/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create drawing");
    }

    const data = await response.json();
    return data.drawingID;
  } catch (error) {
    console.error("Error creating drawing:", error);
    // Fallback to client-side ID generation if API call fails
    return generateUniqueID();
  }
}
