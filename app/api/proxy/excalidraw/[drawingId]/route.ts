import { loadDrawing } from "@/src/excalidraw";
import { NextRequest, NextResponse } from "next/server";

// This proxy handler can fetch content from both Excalidraw or fallback to Google Drawings
export async function GET(
  request: NextRequest,
  { params }: { params: { drawingId: string } }
) {
  try {
    const drawingId = params.drawingId;

    // Try to get the drawing from our Excalidraw storage
    const drawing = loadDrawing(drawingId);

    if (drawing) {
      // If we have the drawing locally, return it
      return NextResponse.json({ data: drawing });
    } else {
      // If we don't have the drawing locally, we'll return a 404
      // In a real migration scenario, you might want to try fetching from Google Drawings
      // or another fallback mechanism here
      return NextResponse.json({ error: "Drawing not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error loading drawing:", error);
    return NextResponse.json(
      { error: "Failed to load drawing" },
      { status: 500 }
    );
  }
}
