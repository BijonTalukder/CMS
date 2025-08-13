"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, Clock, Menu, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/utility/config";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Android?: {
      goHome?: () => void;
      showToast?: (message: string) => void;
    };
  }
}

interface Service {
  id: string;
  title: string;
  shortDescription: string;
  rating: number;
  visitDuration: string;
  priceLevel: number;
  imageUrl: string;
  description: string;
  category?: string;
  distance?: number;
}

const TouristSpotsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [spots, setSpots] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>("all");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/services-list/services/67b435893c57d49ee64a0fbc`
        );
        const data = await response.json();
        // Add mock distance and category for demo purposes
        const enhancedData = data.data.map((spot: Service) => ({
          ...spot,
          distance: Math.random() * 10 + 1, // Random distance between 1-11 km
          category: ["Nature", "Historic", "Museum", "Park"][Math.floor(Math.random() * 4)]
        }));
        setSpots(enhancedData);
      } catch (error) {
        console.error("Error fetching services:", error);
        if (window.Android?.showToast) {
          window.Android.showToast("Failed to load spots. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredSpots = spots.filter((spot) => {
    const matchesSearch = 
      spot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === "all" || 
      (activeFilter === "nearby" && spot.distance && spot.distance < 5) ||
      (activeFilter === "top" && spot.rating >= 4.5) ||
      (activeFilter === "free" && spot.priceLevel === 0) ||
      (activeFilter === "popular" && spot.rating >= 4);

    return matchesSearch && matchesFilter;
  });

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchFocused(false);
  };

  const handleSaveSpot = (spotId: string) => {
    console.log(spotId)
    // In a real app, this would be an API call
    if (window.Android?.showToast) {
      window.Android.showToast("Spot saved to your list");
    }
    // Toggle saved state visually
    // setSpots(spots.map(spot => 
    //   spot.id === spotId ? {...spot, saved: !spot.saved} : spot
    // ));
  };

  const getPriceLevelIndicator = (level: number) => {
    if (level === 0) return "Free";
    return "$".repeat(Math.min(level, 4));
  };

  return (
    <div className="max-w-6xl mx-auto bg-white min-h-screen">
      {/* Fixed header that shrinks on scroll */}
      <div className={`fixed top-0 left-0 right-0 z-30 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'py-4'}`}>
        <div className={`max-w-6xl mx-auto px-4 ${isSearchFocused ? 'md:bg-white bg-white' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-2">
            {!isSearchFocused && (
              <h1 className={`font-bold text-gray-800 transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'}`}>
                Explore {activeFilter && activeFilter !== "all" && `• ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
              </h1>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-full hover:bg-gray-100 md:hidden ${isSearchFocused ? 'hidden' : 'block'}`}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, location or category..."
              className="w-full pl-10 pr-10 py-2 md:py-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              aria-label="Search tourist spots"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter chips - visible when not searching */}
        {!isSearchFocused && (
          <div className="max-w-6xl mx-auto px-4 pt-2 pb-2 overflow-x-auto no-scrollbar">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveFilter("all")}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === "all" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveFilter("popular")}
                className={`flex items-center whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === "popular" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {activeFilter === "popular" && <Star className="w-4 h-4 mr-1 fill-current" />}
                Popular
              </button>
              <button 
                onClick={() => setActiveFilter("nearby")}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === "nearby" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Nearby
              </button>
              <button 
                onClick={() => setActiveFilter("top")}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === "top" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Top Rated
              </button>
              <button 
                onClick={() => setActiveFilter("free")}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-colors ${activeFilter === "free" ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Free Entry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content with Padding for Fixed Header */}
      <main className={`pt-40 pb-20 px-4 md:pt-32 ${isSearchFocused ? 'mt-0' : 'mt-0'}`}>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col">
                  <Skeleton className="h-40 w-full rounded-t-lg" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredSpots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-12 h-12 text-gray-400 mb-4" />
            <h2 className="text-lg font-medium text-gray-700">
              No spots found
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              {searchTerm ? 
                `No results for "${searchTerm}". Try different keywords.` : 
                `Try adjusting your filters or check back later for new spots.`
              }
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setActiveFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSpots.map((spot) => (
              <div key={spot.id} className="group relative">
                {/* Save button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSaveSpot(spot.id);
                  }}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  aria-label="Save spot"
                >
                  {/* <Star className={`w-4 h-4 ${spot.saved ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} /> */}
                </button>
                
                <Link href={`/tourist-spot/${spot.id}`} passHref>
                  <Card className="h-full overflow-hidden border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-blue-200">
                    <div className="relative h-40 w-full">
                      <img
                        src={spot.imageUrl}
                        alt={spot.title}
                        className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {spot.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg font-bold text-gray-800 line-clamp-1">
                          {spot.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 mt-2">
                        <div className="flex items-center gap-1 text-gray-600 mb-2 text-sm">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-1">{spot.shortDescription}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {spot.description}
                        </p>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full text-xs">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {/* <span className="font-medium text-gray-700">{spot.rating.toFixed(1)}</span> */}
                          </div>
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full text-xs">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-gray-700">{spot.visitDuration}</span>
                          </div>
                          {spot.distance && (
                            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full text-xs">
                              <span className="text-gray-700">{spot.distance.toFixed(1)} km</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded-full text-xs">
                            <span className="text-gray-700">{getPriceLevelIndicator(spot.priceLevel)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom navigation bar (mobile only) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-30">
        <div className="flex justify-around py-3">
          <button 
            onClick={() => window.Android?.goHome?.()} 
            className="flex flex-col items-center text-blue-500"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs mt-1">Explore</span>
          </button>
          <button className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            <span className="text-xs mt-1">Saved</span>
          </button>
          <Link href={'/dashboard/profile'} className="flex flex-col items-center text-gray-500 hover:text-blue-500 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default TouristSpotsList;