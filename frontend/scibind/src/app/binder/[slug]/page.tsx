"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Header from "@/components/document/header";
import Toolbar from "@/components/document/toolbar";
import Editor from "@/components/document/editor";
import { EditorMethods } from "@/libs/editormethods";
import { ToolbarProp } from "@/libs/toolbarprop";

export default function BinderEditor() {
  const [editorMethods, setEditorMethods] = useState<EditorMethods | null>(
    null
  );
  const [content, setContent] = useState<string>("");
  const [slug, setSlug] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      const lastPart = pathParts[pathParts.length - 1];
      setSlug(lastPart || null);
    }
  }, [pathname]);

  useEffect(() => {
    if (slug) {
      fetchContent();
    }
  }, [slug]);

  const fetchContent = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/binders/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch content");
      }
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const saveContent = async (newContent: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/binders/${slug}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ content: newContent }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const handleEditorReady = useCallback((methods: EditorMethods) => {
    setEditorMethods(methods);
  }, []);

  const handleEditorUpdate = useCallback(
    (newContent: string) => {
      setContent(newContent);
      saveContent(newContent);
    },
    [slug]
  );
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
          <Editor onEditorReady={handleEditorReady} initialContent={content} />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
