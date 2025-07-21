import ContentDetailPage from '@/components/page/content/ContentDetails';
import React from 'react';

interface DetailsProps {
  params: { serviceListId: string };
}

const Details = ({ params }: DetailsProps) => {
  return (
    <div>
      <ContentDetailPage serviceListId={params.serviceListId} />
    </div>
  );
};

export default Details;
