"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, PencilSimple, Trash, ToggleLeft, ToggleRight } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  sort_order: number
  is_active: boolean
}

const DEFAULT_FORM = { name: "", slug: "", description: "", image_url: "", sort_order: "0", is_active: true }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; editing: Category | null }>({ open: false, editing: null })
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/categories")
      if (res.ok) setCategories(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => {
    setForm(DEFAULT_FORM)
    setModal({ open: true, editing: null })
  }

  const openEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image_url: cat.image_url || "",
      sort_order: String(cat.sort_order),
      is_active: cat.is_active,
    })
    setModal({ open: true, editing: cat })
  }

  const handleNameChange = (name: string) => {
    setForm(f => ({ ...f, name, slug: modal.editing ? f.slug : slugify(name) }))
  }

  const handleSave = async () => {
    if (!form.name || !form.slug) { toast.error("Name and slug are required"); return }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        image_url: form.image_url || null,
        sort_order: parseInt(form.sort_order) || 0,
        is_active: form.is_active,
      }
      const res = modal.editing
        ? await fetch(`/api/admin/categories/${modal.editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })

      if (!res.ok) throw new Error()
      toast.success(modal.editing ? "Category updated" : "Category created")
      setModal({ open: false, editing: null })
      load()
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (cat: Category) => {
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: !c.is_active } : c))
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !cat.is_active }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, is_active: cat.is_active } : c))
      toast.error("Failed to update")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setCategories(prev => prev.filter(c => c.id !== id))
      toast.success("Category deleted")
    } catch {
      toast.error("Failed to delete")
    } finally {
      setDeleteConfirm(null)
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900">Categories</h1>
          <p className="text-sm text-stone-400 mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-semibold rounded-xl text-sm transition-colors">
          <Plus size={16} weight="bold" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl border border-stone-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-16 text-stone-400 text-sm">No categories yet</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden sm:table-cell">Slug</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide hidden sm:table-cell">Order</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wide">Active</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {categories.map(cat => (
                  <tr key={cat.id} className={cn("hover:bg-stone-50 transition-colors", !cat.is_active && "opacity-50")}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-stone-900">{cat.name}</p>
                      {cat.description && <p className="text-xs text-stone-400 line-clamp-1 sm:hidden">{cat.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-stone-400 font-mono text-xs hidden sm:table-cell">{cat.slug}</td>
                    <td className="px-4 py-3 text-center text-stone-500 hidden sm:table-cell">{cat.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button onClick={() => handleToggle(cat)} className={cn("transition-colors", cat.is_active ? "text-yellow-500" : "text-stone-300")}>
                          {cat.is_active
                            ? <ToggleRight size={24} weight="fill" />
                            : <ToggleLeft size={24} weight="regular" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 transition-colors"><PencilSimple size={14} /></button>
                        {deleteConfirm === cat.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(cat.id)} className="text-[10px] font-semibold text-red-600 hover:underline">Delete</button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-[10px] text-stone-400 hover:underline">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(cat.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-stone-300 hover:text-red-500 transition-colors"><Trash size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-stone-100">
              <h2 className="font-bold text-stone-900">{modal.editing ? "Edit Category" : "Add Category"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-stone-400 hover:text-stone-600 text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">Name *</label>
                <input value={form.name} onChange={e => handleNameChange(e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">Slug *</label>
                <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: slugify(e.target.value) }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm font-mono outline-none focus:border-stone-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1.5">Sort Order</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400" />
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <button onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))} className={cn("transition-colors", form.is_active ? "text-yellow-500" : "text-stone-300")}>
                      {form.is_active
                        ? <ToggleRight size={28} weight="fill" />
                        : <ToggleLeft size={28} weight="regular" />}
                    </button>
                    <span className="text-sm text-stone-700">Active</span>
                  </label>
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
