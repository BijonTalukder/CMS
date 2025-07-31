
import ContentDetailPage from '@/components/page/content/ContentDetails';
import React from 'react';


import { use } from "react";
    

export default function TouristSpotDetail({params}: {params: Promise<{ id: string }>}) {
const { id } = use(params);
console.log("Tourist Spot ID:", id);
  return (
    <div>
      <ContentDetailPage id={id} />
    </div>
  );
}
