import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import type { Crewlist } from "../types/crewlist";
import type { Paddler } from "../types/paddler";
import type { Config } from "../types/config";
import { getCrewlistById, updateCrewlist } from "../services/crewlists";
import { getPaddlers } from "../services/paddlers";
import { getConfigs } from "../services/configs";

interface CrewlistDetailProps {
  userId: string;
}

export default function CrewlistDetail({ userId }: CrewlistDetailProps) {
  const { crewlistId } = useParams<{ crewlistId: string }>();
  const navigate = useNavigate();
  const [crewlist, setCrewlist] = useState<Crewlist | null>(null);
  const [paddlers, setPaddlers] = useState<Paddler[]>([]);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!crewlistId) {
      navigate("/crewlists", { replace: true });
      return;
    }
    let cancelled = false;
    getCrewlistById(userId, crewlistId).then((cl) => {
      if (cancelled) return;
      if (!cl) {
        navigate("/crewlists", { replace: true });
        return;
      }
      setCrewlist(cl);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, crewlistId, navigate]);

  useEffect(() => {
    const unsub = getPaddlers(userId, setPaddlers);
    return () => unsub();
  }, [userId]);

  useEffect(() => {
    const unsub = getConfigs(userId, setConfigs);
    return () => unsub();
  }, [userId]);

  if (!crewlistId) return null;
  if (!crewlist) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Loading crewlist...</p>
      </div>
    );
  }

  const memberIds = new Set(crewlist.memberIds ?? []);
  const memberPaddlers = paddlers.filter((p) => p.id && memberIds.has(p.id));
  const availablePaddlers = paddlers.filter((p) => p.id && !memberIds.has(p.id));

  const configForCrewlist = configs.find((c) => c.crewlistId === crewlistId);

  const filteredAvailable = availablePaddlers.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const saveMembers = async (newMemberIds: string[]) => {
    if (!crewlistId) return;
    setIsSaving(true);
    try {
      await updateCrewlist(userId, crewlistId, { memberIds: newMemberIds });
      setCrewlist({ ...crewlist, memberIds: newMemberIds });
    } catch (err) {
      console.error(err);
      alert("Failed to update crewlist members.");
    } finally {
      setIsSaving(false);
    }
  };

  const addMember = (paddlerId: string) => {
    if (!crewlist.memberIds.includes(paddlerId)) {
      saveMembers([...crewlist.memberIds, paddlerId]);
    }
  };

  const removeMember = (paddlerId: string) => {
    if (!crewlist.memberIds.includes(paddlerId)) return;
    saveMembers(crewlist.memberIds.filter((id) => id !== paddlerId));
  };

  return (
    <div className="flex flex-col gap-8 h-full max-w-6xl">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{crewlist.name}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {crewlist.ageDivision} · {crewlist.size === "standard" ? "Standard" : "Small"} ·{" "}
            {crewlist.category
              ? crewlist.category.charAt(0).toUpperCase() + crewlist.category.slice(1)
              : ""}
          </p>
          {isSaving && (
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mt-2">Saving...</p>
          )}
        </div>
        {configForCrewlist?.id && (
          <Link
            to={`/configs/${configForCrewlist.id}`}
            className="inline-flex items-center px-4 py-2 bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white rounded-sm text-sm font-medium transition-colors shrink-0 shadow-sm"
          >
            Open Config
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Left: Add athlete from roster */}
        <div className="border border-slate-200 rounded-sm bg-white p-4 sm:p-6 flex flex-col shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-2">
            Roster Athletes
          </h2>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-sm mb-4 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
          <div className="flex-1 overflow-auto space-y-2 pr-2">
            {filteredAvailable.length === 0 ? (
              <p className="text-sm text-slate-500">
                {availablePaddlers.length === 0
                  ? "All roster athletes are already in this crewlist."
                  : "No matching athletes."}
              </p>
            ) : (
              filteredAvailable.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-4 py-3 rounded-sm border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {p.weight} kg · {p.preferredSide} · {p.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => p.id && addMember(p.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-sm bg-slate-100 border border-slate-200 hover:bg-slate-900 hover:border-slate-900 hover:text-white text-slate-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Current members */}
        <div className="border border-slate-200 rounded-sm bg-slate-50 p-4 sm:p-6 flex flex-col shadow-inner">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-200 pb-2">
            Crewlist Members ({memberPaddlers.length})
          </h2>
          <div className="flex-1 overflow-auto space-y-2 pr-2">
            {memberPaddlers.length === 0 ? (
              <p className="text-sm text-slate-500">
                No athletes in this crewlist yet. Add athletes from the left panel.
              </p>
            ) : (
              memberPaddlers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-4 py-3 rounded-sm border border-slate-200 bg-white shadow-sm"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {p.weight} kg · {p.preferredSide} · {p.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => p.id && removeMember(p.id)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-sm text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
