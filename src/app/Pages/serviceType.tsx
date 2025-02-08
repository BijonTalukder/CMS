"use client";
import React, { useState, useEffect } from 'react';
import { PlusCircle, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Service {
  id?: string;
  title: string;
  shortDescription?: string;
  description?: string;
  phoneNumber?: string;
  type?: string;
  url?: string;
  imageUrl?: string;
  serviceId: string; // Foreign key
}

interface ServiceType {
  id?: string;
  title: string;
  imageUrl?: string;
  serviceList: Service[];
  isOpen: boolean;
}

const ServiceTypeManager = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [newServiceType, setNewServiceType] = useState({
    title: '',
    imageUrl: ''
  });
  const [newService, setNewService] = useState<Service>({
    // id: 0,
    serviceId: '', // Initialize with empty string
    title: '',
    shortDescription: '',
    description: '',
    phoneNumber: '',
    type: '',
    url: '',
    imageUrl: ''
  });
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

  // Fetch service types and services from the API
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await fetch('https://backend-eight-lake-96.vercel.app/api/v1/services');
        if (!response.ok) {
          throw new Error('Failed to fetch service types');
        }
        const data = await response.json();
        // Add isOpen property to each service type for UI toggling
        const serviceTypesWithToggle = data?.data?.map((type: ServiceType) => ({
          ...type,
          isOpen: false,
        }));
        setServiceTypes(serviceTypesWithToggle);
      } catch (error) {
        console.error('Error fetching service types:', error);
      }
    };

    fetchServiceTypes();
  }, []);

  const toggleServiceType = (typeId: string) => {
    setServiceTypes(serviceTypes.map(type => ({
      ...type,
      isOpen: type.id === typeId ? !type.isOpen : type.isOpen
    })));
  };

  const handleAddServiceType =async () => {
    if (newServiceType.title.trim()) {
      setServiceTypes([
        ...serviceTypes,
        {
          // id: serviceTypes.length + 1,
          title: newServiceType.title,
          serviceList: [],
          isOpen: false
        }
      ]);
      console.log('New service type added:', newServiceType);
      try {
        const response = await fetch('https://backend-eight-lake-96.vercel.app/api/v1/services-list/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newServiceType),
        });

        if (!response.ok) {
          throw new Error('Failed to submit service');
        }

        const result = await response.json();
        console.log('Service submitted successfully:', result);

     
        setIsServiceDialogOpen(false);
      } catch (error) {
        console.error('Error submitting service:', error);
      }
      setNewServiceType({
        title: '',
        imageUrl: ''
      });
      setIsTypeDialogOpen(false);
    }
  };

  const handleAddService = async () => {
    if (newService.title.trim() && selectedTypeId) {
      // Set the serviceTypeId in the newService object
      const serviceToSubmit = {
        ...newService,
        isInternalUrl:false,
        serviceId: selectedTypeId.toString(), // Ensure it's a string
      };

      // Submit to API
      try {
        const response = await fetch('https://backend-eight-lake-96.vercel.app/api/v1/services-list/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(serviceToSubmit),
        });

        if (!response.ok) {
          throw new Error('Failed to submit service');
        }

        const result = await response.json();
        console.log('Service submitted successfully:', result);

        // Update the UI with the new service
        const updatedServiceTypes = serviceTypes.map(type => {
          if (type.id === selectedTypeId) {
            return {
              ...type,
              services: [
                ...type.serviceList,
                { ...serviceToSubmit, }
              ]
            };
          }
          return type;
        });

        setServiceTypes(updatedServiceTypes);
        setNewService({
          // id: 0,
          serviceId: '',
          title: '',
          shortDescription: '',
          description: '',
          phoneNumber: '',
          type: '',
          url: '',
          imageUrl: ''
        });
        setIsServiceDialogOpen(false);
      } catch (error) {
        console.error('Error submitting service:', error);
      }
    }
  };

  const handleDeleteServiceType = (typeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setServiceTypes(serviceTypes.filter(type => type.id !== typeId));
  };

  const handleDeleteService = (typeId: string, serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setServiceTypes(serviceTypes.map(type => {
      if (type.id === typeId) {
        return {
          ...type,
          services: type.serviceList.filter(service => service.id !== serviceId)
        };
      }
      return type;
    }));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Service Type Manager</CardTitle>
          <CardDescription>Manage your service types and their associated services</CardDescription>
          <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Service Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service Type</DialogTitle>
                <DialogDescription>
                  Enter the name for the new service type.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newServiceType.title}
                    onChange={(e) => setNewServiceType({...newServiceType, title:e.target.value})}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    value={newServiceType.imageUrl}
                    onChange={(e) => setNewServiceType({...newServiceType,imageUrl: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddServiceType}>Add Service Type</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {serviceTypes.map((type,index) => (
              <div key={index} className="border rounded-lg">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => type.id && toggleServiceType(type.id)}
                >
                  <div className="flex items-center gap-2">
                    {type.isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium">{type.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => type.id && handleDeleteServiceType(type.id, e)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {type.isOpen && (
                  <div className="p-4 pt-0 pl-8 space-y-4">
                    <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTypeId(type.id ?? null); // Set the selected service type ID
                            setIsServiceDialogOpen(true);
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Service</DialogTitle>
                          <DialogDescription>
                            Enter the details for the new service.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="title"
                              value={newService.title}
                              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="shortDescription" className="text-right">
                              Short Description
                            </Label>
                            <Input
                              id="shortDescription"
                              value={newService.shortDescription}
                              onChange={(e) => setNewService({ ...newService, shortDescription: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              Description
                            </Label>
                            <Input
                              id="description"
                              value={newService.description}
                              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phoneNumber" className="text-right">
                              Phone Number
                            </Label>
                            <Input
                              id="phoneNumber"
                              value={newService.phoneNumber}
                              onChange={(e) => setNewService({ ...newService, phoneNumber: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                              Type
                            </Label>
                            <Input
                              id="type"
                              value={newService.type}
                              onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                              URL
                            </Label>
                            <Input
                              id="url"
                              value={newService.url}
                              onChange={(e) => setNewService({ ...newService, url: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imageUrl" className="text-right">
                              Image URL
                            </Label>
                            <Input
                              id="imageUrl"
                              value={newService.imageUrl}
                              onChange={(e) => setNewService({ ...newService, imageUrl: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddService}>Add Service</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <div className="space-y-2">
                      {type.serviceList.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-2 rounded-lg border"
                        >
                          <span>{service.title}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => service.id && handleDeleteService(type.id!, service.id!, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceTypeManager;