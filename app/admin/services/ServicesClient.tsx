"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import ImageUpload from "@/components/admin/ImageUpload"
import {
  Plus, PencilSimple, Trash, ToggleLeft, ToggleRight,
  ArrowUp, ArrowDown, ArrowSquareOut,
  Buildings, Heart, Gift, Cake, Trophy, Smiley, HandWaving, Fire, SquaresFour,
  Briefcase, Star,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Service {
  id: string
  title: string
  slug: string
  description: string | null
  image_url: string | null
  icon: string | null
  is_active: boolean
  sort_order: number
}

const DEFAULT_FORM = {
  title: "", slug: "", description: "", image_url: "", icon: "", is_active: true, sort_order: "0"
}

// Map icon name strings → Phosphor components
const ICON_MAP: Record<string, React.ComponentType<{ size?: number; weight?: "regular" | "bold" | "fill" | "duotone" | "light" | "thin"; className?: string }>> = {
  Buildings, Heart, Gift, Cake, Trophy, Smiley, HandWaving, Fire, SquaresFour, Briefcase, Star,
}

function ServiceIcon({ name, size = 20 }: { name: string | null; size?: number }) {
  if (!name) return <Briefcase size={size} weight="duotone" className="text-stone-400" />
  const Icon = ICON_MAP[name]
  if (Icon) return <Icon size={size} weight="duotone" className="text-yellow-600" />
  // fallback for unknown names
  return <Briefcase size={size} weight="duotone" className="text-stone-400" />
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export default function ServicesClient() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; editing: Service | null }>({ open: false, editing: null })
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/services")
      if (res.ok) setServices(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => {
    setForm(DEFAULT_FORM)
    setModal({ open: true, editing: null })
  }

  const openEdit = (svc: Service) => {
    setForm({
      title: svc.title,
      slug: svc.slug,
      description: svc.description || "",
      image_url: svc.image_url || "",
      icon: svc.icon || "",
      is_active: svc.is_active,
      sort_order: String(svc.sort_order),
    })
    setModal({ open: true, editing: svc })
  }

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast.error("Title and slug are required"); return }
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        image_url: form.image_url || null,
        icon: form.icon || null,
        is_active: form.is_active,
        sort_order: parseInt(form.sort_order) || 0,
      }
      const res = modal.editing
        ? await fetch(`/api/admin/services/${modal.editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })

      if (!res.ok) throw new Error()
      toast.success(modal.editing ? "Service updated" : "Service created")
      setModal({ open: false, editing: null })
      load()
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (svc: Service) => {
    setServices(prev => prev.map(s => s.id === svc.id ? { ...s, is_active: !s.is_active } : s))
    try {
      const res = await fetch(`/api/admin/services/${svc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !svc.is_active }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setServices(prev => prev.map(s => s.id === svc.id ? { ...s, is_active: svc.is_active } : s))
      toast.error("Failed to update")
    }
  }

  const handleReorder = async (svc: Service, direction: "up" | "down") => {
    const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex(s => s.id === svc.id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const a = sorted[idx], b = sorted[swapIdx]
    setServices(prev => prev.map(s =>
      s.id === a.id ? { ...s, sort_order: b.sort_order } :
      s.id === b.id ? { ...s, sort_order: a.sort_order } : s
    ))
    try {
      await Promise.all([
        fetch(`/api/admin/services/${a.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: b.sort_order }) }),
        fetch(`/api/admin/services/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sort_order: a.sort_order }) }),
      ])
    } catch { load() }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setServices(prev => prev.filter(s => s.id !== id))
      toast.success("Service deleted")
    } catch {
      toast.error("Failed to delete")
    } finally {
      setDeleteConfirm(null)
    }
  }

  const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900">Services</h1>
          <p className="text-sm text-stone-400 mt-0.5">{services.length} services · first 3 are featured on the homepage</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-semibold rounded-xl text-sm transition-colors">
          <Plus size={16} weight="bold" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-52 bg-white rounded-2xl border border-stone-100 animate-pulse" />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-24 text-stone-400 text-sm">No services yet. Add your first service.</div>
      ) : (
        <>
          {/* Featured label */}
          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Featured (first 3)</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {sorted.slice(0, 3).map((svc, idx) => (
              <ServiceCard
                key={svc.id}
                svc={svc}
                idx={idx}
                totalCount={sorted.length}
                featured
                onEdit={openEdit}
                onToggle={handleToggle}
                onReorder={handleReorder}
                onDelete={id => setDeleteConfirm(id)}
                deleteConfirm={deleteConfirm}
                onDeleteConfirm={handleDelete}
                onDeleteCancel={() => setDeleteConfirm(null)}
              />
            ))}
          </div>

          {sorted.length > 3 && (
            <>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">Additional</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sorted.slice(3).map((svc, idx) => (
                  <ServiceCard
                    key={svc.id}
                    svc={svc}
                    idx={idx + 3}
                    totalCount={sorted.length}
                    featured={false}
                    onEdit={openEdit}
                    onToggle={handleToggle}
                    onReorder={handleReorder}
                    onDelete={id => setDeleteConfirm(id)}
                    deleteConfirm={deleteConfirm}
                    onDeleteConfirm={handleDelete}
                    onDeleteCancel={() => setDeleteConfirm(null)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h2 className="font-bold text-stone-900">{modal.editing ? "Edit Service" : "Add Service"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">

              {/* Image preview */}
              {form.image_url && (
                <div className="relative w-full aspect-[3/2] rounded-xl overflow-hidden bg-stone-100">
                  <Image src={form.image_url} alt="Preview" fill className="object-cover" onError={() => {}} />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Title *</label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: modal.editing ? f.slug : slugify(e.target.value) }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Slug *</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm font-mono outline-none focus:border-stone-400" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400 resize-none" />
                </div>
                <div className="col-span-2">
                  <ImageUpload
                    value={form.image_url}
                    onChange={v => setForm(f => ({ ...f, image_url: v }))}
                    aspect="landscape"
                    label="Card Image"
                    hint="Shown on the services grid"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Icon name</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
                      <ServiceIcon name={form.icon || null} size={18} />
                    </div>
                    <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="e.g. Heart" className="flex-1 px-3 py-2.5 border border-stone-200 rounded-xl text-sm font-mono outline-none focus:border-stone-400" />
                  </div>
                  <p className="text-[10px] text-stone-400 mt-1">Phosphor icon name: Buildings, Heart, Gift, Cake, Trophy, Smiley, HandWaving, Fire, SquaresFour</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400" />
                </div>
                <div className="col-span-2 flex items-center gap-3 pt-1">
                  <button onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} className={cn("transition-colors", form.is_active ? "text-yellow-500" : "text-stone-300")}>
                    {form.is_active ? <ToggleRight size={28} weight="fill" /> : <ToggleLeft size={28} weight="regular" />}
                  </button>
                  <span className="text-sm text-stone-700">Active — visible on the website</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={() => setModal({ open: false, editing: null })} className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-stone-200 rounded-xl text-sm font-semibold text-stone-900 transition-colors">
                {saving ? "Saving…" : modal.editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Service Card ─────────────────────────────────────────────
function ServiceCard({
  svc, idx, totalCount, featured,
  onEdit, onToggle, onReorder, onDelete,
  deleteConfirm, onDeleteConfirm, onDeleteCancel,
}: {
  svc: Service
  idx: number
  totalCount: number
  featured: boolean
  onEdit: (s: Service) => void
  onToggle: (s: Service) => void
  onReorder: (s: Service, d: "up" | "down") => void
  onDelete: (id: string) => void
  deleteConfirm: string | null
  onDeleteConfirm: (id: string) => void
  onDeleteCancel: () => void
}) {
  return (
    <div className={cn(
      "group relative bg-white rounded-2xl border overflow-hidden transition-all",
      svc.is_active ? "border-stone-100" : "border-stone-100 opacity-50",
      featured && "shadow-sm"
    )}>
      {/* Image or icon hero */}
      <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden">
        {svc.image_url ? (
          <Image src={svc.image_url} alt={svc.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="33vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
              <ServiceIcon name={svc.icon} size={28} />
            </div>
          </div>
        )}

        {/* Top controls overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={() => onReorder(svc, "up")}
              disabled={idx === 0}
              className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white shadow-sm flex items-center justify-center disabled:opacity-30 transition-colors"
            >
              <ArrowUp size={11} weight="bold" />
            </button>
            <button
              onClick={() => onReorder(svc, "down")}
              disabled={idx === totalCount - 1}
              className="w-7 h-7 rounded-lg bg-white/90 hover:bg-white shadow-sm flex items-center justify-center disabled:opacity-30 transition-colors"
            >
              <ArrowDown size={11} weight="bold" />
            </button>
          </div>
          <span className="text-[10px] font-bold bg-white/90 text-stone-600 px-2 py-0.5 rounded-lg shadow-sm tabular-nums">
            #{svc.sort_order}
          </span>
        </div>

        {/* Active badge */}
        {!svc.is_active && (
          <div className="absolute bottom-2 left-2 text-[9px] font-bold bg-stone-900/70 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
            Hidden
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-stone-900 text-sm leading-snug">{svc.title}</h3>
          <div className="flex items-center gap-0.5 flex-shrink-0 -mt-0.5">
            <button
              onClick={() => onToggle(svc)}
              className={cn("p-1 rounded transition-colors", svc.is_active ? "text-yellow-500 hover:text-yellow-600" : "text-stone-300 hover:text-stone-400")}
            >
              {svc.is_active ? <ToggleRight size={20} weight="fill" /> : <ToggleLeft size={20} weight="regular" />}
            </button>
            <button onClick={() => onEdit(svc)} className="p-1 rounded text-stone-300 hover:text-stone-700 hover:bg-stone-100 transition-colors">
              <PencilSimple size={13} weight="bold" />
            </button>
            {deleteConfirm === svc.id ? (
              <div className="flex items-center gap-1 ml-1">
                <button onClick={() => onDeleteConfirm(svc.id)} className="text-[10px] font-semibold text-red-600 hover:underline">Del</button>
                <button onClick={onDeleteCancel} className="text-[10px] text-stone-400 hover:underline">No</button>
              </div>
            ) : (
              <button onClick={() => onDelete(svc.id)} className="p-1 rounded text-stone-200 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash size={13} />
              </button>
            )}
          </div>
        </div>
        {svc.description && (
          <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{svc.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-stone-300 font-mono">{svc.slug}</p>
          <Link
            href={`/admin/services/${svc.id}`}
            className="flex items-center gap-1 text-[10px] font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
          >
            Edit details <ArrowSquareOut size={10} weight="bold" />
          </Link>
        </div>
      </div>
    </div>
  )
}
