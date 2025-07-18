"use client";
import TouristSpotDetail from "@/components/page/TouristSpotDetail";
import { useEffect, useState } from "react";

export interface TouristSpot {
  id: string;
  title: string;
  slug: string;
  location: string;
  author: string;
  date: string;
  coverImage: string;
  contentHtml: string;
  metaDescription?: string;
  tags: string[];
}

interface PageProps {
  params: { slug: string };
}

 const TouristSpotPage=({ params }: PageProps)=> {
  const [spot, setSpot] = useState<TouristSpot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpot() {
      try {
        // const res = await fetch(`/api/tourist-spot/${params.slug}`);
        // if (!res.ok) throw new Error("Failed to fetch");
        // const data = await res.json();
        // setSpot(data);
      } catch {
        setError("Failed to load tourist spot");
      } finally {
        setLoading(false);
      }
    }

    fetchSpot();
  }, [params.slug]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!spot) return <div className="text-center mt-10">Tourist spot not found</div>;

  return <TouristSpotDetail spot={spot} />;
}
export default TouristSpotPage;
