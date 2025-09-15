"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { baseUrl } from "@/utility/config"

interface Image {
  url: string
  thumbnail?: string
  preview?: string
}

interface AiPlatform {
  id: number
  name: string
  url?: string
}

interface Prompt {
  id: string
  title: string
  text: string
  images: Image[]
  aiPlatforms: AiPlatform[]
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const res = await fetch(`${baseUrl}/prompts`) 
    const data = await res.json()
    setPrompts(data.data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`${baseUrl}/prompts/${id}`, { method: "DELETE" })
    loadData()
  }

  const handleEditClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt)
    setIsDialogOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedPrompt) return

    await fetch(`${baseUrl}/prompts/${selectedPrompt.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedPrompt),
    })

    setIsDialogOpen(false)
    loadData()
  }

  // --- Helpers for images & aiPlatforms ---
  const updateImage = (index: number, key: keyof Image, value: string) => {
    if (!selectedPrompt) return
    const updated = [...selectedPrompt.images]
    updated[index][key] = value
    setSelectedPrompt({ ...selectedPrompt, images: updated })
  }

  const addImage = () => {
    if (!selectedPrompt) return
    setSelectedPrompt({
      ...selectedPrompt,
      images: [...selectedPrompt.images, { url: "", thumbnail: "", preview: "" }],
    })
  }

  const removeImage = (index: number) => {
    if (!selectedPrompt) return
    const updated = [...selectedPrompt.images]
    updated.splice(index, 1)
    setSelectedPrompt({ ...selectedPrompt, images: updated })
  }

  const updateAiPlatform = (index: number, key: keyof AiPlatform, value: string) => {
    if (!selectedPrompt) return
    const updated = [...selectedPrompt.aiPlatforms]
    const platform = { ...updated[index] }
    if (key === "id") {
      platform.id = Number(value)
    } else if (key === "name") {
      platform.name = value
    } else if (key === "url") {
      platform.url = value
    }
    updated[index] = platform
    setSelectedPrompt({ ...selectedPrompt, aiPlatforms: updated })
  }

  const addAiPlatform = () => {
    if (!selectedPrompt) return
    setSelectedPrompt({
      ...selectedPrompt,
      aiPlatforms: [...selectedPrompt.aiPlatforms, { id: Date.now(), name: "", url: "" }],
    })
  }

  const removeAiPlatform = (index: number) => {
    if (!selectedPrompt) return
    const updated = [...selectedPrompt.aiPlatforms]
    updated.splice(index, 1)
    setSelectedPrompt({ ...selectedPrompt, aiPlatforms: updated })
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Prompts List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border rounded-lg">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Text</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt) => (
              <tr key={prompt.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{prompt.title}</td>
                <td className="p-2">{prompt.text}</td>
                <td className="p-2 flex gap-2 justify-center">
                  <Button variant="secondary" size="sm" onClick={() => handleEditClick(prompt)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(prompt.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
          </DialogHeader>
          {selectedPrompt && (
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={selectedPrompt.title}
                  onChange={(e) => setSelectedPrompt({ ...selectedPrompt, title: e.target.value })}
                />
              </div>

              {/* Text */}
              <div>
                <Label htmlFor="text">Text</Label>
                <Input
                  id="text"
                  value={selectedPrompt.text}
                  onChange={(e) => setSelectedPrompt({ ...selectedPrompt, text: e.target.value })}
                />
              </div>

              {/* Images */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Images</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addImage}>
                    + Add Image
                  </Button>
                </div>
                {selectedPrompt.images.map((img, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <Input
                      placeholder="URL"
                      value={img.url}
                      onChange={(e) => updateImage(i, "url", e.target.value)}
                    />
                    <Input
                      placeholder="Thumbnail"
                      value={img.thumbnail || ""}
                      onChange={(e) => updateImage(i, "thumbnail", e.target.value)}
                    />
                    <Input
                      placeholder="Preview"
                      value={img.preview || ""}
                      onChange={(e) => updateImage(i, "preview", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(i)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {/* AI Platforms */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>AI Platforms</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAiPlatform}>
                    + Add Platform
                  </Button>
                </div>
                {selectedPrompt.aiPlatforms.map((platform, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <Input
                      placeholder="ID"
                      type="number"
                      value={platform.id}
                      onChange={(e) => updateAiPlatform(i, "id", e.target.value)}
                    />
                    <Input
                      placeholder="Name"
                      value={platform.name}
                      onChange={(e) => updateAiPlatform(i, "name", e.target.value)}
                    />
                    <Input
                      placeholder="URL"
                      value={platform.url || ""}
                      onChange={(e) => updateAiPlatform(i, "url", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAiPlatform(i)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
