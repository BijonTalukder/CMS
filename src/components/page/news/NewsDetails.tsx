"use client"


import React from 'react';
import { 
  Heart, 
  Share2, 
  Clock, 
  Calendar, 
  MessageSquare,
  ChevronLeft 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NewsDetailProps {
  onBack: () => void;
}

const NewsDetail = ({ onBack }: NewsDetailProps) => {
  // This would normally come from props or an API call
  const article = {
    id: '1',
    title: 'Next.js 14 Released with Major Performance Improvements',
    description: 'Vercel announces Next.js 14 with significant performance enhancements, improved developer experience, and new features for server components.',
    content: `
      Today, Vercel announced the release of Next.js 14, bringing significant improvements to the popular React framework. This major update introduces several game-changing features that promise to revolutionize how developers build web applications.

      The new version focuses on three main areas:
      1. Enhanced Performance: The build system has been completely revamped, resulting in up to 40% faster build times.
      2. Improved Developer Experience: New debugging tools and better error messages make it easier to identify and fix issues.
      3. Advanced Server Components: Extended support for React Server Components with new patterns and best practices.

      The team has also introduced a new caching layer that significantly improves data fetching performance and reduces server load. This update represents a major step forward in server-side rendering capabilities.
    `,
    imageUrl: '/api/placeholder/1200/600',
    author: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      role: 'Senior Tech Writer'
    },
    publishDate: '2024-02-16',
    readTime: '5 min read',
    technologies: ['Next.js', 'React', 'TypeScript'],
    isFavorite: false,
    commentCount: 24
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4 flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to News
      </Button>

      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
        </div>

        <CardHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{article.title}</h1>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {article.publishDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {article.readTime}
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                {article.commentCount} comments
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={article.author.avatar} />
                <AvatarFallback>{article.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{article.author.name}</p>
                <p className="text-sm text-gray-500">{article.author.role}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-4 border-t pt-6">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium">Technologies:</span>
            {article.technologies.map(tech => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
          
          <div className="w-full border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Comments ({article.commentCount})</h3>
          
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NewsDetail;