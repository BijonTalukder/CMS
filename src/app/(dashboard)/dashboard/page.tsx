import React from 'react'
import ServiceAreaPage from '@/components/page/serviceArea/ServiceArea'
// import dynamic from "next/dynamic";
import PromptAnalytics from './analytics/PromptAnalytics';

// Dynamically import recharts wrapper
// const PromptAnalytics = dynamic(() => import("./PromptAnalytics"), { ssr: false });

const page = () => {
  
  return (
    <div>
      <ServiceAreaPage/>
      <PromptAnalytics/>
    </div>
  )
}

export default page