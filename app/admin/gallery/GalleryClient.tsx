"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Plus, PencilSimple, Trash, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import ImageUpload from "@/components/admin/ImageUpload"

interface GalleryItem {
  id: string
  title: string | null
  image_url: string
  category: string | null
  sort_order: number
  is_active: boolean
}

const DEFAULT_FORM = { title: "", image_url: "", category: "", sort_order: "0", is_active: true }

export default function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; editing: GalleryItem | null }>({ open: false, editing: null })
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [catFilter, setCatFilter] = useState("all")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/gallery")
      if (res.ok) setItems(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => {
    setForm(DEFAULT_FORM)
    setModal({ open: true, editing: null })
  }

  const openEdit = (item: GalleryItem) => {
    setForm({
      title: item.title || "",
      image_url: item.image_url,
      category: item.category || "",
      sort_order: String(item.sort_order),
      is_active: item.is_active,
    })
    setModal({ open: true, editing: item })
  }

  const handleSave = async () => {
    if (!form.image_url) { toast.error("Image URL is required"); return }
    setSaving(true)
    try {
      const payload = {
        title: form.title || null,
        image_url: form.image_url,
        category: form.category || null,
        sort_order: parseInt(form.sort_order) || 0,
        is_active: form.is_active,
      }
      const res = modal.editing
        ? await fetch(`/api/admin/gallery/${modal.editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })

      if (!res.ok) throw new Error()
      toast.success(modal.editing ? "Image updated" : "Image added")
      setModal({ open: false, editing: null })
      load()
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (item: GalleryItem) => {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i))
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !item.is_active }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: item.is_active } : i))
      toast.error("Failed to update")
    }
  }

  const handleReorder = async (item: GalleryItem, direction: "up" | "down") => {
    const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex(i => i.id === item.id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const a = sorted[idx]
    const b = sorted[swapIdx]
    const newOrder = { [a.id]: b.sort_order, [b.id]: a.sort_order }

    setItems(prev => prev.map(i => newOrder[i.id] !== undefined ? { ...i, sort_order: newOrder[i.id] } : i))
    try {
      await Promise.all([
        fetch(`/api/admin/gallery/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: b.sort_order }) }),
        fetch(`/api/admin/gallery/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: a.sort_order }) }),
      ])
    } catch {
      load()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success("Image deleted")
    } catch {
      toast.error("Failed to delete")
    } finally {
      setDeleteConfirm(null)
    }
  }

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))] as string[]
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)
  const filtered = catFilter === "all" ? sorted : sorted.filter(i => i.category === catFilter)

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Gallery</h1>
          <p className="text-sm text-stone-400 mt-0.5">{items.length} images</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-semibold rounded-xl text-sm transition-colors">
          <Plus size={16} weight="bold" /> Add Image
        </button>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
          <button onClick={() => setCatFilter("all")} className={cn("flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors", catFilter === "all" ? "bg-yellow-500 text-stone-900" : "bg-stone-900 border border-stone-800 text-stone-400 hover:bg-stone-800")}>All</button>
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)} className={cn("flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize", catFilter === c ? "bg-yellow-500 text-stone-900" : "bg-stone-900 border border-stone-800 text-stone-400 hover:bg-stone-800")}>{c}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square bg-stone-900 rounded-2xl border border-stone-800 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-400 text-sm">No images yet. Add your first photo.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((item, idx) => (
            <div key={item.id} className={cn("group relative bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden", !item.is_active && "opacity-50")}>
              <div className="relative aspect-square bg-stone-800">
                <Image src={item.image_url} alt={item.title || "Gallery"} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              </div>
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-1.5">
                  <button onClick={() => handleReorder(item, "up")} disabled={idx === 0} className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center disabled:opacity-30 transition-colors">
                    <ArrowUp size={12} weight="bold" />
                  </button>
                  <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors">
                    <PencilSimple size={12} weight="bold" />
                  </button>
                  <button onClick={() => handleReorder(item, "down")} disabled={idx === filtered.length - 1} className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center disabled:opacity-30 transition-colors">
                    <ArrowDown size={12} weight="bold" />
                  </button>
                </div>
              </div>
              {/* Bottom bar */}
              <div className="p-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  {item.title && <p className="text-xs font-medium text-stone-100 truncate">{item.title}</p>}
                  {item.category && <p className="text-[10px] text-stone-400 capitalize">{item.category}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleToggle(item)} className={cn("transition-colors", item.is_active ? "text-yellow-500" : "text-stone-600")}>
                    {item.is_active ? <ToggleRight size={20} weight="fill" /> : <ToggleLeft size={20} weight="regular" />}
                  </button>
                  {deleteConfirm === item.id ? (
                    <div className="flex gap-0.5">
                      <button onClick={() => handleDelete(item.id)} className="text-[9px] font-semibold text-red-400 hover:underline px-1">Del</button>
                      <button onClick={() => setDeleteConfirm(null)} className="text-[9px] text-stone-500 hover:underline px-1">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(item.id)} className="p-1 hover:bg-red-500/10 rounded text-stone-600 hover:text-red-400 transition-colors">
                      <Trash size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-stone-800">
              <h2 className="font-bold text-white">{modal.editing ? "Edit Image" : "Add Image"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-stone-400 hover:text-stone-200 text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">
              <ImageUpload
                value={form.image_url}
                onChange={v => setForm(f => ({ ...f, image_url: v }))}
                aspect="landscape"
                label="Image *"
              />
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Optional caption" className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white outline-none focus:border-yellow-500 placeholder:text-stone-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">Category</label>
                <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. cakes, events, behind the scenes" className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white outline-none focus:border-yellow-500 placeholder:text-stone-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1.5">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white outline-none focus:border-yellow-500" />
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} className={cn("transition-colors", form.is_active ? "text-yellow-500" : "text-stone-600")}>
                      {form.is_active ? <ToggleRight size={28} weight="fill" /> : <ToggleLeft size={28} weight="regular" />}
                    </button>
                    <span className="text-sm text-stone-200">Visible</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={() => setModal({ open: false, editing: null })} className="flex-1 py-2.5 border border-stone-700 rounded-xl text-sm font-semibold text-stone-300 hover:bg-stone-800 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-stone-700 rounded-xl text-sm font-semibold text-stone-900 transition-colors">
                {saving ? "Saving…" : modal.editing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
