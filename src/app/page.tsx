import React from 'react';
import { MapPin, Search, Star, Video } from 'lucide-react';

export default function TouristLandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Discover the Beauty of Bali</h1>
            <p className="text-xl md:text-2xl text-white mb-6">Find top attractions, tours, and hidden gems</p>
            <div className="flex justify-center max-w-md mx-auto">
              <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden w-full">
                <input
                  type="text"
                  placeholder="Search attractions, hotels, tours..."
                  className="px-4 py-2 w-full outline-none text-sm"
                />
                <button className="bg-blue-500 p-2 text-white">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attractions Section */}
      <section className="py-12 px-4 bg-sky-50">
        <h2 className="text-3xl font-bold text-center mb-8">Top Attractions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {["Beaches", "Temples", "Waterfalls"].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow p-6 text-center">
              <MapPin className="mx-auto mb-4 text-sky-500" size={32} />
              <h3 className="text-xl font-semibold mb-2">{item}</h3>
              <p className="text-gray-600 text-sm">Explore the best {item.toLowerCase()} in Bali with our curated list of spots.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">What Travelers Say</h2>
        <div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2">
          {["An unforgettable experience!", "Loved the beaches and food!"].map((text, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6">
              <Star className="text-yellow-400 mb-2" />
              <p className="text-gray-700 italic">{text}</p>
              <p className="text-right text-sm text-gray-500 mt-2">- Traveler {idx + 1}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video / Gallery Section */}
      <section className="py-12 px-4 bg-sky-50">
        <h2 className="text-3xl font-bold text-center mb-8">Experience It Live</h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <video controls className="rounded-xl w-full">
              <source src="/videos/preview.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="flex-1 text-center md:text-left">
            <Video className="mx-auto md:mx-0 mb-4 text-blue-500" size={32} />
            <p className="text-gray-600 text-lg">Watch breathtaking views of Bali’s coastlines, culture, and adventures!</p>
          </div>
        </div>
      </section>

      {/* Guide / Map Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Plan Your Trip</h2>
        <div className="max-w-5xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?..."
            width="100%"
            height="350"
            className="w-full rounded-xl border-none"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* CTA Buttons */}
      <section className="py-12 px-4 text-center bg-gradient-to-b from-blue-100 to-white">
        <h2 className="text-2xl font-semibold mb-4">Ready to explore?</h2>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full">Plan Your Trip</button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full">Explore Tours</button>
          {/* <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full">Book Now</button> */}
        </div>
      </section>
    </div>
  );
}
