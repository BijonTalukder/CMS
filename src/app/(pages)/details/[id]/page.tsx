
import ContentDetailPage from "@/components/page/content/ContentDetails";
import React, { use } from "react";



const ServiceDetailsPage = ({params}: {params: Promise<{ id: string }>})=> {
  const { id } = use(params);
  return (
    <div>
      <ContentDetailPage id={id} />
    </div>
  );
};

export default ServiceDetailsPage;
