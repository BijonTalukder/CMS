"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { baseUrl } from "@/utility/config";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  serviceListId: string;
  title: string;
  slug: string;
  type: string;
  coverImage: string;
  contentHtml: string;
  metaDescription?: string;
  tags?: string;
  readTimeMinutes?: number;
};

export default function CreateServiceDetail() {
  

  const router = useRouter();
   const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || "";
  const [form, setForm] = useState<FormData>({
    serviceListId: id ,
    title: "",
    slug: "",
    type: "",
    coverImage: "",
    contentHtml: "",
    metaDescription: "",
    tags: "",
    readTimeMinutes: undefined,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === "" ? undefined : Number(value) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = form.tags ? form.tags.split(",").map((t) => t.trim()) : [];

      const payload = {
        ...form,
        tags: tagsArray,
        readTimeMinutes: form.readTimeMinutes,
      };

      const res = await fetch(`${baseUrl}/service-list-details/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create service detail");

      router.push("/details"); // redirect after creation
    } catch (error) {
      console.error("Error creating service detail:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Create Service Detail</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="serviceListId">Service List ID *</Label>
          <Input
            id="serviceListId"
            name="serviceListId"
            value={form.serviceListId}
            onChange={handleChange}
            required
            disabled // Don't let user edit this, it comes from URL param
          />
        </div>

        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Title"
          />
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            placeholder="Unique URL slug"
          />
        </div>

        <div>
          <Label htmlFor="type">Type *</Label>
          <Input
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            placeholder="e.g. education, tourist"
          />
        </div>

        <div>
          <Label htmlFor="coverImage">Cover Image URL *</Label>
          <Input
            id="coverImage"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            required
            placeholder="https://example.com/image.jpg"
          />
        </div>

         <div>
          <Label htmlFor="contentHtml">Content HTML *</Label>
          <Textarea
            id="contentHtml"
            name="contentHtml"
            value={form.contentHtml}
            onChange={handleChange  }
            required
            rows={8}
            placeholder="<p>Your content here</p>"
          />
        </div>


        <div>
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Input
            id="metaDescription"
            name="metaDescription"
            value={form.metaDescription || ""}
            onChange={handleChange}
            placeholder="SEO description (optional)"
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={form.tags || ""}
            onChange={handleChange}
            placeholder="education, university"
          />
        </div>

        <div>
          <Label htmlFor="readTimeMinutes">Read Time (minutes)</Label>
          <Input
            type="number"
            id="readTimeMinutes"
            name="readTimeMinutes"
            value={form.readTimeMinutes ?? ""}
            onChange={handleNumberChange}
            min={0}
            placeholder="5"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create"}
        </Button>
      </form>
    </main>
  );
}
