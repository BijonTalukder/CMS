"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "@/components/ui/use-toast";
import { baseUrl } from "@/utility/config";

type Role = "user" | "seller" | "admin";
type ServiceAction = "view" | "create" | "edit" | "delete";

interface Area {
  id: string;
  name: string;
  routes: string[];
}

export default function CreateUserPage() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user" as Role,
    status: true,
    permissions: [] as {
      areaId: string;
      permissions: Record<string, ServiceAction[]>;
    }[],
  });

  const [loading, setLoading] = useState(false);

  // Define routes here, used for all areas or customize per area
  const predefinedRoutes = [
    "news",
    "tourist-spot",
    "users",
    "reports",
  ];

  useEffect(() => {
    fetch(`${baseUrl}/service-areas`)
      .then((res) => res.json())
      .then((data) => {
        const areasWithRoutes = data?.data?.map((area: any) => ({
          ...area,
          routes: predefinedRoutes,
        }));
        setAreas(areasWithRoutes);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleService = (
    areaId: string,
    route: string,
    service: ServiceAction,
    checked: boolean
  ) => {
    setForm((prev) => {
      const existingArea = prev.permissions.find((p) => p.areaId === areaId);

      if (!existingArea) {
        return {
          ...prev,
          permissions: [
            ...prev.permissions,
            { areaId, permissions: { [route]: [service] } },
          ],
        };
      }

      const currentServices = existingArea.permissions[route] || [];
      const updatedServices = checked
        ? [...currentServices, service]
        : currentServices.filter((s) => s !== service);

      return {
        ...prev,
        permissions: prev.permissions.map((p) =>
          p.areaId === areaId
            ? { ...p, permissions: { ...p.permissions, [route]: updatedServices } }
            : p
        ),
      };
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
    const cookies = document.cookie; 
    
    // নির্দিষ্ট cookie পেতে:
    const token = cookies
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
      console.log("Token:", token);
      const res = await fetch(`${baseUrl}/admin/create-user-with-permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,

              "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create user");

      // toast({ title: "✅ User created successfully" });
      alert("User created successfully");
    } catch (error: any) {
      // toast({ title: "❌ Error", description: error.message });
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4 border rounded-lg shadow">
      <h1 className="text-xl font-semibold">Create New User</h1>

      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Full name"
        />
      </div>

      {/* Email */}
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="user@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <Label>Password</Label>
        <Input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Enter password"
        />
      </div>

      {/* Phone */}
      <div>
        <Label>Phone</Label>
        <Input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Optional"
        />
      </div>

      {/* Role */}
      <div>
        <Label>Role</Label>
        <Select
          value={form.role}
          onValueChange={(value: Role) => setForm({ ...form, role: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="seller">Seller</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={form.status}
          onCheckedChange={(checked) => setForm({ ...form, status: checked })}
        />
        <Label>Active</Label>
      </div>

      {/* Area Permissions */}
      {
        form.role === "admin" &&   <div className="border rounded-lg p-4">
        <h2 className="font-medium mb-3">Area Permissions</h2>
        {areas.map((area) => (
          <div key={area.id} className="mb-6">
            <h3 className="font-semibold">{area.name}</h3>
            {area.routes.map((route) => {
              const existingArea = form.permissions.find(
                (p) => p.areaId === area.id
              );
              const selectedActions =
                existingArea?.permissions[route] || [];

              return (
                <div key={route} className="pl-4 mt-2">
                  <p className="font-medium">{route}</p>
                  <div className="flex gap-4 mt-1">
                    {(["view", "create", "edit", "delete"] as ServiceAction[]).map(
                      (action) => {
                        const checked = selectedActions.includes(action);
                        return (
                          <div
                            key={action}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(c) =>
                                toggleService(area.id, route, action, Boolean(c))
                              }
                            />
                            <span className="capitalize">{action}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      }
    

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
    </div>
  );
}
