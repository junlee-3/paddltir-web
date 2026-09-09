import { useEffect, useState, useRef } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  defaultPaddlerForm,
  PREFERRED_SIDES,
  GENDERS,
  SEAT_PREFERENCES,
  ROLES,
  type Paddler,
  type PaddlerFormData,
} from "../types/paddler";
import { getPaddlers, addPaddler, updatePaddler, deletePaddler, deleteAllPaddlers } from "../services/paddlers";

interface PaddlersRosterProps {
  userId: string;
}

export default function PaddlersRoster({ userId }: PaddlersRosterProps) {
  const [paddlers, setPaddlers] = useState<Paddler[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPaddlerId, setEditingPaddlerId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [form, setForm] = useState<PaddlerFormData>(defaultPaddlerForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = getPaddlers(userId, setPaddlers);
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "weight" || name === "ergScore") {
      setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const startEdit = (p: Paddler) => {
    setForm({
      name: p.name,
      weight: p.weight,
      ergScore: p.ergScore,
      preferredSide: p.preferredSide,
      gender: p.gender,
      seatPreference: p.seatPreference,
      role: p.role,
    });
    setEditingPaddlerId(p.id ?? null);
    setShowForm(true);
    setOpenMenuId(null);
  };

  const cancelEdit = () => {
    setForm(defaultPaddlerForm);
    setEditingPaddlerId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingPaddlerId) {
        await updatePaddler(userId, editingPaddlerId, form);
        cancelEdit();
      } else {
        await addPaddler(userId, form);
        setForm(defaultPaddlerForm);
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save paddler. Check the console and Firestore rules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (paddlerId: string, paddlerName: string) => {
    if (!confirm(`Delete "${paddlerName}"? This cannot be undone.`)) return;
    setOpenMenuId(null);
    try {
      await deletePaddler(userId, paddlerId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete paddler.");
    }
  };

  const handleClearRoster = async () => {
    if (paddlers.length === 0) return;
    if (
      !confirm(
        `Delete all ${paddlers.length} paddler${paddlers.length === 1 ? "" : "s"} from the roster? This cannot be undone.`
      )
    )
      return;
    try {
      await deleteAllPaddlers(userId);
    } catch (err) {
      console.error(err);
      alert("Failed to clear roster.");
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Roster</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your paddlers</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-sm hover:bg-slate-50 transition-colors shadow-sm"
          >
            Export
          </button>
          <button
            type="button"
            onClick={handleClearRoster}
            disabled={paddlers.length === 0}
            className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-sm hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            Clear Roster
          </button>
          <button
            type="button"
            onClick={() => {
              if (showForm) cancelEdit();
              else {
                setForm(defaultPaddlerForm);
                setEditingPaddlerId(null);
                setShowForm(true);
              }
            }}
            className={`px-4 py-2 text-sm font-medium rounded-sm border transition-colors shadow-sm ${
              showForm && !editingPaddlerId
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                : "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {showForm ? "Cancel" : "Add Paddler"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white border border-slate-200 rounded-sm shadow-sm space-y-5 max-w-2xl"
        >
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-900 border-b border-slate-100 pb-3">
            {editingPaddlerId ? "Edit Paddler" : "New Paddler"}
          </h2>

          <div>
            <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                Weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.1"
                value={form.weight || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label htmlFor="ergScore" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                2 Min Erg Score (m)
              </label>
              <input
                id="ergScore"
                name="ergScore"
                type="number"
                min="0"
                step="1"
                value={form.ergScore || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="preferredSide" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                Preferred Side
              </label>
              <select
                id="preferredSide"
                name="preferredSide"
                value={form.preferredSide}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                {PREFERRED_SIDES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="seatPreference" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                Seat Preference
              </label>
              <select
                id="seatPreference"
                name="seatPreference"
                value={form.seatPreference}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                {SEAT_PREFERENCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="role" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-sm text-sm font-medium transition-colors shadow-sm"
            >
              {isSubmitting
                ? "Saving..."
                : editingPaddlerId
                  ? "Save Changes"
                  : "Add Paddler"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Weight (kg)
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Power Ratio
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Preferred Side
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Seat Preference
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 w-14"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paddlers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-500">
                    No paddlers yet. Click "Add Paddler" to get started.
                  </td>
                </tr>
              ) : (
                paddlers.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.weight}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.powerRatio.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.preferredSide}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.gender}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.seatPreference}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.role}</td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className="relative inline-block text-left"
                        ref={openMenuId === p.id ? menuRef : undefined}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId((prev) => (prev === p.id ? null : p.id ?? null))
                          }
                          className="p-1.5 rounded-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          aria-label="Actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenuId === p.id && (
                          <div className="absolute right-0 top-full mt-1 z-10 py-1 min-w-[140px] bg-white rounded-sm border border-slate-200 shadow-sm">
                            <button
                              type="button"
                              onClick={() => startEdit(p)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => p.id && handleDelete(p.id, p.name)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 shrink-0" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
