"use client";

import { useEffect, useState } from "react";
import { baseUrl } from "@/utility/config";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalyticsEvent {
  createdAt: string;
  type: "view" | "like";
}

export default function PromptAnalytics() {
  const [data, setData] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${baseUrl}/analytics`);
        if (!res.ok) throw new Error("Failed to fetch analytics");

        const json = await res.json();
        if (Array.isArray(json.data)) {
          setData(json.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <p className="text-gray-600">Loading analytics...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data.length) return <p className="text-gray-500">No analytics data found</p>;

  // ✅ Group by date
  const grouped: Record<string, { views: number; likes: number }> = {};
  data.forEach((event) => {
    const date = new Date(event.createdAt).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = { views: 0, likes: 0 };
    }
    if (event.type === "view") grouped[date].views += 1;
    if (event.type === "like") grouped[date].likes += 1;
  });

  const labels = Object.keys(grouped);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Views",
        data: labels.map((d) => grouped[d].views),
        backgroundColor: "rgba(59, 130, 246, 0.8)", // blue
        borderRadius: 8,
      },
      {
        label: "Likes",
        data: labels.map((d) => grouped[d].likes),
        backgroundColor: "rgba(239, 68, 68, 0.8)", // red
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { font: { size: 14 } },
      },
      title: {
        display: true,
        text: "📊 Prompt Analytics (Daily)",
        font: { size: 18, weight: "bold" },
        color: "#111827",
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#fff",
        bodyColor: "#d1d5db",
        padding: 12,
        cornerRadius: 6,
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: 12 } },
        grid: { color: "rgba(209, 213, 219, 0.2)" },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics Dashboard</h2>
      <div className="h-[420px]">
        <Bar options={options} data={chartData} />
      </div>
    </div>
  );
}
