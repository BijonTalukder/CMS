import ContentDetailPage from '@/components/page/content/ContentDetails';
import DynamicNavBar from '@/components/shared/NavigationBar';
import React from 'react';
import { use } from "react";

export default function TouristSpotDetail({params}: {params: Promise<{ id: string }>}) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Navigation Bar - Automatic Detection */}
      <DynamicNavBar title="Tourist Spot Details" />

      {/* Content */}
      <div>
        <ContentDetailPage id={id} />
      </div>
    </div>
  );
}