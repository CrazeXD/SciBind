// components/Editor.tsx
import React from "react";

export default function Editor() {
  return (
    <div className="flex-grow bg-base-100 p-4">
      <div
        className="w-full h-full p-4 border border-base-300 rounded-lg shadow-sm"
        contentEditable={true}
        suppressContentEditableWarning={true}
      >
        Start typing your document here...
      </div>
    </div>
  );
}
