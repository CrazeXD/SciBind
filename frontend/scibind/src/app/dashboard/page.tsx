"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Binder from "@/components/binder";

export default function Dashboard() {
  const router = useRouter();
  const [binders, setBinders] = useState<
    { id: number; event: string; materialtype: string; division: string }[]
  >([]);

  useEffect(() => {
    const validateToken = async () => {
      try {
        if (typeof window !== "undefined" && localStorage.getItem("token")) {
          let response = await fetch("http://127.0.0.1:8000/api/verify/", {
            method: "POST",
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          });
          if (!response.ok) {
            localStorage.removeItem("token");
            router.push("/auth/login");
          }
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        router.push("/auth/login");
      }
    };

    validateToken();
  }, [router]);

  useEffect(() => {
    const fetchBinders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

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

    fetchBinders();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Binders</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {binders.map((binderobj) => (
            <Binder
              event={binderobj.event}
              id={binderobj.id}
              type={binderobj.materialtype}
              division={binderobj.division}
              key={binderobj.id}
            />
          ))}
        </div>
      </div>
      <p className="text-center">
        Don't see one of your binders? It may have been marked as old. Check
        your events and reselect it to get access back.
      </p>
    </div>
  );
}
