"use client";
import ExcalidrawViewer from "@/components/ExcalidrawViewer";
import { use, useEffect, useState } from "react";

interface ViewDrawingParams {
  params: Promise<{
    drawingId: string;
  }>;
}

export default function ViewDrawingPage({ params }: ViewDrawingParams) {
  const { drawingId } = use(params);
  const [drawingData, setDrawingData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const loadDrawing = async () => {
      try {
        const response = await fetch(`/api/excalidraw/${drawingId}`);
        const result = await response.json();

        if (response.ok && result.data) {
          setDrawingData(result.data);
        }
      } catch (error) {
        console.error("Error loading drawing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDrawing();
  }, [drawingId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!drawingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Drawing not found
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <ExcalidrawViewer drawingData={drawingData} />
    </div>
  );
}
