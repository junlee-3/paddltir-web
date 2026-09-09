import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  defaultConfigForm,
  type Config,
  type ConfigFormData,
} from "../types/config";
import { getConfigs, addConfig, updateConfig, deleteConfig } from "../services/configs";
import type { Crewlist } from "../types/crewlist";
import { getCrewlists } from "../services/crewlists";

interface ConfigsProps {
  userId: string;
}

function formatSize(size: string): string {
  return size === "standard" ? "Standard" : "Small";
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function Configs({ userId }: ConfigsProps) {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [crewlists, setCrewlists] = useState<Crewlist[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [form, setForm] = useState<ConfigFormData>(defaultConfigForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = getConfigs(userId, setConfigs);
    return () => unsubscribe();
  }, [userId]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startCreate = () => {
    setForm(defaultConfigForm);
    setEditingConfigId(null);
    setShowForm(true);
  };

  const startEdit = (config: Config) => {
    setForm({
      name: config.name,
      ageDivision: config.ageDivision,
      size: config.size,
      category: config.category,
      crewlistId: config.crewlistId,
    });
    setEditingConfigId(config.id ?? null);
    setShowForm(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (configId: string, configName: string) => {
    if (!confirm(`Delete "${configName}"? This cannot be undone.`)) return;
    setOpenMenuId(null);
    try {
      await deleteConfig(userId, configId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete config.");
    }
  };

  const cancelForm = () => {
    setForm(defaultConfigForm);
    setEditingConfigId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = form.name.trim();
    setIsSubmitting(true);
    try {
      if (editingConfigId) {
        // For existing configs, allow renaming only; keep other fields as-is
        await updateConfig(userId, editingConfigId, {
          name: trimmedName || form.name,
        });
        cancelForm();
      } else {
        if (!form.crewlistId) {
          alert("Please choose a crewlist for this config.");
          setIsSubmitting(false);
          return;
        }
        const crewlist = crewlists.find((c) => c.id === form.crewlistId);
        if (!crewlist) {
          alert("Selected crewlist no longer exists.");
          setIsSubmitting(false);
          return;
        }

        const data: ConfigFormData = {
          name: trimmedName || crewlist.name,
          ageDivision: crewlist.ageDivision,
          size: crewlist.size,
          category: crewlist.category,
          crewlistId: crewlist.id,
        };

        await addConfig(userId, data);
        setForm(defaultConfigForm);
        setShowForm(false);
      }
    } catch (err) {
      console.error("Config save error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Failed to save config: ${msg}. If this is a permissions error, check Supabase RLS policies for the configs table.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = Boolean(editingConfigId);

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Configs</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage crew configurations</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => (showForm && !editingConfigId ? cancelForm() : startCreate())}
            className={`px-4 py-2 text-sm font-medium rounded-sm border transition-colors shadow-sm ${
              showForm && !editingConfigId
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                : "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {showForm && !editingConfigId ? "Cancel" : "Create New Config"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white border border-slate-200 rounded-sm shadow-sm space-y-5 max-w-2xl"
        >
          <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-900 border-b border-slate-100 pb-3">
            {isEditMode ? "Edit Config" : "New Config"}
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

          {!isEditMode && (
            <div>
              <label htmlFor="crewlistId" className="block text-xs font-medium uppercase tracking-wider text-slate-600 mb-1.5">
                Crewlist
              </label>
              <select
                id="crewlistId"
                name="crewlistId"
                value={form.crewlistId ?? ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-sm text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                <option value="">Select a crewlist...</option>
                {crewlists.map((cl) => (
                  <option key={cl.id} value={cl.id}>
                    {cl.name} — {cl.ageDivision}, {formatSize(cl.size)}, {formatCategory(cl.category)}
                  </option>
                ))}
              </select>
              {crewlists.length === 0 && (
                <p className="mt-2 text-xs text-slate-500">
                  You have no crewlists yet. Create one first from the Crewlists page.
                </p>
              )}
            </div>
          )}

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
                  : "Create Config"}
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
              <th className="px-6 py-3 text-xs font-bold text-slate-700 uppercase tracking-wider">
              </th>
              <th className="px-6 py-3 w-14"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {configs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">
                  No configs yet. Click "Create New Config" to get started.
                </td>
              </tr>
            ) : (
              configs.map((config) => (
                <tr key={config.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{config.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{config.ageDivision}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatSize(config.size)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatCategory(config.category)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to={`/configs/${config.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-medium rounded-sm transition-colors"
                    >
                      Open
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div
                      className="relative inline-block text-left"
                      ref={openMenuId === config.id ? menuRef : undefined}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId((prev) => (prev === config.id ? null : config.id ?? null))
                        }
                        className="p-1.5 rounded-sm text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                        aria-label="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {openMenuId === config.id && (
                        <div className="absolute right-0 top-full mt-1 z-10 py-1 min-w-[140px] bg-white rounded-sm border border-slate-200 shadow-sm">
                          <button
                            type="button"
                            onClick={() => startEdit(config)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => config.id && handleDelete(config.id, config.name)}
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
