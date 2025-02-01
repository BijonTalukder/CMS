"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash, Phone, Link, ExternalLink, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ServiceListManagement = () => {
  const [services, setServices] = useState([]);
  const [serviceLists, setServiceLists] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    title: '',
    shortDescription: '',
    description: '',
    phoneNumber: '',
    type: 'default',
    status: true,
    url: '',
    isInternalUrl: false,
    imageUrl: '',
    dynamicFields: {}
  });

  // Fetch services
  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/services');
      const data = await response.json();
      setServices(data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Fetch service lists for selected service
  const fetchServiceLists = async (serviceId = selectedService) => {
    if (!serviceId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/v1/service-list?serviceId=${serviceId}`);
      const data = await response.json();
      setServiceLists(data.data);
    } catch (error) {
      console.error('Error fetching service lists:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService) {
      fetchServiceLists(selectedService);
    }
  }, [selectedService]);

  // Create service list
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/service-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, serviceId: selectedService }),
      });
      
      if (response.ok) {
        setOpen(false);
        setFormData({
          serviceId: '',
          title: '',
          shortDescription: '',
          description: '',
          phoneNumber: '',
          type: 'default',
          status: true,
          url: '',
          isInternalUrl: false,
          imageUrl: '',
          dynamicFields: {}
        });
        fetchServiceLists();
      }
    } catch (error) {
      console.error('Error creating service list:', error);
    }
  };

  // Delete service list
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/service-list/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchServiceLists();
      }
    } catch (error) {
      console.error('Error deleting service list:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Service</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            onValueChange={(value) => setSelectedService(value)}
            value={selectedService}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedService && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Service Lists</CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service List
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Service List</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description</Label>
                    <Input
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, shortDescription: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) =>
                        setFormData({ ...formData, url: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={formData.status}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, status: checked })
                      }
                    />
                    <Label htmlFor="status">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isInternalUrl"
                      checked={formData.isInternalUrl}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isInternalUrl: checked })
                      }
                    />
                    <Label htmlFor="isInternalUrl">Internal URL</Label>
                  </div>
                  <Button type="submit" className="w-full">
                    Create Service List
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceLists.map((list) => (
                <Card key={list.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={list.imageUrl || "/api/placeholder/400/320"}
                      alt={list.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Switch checked={list.status} disabled />
                    </div>
                  </div>
                  <CardContent className="space-y-2 p-4">
                    <h3 className="font-semibold">{list.title}</h3>
                    {list.shortDescription && (
                      <p className="text-sm text-gray-500">{list.shortDescription}</p>
                    )}
                    {list.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{list.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {list.isInternalUrl ? (
                        <Link className="w-4 h-4" />
                      ) : (
                        <ExternalLink className="w-4 h-4" />
                      )}
                      <span className="text-sm truncate">{list.url}</span>
                    </div>
                    <div className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100">
                      {list.type}
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(list.id)}
                      className="absolute bottom-4 right-4"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServiceListManagement;