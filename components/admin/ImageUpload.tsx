"use client"

import { useRef, useState, useCallback } from "react"
import Image from "next/image"
import { CloudArrowUp, X, Link, ArrowClockwise } from "@phosphor-icons/react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface Props {
  value: string
  onChange: (url: string) => void
  aspect?: "square" | "video" | "portrait" | "landscape"
  label?: string
  hint?: string
}

const ASPECT = {
  square:    "aspect-square",
  video:     "aspect-video",
  portrait:  "aspect-[3/4]",
  landscape: "aspect-[4/3]",
}

export default function ImageUpload({ value, onChange, aspect = "landscape", label, hint }: Props) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlDraft, setUrlDraft] = useState("")
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Images only"); return }
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5 MB"); return }

    setUploading(true)
    setProgress(10)

    const fd = new FormData()
    fd.append("file", file)

    // Fake progress ticks while waiting
    const tick = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 400)

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      clearInterval(tick)
      setProgress(100)
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Upload failed")
      }
      const { url } = await res.json()
      onChange(url)
      toast.success("Image uploaded")
    } catch (e: unknown) {
      clearInterval(tick)
      toast.error(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setTimeout(() => { setUploading(false); setProgress(0) }, 400)
    }
  }, [onChange])

  const handleFiles = (files: FileList | null) => {
    if (files?.[0]) upload(files[0])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const applyUrl = () => {
    if (urlDraft.trim()) {
      onChange(urlDraft.trim())
      setUrlDraft("")
      setShowUrlInput(false)
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-stone-600">{label}</p>
          {hint && <p className="text-[10px] text-stone-400">{hint}</p>}
        </div>
      )}

      {/* Drop zone / preview */}
      <div
        className={cn(
          "relative w-full rounded-xl overflow-hidden border-2 transition-all",
          ASPECT[aspect],
          dragging
            ? "border-yellow-400 bg-yellow-50"
            : value
            ? "border-transparent"
            : "border-dashed border-stone-200 bg-stone-50 hover:border-stone-300 cursor-pointer"
        )}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !value && inputRef.current?.click()}
      >
        {value ? (
          <>
            <Image src={value} alt="Upload preview" fill className="object-cover" />

            {/* Upload progress overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
                <ArrowClockwise size={24} className="text-white animate-spin" />
                <div className="w-32 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Hover controls */}
            {!uploading && (
              <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors group flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-semibold text-stone-800 hover:bg-yellow-50 transition-colors"
                >
                  <CloudArrowUp size={14} weight="bold" /> Replace
                </button>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); onChange("") }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <X size={14} weight="bold" /> Remove
                </button>
              </div>
            )}
          </>
        ) : uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <ArrowClockwise size={28} className="text-yellow-500 animate-spin" />
            <div className="w-32 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-stone-400">Uploading…</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center">
              <CloudArrowUp size={20} weight="duotone" className="text-stone-400" />
            </div>
            <p className="text-xs text-stone-500 font-medium text-center">
              {dragging ? "Drop to upload" : "Click or drag to upload"}
            </p>
            <p className="text-[10px] text-stone-300">JPG, PNG, WebP · max 5 MB</p>
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white disabled:text-stone-400 text-xs font-semibold rounded-lg transition-colors"
        >
          <CloudArrowUp size={12} weight="bold" />
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
        </button>
        <button
          type="button"
          onClick={() => { setShowUrlInput(v => !v); setUrlDraft(value) }}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-500 text-xs font-semibold rounded-lg transition-colors"
        >
          <Link size={12} weight="bold" /> Use URL
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="ml-auto p-1.5 text-stone-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X size={13} weight="bold" />
          </button>
        )}
      </div>

      {/* URL input */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            value={urlDraft}
            onChange={e => setUrlDraft(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyUrl()}
            placeholder="https://..."
            className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-xs outline-none focus:border-stone-400"
            autoFocus
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-3 py-2 bg-yellow-500 hover:bg-yellow-400 text-stone-900 text-xs font-semibold rounded-lg transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-3 py-2 border border-stone-200 text-stone-400 text-xs rounded-lg hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  )
}
