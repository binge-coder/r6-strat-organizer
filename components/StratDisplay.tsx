"use client";
import { getExcalidrawEditURL } from "@/src/excalidraw";
import { Ban } from "lucide-react";
import { useEffect, useState } from "react";
import ExcalidrawViewer from "./ExcalidrawViewer";

export interface StratDisplayProps {
  strat: Strat | null;
  editView?: boolean;
}

export default function StratDisplay(props: StratDisplayProps) {
  const [drawingData, setDrawingData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDrawing = async () => {
      if (!props.strat?.drawingID) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/excalidraw/${props.strat.drawingID}`
        );
        if (response.ok) {
          const result = await response.json();
          setDrawingData(result.data);
        }
      } catch (error) {
        console.error("Error loading drawing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDrawing();
  }, [props.strat?.drawingID]);

  return (
    <div className="relative h-full w-full flex justify-center items-center flex-col z-0">
      {props.strat?.drawingID ? (
        <>
          <div className="w-full flex-1 flex flex-col">
            {" "}
            {isLoading ? (
              <div className="flex-1 flex justify-center items-center">
                Loading...
              </div>
            ) : drawingData ? (
              props.editView ? (
                // Use ExcalidrawEditor when in edit mode
                <iframe
                  src={getExcalidrawEditURL(props.strat.drawingID)}
                  className="w-full h-full border-0"
                  style={{ minHeight: "500px" }}
                />
              ) : (
                // Use ExcalidrawViewer for view-only mode
                <ExcalidrawViewer drawingData={drawingData} />
              )
            ) : (
              <div className="flex-1 flex justify-center items-center flex-col gap-4">
                <Ban className="text-muted-foreground" height={64} width={64} />
                <p className="text-muted-foreground">
                  Drawing could not be loaded
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-between items-center w-full p-2 bg-background rounded">
            {" "}
            <div className="flex gap-2">
              {props.strat.map}
              {" | "}
              {props.strat.site}
              {" | "}
              {props.strat.name}
            </div>
          </div>
        </>
      ) : (
        <>
          <Ban className="text-muted-foreground" height={64} width={64} />
          <p className="text-muted-foreground">No strat selected</p>
        </>
      )}
    </div>
  );
}
