"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Header from "@/components/header";
import Toolbar from "@/components/toolbar";
import Editor from "@/components/editor";
import { EditorMethods } from "@/components/editor";

export default function Home() {
  const [editorMethods, setEditorMethods] = useState<EditorMethods | null>(null);
  const handleEditorReady = (methods: EditorMethods) => {
    setEditorMethods(methods);
  }

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
        <Toolbar />
      </div>

      <div className="mt-28 flex-grow bg-base-200">
        {slug !== null ? <Editor slug={slug} onEditorReady={handleEditorReady}/> : <div>Loading...</div>}
      </div>
    </div>
  );
}
