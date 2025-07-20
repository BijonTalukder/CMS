"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { getServiceDetailByServiceListId } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
};

export default function ServiceDetailPage({ params }: { params: { serviceListId: string } }) {
  const { serviceListId } = params;
  const [detail, setDetail] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getServiceDetailByServiceListId(serviceListId)
//       .then((data) => setDetail(data))
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   }, [serviceListId]);

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
    <main className="max-w-4xl mx-auto p-4">
      <article className="prose prose-slate max-w-none">
        <h1>{detail.title}</h1>
        <div className="flex items-center gap-4 mb-6">
          <Badge variant="secondary">{detail.type.toUpperCase()}</Badge>
          {detail.readTimeMinutes && <Badge>{detail.readTimeMinutes} min read</Badge>}
          <div className="text-sm text-muted-foreground">
            👁️ {detail.views ?? 0} views &nbsp; 👍 {detail.upVotes ?? 0} &nbsp; 👎 {detail.downVotes ?? 0}
          </div>
        </div>
        <img src={detail.coverImage} alt={detail.title} className="rounded-lg mb-6 w-full object-cover max-h-80" />
        <ScrollArea className="max-h-[600px]">
          <div dangerouslySetInnerHTML={{ __html: detail.contentHtml }} />
        </ScrollArea>
      </article>
    </main>
  );
}
