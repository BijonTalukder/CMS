"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PlusCircle, ChevronDown, ChevronRight, Trash2, Radio } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  // RadioGroup,
  // RadioGroupItem
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { baseUrl } from '@/utility/config';

interface Service {
  id?: string;
  title: string;
  shortDescription?: string;
  description?: string;
  phoneNumber?: string;
  type?: string;
  url?: string;
  imageUrl?: string;
  isClikableLink: boolean;
  serviceId: string; // Foreign key
}
// let bannerImage: string[] = [];
interface ServiceType {
  id?: string;
  title: string;
  imageUrl?: string;
  type: string;
  isLottie: boolean,
  bannerImage: string[];
  serviceList: Service[];
  isOpen: boolean;
}
interface ServiceTypeData {

  title: string;
  imageUrl?: string;
  type: string;
  isLottie: boolean,
  bannerImage?: string[];

}
const ServiceTypeManager = () => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [newServiceType, setNewServiceType] = useState({
    title: '',
    imageUrl: '',
    isLottie: false,
    type: "card",
    bannerImage: []

  });
  const [newService, setNewService] = useState<Service>({
    isClikableLink: false,
    serviceId: '',
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
  const [isClikableLink, setIsClikableLink] = useState<boolean>(false);
  // Fetch service types and services from the API
  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await fetch(`${baseUrl}/services`);
        if (!response.ok) {
          throw new Error('Failed to fetch service types');
        }
        const data = await response.json();
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
  const handleTypeChange = (e: any) => {
    const selectedType = e.target.value;
    setNewServiceType(prevState => ({
      ...prevState,
      type: selectedType,
      bannerImage: selectedType === 'banner' ? prevState.bannerImage : []
    }));
  };
  const handleAddServiceType = async () => {
    if (newServiceType.title.trim()) {
      setServiceTypes([
        ...serviceTypes,
        {
          // id: serviceTypes.length + 1,
          title: newServiceType.title,
          bannerImage: newServiceType.bannerImage,
          type: newServiceType.type,
          isLottie: newServiceType.isLottie,
          serviceList: [],
          isOpen: false
        }
      ]);
      try {
        const response = await fetch(`${baseUrl}/services/create`, {
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
        imageUrl: '',
        type: "card",
        isLottie: false,
        bannerImage: []
      });
      setIsTypeDialogOpen(false);
    }
  };

  const handleAddService = async () => {
    if (newService.title.trim() && selectedTypeId) {
      // Set the serviceTypeId in the newService object
      const serviceToSubmit = {
        ...newService,
        isClikableLink: isClikableLink,
        isInternalUrl: false,
        serviceId: selectedTypeId.toString(), // Ensure it's a string
      };

      // Submit to API
      try {
        const response = await fetch(`${baseUrl}/services-list/create`, {
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
          isClikableLink: false,
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

    axios.delete(`${baseUrl}/services/${typeId}`)
      .then(response => {
        console.log('Service type deleted successfully:', response.data);
      })
    setServiceTypes(serviceTypes.filter(type => type.id !== typeId));
  };

  const handleDeleteService = (typeId: string, serviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Deleting service:', serviceId, 'from type:', typeId);
    axios.delete(`${baseUrl}/services-list/${serviceId}`)
      .then(response => {
        console.log('Service type deleted successfully:', response.data);
      })
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
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newServiceType.title}
                    onChange={(e) => setNewServiceType({ ...newServiceType, title: e.target.value })}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">Type</Label>
                  <div className="col-span-3">
                    <Select
                      value={newServiceType.type}
                      onValueChange={handleTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="banner">Banner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>



                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={newServiceType.imageUrl}
                    onChange={(e) => setNewServiceType({ ...newServiceType, imageUrl: e.target.value })}
                    className="col-span-3"
                    disabled={newServiceType.type === 'banner'}
                  />
                </div>

                {newServiceType.type === 'banner' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bannerImages" className="text-right">Banner Image URLs</Label>
                    <Input
                      id="bannerImages"
                      type="text"
                      value={newServiceType.bannerImage.join(',')} // Displaying comma-separated URLs
                      onChange={(e) => {
                        const urls = e.target.value.split(',').map(url => url.trim()); // Split by commas and trim whitespace
                        setNewServiceType({
                          ...newServiceType,
                          //@ts-ignore
                          bannerImage: urls,
                        });
                      }}
                      className="col-span-3"
                      placeholder="Enter multiple image URLs separated by commas"
                    />
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isLottie" className="text-right">Is Lottie?</Label>
                  <Input
                    id="isLottie"
                    type="checkbox"
                    checked={newServiceType.isLottie}
                    onChange={() => setNewServiceType({ ...newServiceType, isLottie: !newServiceType.isLottie })}
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
            {serviceTypes.map((type, index) => (
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the service type and all its services.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e: React.MouseEvent) => type.id && handleDeleteServiceType(type.id, e)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

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
                            <Label htmlFor="isClikableLink" className="text-right">
                              Is Clikable Link
                            </Label>
                            <RadioGroup
                              defaultValue="option-two"
                              onValueChange={(value) => setIsClikableLink(value === "option-one")}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="option-one" id="option-one" />
                                <Label htmlFor="option-one">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="option-two" id="option-two" />
                                <Label htmlFor="option-two">No</Label>
                              </div>
                            </RadioGroup>

                          </div>
                          {isClikableLink && (
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
                          )}
                          {/* <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="url" className="text-right">
                              URL
                            </Label>
                            <Input
                              id="url"
                              value={newService.url}
                              onChange={(e) => setNewService({ ...newService, url: e.target.value })}
                              className="col-span-3"
                            />
                          </div> */}
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


                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the service type and all its services.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e: React.MouseEvent) => service.id && handleDeleteService(type.id!, service.id!, e)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
   
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