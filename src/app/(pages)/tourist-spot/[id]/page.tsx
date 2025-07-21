import ContentDetailPage from '@/components/page/content/ContentDetails';
import React from 'react'
interface PageProps {
  params: { id: string };
}
const TouristSpotDetail = ({ params }: PageProps) => {
  
  return (
    <div>
      <ContentDetailPage serviceListId={params.id} />
    </div>
  )
}

export default TouristSpotDetail