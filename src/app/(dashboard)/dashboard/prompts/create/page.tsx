"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FiTrash2, FiEdit2, FiPlus } from "react-icons/fi";
import { baseUrl } from "@/utility/config";

// Types
type Image = {
  url: string;
  thumbnail?: string;
  preview?: string;
};

type AiPlatform = {
  id: number;
  name: string;
  url?: string;
};

type Prompt = {
  id: string;
  title: string;
  text: string;
  images: Image[];
  aiPlatforms: AiPlatform[];
  createdAt: string;
};

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    id: "",
    title: "",
    text: "",
    images: [] as Image[],
    aiPlatforms: [] as AiPlatform[],
  });
  const [editing, setEditing] = useState(false);

  // Fetch all prompts
  const fetchPrompts = async () => {
    const res = await fetch(`${baseUrl}/prompts`);
    const data = await res.json();

    // console.log(data)
    setPrompts(data.data);
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      text: form.text,
      images: form.images,
      aiPlatforms: form.aiPlatforms,
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

    setForm({ id: "", title: "", text: "", images: [], aiPlatforms: [] });
    setEditing(false);
    setLoading(false);
    fetchPrompts();
  };

  // Delete prompt
  const handleDelete = async (id: string) => {
    await fetch(`${baseUrl}/prompts/${id}`, { method: "DELETE" });
    fetchPrompts();
  };

  // Add/remove image
  const addImage = () => {
    setForm({
      ...form,
      images: [...form.images, { url: "", thumbnail: "", preview: "" }],
    });
  };

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

  // Add/remove aiPlatform
  const addAiPlatform = () => {
    setForm({
      ...form,
      aiPlatforms: [...form.aiPlatforms, { id: Date.now(), name: "", url: "" }],
    });
  };

  const updateAiPlatform = (index: number, key: keyof AiPlatform, value: string) => {
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
            {/* Title & Text */}
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

            {/* Images */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Images</span>
                <Button type="button" variant="outline" size="sm" onClick={addImage}>
                  <FiPlus className="mr-1" /> Add Image
                </Button>
              </div>
              {form.images.map((img, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-center">
                  <Input
                    placeholder="URL"
                    value={img.url}
                    onChange={(e) => updateImage(index, "url", e.target.value)}
                  />
                  <Input
                    placeholder="Thumbnail"
                    value={img.thumbnail || ""}
                    onChange={(e) => updateImage(index, "thumbnail", e.target.value)}
                  />
                  <Input
                    placeholder="Preview"
                    value={img.preview || ""}
                    onChange={(e) => updateImage(index, "preview", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeImage(index)}
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
              {form.aiPlatforms.map((platform, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-center">
                  <Input
                    placeholder="ID"
                    type="number"
                    value={platform.id}
                    onChange={(e) => updateAiPlatform(index, "id", e.target.value)}
                  />
                  <Input
                    placeholder="Name"
                    value={platform.name}
                    onChange={(e) => updateAiPlatform(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={platform.url || ""}
                    onChange={(e) => updateAiPlatform(index, "url", e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAiPlatform(index)}
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts.length>0 && prompts?.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.title}</TableCell>
                  <TableCell>{prompt.text}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setForm({
                          id: prompt.id,
                          title: prompt.title,
                          text: prompt.text,
                          images: prompt.images || [],
                          aiPlatforms: prompt.aiPlatforms || [],
                        });
                        setEditing(true);
                      }}
                    >
                      <FiEdit2 className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(prompt.id)}
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {prompts.length === 0 && <p className="text-gray-500 mt-4">No prompts found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
