import { Link } from "react-router-dom";
import type { User } from "firebase/auth";
import { Users, Kayak } from "lucide-react";

interface HomeProps {
  user: User;
}

export default function Home({ user }: HomeProps) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Welcome back, {user.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Roster Card */}
        <div className="border border-slate-200 bg-white p-6 rounded-sm shadow-sm flex flex-col items-start">
          <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-medium text-slate-900 mb-1">Team Roster</h2>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            Manage your paddlers, their details, and performance metrics in a centralized table.
          </p>
          <Link
            to="/roster"
            className="inline-flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-sm transition-colors border border-slate-900 shadow-sm"
          >
            Manage Roster
          </Link>
        </div>

        {/* Configs Card */}
        <div className="border border-slate-200 bg-white p-6 rounded-sm shadow-sm flex flex-col items-start">
          <div className="w-10 h-10 rounded bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
            <Kayak className="w-5 h-5 text-slate-600" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-medium text-slate-900 mb-1">Boat Configurations</h2>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            Create, test, and optimize crew lineups based on weight and side preferences.
          </p>
          <Link
            to="/configs"
            className="inline-flex items-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-sm font-medium rounded-sm transition-colors border border-slate-200 shadow-sm"
          >
            View Configs
          </Link>
        </div>
      </div>
    </div>
  );
}
