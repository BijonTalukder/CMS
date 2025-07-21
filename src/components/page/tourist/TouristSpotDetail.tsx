'use client';


import { Card, CardContent } from "@/components/ui/card";
import { TouristSpot } from "./TouristSpotDetaiComponent";

const TouristSpotDetail=({ spot }: { spot: TouristSpot })=> {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card>
        <img
          src={spot.coverImage}
          alt={spot.title}
          className="rounded-t-2xl w-full object-cover h-[300px]"
        />
        <CardContent className="space-y-4 mt-6">
          <h1 className="text-3xl font-bold">{spot.title}</h1>
          <div className="text-sm text-muted-foreground">
            {new Date(spot.date).toLocaleDateString()} • {spot.location} • By {spot.author}
          </div>
          <article
            className="prose max-w-none prose-sm prose-headings:font-semibold prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: spot.contentHtml }}
          />
          <div className="mt-4 text-sm text-muted-foreground">
            Tags: {spot.tags.map((tag) => `#${tag}`).join(", ")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default TouristSpotDetail;
