"use client"

import { useState, useEffect, useCallback } from "react"
import { FloppyDisk, ArrowClockwise } from "@phosphor-icons/react"
import { toast } from "sonner"

interface ContentBlock {
  key: string
  label: string
  value: string | null
  type: "text" | "textarea" | "url" | "color"
  group: string
}

export default function ContentClient() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/content")
      if (res.ok) {
        const data: ContentBlock[] = await res.json()
        setBlocks(data)
        const initial: Record<string, string> = {}
        data.forEach(b => { initial[b.key] = b.value ?? "" })
        setEdits(initial)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (key: string) => {
    setSaving(key)
    try {
      const res = await fetch(`/api/admin/content/${key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: edits[key] }),
      })
      if (!res.ok) throw new Error()
      setBlocks(prev => prev.map(b => b.key === key ? { ...b, value: edits[key] } : b))
      toast.success("Saved")
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(null)
    }
  }

  const isDirty = (key: string) => {
    const block = blocks.find(b => b.key === key)
    return block ? (block.value ?? "") !== edits[key] : false
  }

  // Group blocks
  const groups = [...new Set(blocks.map(b => b.group))]

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-stone-900">Content</h1>
          <p className="text-sm text-stone-400 mt-0.5">Manage page text and media</p>
        </div>
        <button onClick={load} disabled={loading} className="p-2 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors disabled:opacity-50">
          <ArrowClockwise size={16} className={`text-stone-500 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-white rounded-xl border border-stone-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(group => (
            <div key={group}>
              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">{group}</p>
              <div className="space-y-3">
                {blocks.filter(b => b.group === group).map(block => (
                  <div key={block.key} className="bg-white rounded-2xl border border-stone-100 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-sm font-semibold text-stone-900">{block.label}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{block.key}</p>
                      </div>
                      {isDirty(block.key) && (
                        <button
                          onClick={() => handleSave(block.key)}
                          disabled={saving === block.key}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 disabled:bg-stone-200 text-stone-900 text-xs font-semibold rounded-lg transition-colors flex-shrink-0"
                        >
                          <FloppyDisk size={12} weight="bold" />
                          {saving === block.key ? "Saving…" : "Save"}
                        </button>
                      )}
                    </div>
                    {block.type === "textarea" ? (
                      <textarea
                        value={edits[block.key] ?? ""}
                        onChange={e => setEdits(prev => ({ ...prev, [block.key]: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400 resize-none"
                      />
                    ) : block.type === "color" ? (
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={edits[block.key] || "#000000"}
                          onChange={e => setEdits(prev => ({ ...prev, [block.key]: e.target.value }))}
                          className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer p-0.5"
                        />
                        <input
                          value={edits[block.key] ?? ""}
                          onChange={e => setEdits(prev => ({ ...prev, [block.key]: e.target.value }))}
                          className="flex-1 px-3 py-2.5 border border-stone-200 rounded-xl text-sm font-mono outline-none focus:border-stone-400"
                        />
                      </div>
                    ) : (
                      <input
                        type={block.type === "url" ? "url" : "text"}
                        value={edits[block.key] ?? ""}
                        onChange={e => setEdits(prev => ({ ...prev, [block.key]: e.target.value }))}
                        placeholder={block.type === "url" ? "https://..." : ""}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm outline-none focus:border-stone-400"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {blocks.length === 0 && (
            <div className="text-center py-20">
              <p className="text-stone-400 text-sm mb-2">No content blocks yet</p>
              <p className="text-stone-300 text-xs">Run the SQL migration to seed default content blocks</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
