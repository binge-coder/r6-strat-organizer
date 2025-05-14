import fs, { promises as fsPromises } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "drawings");

// Ensure the drawings directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.error("Failed to create drawings directory:", err);
}

// Generate a unique ID for a new drawing
function generateUniqueID(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Create a new drawing endpoint
export async function POST(request: NextRequest) {
  try {
    // Generate a unique ID
    const drawingID = generateUniqueID();

    // Create an empty drawing with default content
    const emptyDrawing = JSON.stringify({
      elements: [],
      appState: {
        viewBackgroundColor: "#ffffff",
        currentItemFontFamily: 1,
      },
    });

    // Write the empty drawing to a file
    const filePath = path.join(DATA_DIR, `${drawingID}.json`);
    await fsPromises.writeFile(filePath, emptyDrawing, "utf8");

    return NextResponse.json({ success: true, drawingID });
  } catch (error) {
    console.error("Error creating drawing:", error);
    return NextResponse.json(
      { error: "Failed to create drawing" },
      { status: 500 }
    );
  }
}
