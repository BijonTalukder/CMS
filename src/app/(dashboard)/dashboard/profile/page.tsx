"use client";
import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
 
  LogOut, 
  ChevronRight, 
  Edit,
  Bell,
  CreditCard,
  HelpCircle,
  Shield,
  Moon,
  Globe,
  BookOpen,
  Plus,
  Calendar,
  MessageSquare,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface SavedItem {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  rating: number;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  excerpt: string;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("saved");
  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: "1",
      title: "Eiffel Tower",
      imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&h=300&fit=crop",
      location: "Paris, France",
      rating: 4.8
    },
    {
      id: "2",
      title: "Grand Canyon",
      imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&h=300&fit=crop",
      location: "Arizona, USA",
      rating: 4.9
    },
    {
      id: "3",
      title: "Santorini",
      imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&h=300&fit=crop",
      location: "Greece",
      rating: 4.7
    }
  ]);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: "1",
      title: "My Amazing Trip to Paris",
      content: "Paris was absolutely breathtaking! The Eiffel Tower at night was magical...",
      date: "2023-06-15",
      excerpt: "Exploring the city of lights and love"
    },
    {
      id: "2",
      title: "Hiking the Grand Canyon",
      content: "The Grand Canyon hike was challenging but rewarding. The views from the rim...",
      date: "2023-05-22",
      excerpt: "An unforgettable adventure in Arizona"
    }
  ]);

  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);

  const removeSavedItem = (id: string) => {
    setSavedItems(savedItems.filter(item => item.id !== id));
  };

  const createNewBlogPost = () => {
    if (newBlogTitle.trim() && newBlogContent.trim()) {
      const newPost: BlogPost = {
        id: (blogPosts.length + 1).toString(),
        title: newBlogTitle,
        content: newBlogContent,
        date: new Date().toISOString().split('T')[0],
        excerpt: newBlogContent.substring(0, 100) + (newBlogContent.length > 100 ? '...' : '')
      };
      
      setBlogPosts([newPost, ...blogPosts]);
      setNewBlogTitle("");
      setNewBlogContent("");
      setIsCreatingBlog(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm p-4 flex items-center">
        <Link href="/" className="md:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <ChevronRight className="h-6 w-6 rotate-180" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
      </header>

      <main className="p-4 md:p-6">
        {/* Profile Header */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24 md:h-32"></div>
          <div className="px-4 pb-4 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 md:-mt-16">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-white shadow-lg">
                <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback className="text-2xl">JD</AvatarFallback>
              </Avatar>
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">John Doe</h2>
                <p className="text-gray-600">Travel Enthusiast & Blogger</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                  <Badge variant="secondary">Explorer</Badge>
                  <Badge variant="outline">Member since 2023</Badge>
                  <Badge variant="outline">5 Blog Posts</Badge>
                </div>
              </div>
              <Button className="mt-4 md:mt-0 md:ml-auto">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex border-b mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2 font-medium text-sm md:text-base relative whitespace-nowrap ${activeTab === "saved" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Saved Places
            {activeTab === "saved" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-2 font-medium text-sm md:text-base relative whitespace-nowrap ${activeTab === "blog" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            My Blog
            {activeTab === "blog" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 font-medium text-sm md:text-base relative whitespace-nowrap ${activeTab === "settings" ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
          >
            Settings
            {activeTab === "settings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "saved" ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Saved Destinations</h3>
            
            {savedItems.length === 0 ? (
              <Card className="p-8 text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No saved places yet</h3>
                <p className="text-gray-500 mb-4">Save your favorite destinations to see them here</p>
                <Link href="/">
                  <Button>Explore Destinations</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savedItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-40 object-cover"
                      />
                      <button
                        onClick={() => removeSavedItem(item.id)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100"
                        aria-label="Remove from saved"
                      >
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-lg font-bold text-gray-800">{item.title}</CardTitle>
                      </CardHeader>
                      <div className="flex items-center text-gray-600 mb-2 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 mr-1" />
                          <span className="font-medium">{item.rating}</span>
                        </div>
                        <Link href={`/tourist-spot/${item.id}`}>
                          <Button size="sm" variant="outline">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "blog" ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">My Travel Blog</h3>
              <Button onClick={() => setIsCreatingBlog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
            
            {isCreatingBlog ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create New Blog Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <Input 
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      placeholder="Enter blog title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <Textarea 
                      value={newBlogContent}
                      onChange={(e) => setNewBlogContent(e.target.value)}
                      placeholder="Write your travel story..."
                      rows={6}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={createNewBlogPost}>Publish</Button>
                    <Button variant="outline" onClick={() => setIsCreatingBlog(false)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
            
            {blogPosts.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No blog posts yet</h3>
                <p className="text-gray-500 mb-4">Share your travel experiences with the world</p>
                <Button onClick={() => setIsCreatingBlog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-bold text-gray-800">{post.title}</CardTitle>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{post.excerpt}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span>0 comments</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm">Read More</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">John Doe</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">john.doe@example.com</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Notifications</span>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Dark Mode</span>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Language</span>
                  </div>
                  <Button variant="outline" size="sm">English</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Password</span>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Payment Methods</span>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <HelpCircle className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Help Center</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <LogOut className="w-5 h-5 text-gray-500 mr-3" />
                    <span>Log Out</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;