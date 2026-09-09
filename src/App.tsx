import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { mapAuthUser, supabase } from "./supabase";
import type { AuthUser } from "./types/auth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PaddlersRoster from "./pages/PaddlersRoster";
import Crewlists from "./pages/Crewlists";
import CrewlistDetail from "./pages/CrewlistDetail";
import Configs from "./pages/Configs";
import ConfigCrew from "./pages/ConfigCrew";

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(mapAuthUser(data.session?.user ?? null));
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapAuthUser(session?.user ?? null));
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} />}>
        <Route index element={<Home user={user} />} />
        <Route path="roster" element={<PaddlersRoster userId={user.uid} />} />
        <Route path="crewlists" element={<Crewlists userId={user.uid} />} />
        <Route path="crewlists/:crewlistId" element={<CrewlistDetail userId={user.uid} />} />
        <Route path="configs" element={<Configs userId={user.uid} />} />
        <Route path="configs/:configId" element={<ConfigCrew userId={user.uid} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
