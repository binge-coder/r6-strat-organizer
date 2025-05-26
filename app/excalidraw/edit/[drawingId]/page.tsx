"use client";
import ExcalidrawEditor from "@/components/ExcalidrawEditor";
import { use, useEffect, useState } from "react";

interface EditDrawingParams {
  params: Promise<{
    drawingId: string;
  }>;
}

export default function EditDrawingPage({ params }: EditDrawingParams) {
  const { drawingId } = use(params);
  const [drawingData, setDrawingData] = useState<string | undefined>(undefined);
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
  const handleSave = async (data: string) => {
    try {
      await fetch(`/api/excalidraw/${drawingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
    } catch (error) {
      console.error("Error saving drawing:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <ExcalidrawEditor initialData={drawingData} onSave={handleSave} />
    </div>
  );
}
