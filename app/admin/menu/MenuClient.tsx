"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Plus, PencilSimple, Trash, MagnifyingGlass, Star } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { type Category } from "@/lib/menu-service"
import ImageUpload from "@/components/admin/ImageUpload"

interface MenuItem {
  id: string
  name: string
  description?: string | null
  price: number
  image_url?: string | null
  is_available: boolean
  is_popular: boolean
  category_id: string
  sort_order?: number
  category?: Category
}

const DEFAULT_FORM = { name: "", description: "", price: "", image_url: "", category_id: "", is_available: true, is_popular: false }

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={cn("relative rounded-full transition-colors flex-shrink-0", value ? "bg-yellow-500" : "bg-stone-700")}
      style={{ height: 22, width: 40 }}
    >
      <span
        className="absolute top-0.5 rounded-full bg-white shadow transition-transform"
        style={{ width: 18, height: 18, left: value ? 20 : 2 }}
      />
    </button>
  )
}

export default function MenuClient() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [modal, setModal] = useState<{ open: boolean; editing: MenuItem | null }>({ open: false, editing: null })
  const [form, setForm] = useState(DEFAULT_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [menuRes, catRes] = await Promise.all([
        fetch("/api/admin/menu"),
        fetch("/api/admin/categories"),
      ])
      const [menuData, catData] = await Promise.all([menuRes.json(), catRes.json()])
      setItems(menuData)
      setCategories(catData)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => {
    setForm(DEFAULT_FORM)
    setModal({ open: true, editing: null })
  }

  const openEdit = (item: MenuItem) => {
    setForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      image_url: item.image_url || "",
      category_id: item.category_id,
      is_available: item.is_available,
      is_popular: item.is_popular,
    })
    setModal({ open: true, editing: item })
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error("Name, price and category are required")
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        image_url: form.image_url || null,
        category_id: form.category_id,
        is_available: form.is_available,
        is_popular: form.is_popular,
      }
      const res = modal.editing
        ? await fetch(`/api/admin/menu/${modal.editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })

      if (!res.ok) throw new Error()
      toast.success(modal.editing ? "Item updated" : "Item added")
      setModal({ open: false, editing: null })
      load()
    } catch {
      toast.error("Failed to save. Try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (item: MenuItem, field: "is_available" | "is_popular") => {
    const newVal = !item[field]
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, [field]: newVal } : i))
    try {
      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: newVal }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, [field]: !newVal } : i))
      toast.error("Failed to update")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setItems(prev => prev.filter(i => i.id !== id))
      toast.success("Item deleted")
    } catch {
      toast.error("Failed to delete")
    } finally {
      setDeleteConfirm(null)
    }
  }

  const filtered = items
    .filter(i => catFilter === "all" || i.category_id === catFilter)
    .filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl lg:text-2xl font-bold text-white">Menu Items</h1>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-semibold rounded-xl text-sm transition-colors">
          <Plus size={16} weight="bold" /> Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items…"
            className="w-full pl-9 pr-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white outline-none focus:border-yellow-500 placeholder:text-stone-500" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          <button onClick={() => setCatFilter("all")} className={cn("flex-none px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap", catFilter === "all" ? "bg-yellow-500 text-stone-900" : "bg-stone-900 border border-stone-700 text-stone-400 hover:bg-stone-800")}>All</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCatFilter(c.id)} className={cn("flex-none px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap", catFilter === c.id ? "bg-yellow-500 text-stone-900" : "bg-stone-900 border border-stone-700 text-stone-400 hover:bg-stone-800")}>{c.name}</button>
          ))}
        </div>
      </div>

      {/* Table (desktop) / Cards (mobile) */}
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-stone-900 rounded-xl border border-stone-800 animate-pulse" />)}</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-800 border-b border-stone-700">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Price</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Popular</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-wide">Available</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {filtered.map(item => (
                  <tr key={item.id} className={cn("hover:bg-stone-800 transition-colors", !item.is_available && "opacity-50")}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-800 flex-shrink-0">
                            <Image src={item.image_url} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-stone-800 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          {item.description && <p className="text-xs text-stone-400 line-clamp-1 max-w-xs">{item.description}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-400 text-xs">{item.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold text-white">NLe {item.price.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <button onClick={() => handleToggle(item, "is_popular")} className={cn("w-6 h-6 rounded-full flex items-center justify-center transition-colors", item.is_popular ? "bg-yellow-500/20 text-yellow-500" : "text-stone-600 hover:text-stone-400")}>
                          <Star size={14} weight={item.is_popular ? "fill" : "regular"} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3"><div className="flex justify-center"><Toggle value={item.is_available} onChange={() => handleToggle(item, "is_available")} /></div></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-stone-700 rounded-lg transition-colors text-stone-400 hover:text-stone-200"><PencilSimple size={14} /></button>
                        {deleteConfirm === item.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleDelete(item.id)} className="text-[10px] font-semibold text-red-400 hover:underline">Delete</button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-[10px] text-stone-500 hover:underline">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-stone-600 hover:text-red-400"><Trash size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map(item => (
              <div key={item.id} className={cn("bg-stone-900 rounded-2xl border border-stone-800 p-4 flex items-center gap-3", !item.is_available && "opacity-50")}>
                {item.image_url ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-800 flex-shrink-0">
                    <Image src={item.image_url} alt={item.name} width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-stone-800 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{item.name}</p>
                  <p className="text-xs text-stone-400">{item.category?.name}</p>
                  <p className="text-sm font-bold text-white mt-0.5">NLe {item.price.toFixed(0)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Toggle value={item.is_available} onChange={() => handleToggle(item, "is_available")} />
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 hover:bg-stone-700 rounded-lg text-stone-400"><PencilSimple size={14} /></button>
                    <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-stone-600 hover:text-red-400"><Trash size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-stone-400 text-sm">No items found</div>
      )}

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-stone-800">
              <h2 className="font-bold text-white">{modal.editing ? "Edit Item" : "Add Item"}</h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-stone-400 hover:text-stone-200 text-xl leading-none">×</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white outline-none focus:border-yellow-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">Category *</label>
                <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white outline-none focus:border-yellow-500">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">Price (NLe) *</label>
                <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white outline-none focus:border-yellow-500" />
              </div>
              <div>
                <ImageUpload
                  value={form.image_url}
                  onChange={v => setForm(f => ({ ...f, image_url: v }))}
                  aspect="square"
                  label="Item Image"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-white outline-none focus:border-yellow-500 resize-none" />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Toggle value={form.is_available} onChange={v => setForm(f => ({ ...f, is_available: v }))} />
                  <span className="text-sm text-stone-200">Available</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <Toggle value={form.is_popular} onChange={v => setForm(f => ({ ...f, is_popular: v }))} />
                  <span className="text-sm text-stone-200">Popular</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-5 pt-0">
              <button onClick={() => setModal({ open: false, editing: null })} className="flex-1 py-2.5 border border-stone-700 rounded-xl text-sm font-semibold text-stone-300 hover:bg-stone-800 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-stone-700 rounded-xl text-sm font-semibold text-stone-900 transition-colors">
                {saving ? "Saving…" : modal.editing ? "Update" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
