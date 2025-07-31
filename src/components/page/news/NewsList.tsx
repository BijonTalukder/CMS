
"use client"
import React, { useEffect, useState } from "react";
import { Heart, Share2, Calendar, User, Brain, Tags } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { baseUrl } from "@/utility/config";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  authorName: string;
  publishedAt: string;
  technologies?: string[];
  isFavorite: boolean;
  aiSummary?: string;
  aiCategory?: string;
  aiImportanceScore?: number;
  imageQuality?: number;
  imageAltText?: string;
  tags?: string[];
  isBreakingNews?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const NewsList = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'importance'>('date');
  const [selectedCategory, setSelectedCategory] = useState<string|undefined>('all');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${baseUrl}/news`);
        // console.log(response);
        
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNewsItems(data?.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const toggleFavorite = (id: string) => {
    setNewsItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleShare = (item: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.aiSummary || item.description,
        url: window.location.href,
      })
        .then(() => console.log("Successfully shared"))
        .catch((error) => console.error("Error sharing", error));
    }
  };

  const getImportanceColor = (score?: number) => {
    if (!score) return "bg-gray-100";
    if (score >= 8) return "bg-red-100 text-red-700";
    if (score >= 6) return "bg-orange-100 text-orange-700";
    return "bg-blue-100 text-blue-700";
  };

  const sortedAndFilteredNews = newsItems
    .filter(item => selectedCategory === 'all' || item.aiCategory === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'importance') {
        return (b.aiImportanceScore || 0) - (a.aiImportanceScore || 0);
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  const categories = ['all', ...new Set(newsItems.map(item => item.aiCategory).filter(Boolean))];

  if (loading) return <p className="text-center text-lg font-semibold">⏳ Loading news...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'date' ? "default" : "outline"}
            onClick={() => setSortBy('date')}
          >
            Latest
          </Button>
          <Button
            variant={sortBy === 'importance' ? "default" : "outline"}
            onClick={() => setSortBy('importance')}
          >
            Important
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredNews.map((item) => (
          <Card key={item.id} className="overflow-hidden shadow-lg rounded-lg border">
            <div className="relative">
              {item.isBreakingNews && (
                <Badge className="absolute top-2 left-2 z-10 bg-red-500">
                  Breaking News
                </Badge>
              )}
              <img
                src={item.imageUrl || "/api/placeholder/400/320"}
                alt={item.imageAltText || item.title}
                className="w-full h-60 object-cover rounded-t-lg"
              />
              {item.imageQuality && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="absolute bottom-2 right-2" variant="secondary">
                        Quality: {(item.imageQuality * 100).toFixed(0)}%
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      AI-assessed image quality score
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {item.title}
                    {item.aiImportanceScore && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className={getImportanceColor(item.aiImportanceScore)}>
                              {item.aiImportanceScore}/10
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            AI Importance Score
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{item.authorName || "Unknown Author"}</span>
                    <Calendar className="w-4 h-4 ml-4" />
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(item.id)}
                  >
                    <Heart
                      className={`h-6 w-6 transition ${
                        item.isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare(item)}
                  >
                    <Share2 className="h-6 w-6 text-gray-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {item.aiSummary && (
                <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
                  <Brain className="w-5 h-5 text-blue-500 mt-1" />
                  <p className="text-sm text-blue-700">{item.aiSummary}</p>
                </div>
              )}
              <p className="text-gray-700 text-sm">{item.description}</p>
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2">
              {item.aiCategory && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tags className="w-3 h-3" />
                  {item.aiCategory}
                </Badge>
              )}
              {item.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsList;