'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { baseUrl } from '@/utility/config'


const CreateNewsForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    slug: '',
    tags: '',
    isBreakingNews: false,
    thumbnailUrl: '',
    type: 'rss',
    newsUrl: '',
    isExternalNews: true,
    imageUrl: '',
    videoUrl: '',
    videoEmbed: '',
    hasVideo: false,
    authorName: '',
    publishedAt: new Date().toISOString(),
    like: 0,
    comment: 0,
    aiSummary: '',
    aiCategory: '',
    aiImportanceScore: 0,
    imageQuality: 0,
    imageAltText: '',
  })

  // const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`${baseUrl}/breaking-news/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()),
          aiImportanceScore: Number(formData.aiImportanceScore),
          imageQuality: Number(formData.imageQuality),
          like: Number(formData.like),
          comment: Number(formData.comment),
        }),
      })

      // const result = await res.json()

      if (res.ok) {
        // toast({ title: 'Success', description: 'News created successfully' })
        setFormData((prev) => ({ ...prev, title: '', slug: '', tags: '', shortDescription: '', description: '' }))
      } else {
        // toast({ title: 'Error', description: result.message || 'Something went wrong', variant: 'destructive' })
      }
    } catch (error) {
      // toast({ title: 'Error', description: String(error), variant: 'destructive' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <div>
        <Label>Title</Label>
        <Input name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div>
        <Label>Slug</Label>
        <Input name="slug" value={formData.slug} onChange={handleChange} required />
      </div>

      <div>
        <Label>Short Description</Label>
        <Textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea name="description" value={formData.description} onChange={handleChange} />
      </div>

      <div>
        <Label>Tags (comma separated)</Label>
        <Input name="tags" value={formData.tags} onChange={handleChange} />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox checked={formData.isBreakingNews} onCheckedChange={(checked) => handleCheckbox('isBreakingNews', Boolean(checked))} />
        <Label>Breaking News</Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Thumbnail URL</Label>
          <Input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} />
        </div>

        <div>
          <Label>News URL</Label>
          <Input name="newsUrl" value={formData.newsUrl} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Image URL</Label>
          <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </div>

        <div>
          <Label>Video URL</Label>
          <Input name="videoUrl" value={formData.videoUrl} onChange={handleChange} />
        </div>
      </div>

      <div>
        <Label>Video Embed</Label>
        <Input name="videoEmbed" value={formData.videoEmbed} onChange={handleChange} />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox checked={formData.hasVideo} onCheckedChange={(checked) => handleCheckbox('hasVideo', Boolean(checked))} />
        <Label>Has Video</Label>
      </div>

      <div>
        <Label>Author Name</Label>
        <Input name="authorName" value={formData.authorName} onChange={handleChange} />
      </div>

      <div>
        <Label>AI Summary</Label>
        <Textarea name="aiSummary" value={formData.aiSummary} onChange={handleChange} />
      </div>

      <div>
        <Label>AI Category</Label>
        <Input name="aiCategory" value={formData.aiCategory} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>AI Importance Score</Label>
          <Input name="aiImportanceScore" type="number" value={formData.aiImportanceScore} onChange={handleChange} />
        </div>
        <div>
          <Label>Image Quality</Label>
          <Input name="imageQuality" type="number" value={formData.imageQuality} onChange={handleChange} />
        </div>
      </div>

      <div>
        <Label>Image Alt Text</Label>
        <Input name="imageAltText" value={formData.imageAltText} onChange={handleChange} />
      </div>

      <Button type="submit">Submit News</Button>
    </form>
  )
}

export default CreateNewsForm
