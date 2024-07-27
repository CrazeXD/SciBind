// components/Editor.tsx
import React, { useRef, useEffect } from "react";

export default function Editor() {
  const editorRef = useRef<HTMLDivElement>(null);

  const PAGE_HEIGHT = 1056; // A4 height in pixels at 96 DPI
  const PAGE_WIDTH = 816; // A4 width in pixels at 96 DPI

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = "Start typing your document here...";
    }
  }, []);

  return (
    <div className="flex-grow bg-base-200 p-4 overflow-auto">
      <div className="w-full max-w-[816px] mx-auto">
        <div
          ref={editorRef}
          className="w-full p-8 bg-base-100 rounded shadow-md border border-gray-300"
          contentEditable={true}
          suppressContentEditableWarning={true}
          style={{
            minHeight: `${PAGE_HEIGHT}px`,
            color: "black",
          }}
        />
      </div>
      <style jsx>{`
        .page-break {
          height: 20px;
          background-color: #f0f0f0;
          margin: 10px 0;
        }
        [contenteditable] {
          outline: none;
        }
        [contenteditable] > div {
          min-height: ${PAGE_HEIGHT}px;
          width: ${PAGE_WIDTH}px;
          padding: 40px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          background-color: white;
        }
      `}</style>
    </div>
  );
}
