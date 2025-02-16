"use client"

import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, DollarSign, Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TouristSpots = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const spots = [
    {
      id: 1,
      name: "Eiffel Tower",
      location: "Paris, France",
      rating: 4.8,
      visitDuration: "2-3 hours",
      priceLevel: 3,
      image: "/api/placeholder/400/250",
      description: "Iconic iron lattice tower on the Champ de Mars, one of the world's most famous landmarks."
    },
    {
      id: 2,
      name: "Colosseum",
      location: "Rome, Italy",
      rating: 4.7,
      visitDuration: "2-4 hours",
      priceLevel: 2,
      image: "/api/placeholder/400/250",
      description: "Ancient amphitheater in the heart of Rome, a marvel of Roman architecture and engineering."
    },
    {
      id: 3,
      name: "Taj Mahal",
      location: "Agra, India",
      rating: 4.9,
      visitDuration: "3-4 hours",
      priceLevel: 2,
      image: "/api/placeholder/400/250",
      description: "Beautiful white marble mausoleum, one of the world's most celebrated monuments."
    }
  ];

  const filteredSpots = spots.filter(spot =>
    spot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    spot.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPriceLevel = (level) => {
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
        <div className="grid gap-4">
          {filteredSpots.map((spot) => (
            <Card key={spot.id} className="overflow-hidden hover:shadow-lg transition-shadow active:scale-[0.99]">
              <div className="flex flex-col">
                <div className="relative h-48 sm:h-64">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-bold mb-2">{spot.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{spot.location}</span>
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
                    <p className="text-gray-600 text-sm line-clamp-2">{spot.description}</p>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouristSpots;