"use client";

import Head from "next/head";
import Header from "@/components/header";
import Toolbar from "@/components/toolbar";
import Editor from "@/components/editor";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>SciBind Editor</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Toolbar />
      <Editor />
    </div>
  );
}
