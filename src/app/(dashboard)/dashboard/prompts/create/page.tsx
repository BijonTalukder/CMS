"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FiTrash2, FiEdit2, FiPlus } from "react-icons/fi";
import { baseUrl } from "@/utility/config";

// Types
type Image = { url: string; thumbnail?: string; preview?: string };
type AiPlatform = { id: number; name: string; url?: string };
type Category = { id: string; name: string };
type Prompt = {
  id: string;
  title: string;
  text: string;
  images: Image[];
  aiPlatforms: AiPlatform[];
  categoryId?: string;
  categoryName?: string;
  tags?: string[];
  createdAt: string;
};

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    text: "",
    images: [] as Image[],
    aiPlatforms: [] as AiPlatform[],
    categoryId: "",
    tags: [] as string[],
  });

  // Fetch all prompts
  const fetchPrompts = async () => {
    const res = await fetch(`${baseUrl}/prompts`);
    const data = await res.json();
    setPrompts(data.data);
  };

  // Fetch categories
  const fetchCategories = async () => {
    const res = await fetch(`${baseUrl}/categories`);
    const data = await res.json();
    setCategories(data.data);
  };

  useEffect(() => {
    fetchPrompts();
    fetchCategories();
  }, []);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      text: form.text,
      images: form.images,
      aiPlatforms: form.aiPlatforms,
      categoryId: form.categoryId || null,
      tags: form.tags,
    };

    if (editing) {
      await fetch(`${baseUrl}/prompts/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch(`${baseUrl}/prompts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm({
      id: "",
      title: "",
      text: "",
      images: [],
      aiPlatforms: [],
      categoryId: "",
      tags: [],
    });
    setEditing(false);
    setLoading(false);
    fetchPrompts();
  };

  const handleDelete = async (id: string) => {
    await fetch(`${baseUrl}/prompts/${id}`, { method: "DELETE" });
    fetchPrompts();
  };

  // Images handlers
  const addImage = () =>
    setForm({
      ...form,
      images: [...form.images, { url: "", thumbnail: "", preview: "" }],
    });
  const updateImage = (index: number, key: keyof Image, value: string) => {
    const updated = [...form.images];
    updated[index][key] = value;
    setForm({ ...form, images: updated });
  };
  const removeImage = (index: number) => {
    const updated = [...form.images];
    updated.splice(index, 1);
    setForm({ ...form, images: updated });
  };

  // AI platforms handlers
  const addAiPlatform = () =>
    setForm({
      ...form,
      aiPlatforms: [...form.aiPlatforms, { id: Date.now(), name: "", url: "" }],
    });
  const updateAiPlatform = (
    index: number,
    key: keyof AiPlatform,
    value: string
  ) => {
    const updated = [...form.aiPlatforms];
    (updated[index] as any)[key] = key === "id" ? Number(value) : value;
    setForm({ ...form, aiPlatforms: updated });
  };
  const removeAiPlatform = (index: number) => {
    const updated = [...form.aiPlatforms];
    updated.splice(index, 1);
    setForm({ ...form, aiPlatforms: updated });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Prompt" : "Create Prompt"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <Textarea
              placeholder="Text"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              required
            />

            {/* Category */}
            <select
              className="w-full border rounded-lg p-2"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Tags */}
            <Input
              placeholder="Tags (comma separated)"
              value={form.tags.join(", ")}
              onChange={(e) =>
                setForm({
                  ...form,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t),
                })
              }
            />

            {/* Images */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Images</span>
                <Button type="button" variant="outline" size="sm" onClick={addImage}>
                  <FiPlus className="mr-1" /> Add Image
                </Button>
              </div>
              {form.images.map((img, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                  <Input
                    placeholder="URL"
                    value={img.url}
                    onChange={(e) => updateImage(idx, "url", e.target.value)}
                  />
                  <Input
                    placeholder="Thumbnail"
                    value={img.thumbnail || ""}
                    onChange={(e) => updateImage(idx, "thumbnail", e.target.value)}
                  />
                  <Input
                    placeholder="Preview"
                    value={img.preview || ""}
                    onChange={(e) => updateImage(idx, "preview", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(idx)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* AI Platforms */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">AI Platforms</span>
                <Button type="button" variant="outline" size="sm" onClick={addAiPlatform}>
                  <FiPlus className="mr-1" /> Add Platform
                </Button>
              </div>
              {form.aiPlatforms.map((platform, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-2 items-center">
                  <Input
                    placeholder="ID"
                    type="number"
                    value={platform.id}
                    onChange={(e) => updateAiPlatform(idx, "id", e.target.value)}
                  />
                  <Input
                    placeholder="Name"
                    value={platform.name}
                    onChange={(e) => updateAiPlatform(idx, "name", e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={platform.url || ""}
                    onChange={(e) => updateAiPlatform(idx, "url", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAiPlatform(idx)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading}>
              {editing ? "Update" : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>All Prompts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Text</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.length > 0 ? (
                prompts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.title}</TableCell>
                    <TableCell>{p.text}</TableCell>
                    <TableCell>{p.categoryName || "-"}</TableCell>
                    <TableCell>{p.tags?.join(", ") || "-"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setForm({
                            id: p.id,
                            title: p.title,
                            text: p.text,
                            images: p.images || [],
                            aiPlatforms: p.aiPlatforms || [],
                            categoryId: p.categoryId || "",
                            tags: p.tags || [],
                          });
                          setEditing(true);
                        }}
                      >
                        <FiEdit2 className="mr-1" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        <FiTrash2 className="mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <p className="text-gray-500 mt-4">No prompts found.</p>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
