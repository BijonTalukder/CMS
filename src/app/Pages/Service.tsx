// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Plus, Trash, Edit } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import Image from "next/image";

// const ServiceManagement = () => {
//   const [services, setServices] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     status: true,
//     imageUrl: "",
//   });
//   const [serviceListData, setServiceListData] = useState({
//     serviceId: "",
//     title: "",
//     shortDescription: "",
//     description: "",
//     phoneNumber: "",
//     type: "",
//     url: "",
//     status: true,
//     isInternalUrl: false,
//     imageUrl: "",
//     dynamicFields: {},
//   });

//   // Fetch services
//   const fetchServices = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/v1/services");
//       const data = await response.json();
//       setServices(data.data);
//     } catch (error) {
//       console.error("Error fetching services:", error);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   // Create service
//   const handleCreateService = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5000/api/v1/services/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         setOpen(false);
//         setFormData({ title: "", status: true, imageUrl: "" });
//         fetchServices();
//       }
//     } catch (error) {
//       console.error("Error creating service:", error);
//     }
//   };

//   // Create service list
//   const handleCreateServiceList = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5000/api/v1/services-list/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(serviceListData),
//       });

//       if (response.ok) {
//         setServiceListData({
//           serviceId: "",
//           title: "",
//           shortDescription: "",
//           description: "",
//           phoneNumber: "",
//           type: "",
//           url: "",
//           isInternalUrl: false,
//           imageUrl: "",
//           dynamicFields: {},
//         });
//         fetchServices();
//       }
//     } catch (error) {
//       console.error("Error creating service list:", error);
//     }
//   };

//   // Delete service
//   const handleDeleteService = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/v1/services/${id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         fetchServices();
//       }
//     } catch (error) {
//       console.error("Error deleting service:", error);
//     }
//   };

//   return (
//     <div className="p-6">
//       <Card className="w-full max-w-6xl mx-auto shadow-lg">
//         <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-lg">
//           <CardTitle className="text-white text-2xl font-bold">Services Management</CardTitle>
//           <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//               <Button className="bg-white text-blue-600 hover:bg-gray-100">
//                 <Plus className="w-4 h-4 mr-2" />
//                 Add Service
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle className="text-xl font-semibold">Create New Service</DialogTitle>
//               </DialogHeader>
//               <form onSubmit={handleCreateService} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title" className="font-medium">Title</Label>
//                   <Input
//                     id="title"
//                     value={formData.title}
//                     onChange={(e) =>
//                       setFormData({ ...formData, title: e.target.value })
//                     }
//                     required
//                     className="w-full"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="imageUrl" className="font-medium">Image URL</Label>
//                   <Input
//                     id="imageUrl"
//                     value={formData.imageUrl}
//                     onChange={(e) =>
//                       setFormData({ ...formData, imageUrl: e.target.value })
//                     }
//                     className="w-full"
//                   />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Switch
//                     id="status"
//                     checked={formData.status}
//                     onCheckedChange={(checked) =>
//                       setFormData({ ...formData, status: checked })
//                     }
//                   />
//                   <Label htmlFor="status" className="font-medium">Active</Label>
//                 </div>
//                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
//                   Create Service
//                 </Button>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {services.map((service) => (
//               <Card key={service.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
//                 <div className="relative h-48">
//                   <Image
//                     src={service.imageUrl || ""}
//                     alt={service.title}
//                     layout="fill"
//                     objectFit="cover"
//                     className="rounded-t-lg"
//                   />
//                   <div className="absolute top-2 right-2">
//                     <Switch checked={service.status} disabled />
//                   </div>
//                 </div>
//                 <CardContent className="p-4">
//                   <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
//                   <div className="flex space-x-2">
//                     <Dialog>
//                       <DialogTrigger asChild>
//                         <Button
//                           onClick={() => setServiceListData({ ...serviceListData, serviceId: service.id })}
//                           className="flex-1 bg-blue-600 hover:bg-blue-700"
//                         >
//                           <Edit className="w-4 h-4 mr-2" />
//                           Add Service List
//                         </Button>
//                       </DialogTrigger>
//                       <DialogContent className="sm:max-w-md">
//                         <DialogHeader>
//                           <DialogTitle className="text-xl font-semibold">Create Service List for {service.title}</DialogTitle>
//                         </DialogHeader>
//                         <form onSubmit={handleCreateServiceList} className="space-y-4">
//                           {/* Form fields for service list */}
//                           <div className="space-y-2">
//                             <Label htmlFor="serviceListTitle" className="font-medium">Title</Label>
//                             <Input
//                               id="serviceListTitle"
//                               value={serviceListData.title}
//                               onChange={(e) =>
//                                 setServiceListData({ ...serviceListData, title: e.target.value })
//                               }
//                               required
//                               className="w-full"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="shortDescription" className="font-medium">Short Description</Label>
//                             <Input
//                               id="shortDescription"
//                               value={serviceListData.shortDescription}
//                               onChange={(e) =>
//                                 setServiceListData({ ...serviceListData, shortDescription: e.target.value })
//                               }
//                               className="w-full"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="description" className="font-medium">Description</Label>
//                             <Input
//                               id="description"
//                               value={serviceListData.description}
//                               onChange={(e) =>
//                                 setServiceListData({ ...serviceListData, description: e.target.value })
//                               }
//                               className="w-full"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="phoneNumber" className="font-medium">Phone Number</Label>
//                             <Input
//                               id="phoneNumber"
//                               value={serviceListData.phoneNumber}
//                               onChange={(e) =>
//                                 setServiceListData({ ...serviceListData, phoneNumber: e.target.value })
//                               }
//                               className="w-full"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="type" className="font-medium">Type</Label>
//                             <Input
//                               id="type"
//                               value={serviceListData.type}
//                               onChange={(e) =>
//                                 setServiceListData({ ...serviceListData, type: e.target.value })
//                               }
//                               className="w-full"
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="url" className="font-medium">URL</Label>
//                             <Input
//                               id="url"
//                               value={serviceListData.url}
//                               onChange={(e) =>
//                                 setServiceListData({ ...serviceListData, url: e.target.value })
//                               }
//                               className="w-full"
//                             />
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <Switch
//                               id="isInternalUrl"
//                               checked={serviceListData.isInternalUrl}
//                               onCheckedChange={(checked) =>
//                                 setServiceListData({ ...serviceListData, isInternalUrl: checked })
//                               }
//                             />
//                             <Label htmlFor="isInternalUrl" className="font-medium">Internal URL</Label>
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="imageUrl" className="font-medium">Image URL</Label>
//                             <Input
//                               id="imageUrl"
//                               value={serviceListData.imageUrl}
//                               onChange={(e) =>
//                                 setServiceListData({ ...serviceListData, imageUrl: e.target.value })
//                               }
//                               className="w-full"
//                             />
//                           </div>
//                           <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
//                             Create Service List
//                           </Button>
//                         </form>
//                       </DialogContent>
//                     </Dialog>
//                     <Button
//                       variant="destructive"
//                       size="icon"
//                       onClick={() => handleDeleteService(service.id)}
//                       className="flex-1"
//                     >
//                       <Trash className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ServiceManagement;
