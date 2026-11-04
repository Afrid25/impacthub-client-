import React from "react";
import AllEventsClient from "./client";

export const instant = false;

export default async function AllEventsPage() {
  let data = [];
  try {
    const res = await fetch("http://localhost:4500/all-events", {
      cache: "no-store",
    });
    if (res.ok) {
      data = (await res.json()) || [];
    }
  } catch (e) {
    console.error("Failed to fetch events:", e);
    data = [];
  }

  return <AllEventsClient initialEvents={data} />;
}
