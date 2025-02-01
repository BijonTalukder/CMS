import React, { useState } from 'react';
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

const ServiceTypeManager = () => {
  const [serviceTypes, setServiceTypes] = useState([
    {
      id: 1,
      name: 'News',
      services: [
        { id: 1, name: 'Prothom Alo' },
        { id: 2, name: 'Dainik CTG' },
        { id: 3, name: 'Ittefaq' }
      ],
      isOpen: false
    }
  ]);

  const [newServiceType, setNewServiceType] = useState('');
  const [newService, setNewService] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

  const toggleServiceType = (typeId) => {
    setServiceTypes(serviceTypes.map(type => ({
      ...type,
      isOpen: type.id === typeId ? !type.isOpen : type.isOpen
    })));
  };

  const handleAddServiceType = () => {
    if (newServiceType.trim()) {
      setServiceTypes([
        ...serviceTypes,
        {
          id: serviceTypes.length + 1,
          name: newServiceType,
          services: [],
          isOpen: false
        }
      ]);
      setNewServiceType('');
      setIsTypeDialogOpen(false);
    }
  };

  const handleAddService = () => {
    if (newService.trim() && selectedTypeId) {
      setServiceTypes(serviceTypes.map(type => {
        if (type.id === selectedTypeId) {
          return {
            ...type,
            services: [
              ...type.services,
              { id: type.services.length + 1, name: newService }
            ]
          };
        }
        return type;
      }));
      setNewService('');
      setIsServiceDialogOpen(false);
    }
  };

  const handleDeleteServiceType = (typeId, e) => {
    e.stopPropagation();
    setServiceTypes(serviceTypes.filter(type => type.id !== typeId));
  };

  const handleDeleteService = (typeId, serviceId, e) => {
    e.stopPropagation();
    setServiceTypes(serviceTypes.map(type => {
      if (type.id === typeId) {
        return {
          ...type,
          services: type.services.filter(service => service.id !== serviceId)
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
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value)}
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
            {serviceTypes.map((type) => (
              <div key={type.id} className="border rounded-lg">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleServiceType(type.id)}
                >
                  <div className="flex items-center gap-2">
                    {type.isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium">{type.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteServiceType(type.id, e)}
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
                          onClick={() => setSelectedTypeId(type.id)}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Service</DialogTitle>
                          <DialogDescription>
                            Enter the name for the new service.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="serviceName" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="serviceName"
                              value={newService}
                              onChange={(e) => setNewService(e.target.value)}
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
                      {type.services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-2 rounded-lg border"
                        >
                          <span>{service.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleDeleteService(type.id, service.id, e)}
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