"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle, ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import { baseUrl } from "@/utility/config"
import { Checkbox } from "@/components/ui/checkbox"

interface Service {
  id?: string
  title: string
  shortDescription?: string
  description?: string
  phoneNumber?: string
  type?: "sectionCardOne" | "sectionCardTwo" | "sectionCardThree" | "sectionCardFour" 
  url?: string
  imageUrl?: string
  isClikableLink: boolean
  serviceId: string
  isTouristSpot?: boolean
  contentHtml?: string
}

interface ServiceType {
  id?: string
  title: string
  imageUrl?: string
  type: "card" | "banner"
  isLottie: boolean
  bannerImage: string[]
  serviceList: Service[]
  isOpen: boolean
}

interface ServiceTypeManagerProps {
  id: string;
}

const ServiceTypeManager: React.FC<ServiceTypeManagerProps> = ({id}) => {
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [newServiceType, setNewServiceType] = useState<Omit<ServiceType, "id" | "serviceList" | "isOpen">>({
    title: "",
    imageUrl: "",
    isLottie: false,
    type: "card",
    bannerImage: [],
  })

  const [newService, setNewService] = useState<Service>({
    isClikableLink: false,
    serviceId: "",
    title: "",
    shortDescription: "",
    description: "",
    phoneNumber: "",
    type: "sectionCardOne", // Default value
    url: "",
    isTouristSpot: false,
    contentHtml: "",
    imageUrl: "",
  })

  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null)
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [isClikableLink, setIsClikableLink] = useState(false)
  const [isTouristSpot, setIsTouristSpot] = useState(false)

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await fetch(`${baseUrl}/services/service-area/${id}`)
        if (!response.ok) throw new Error("Failed to fetch service types")

        const data = await response.json()
        const formatted: ServiceType[] = data?.data?.map((type: any) => ({
          ...type,
          isOpen: false,
        }))
        setServiceTypes(formatted)
      } catch (error) {
        console.error("Error fetching service types:", error)
      }
    }

    fetchServiceTypes()
  }, [id])

  const toggleServiceType = (typeId: string) => {
    setServiceTypes((prev) =>
      prev.map((type) =>
        type.id === typeId ? { ...type, isOpen: !type.isOpen } : type
      )
    )
  }

  const handleTypeChange = (selectedType: string) => {
    setNewServiceType((prev) => ({
      ...prev,
      type: selectedType as "card" | "banner",
      bannerImage: selectedType === "banner" ? prev.bannerImage : [],
    }))
  }

  const handleServiceTypeChange = (selectedType: "sectionCardOne" | "sectionCardTwo" | "sectionCardThree" | "sectionCardFour") => {
    setNewService((prev) => ({
      ...prev,
      type: selectedType,
    }))
  }

  const handleAddServiceType = async () => {
    if (!newServiceType.title.trim()) return

    try {
      const response = await fetch(`${baseUrl}/services/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newServiceType),
      })

      if (!response.ok) throw new Error("Failed to submit service")

      const created = await response.json()
      setServiceTypes((prev) => [
        ...prev,
        {
          ...newServiceType,
          id: created.data.id,
          serviceList: [],
          isOpen: false,
        },
      ])
      setNewServiceType({
        title: "",
        imageUrl: "",
        type: "card",
        isLottie: false,
        bannerImage: [],
      })
      setIsTypeDialogOpen(false)
    } catch (err) {
      console.error("Error submitting service:", err)
    }
  }

  const handleAddService = async () => {
    if (!newService.title.trim() || !selectedTypeId || !newService.type) return

    const payload = {
      ...newService,
      isClikableLink,
      isTouristSpot,
      isInternalUrl: false,
      serviceId: selectedTypeId,
    }

    try {
      const response = await fetch(`${baseUrl}/services-list/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to submit service")

      const result = await response.json()
      const updated = serviceTypes.map((type) =>
        type.id === selectedTypeId
          ? {
            ...type,
            serviceList: [...type.serviceList, result.data],
          }
          : type
      )
      setServiceTypes(updated)
      setNewService({
        isClikableLink: false,
        serviceId: "",
        title: "",
        shortDescription: "",
        description: "",
        phoneNumber: "",
        type: "sectionCardOne",
        url: "",
        isTouristSpot: false,
        contentHtml: "",
        imageUrl: "",
      })
      setIsClikableLink(false)
      setIsTouristSpot(false)
      setIsServiceDialogOpen(false)
    } catch (error) {
      console.error("Error submitting service:", error)
    }
  }

  const handleDeleteServiceType = async (
    typeId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    try {
      await axios.delete(`${baseUrl}/services/${typeId}`)
      setServiceTypes((prev) => prev.filter((type) => type.id !== typeId))
    } catch (err) {
      console.error("Failed to delete service type", err)
    }
  }

  const handleDeleteService = async (
    typeId: string,
    serviceId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation()
    try {
      await axios.delete(`${baseUrl}/services-list/${serviceId}`)
      setServiceTypes((prev) =>
        prev.map((type) =>
          type.id === typeId
            ? {
              ...type,
              serviceList: type.serviceList.filter((s) => s.id !== serviceId),
            }
            : type
        )
      )
    } catch (err) {
      console.error("Failed to delete service", err)
    }
  }

  const renderServiceFields = () => {
    const serviceType = newService.type
    
    return (
      <>
        {/* Title - Always shown */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title *
          </Label>
          <Input
            id="title"
            value={newService.title}
            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            className="col-span-3"
            required
          />
        </div>

        {/* Section Card One: title, shortDescription, description, phoneNumber */}
        {serviceType === "sectionCardOne" && (
          <>
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
          </>
        )}

        {/* Section Card Two: title, shortDescription, description, phoneNumber, imageUrl */}
        {serviceType === "sectionCardTwo" && (
          <>
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
          </>
        )}

        {/* Section Card Three: title, shortDescription, description, imageUrl, isTouristSpot, contentHtml, isClikableLink, url */}
        {serviceType === "sectionCardThree" && (
          <>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contentHtml" className="text-right">
                Content HTML
              </Label>
              <Input
                id="contentHtml"
                value={newService.contentHtml}
                onChange={(e) => setNewService({ ...newService, contentHtml: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isTouristSpot" className="text-right">
                Is Tourist Spot
              </Label>
              <RadioGroup
                defaultValue="option-two"
                onValueChange={(value) => setIsTouristSpot(value === "option-one")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="tourist-yes" />
                  <Label htmlFor="tourist-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="tourist-no" />
                  <Label htmlFor="tourist-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isClikableLink" className="text-right">
                Is Clickable Link
              </Label>
              <RadioGroup
                defaultValue="option-two"
                onValueChange={(value) => setIsClikableLink(value === "option-one")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="link-yes" />
                  <Label htmlFor="link-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="link-no" />
                  <Label htmlFor="link-no">No</Label>
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
          </>
        )}

        {/* Section Card Four: title, imageUrl, isClikableLink only */}
        {serviceType === "sectionCardFour" && (
          <>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isClikableLink" className="text-right">
                Is Clickable Link
              </Label>
              <RadioGroup
                defaultValue="option-two"
                onValueChange={(value) => setIsClikableLink(value === "option-one")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-one" id="link-four-yes" />
                  <Label htmlFor="link-four-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="option-two" id="link-four-no" />
                  <Label htmlFor="link-four-no">No</Label>
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
          </>
        )}
      </>
    )
  }

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
                      value={newServiceType.bannerImage.join(',')}
                      onChange={(e) => {
                        const urls = e.target.value.split(',').map(url => url.trim());
                        setNewServiceType({
                          ...newServiceType,
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
                 
                   <Checkbox id="isLottie"
                  checked={newServiceType.isLottie}
      onCheckedChange={(checked) => setNewServiceType({ ...newServiceType, isLottie: !!checked })}
                     aria-label='Size default' />
                  {/* <Input
                    id="isLottie"
                    type="checkbox"
                    checked={newServiceType.isLottie}
                   
                    className="col-span-3"
                  /> */}
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
                            setSelectedTypeId(type.id ?? null);
                            setNewService({
                              isClikableLink: false,
                              serviceId: "",
                              title: "",
                              shortDescription: "",
                              description: "",
                              phoneNumber: "",
                              type: "sectionCardOne",
                              url: "",
                              isTouristSpot: false,
                              contentHtml: "",
                              imageUrl: "",
                            });
                            setIsClikableLink(false);
                            setIsTouristSpot(false);
                            setIsServiceDialogOpen(true);
                          }}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add New Service</DialogTitle>
                          <DialogDescription>
                            Enter the details for the new service.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          {/* Service Type Selection - Required */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="serviceType" className="text-right">
                              Service Type *
                            </Label>
                            <div className="col-span-3">
                              <Select
                                value={newService.type}
                                onValueChange={handleServiceTypeChange}
                                required
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Service Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sectionCardOne">Section Card One</SelectItem>
                                  <SelectItem value="sectionCardTwo">Section Card Two</SelectItem>
                                  <SelectItem value="sectionCardThree">Section Card Three</SelectItem>
                                  <SelectItem value="sectionCardFour">Section Card Four</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {renderServiceFields()}
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
                          <div>
                            <span className="font-medium">{service.title}</span>
                            <span className="ml-2 text-sm text-gray-500">({service.type})</span>
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
                                  This will permanently delete the service.
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