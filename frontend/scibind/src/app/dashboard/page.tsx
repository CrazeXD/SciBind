"use client";

import Navbar from "@/components/navbar";
import Binder from "@/components/binder";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [binders, setBinders] = useState<{ event: string; materialtype: string }[]>([]);

  const onload = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/binders/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setBinders(data);
      } else {
        console.error("Data is not an array:", data);
        setBinders([]);
      }
    } catch (error) {
      console.error("Error fetching binders:", error);
      setBinders([]);
    }
  };

  useEffect(() => {
    onload();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Binders</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {binders.map((binderobj) => (
            <Binder event={binderobj.event} type={binderobj.materialtype} key={binderobj.event} />
          ))}
        </div>
      </div>
    </div>
  );
}