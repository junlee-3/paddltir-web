import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  type Crewlist,
  type CrewlistFormData,
  CREWLIST_AGE_DIVISIONS,
  defaultCrewlistForm,
} from "../types/crewlist";
import { getCrewlists, addCrewlist, updateCrewlist, deleteCrewlist } from "../services/crewlists";

interface CrewlistsProps {
  userId: string;
}

function formatSize(size: string): string {
  return size === "standard" ? "Standard" : "Small";
}

function formatCategory(category: string | null | undefined): string {
  if (!category) return "";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function Crewlists({ userId }: CrewlistsProps) {
  const [crewlists, setCrewlists] = useState<Crewlist[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [form, setForm] = useState<CrewlistFormData>(defaultCrewlistForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = getCrewlists(userId, setCrewlists);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startCreate = () => {
    setForm(defaultCrewlistForm);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (list: Crewlist) => {
    setForm({
      name: list.name,
      ageDivision: list.ageDivision,
      size: list.size,
      category: list.category,
    });
    setEditingId(list.id ?? null);
    setShowForm(true);
    setOpenMenuId(null);
  };

  const cancelForm = () => {
    setForm(defaultCrewlistForm);
    setEditingId(null);
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
      if (editingId) {
        await updateCrewlist(userId, editingId, form);
        cancelForm();
      } else {
        await addCrewlist(userId, form);
        setForm(defaultCrewlistForm);
        setShowForm(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save crewlist. Check Firestore rules.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (crewlistId: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setOpenMenuId(null);
    try {
      await deleteCrewlist(userId, crewlistId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete crewlist.");
    }
  };

  const isEditMode = Boolean(editingId);

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Crewlists</h1>
          <p className="text-sm text-slate-500 mt-1">Define groups of athletes for configs</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => (showForm && !editingId ? cancelForm() : startCreate())}
            className={`px-4 py-2 text-sm font-medium rounded-sm border transition-colors shadow-sm ${
              showForm && !editingId
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                : "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {showForm && !editingId ? "Cancel" : "Create New Crewlist"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white border border-slate-200 rounded-sm shadow-sm space-y-5 max-w-2xl"
        >
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-900 border-b border-slate-100 pb-3">
            {isEditMode ? "Edit Crewlist" : "New Crewlist"}
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

          <div>
            <label htmlFor="ageDivision" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
              Age Division
            </label>
            <select
              id="ageDivision"
              name="ageDivision"
              value={form.ageDivision}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            >
              {CREWLIST_AGE_DIVISIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="size" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                Size
              </label>
              <select
                id="size"
                name="size"
                value={form.size}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                <option value="small">Small</option>
                <option value="standard">Standard</option>
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                <option value="open">Open</option>
                <option value="women">Women</option>
                <option value="mixed">Mixed</option>
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
                : isEditMode
                ? "Save Changes"
                : "Create Crewlist"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Age Division
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider" />
              <th className="px-6 py-3 w-14" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {crewlists.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                  No crewlists yet. Click "Create New Crewlist" to get started.
                </td>
              </tr>
            ) : (
              crewlists.map((list) => (
                <tr
                  key={list.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{list.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{list.ageDivision}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatSize(list.size)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatCategory(list.category)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/crewlists/${list.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium rounded-sm transition-colors"
                    >
                      Open
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className="relative inline-block text-left"
                      ref={openMenuId === list.id ? menuRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId((prev) => (prev === list.id ? null : list.id ?? null))
                        }
                        className="p-1.5 rounded-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === list.id && (
                        <div className="absolute right-0 top-full mt-1 z-10 py-1 min-w-[140px] bg-white rounded-sm border border-slate-200 shadow-sm">
                          <button
                            type="button"
                            onClick={() => startEdit(list)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => list.id && handleDelete(list.id, list.name)}
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
