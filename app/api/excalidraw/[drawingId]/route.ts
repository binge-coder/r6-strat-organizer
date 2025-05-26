import fs, { promises as fsPromises } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "drawings");

// Ensure the drawings directory exists (server-side only)
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.error("Failed to create drawings directory:", err);
}

// Load drawing endpoint
export async function GET(
  request: NextRequest,
  context: { params: { drawingId: string } }
) {
  try {
    const { drawingId } = await context.params;
    const filePath = path.join(DATA_DIR, `${drawingId}.json`);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Drawing not found" }, { status: 404 });
    }

    // Read the drawing data
    const data = await fsPromises.readFile(filePath, "utf8");

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error loading drawing:", error);
    return NextResponse.json(
      { error: "Failed to load drawing" },
      { status: 500 }
    );
  }
}

// Save drawing endpoint
export async function POST(
  request: NextRequest,
  context: { params: { drawingId: string } }
) {
  try {
    const { drawingId } = await context.params;

    // Check if request has a body
    const contentLength = request.headers.get("content-length");
    if (!contentLength || contentLength === "0") {
      return NextResponse.json(
        { error: "No request body provided" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error("Error parsing JSON:", jsonError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (!body || !body.data) {
      return NextResponse.json(
        { error: "No drawing data provided" },
        { status: 400 }
      );
    }

    // Write the drawing data to a file
    const filePath = path.join(DATA_DIR, `${drawingId}.json`);
    await fsPromises.writeFile(filePath, body.data, "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving drawing:", error);
    return NextResponse.json(
      { error: "Failed to save drawing" },
      { status: 500 }
    );
  }
}
