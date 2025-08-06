"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { baseUrl } from "@/utility/config";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Type definition for BreakingNews
type BreakingNews = {
  id: string;
  newsTitle: string;
  content?: string;
  status: boolean;
  order: number;
  createdAt: string;
};

const BreakingNewsList = () => {
  const [newsList, setNewsList] = useState<BreakingNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    newsTitle: "",
    content: "",
    order: "",
  });

  // Load breaking news list
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/breaking-news`);
      setNewsList(res.data.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete breaking news by id
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${baseUrl}/breaking-news/${id}`);
      await loadData();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Toggle status active/inactive with PATCH request
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.patch(`${baseUrl}/breaking-news/${id}`, {
        status: !currentStatus,
      });
      await loadData();
    } catch (error) {
      console.error("Status toggle failed", error);
    }
  };

  // Create new breaking news
  const handleSubmit = async () => {
    if (!formData.newsTitle.trim() || !formData.order.trim()) {
      alert("Please fill title and order.");
      return;
    }
    try {
      await axios.post(`${baseUrl}/breaking-news/create`, {
        newsTitle: formData.newsTitle,
        content: formData.content,
        order: parseInt(formData.order),
      });
      setOpen(false);
      setFormData({ newsTitle: "", content: "", order: "" });
      await loadData();
    } catch (error) {
      console.error("Create failed", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      {/* Create Breaking News Button and Modal */}
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Breaking News</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Breaking News</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={formData.newsTitle}
                onChange={(e) =>
                  setFormData({ ...formData, newsTitle: e.target.value })
                }
              />
              <Textarea
                placeholder="Content (optional)"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Order"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Breaking News List */}
      <Card>
        <CardHeader>
          <CardTitle>Breaking News List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>{item.newsTitle}</TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${
                          item.status ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(item.id, item.status)}
                      >
                        {item.status ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BreakingNewsList;
