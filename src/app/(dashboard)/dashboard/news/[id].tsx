import NewsDetail from '@/components/page/news/NewsDetails'
import React from 'react'

const NewsDetails = () => {
  return (
    <div>

      <NewsDetail onBack={() => window.history.back()} />
    </div>
  )
}

export default NewsDetails