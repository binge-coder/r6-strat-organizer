"use client";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

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

interface ExcalidrawEditorProps {
  initialData?: string;
  onSave?: (data: string) => void;
  readOnly?: boolean;
}

const ExcalidrawEditor: React.FC<ExcalidrawEditorProps> = ({
  initialData,
  onSave,
  readOnly = false,
}) => {
  const excalidrawAPIRef = useRef<any>(null);
  const [initialElements, setInitialElements] = useState<any[]>([]);
  const { theme } = useTheme();

  // Parse initial data if provided
  useEffect(() => {
    if (initialData) {
      try {
        const parsedData = JSON.parse(initialData);
        if (parsedData.elements) {
          setInitialElements(parsedData.elements);
        }
      } catch (e) {
        console.error("Failed to parse initialData:", e);
      }
    }
  }, [initialData]);

  // Auto-save handler
  const handleChange = useCallback(() => {
    if (!excalidrawAPIRef.current || !onSave) return;

    const elements = excalidrawAPIRef.current.getSceneElements();
    const appState = excalidrawAPIRef.current.getAppState();

    // Only save if there are elements or if we're explicitly purging all elements
    if (elements.length > 0 || initialElements.length > 0) {
      const data = {
        elements,
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          currentItemFontFamily: appState.currentItemFontFamily,
        },
      };
      onSave(JSON.stringify(data));
    }
  }, [onSave, initialElements.length]);
  return (
    <div style={{ height: "100%", width: "100%", minHeight: "500px" }}>
      {typeof window !== "undefined" && (
        <Excalidraw
          excalidrawAPI={(api: any) => {
            excalidrawAPIRef.current = api;
          }}
          initialData={{
            elements: initialElements,
            appState: {
              theme: theme === "dark" ? "dark" : "light",
            },
          }}
          viewModeEnabled={readOnly}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default ExcalidrawEditor;
