"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Import Excalidraw dynamically with SSR disabled
const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        Loading Excalidraw...
      </div>
    ),
  }
);

// Import CSS in a useEffect to avoid SSR issues
interface ExcalidrawViewerProps {
  drawingData: string | null;
}

const ExcalidrawViewer: React.FC<ExcalidrawViewerProps> = ({ drawingData }) => {
  const [parsedData, setParsedData] = useState<any>(null);
  const { theme } = useTheme(); // Import CSS on the client side
  useEffect(() => {
    // @ts-ignore - CSS import may not have type declarations
    import("@excalidraw/excalidraw/index.css").catch(() => {
      // CSS import may fail in some environments, but it's not critical
    });
  }, []);

  // Parse the drawing data when it becomes available
  useEffect(() => {
    if (drawingData) {
      try {
        const parsed = JSON.parse(drawingData);
        setParsedData(parsed);
      } catch (e) {
        console.error("Failed to parse drawingData:", e);
      }
    }
  }, [drawingData]);

  // Don't render Excalidraw until we have parsed data
  if (!parsedData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading drawing...
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%", minHeight: "500px" }}>
      {typeof window !== "undefined" && (
        <Excalidraw
          initialData={{
            elements: parsedData.elements || [],
            appState: {
              ...parsedData.appState,
              theme: theme === "dark" ? "dark" : "light",
            },
          }}
          viewModeEnabled={true}
          UIOptions={{
            canvasActions: {
              export: false,
              saveAsImage: false,
              loadScene: false,
              saveToActiveFile: false,
            },
          }}
        />
      )}
    </div>
  );
};

export default ExcalidrawViewer;
