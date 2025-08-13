'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import axios from 'axios'
import { baseUrl } from '@/utility/config'
import Link from 'next/link'
import useUserStore from '@/store/userStore'

// type PermissionObject = {
//   [key: string]: string[]; // e.g. { news: ["view", "create"], ... }
// };

// type UserPermission = {
//   id: string;
//   userId: string;
//   areaId: string;
//   permissions: PermissionObject;
//   status: boolean;
//   createdAt: string;
// };

// type User = {
//   id: string;
//   email: string;
//   phone: string;
//   role: string;
//   name: string;
//   status: boolean;
//   createdAt: string;
//   updatedAt: string;
//   userPermissions: UserPermission[];
// };

type ServiceArea = {
  id: string;
  name: string;
  description?: string;
  status: boolean;
};
const ServiceAreaPage=()=> {
  const [open, setOpen] = useState(false)
  const [areas, setAreas] = useState<ServiceArea[]>([])
  const [form, setForm] = useState({ name: '', description: '', status: true })
  const user = useUserStore(state => state.user)

const fetchAreas = async (): Promise<void> => {
  try {
    const res = await axios.get<{ data: ServiceArea[] }>(`${baseUrl}/service-areas`);
    const allAreas = res.data?.data || [];

    if (user?.userPermissions?.length) {
      const allowedAreaIds = user.userPermissions.map((p:any) => p.areaId);
      const filteredAreas = allAreas.filter((area) => allowedAreaIds.includes(area.id));
      setAreas(filteredAreas);
    } else {
      setAreas(allAreas);
    }
  } catch (err) {
    console.error('Failed to fetch service areas', err);
  }
};

  const createArea = async () => {
    try {
      await axios.post(`${baseUrl}/service-areas/create`, form)
      setForm({ name: '', description: '', status: true })
      setOpen(false)
      fetchAreas()
    } catch (err) {
      console.error('Create failed', err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseUrl}/service-area/${id}`)
      fetchAreas()
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  useEffect(() => {
    fetchAreas()
  }, [])

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Service Area</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Service Area</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Service Area</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={form.status}
                  onCheckedChange={(checked) => setForm({ ...form, status: checked })}
                />
                <Label>Status</Label>
              </div>
              <Button onClick={createArea} className="w-full">
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((area) => (

          <Link key={area.id} href={`/dashboard/service-area/${area.id}`}>
            <Card key={area.id}>
            <CardHeader>
              <CardTitle>{area.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{area.description || 'No description'}</p>
              <p className="text-sm text-gray-500 mt-2">Status: {area.status ? 'Active' : 'Inactive'}</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(area.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
          </Link>
        
        ))}
      </div>
    </div>
  )
}
export default ServiceAreaPage;