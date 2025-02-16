"use client"

import React from 'react';
import { Heart, Share2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  technologies: string[];
  isFavorite: boolean;
}

const NewsList = () => {
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([
    {
      id: '1',
      title: 'Next.js 14 Released with Major Performance Improvements',
      description: 'Vercel announces Next.js 14 with significant performance enhancements, improved developer experience, and new features for server components.',
      imageUrl: '/api/placeholder/800/400',
      author: 'Sarah Johnson',
      technologies: ['Next.js', 'React', 'TypeScript'],
      isFavorite: false
    },
    {
      id: '2',
      title: 'The Future of Web Development with WebAssembly',
      description: 'Exploring how WebAssembly is revolutionizing web performance and enabling new possibilities for web applications.',
      imageUrl: '/api/placeholder/800/400',
      author: 'Michael Chen',
      technologies: ['WebAssembly', 'Rust', 'JavaScript'],
      isFavorite: true
    }
  ]);

  const toggleFavorite = (id: string) => {
    setNewsItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleShare = (id: string) => {
    // Implementation for sharing would go here
    console.log(`Sharing news item ${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {newsItems.map(item => (
        <Card key={item.id} className="overflow-hidden">
          <div className="relative">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
          </div>
          
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{item.title}</h2>
                <p className="text-sm text-gray-500">By {item.author}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(item.id)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      item.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleShare(item.id)}
                >
                  <Share2 className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600">{item.description}</p>
          </CardContent>

          <CardFooter className="flex flex-wrap gap-2">
            {item.technologies.map(tech => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NewsList;