"use client"

import React from 'react';
import { 
  Plus, 
  Trash, 
  Phone, 
  Link2, 
  Type, 
  FileText, 
  Globe,
  ChevronRight
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from 'react';

const Service = () => {
  const [services, setServices] = useState([]);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  // Basic form state
  const [formData, setFormData] = useState({
    title: '',
    status: true,
    imageUrl: '',
    serviceList: []
  });

  const handleCreateService = (e) => {
    e.preventDefault();
    const newService = { ...formData, serviceList: [] };
    setServices([...services, newService]);
    setIsServiceDialogOpen(false);
    setFormData({ title: '', status: true, imageUrl: '', serviceList: [] });
  };

  const [serviceListData, setServiceListData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    phoneNumber: '',
    type: '',
    status: true,
    url: '',
    isInternalUrl: false,
    imageUrl: '',
    dynamicFields: '{}'
  });

  const handleServiceListSubmit = (serviceId) => {
    const updatedServices = services.map(service => {
      if (service === selectedService) {
        return {
          ...service,
          serviceList: [...(service.serviceList || []), serviceListData]
        };
      }
      return service;
    });
    setServices(updatedServices);
    setServiceListData({
      title: '',
      shortDescription: '',
      description: '',
      phoneNumber: '',
      type: '',
      status: true,
      url: '',
      isInternalUrl: false,
      imageUrl: '',
      dynamicFields: '{}'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Service Header and Create Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Services</h1>
        <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            {/* Service Creation Form (unchanged) */}
            {/* ... existing service creation form code ... */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle>{service.title}</CardTitle>
                    <Badge variant={service.status ? "success" : "secondary"}>
                      {service.status ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {service.serviceList?.length || 0} items in this service
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={service.status}
                    onCheckedChange={(checked) => {
                      const updatedServices = [...services];
                      updatedServices[index].status = checked;
                      setServices(updatedServices);
                    }}
                  />
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="items" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="items">Service Items</TabsTrigger>
                  <TabsTrigger value="add">Add New Item</TabsTrigger>
                </TabsList>
                
                <TabsContent value="items">
                  <div className="space-y-4">
                    {service.serviceList?.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {service.serviceList.map((item, itemIndex) => (
                          <AccordionItem key={itemIndex} value={`item-${itemIndex}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                  {item.type.charAt(0)}
                                </div>
                                <div className="text-left">
                                  <p className="font-medium">{item.title}</p>
                                  <p className="text-sm text-muted-foreground">{item.type}</p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4 p-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-muted-foreground">Phone</Label>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      <span>{item.phoneNumber}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-muted-foreground">URL</Label>
                                    <div className="flex items-center gap-2">
                                      <Link2 className="h-4 w-4" />
                                      <span className="truncate">{item.url}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-muted-foreground">Description</Label>
                                  <p>{item.description}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant={item.status ? "success" : "secondary"}>
                                    {item.status ? "Active" : "Inactive"}
                                  </Badge>
                                  <Badge variant={item.isInternalUrl ? "outline" : "secondary"}>
                                    {item.isInternalUrl ? "Internal URL" : "External URL"}
                                  </Badge>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No service items yet. Add your first item!
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="add">
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input 
                          value={serviceListData.title}
                          onChange={(e) => setServiceListData({
                            ...serviceListData,
                            title: e.target.value
                          })}
                          placeholder="Enter title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Input 
                          value={serviceListData.type}
                          onChange={(e) => setServiceListData({
                            ...serviceListData,
                            type: e.target.value
                          })}
                          placeholder="Service type"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Short Description</Label>
                      <Textarea 
                        value={serviceListData.shortDescription}
                        onChange={(e) => setServiceListData({
                          ...serviceListData,
                          shortDescription: e.target.value
                        })}
                        placeholder="Brief description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input 
                          value={serviceListData.phoneNumber}
                          onChange={(e) => setServiceListData({
                            ...serviceListData,
                            phoneNumber: e.target.value
                          })}
                          placeholder="Contact number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input 
                          value={serviceListData.url}
                          onChange={(e) => setServiceListData({
                            ...serviceListData,
                            url: e.target.value
                          })}
                          placeholder="Service URL"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label>Status</Label>
                        <Switch 
                          checked={serviceListData.status}
                          onCheckedChange={(checked) => setServiceListData({
                            ...serviceListData,
                            status: checked
                          })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label>Internal URL</Label>
                        <Switch 
                          checked={serviceListData.isInternalUrl}
                          onCheckedChange={(checked) => setServiceListData({
                            ...serviceListData,
                            isInternalUrl: checked
                          })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Image</Label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setServiceListData({
                          ...serviceListData,
                          imageUrl: e.target.value
                        })}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button 
                        onClick={() => handleServiceListSubmit(service.id)}
                        className="w-full"
                      >
                        Add Service Item
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Service;