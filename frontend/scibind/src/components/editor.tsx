// components/Editor.tsx
import React, { useRef, useEffect, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface EditorProps {
  slug: string;
}

export default function Editor({ slug }: EditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  const PAGE_HEIGHT = 1056; // A4 height in pixels at 96 DPI
  const PAGE_WIDTH = 816; // A4 width in pixels at 96 DPI

  useEffect(() => {
    if (slug && typeof slug === "string") {
      const doc = new Y.Doc();
      const wsProvider = new WebsocketProvider(
        "ws://localhost:1234",
        slug,
        doc
      );
      setYdoc(doc);
      setProvider(wsProvider);

      const ytext = doc.getText("content");

      if (editorRef.current) {
        editorRef.current.innerHTML =
          ytext.toString() || "Start typing your binder here...";

        const observer = new MutationObserver(() => {
          if (editorRef.current) {
            ytext.delete(0, ytext.length);
            ytext.insert(0, editorRef.current.innerHTML);
          }
        });

        observer.observe(editorRef.current, {
          childList: true,
          subtree: true,
          characterData: true,
        });

        return () => {
          observer.disconnect();
          wsProvider.destroy();
        };
      }
    }
  }, [slug]);

  useEffect(() => {
    if (ydoc && provider && editorRef.current) {
      const ytext = ydoc.getText("content");

      ytext.observe((event) => {
        if (editorRef.current) {
          editorRef.current.innerHTML = ytext.toString();
        }
      });
    }
  }, [ydoc, provider]);

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
