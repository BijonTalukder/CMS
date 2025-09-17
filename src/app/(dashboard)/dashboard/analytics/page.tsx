"use client"

import dynamic from "next/dynamic";

// Dynamically import recharts wrapper
const PromptAnalytics = dynamic(() => import("./PromptAnalytics"), { ssr: false });

export default function Page() {
  return <PromptAnalytics />;
}
