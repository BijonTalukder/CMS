"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import axios from "axios";

type ServiceDetail = {
  id: string;
  title: string;
  slug: string;
  type: string;
  coverImage: string;
  contentHtml: string;
  metaDescription?: string;
  tags: string[];
  readTimeMinutes?: number;
  views?: number;
  upVotes?: number;
  downVotes?: number;
  createdAt: string;
  updatedAt: string;
};

const ContentDetailPage = ({ serviceListId }: { serviceListId: string }) => {
  const [detail, setDetail] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/service-list-details/${serviceListId}`
        );
        setDetail(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (serviceListId) {
      fetchData();
    }
  }, [serviceListId]);

  if (loading)
    return (
      <Card className="w-full max-w-3xl mx-auto p-4">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-24 w-full" />
      </Card>
    );

  if (!detail) return <p className="text-center mt-8">No details found.</p>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <article className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold mb-2">{detail.title}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
          <Badge variant="secondary">{detail.type}</Badge>
          {detail.readTimeMinutes && <Badge>{detail.readTimeMinutes} min read</Badge>}
          <span>👁️ {detail.views ?? 0} views</span>
          <span>👍 {detail.upVotes ?? 0}</span>
          <span>👎 {detail.downVotes ?? 0}</span>
          <span>📅 {detail.createdAt}</span>
        </div>

        {detail.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {detail.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <img
          src={detail.coverImage}
          alt={detail.title}
          className="w-full rounded-lg object-cover max-h-96 mb-6"
        />

        <ScrollArea className="max-h-[600px]">
          <div dangerouslySetInnerHTML={{ __html: detail.contentHtml }} />
        </ScrollArea>

        {detail.metaDescription && (
          <p className="mt-6 text-muted-foreground italic text-sm">
            Meta: {detail.metaDescription}
          </p>
        )}
      </article>
    </main>
  );
};

export default ContentDetailPage;
