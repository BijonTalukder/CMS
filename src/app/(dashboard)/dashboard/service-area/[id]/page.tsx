import ServiceTypeManager from "@/app/(pages)/serviceType"
import { Suspense, use } from "react";

const Services = ({params}: {params: Promise<{ id: string }>}) => {
    const { id } = use(params);
    
  return (
    <div>
<Suspense fallback={<div>Loading service type...</div>}>
        <ServiceTypeManager id={id} />
      </Suspense>    </div>
  )
}

export default Services