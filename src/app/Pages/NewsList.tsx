"use client"
import React, { useState } from 'react';
import { Search, Heart, Share2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const NewsList = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());

  // Sample news data with sources
  const news = [
    {
      id: 1,
      title: "New Technology Breakthrough",
      description: "Scientists discover revolutionary quantum computing method",
      category: "technology",
      time: "2 hours ago",
      source: "Prothom Alo",
      sourceIcon: "/api/placeholder/32/32",
      reads: "5.2K"
    },
    {
      id: 2,
      title: "Global Climate Summit",
      description: "World leaders gather to discuss climate change solutions",
      category: "politics",
      time: "3 hours ago",
      source: "The Daily Star",
      sourceIcon: "/api/placeholder/32/32",
      reads: "3.8K"
    },
    {
      id: 3,
      title: "Sports Championship Results",
      description: "Local team wins national championship in dramatic fashion",
      category: "sports",
      time: "4 hours ago",
      source: "Dhaka Tribune",
      sourceIcon: "/api/placeholder/32/32",
      reads: "7.1K"
    }
  ];

  const categories = [
    { value: "all", label: "All" },
    { value: "technology", label: "Tech" },
    { value: "politics", label: "Politics" },
    { value: "sports", label: "Sports" }
  ];

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search news..."
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 bg-white">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="px-4"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* News List */}
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-4">
          {news.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:bg-gray-50">
              <CardHeader className="p-4">
                {/* Source info */}
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={item.sourceIcon} 
                    alt={item.source}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-600">{item.source}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {item.reads} reads
                  </Badge>
                </div>
                
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="mt-1">
                  {item.description}
                </CardDescription>
              </CardHeader>

              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="capitalize">{item.category}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className={favorites.has(item.id) ? "text-red-500" : "text-gray-500"}
                  >
                    <Heart className="h-5 w-5" fill={favorites.has(item.id) ? "currentColor" : "none"} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewsList;