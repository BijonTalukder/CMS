"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, Clock, Menu, ChevronRight, X, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { baseUrl } from "@/utility/config";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Extend Window interface to include Android property
declare global {
  interface Window {
    Android?: {
      goHome?: () => void;
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
}

const TouristSpotsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [spots, setSpots] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/services-list/services/67b435893c57d49ee64a0fbc`
        );
        const data = await response.json();
        setSpots(data.data); 
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredSpots = spots.filter(
    (spot) =>
      spot.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spot.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm("");
    setIsSearchFocused(false);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {/* App-like header with status bar spacer */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white">
        {/* Fake status bar for mobile */}
        {/* <div className="h-6 bg-gray-100 md:hidden"></div> */}
        
        {/* Search header */}
        <header className={`p-4 border-b shadow-sm transition-all ${isSearchFocused ? 'md:bg-white bg-white' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            {!isSearchFocused && (
              <h1 className="text-xl font-bold text-gray-800">Explore </h1>
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
              placeholder="Search by name or location..."
              className="w-full pl-10 pr-10 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
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
        </header>
      </div>

      {/* Filter chips (mobile app style) */}
      <div className="fixed top-[150px] z-10 w-full bg-white pt-2 px-4 pb-2 overflow-x-auto no-scrollbar md:hidden">
        <div className="flex space-x-2">
          <button className="flex items-center whitespace-nowrap px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
            <Filter className="w-4 h-4 mr-1" />
            Popular
          </button>
          <button className="whitespace-nowrap px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
            Nearby
          </button>
          <button className="whitespace-nowrap px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
            Top Rated
          </button>
          <button className="whitespace-nowrap px-3 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
            Free Entry
          </button>
        </div>
      </div>

      {/* Main Content with Padding for Fixed Header */}
      <main className={`pt-[200px] pb-20 px-4 ${isSearchFocused ? 'mt-0' : 'mt-0'}`}>
        {loading ? (
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-md">
                <div className="flex">
                  <Skeleton className="h-24 w-24 rounded-lg" />
                  <div className="ml-4 flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-1/2" />
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
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:gap-6">
            {filteredSpots.map((spot) => (
              <Link key={spot.id} href={`/tourist-spot/${spot.id}`} passHref>
                <Card className="overflow-hidden border-none shadow-md active:scale-95 transition-transform">
                  <div className="flex">
                    <div className="relative h-24 w-24 flex-shrink-0">
                      <img
                        src={spot.imageUrl}
                        alt={spot.title}
                        className="absolute h-full w-full object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                    <div className="ml-4 flex-1 py-1">
                      <CardHeader className="p-0">
                        <CardTitle className="text-base font-bold text-gray-800 line-clamp-1">
                          {spot.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 mt-1">
                        <div className="flex items-center gap-1 text-gray-600 mb-1 text-xs">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="line-clamp-1">{spot.shortDescription}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full text-xs">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="font-medium text-gray-700">{spot.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-gray-700">{spot.visitDuration}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-xs line-clamp-2 mt-1">
                          {spot.description}
                        </p>
                      </CardContent>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 mt-1 mr-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Bottom navigation bar (mobile app style) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-20">
        <div className="flex justify-around py-3">
          <button onClick={() => window.Android?.goHome?.()} className="flex flex-col items-center text-blue-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span className="text-xs mt-1">Explore</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">Saved</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default TouristSpotsList;