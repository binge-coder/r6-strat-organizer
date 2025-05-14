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
  drawingData: string;
}

const ExcalidrawViewer: React.FC<ExcalidrawViewerProps> = ({ drawingData }) => {
  const [elements, setElements] = useState<any[]>([]);
  const { theme } = useTheme();

  // Import CSS on the client side
  useEffect(() => {
    import("@excalidraw/excalidraw/index.css");
  }, []);

  useEffect(() => {
    if (drawingData) {
      try {
        const parsedData = JSON.parse(drawingData);
        if (parsedData.elements) {
          setElements(parsedData.elements);
        }
      } catch (e) {
        console.error("Failed to parse drawingData:", e);
      }
    }
  }, [drawingData]);

  return (
    <div style={{ height: "100%", width: "100%", minHeight: "500px" }}>
      {" "}
      {typeof window !== "undefined" && (
        <Excalidraw
          initialData={{
            elements,
            appState: {
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
              theme: false,
            },
          }}
        />
      )}
    </div>
  );
};

export default ExcalidrawViewer;
