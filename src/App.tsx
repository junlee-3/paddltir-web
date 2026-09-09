import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PaddlersRoster from "./pages/PaddlersRoster";
import Crewlists from "./pages/Crewlists";
import CrewlistDetail from "./pages/CrewlistDetail";
import Configs from "./pages/Configs";
import ConfigCrew from "./pages/ConfigCrew";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      if (!currentUser) {
        loginUser();
      }
    });

    return () => unsubscribe();
  }, []);

  const loginUser = async () => {
    const email = window.prompt("Enter your email:");
    if (!email) {
      alert("Email is required!");
      loginUser();
      return;
    }

    const password = window.prompt("Enter your password:");
    if (!password) {
      alert("Password is required!");
      loginUser();
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert("Login failed: " + errorMessage);
      loginUser();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-900">
        <p className="text-gray-500">Please log in...</p>
      </div>
    );
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