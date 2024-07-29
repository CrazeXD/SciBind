"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Header from "@/components/header";
import Toolbar from "@/components/toolbar";
import Editor from "@/components/editor";
import { EditorMethods } from "@/libs/editormethods";
import { ToolbarProp } from "@/libs/toolbarprop";

export default function BinderEditor() {
  const [editorMethods, setEditorMethods] = useState<EditorMethods | null>(
    null
  );
  const handleEditorReady = useCallback((methods: EditorMethods) => {
    setEditorMethods(methods);
  }, []);
  // Assign the editorMethods to a toolbar prop
  const toolbarMethods: ToolbarProp = {
    onBold: () => {
      if (editorMethods) {
        editorMethods.toggleBold();
      }
    },
    onItalic: () => {
      if (editorMethods) {
        editorMethods.toggleItalic();
      }
    },
    onUnderline: () => {
      if (editorMethods) {
        editorMethods.toggleUnderline();
      }
    },
    onHighlight: (color: string) => {
      if (editorMethods) {
        editorMethods.toggleHighlight(color);
      }
    },
    onAlignLeft: () => {
      if (editorMethods) {
        editorMethods.alignLeft();
      }
    },
    onAlignCenter: () => {
      if (editorMethods) {
        editorMethods.alignCenter();
      }
    },
    onAlignRight: () => {
      if (editorMethods) {
        editorMethods.alignRight();
      }
    },
  };

  const [slug, setSlug] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      setSlug(lastPart || null);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral" data-theme="doc">
      <Head>
        <title>SciBind</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="fixed top-0 w-full z-10">
        <Header />
        <Toolbar methods={toolbarMethods} />
      </div>

      <div className="mt-28 flex-grow bg-base-200">
        {slug !== null ? (
          <Editor slug={slug} onEditorReady={handleEditorReady} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
