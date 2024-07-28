"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import Header from "@/components/header";
import Toolbar from "@/components/toolbar";
import Editor from "@/components/editor";

export default function Home() {
  const [slug, setSlug] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      // Assuming the slug is the last part of the path
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
        {slug !== null ? <Editor slug={slug} /> : <div>Loading...</div>}
      </div>
    </div>
  );
}
