
import ContentDetailPage from "@/components/page/content/ContentDetails";
import React from "react";

interface PageProps {
  params: { id: string };
}

const ServiceDetailsPage = ({ params }: PageProps)=> {
  return (
    <div>
      <ContentDetailPage id={params.id} />
    </div>
  );
};

export default ServiceDetailsPage;
