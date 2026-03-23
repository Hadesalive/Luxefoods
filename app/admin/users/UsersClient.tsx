"use client"

import { useState, useEffect, useCallback } from "react"
import { UserPlus, Trash, PencilSimple, X, Check, Spinner, ShieldCheck, CashRegister } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  role: string
  created_at: string
  last_sign_in_at: string | null
}

const ROLES = ["admin", "cashier"] as const

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
      role === "admin"
        ? "bg-yellow-500/15 text-yellow-400"
        : "bg-stone-700 text-stone-300"
    )}>
      {role === "admin"
        ? <ShieldCheck size={12} weight="duotone" />
        : <CashRegister size={12} weight="duotone" />
      }
      {role}
    </span>
  )
}

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ email: "", password: "", role: "cashier" })

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/users")
    const data = await res.json()
    setUsers(data.users ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error); setSaving(false); return }
    toast.success("User created")
    setModal(false)
    setForm({ email: "", password: "", role: "cashier" })
    setSaving(false)
    load()
  }

  const handleRoleUpdate = async (id: string) => {
    setSaving(true)
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: editRole }),
    })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error); setSaving(false); return }
    toast.success("Role updated")
    setEditingId(null)
    setSaving(false)
    load()
  }

  const handleDelete = async (id: string) => {
    setSaving(true)
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    const data = await res.json()
    if (!res.ok) { toast.error(data.error); setSaving(false); return }
    toast.success("User deleted")
    setDeletingId(null)
    setSaving(false)
    load()
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-stone-500 mt-0.5">{users.length} account{users.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-semibold rounded-xl text-sm transition-colors"
        >
          <UserPlus size={16} weight="bold" />
          Add User
        </button>
      </div>

      {/* Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-px">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-stone-800 last:border-0">
                <div className="w-8 h-8 rounded-full bg-stone-800 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-stone-800 rounded w-48 animate-pulse" />
                  <div className="h-3 bg-stone-800 rounded w-24 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-stone-500 text-sm">No users found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-800">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-stone-500 uppercase tracking-wider hidden sm:table-cell">Last Sign In</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-stone-800/40 transition-colors">
                  {/* Email */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-stone-300 uppercase">
                          {user.email?.[0]}
                        </span>
                      </div>
                      <span className="text-sm text-stone-100 font-medium truncate max-w-[180px]">{user.email}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-4">
                    {editingId === user.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={editRole}
                          onChange={e => setEditRole(e.target.value)}
                          className="bg-stone-800 border border-stone-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-yellow-500"
                        >
                          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button
                          onClick={() => handleRoleUpdate(user.id)}
                          disabled={saving}
                          className="w-6 h-6 rounded-md bg-yellow-500/20 hover:bg-yellow-500/30 flex items-center justify-center transition-colors"
                        >
                          {saving ? <Spinner size={12} className="animate-spin text-yellow-400" /> : <Check size={12} weight="bold" className="text-yellow-400" />}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="w-6 h-6 rounded-md bg-stone-700 hover:bg-stone-600 flex items-center justify-center transition-colors"
                        >
                          <X size={12} className="text-stone-400" />
                        </button>
                      </div>
                    ) : (
                      <RoleBadge role={user.role} />
                    )}
                  </td>

                  {/* Last sign in */}
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-xs text-stone-500">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                        : "Never"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    {deletingId === user.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={saving}
                          className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold rounded-lg transition-colors"
                        >
                          {saving ? "…" : "Confirm"}
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 text-stone-300 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => { setEditingId(user.id); setEditRole(user.role) }}
                          className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors"
                          title="Edit role"
                        >
                          <PencilSimple size={13} className="text-stone-400" />
                        </button>
                        <button
                          onClick={() => setDeletingId(user.id)}
                          className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-red-500/20 flex items-center justify-center transition-colors group"
                          title="Delete user"
                        >
                          <Trash size={13} className="text-stone-400 group-hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
              <h2 className="text-sm font-semibold text-white">Add User</h2>
              <button onClick={() => setModal(false)} className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition-colors">
                <X size={14} className="text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-stone-400 block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="user@luxefood.com"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-400 block mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Min. 8 characters"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-400 block mb-1.5">Role</label>
                <select
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModal(false)}
                  className="flex-1 py-2.5 border border-stone-700 rounded-xl text-sm font-semibold text-stone-300 hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-stone-900 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? <Spinner size={14} className="animate-spin" /> : null}
                  {saving ? "Creating…" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
