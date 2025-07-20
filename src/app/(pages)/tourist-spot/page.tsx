"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, Clock, DollarSign, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Image from "next/image";
import { baseUrl } from "@/utility/config";
import Link from "next/link";

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

const TouristSpots: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const renderPriceLevel = (level: number) => {
    return [...Array(level)].map((_, i) => (
      <DollarSign key={i} className="w-4 h-4 inline text-green-600" />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 border-b">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Tourist Spots</h1>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-100 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search spots..."
              className="w-full pl-10 pr-4 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Main Content with Padding for Fixed Header */}
      <div className="pt-32 px-4 pb-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <div className="grid gap-4">
            {filteredSpots.map((spot) => (

              <Link  key={spot.id} href={`/tourist-spot/${spot.id}`}>
                   <Card
              
                className="overflow-hidden hover:shadow-lg transition-shadow active:scale-[0.99]"
              >
                <div className="flex flex-col">
                  <div className="relative h-48 sm:h-64">
                    <img
                      src={spot.imageUrl}
                      alt={spot.title}
                      height={200}
                      width={200}
                      className="absolute h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <CardHeader className="p-0">
                      <CardTitle className="text-lg font-bold mb-2">
                        {spot.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{spot.shortDescription}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-3 text-sm">
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{spot.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{spot.visitDuration}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                          {renderPriceLevel(spot.priceLevel)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {spot.description}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card></Link>
         
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristSpots;
