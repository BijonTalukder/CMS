"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { baseUrl } from "@/utility/config";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/categories`);
      setCategories(res.data.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateOrUpdate = async () => {
    try {
      if (editingId) {
        // Update category
        const res = await axios.put(`${baseUrl}/categories/${editingId}`, { name, description });
        toast.success("Category updated");
        setCategories((prev) =>
          prev.map((cat) => (cat.id === editingId ? res.data.data : cat))
        );
      } else {
        // Create category
        const res = await axios.post(`${baseUrl}/categories`, { name, description });
        toast.success("Category created");
        setCategories((prev) => [res.data.data, ...prev]);
      }
      setName("");
      setDescription("");
      setEditingId(null);
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleEdit = (category: Category) => {
    setName(category.name);
    setDescription(category.description || "");
    setEditingId(category.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${baseUrl}/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      {/* Create / Update Form */}
      <div className="flex flex-col md:flex-row gap-2 mb-6">
        <Input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={handleCreateOrUpdate}>
          {editingId ? "Update" : "Create"}
        </Button>
        {editingId && (
          <Button
            variant="outline"
            onClick={() => {
              setName("");
              setDescription("");
              setEditingId(null);
            }}
          >
            Cancel
          </Button>
        )}
      </div>

      {/* Category Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>Loading...</TableCell>
            </TableRow>
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>No categories found</TableCell>
            </TableRow>
          ) : (
            categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.description}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => handleEdit(cat)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
