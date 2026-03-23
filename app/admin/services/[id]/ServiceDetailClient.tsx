"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Trash, FloppyDisk, ArrowUp, ArrowDown } from "@phosphor-icons/react"
import { toast } from "sonner"
import ImageUpload from "@/components/admin/ImageUpload"

interface ServiceDetail {
  id: string
  title: string
  slug: string
  tagline: string | null
  description: string | null
  full_description: string | null
  form_title: string | null
  image_url: string | null
  hero_image_url: string | null
  gallery_images: string[]
  includes: string[]
  is_active: boolean
}

export default function ServiceDetailClient({ id }: { id: string }) {
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Editable fields
  const [tagline, setTagline] = useState("")
  const [shortDesc, setShortDesc] = useState("")
  const [fullDesc, setFullDesc] = useState("")
  const [formTitle, setFormTitle] = useState("")
  const [heroUrl, setHeroUrl] = useState("")
  const [gallery, setGallery] = useState<string[]>(["", "", ""])
  const [includes, setIncludes] = useState<string[]>([""])

  useEffect(() => {
    fetch(`/api/admin/services/${id}`)
      .then(r => r.json())
      .then((data: ServiceDetail) => {
        setService(data)
        setTagline(data.tagline || "")
        setShortDesc(data.description || "")
        setFullDesc(data.full_description || "")
        setFormTitle(data.form_title || data.title || "")
        setHeroUrl(data.hero_image_url || data.image_url || "")
        setGallery(
          data.gallery_images?.length
            ? [...data.gallery_images, ...Array(Math.max(0, 3 - data.gallery_images.length)).fill("")]
            : ["", "", ""]
        )
        setIncludes(data.includes?.length ? data.includes : [""])
      })
      .catch(() => toast.error("Failed to load service"))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagline: tagline || null,
          description: shortDesc || null,
          full_description: fullDesc || null,
          form_title: formTitle || null,
          hero_image_url: heroUrl || null,
          gallery_images: gallery.filter(Boolean),
          includes: includes.filter(Boolean),
        }),
      })
      if (!res.ok) throw new Error()
      toast.success("Details saved")
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const addInclude = () => setIncludes(prev => [...prev, ""])
  const removeInclude = (i: number) => setIncludes(prev => prev.filter((_, idx) => idx !== i))
  const moveInclude = (i: number, dir: "up" | "down") => {
    const next = dir === "up" ? i - 1 : i + 1
    if (next < 0 || next >= includes.length) return
    const arr = [...includes]
    ;[arr[i], arr[next]] = [arr[next], arr[i]]
    setIncludes(arr)
  }
  const updateInclude = (i: number, val: string) =>
    setIncludes(prev => prev.map((v, idx) => idx === i ? val : v))

  if (loading) {
    return (
      <div className="p-4 lg:p-8 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-stone-100 rounded-lg animate-pulse mb-8" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl border border-stone-100 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-400">Service not found.</p>
        <Link href="/admin/services" className="text-yellow-600 text-sm mt-2 inline-block">← Back to services</Link>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <Link href="/admin/services" className="flex items-center gap-1.5 text-stone-400 hover:text-stone-700 text-sm mb-2 transition-colors">
            <ArrowLeft size={14} /> All services
          </Link>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900">{service.title}</h1>
          <p className="text-xs text-stone-400 font-mono mt-0.5">/services/{service.slug}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-stone-200 text-stone-900 font-semibold rounded-xl text-sm transition-colors flex-shrink-0"
        >
          <FloppyDisk size={15} weight="bold" />
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="space-y-5">

        {/* Hero image */}
        <Section title="Hero Image" hint="Full-width banner at the top of the detail page">
          <ImageUpload
            value={heroUrl}
            onChange={setHeroUrl}
            aspect="video"
            hint="Recommended: 1920×1080"
          />
        </Section>

        {/* Core copy */}
        <Section title="Copy" hint="Text shown on the detail page">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-500 block mb-1.5">Tagline <span className="text-stone-300 font-normal">(bold subtitle)</span></label>
              <input
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="e.g. Professional catering for corporate events…"
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 block mb-1.5">Short description <span className="text-stone-300 font-normal">(used on cards & listings)</span></label>
              <textarea
                value={shortDesc}
                onChange={e => setShortDesc(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 block mb-1.5">Full description <span className="text-stone-300 font-normal">(detail page body)</span></label>
              <textarea
                value={fullDesc}
                onChange={e => setFullDesc(e.target.value)}
                rows={5}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-500 block mb-1.5">Booking form title <span className="text-stone-300 font-normal">(pre-fills the enquiry form)</span></label>
              <input
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400"
              />
            </div>
          </div>
        </Section>

        {/* What's included */}
        <Section title="What's Included" hint="Checklist shown on the detail page">
          <div className="space-y-2">
            {includes.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveInclude(i, "up")} disabled={i === 0} className="p-0.5 text-stone-300 hover:text-stone-600 disabled:opacity-20 transition-colors">
                    <ArrowUp size={10} weight="bold" />
                  </button>
                  <button onClick={() => moveInclude(i, "down")} disabled={i === includes.length - 1} className="p-0.5 text-stone-300 hover:text-stone-600 disabled:opacity-20 transition-colors">
                    <ArrowDown size={10} weight="bold" />
                  </button>
                </div>
                <div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                </div>
                <input
                  value={item}
                  onChange={e => updateInclude(i, e.target.value)}
                  placeholder={`Include item ${i + 1}`}
                  className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400"
                />
                <button onClick={() => removeInclude(i)} className="p-1.5 text-stone-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
                  <Trash size={13} />
                </button>
              </div>
            ))}
            <button
              onClick={addInclude}
              className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 font-semibold mt-1 transition-colors"
            >
              <Plus size={12} weight="bold" /> Add item
            </button>
          </div>
        </Section>

        {/* Gallery */}
        <Section title="Gallery" hint="3 photos shown below the description">
          <div className="grid grid-cols-3 gap-4">
            {gallery.map((url, i) => (
              <ImageUpload
                key={i}
                value={url}
                onChange={v => setGallery(prev => prev.map((old, idx) => idx === i ? v : old))}
                aspect="landscape"
                label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        </Section>

      </div>

      {/* Bottom save */}
      <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-stone-200 text-stone-900 font-semibold rounded-xl text-sm transition-colors"
        >
          <FloppyDisk size={15} weight="bold" />
          {saving ? "Saving…" : "Save all changes"}
        </button>
      </div>

    </div>
  )
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-stone-50">
        <p className="text-sm font-bold text-stone-900">{title}</p>
        {hint && <p className="text-xs text-stone-400 mt-0.5">{hint}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
