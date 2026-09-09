import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { ClipboardList, Kayak, Camera, Menu, X } from "lucide-react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { supabase } from "../supabase";
import { uploadProfilePhoto } from "../services/profile";
import type { AuthUser } from "../types/auth";

const HomeIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const RosterIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CrewlistIcon = () => (
  <ClipboardList className="w-5 h-5 shrink-0" strokeWidth={1.5} />
);

const ConfigIcon = () => (
  <Kayak className="w-5 h-5 shrink-0" strokeWidth={1.5} />
);

const SettingsIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

interface LayoutProps {
  user: AuthUser;
}

const UPLOAD_TIMEOUT_MS = 30000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(() => {
      reject(new Error("Upload took too long. Please try again."));
    }, ms);
    promise
      .then((value) => {
        window.clearTimeout(id);
        resolve(value);
      })
      .catch((err) => {
        window.clearTimeout(id);
        reject(err);
      });
  });
}

function NavLink({
  to,
  icon: Icon,
  children,
  onClick,
}: {
  to: string;
  icon: React.ComponentType;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const location = useLocation();
  const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-6 py-3 transition-colors text-sm border-l-2 ${
        active
          ? "border-slate-900 bg-white text-slate-900 font-semibold"
          : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-white/50"
      }`}
    >
      <Icon />
      {children}
    </Link>
  );
}

export default function Layout({ user }: LayoutProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.photoURL ?? null
  );
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastObjectUrlRef = useRef<string | null>(null);

  const handleLogout = () => {
    void supabase.auth.signOut();
  };

  const initials = user.email
    ? user.email
        .split("@")[0]
        .slice(0, 2)
        .toUpperCase()
    : "?";
  const displayName =
    user.displayName ?? user.email?.split("@")[0] ?? "User";

  useEffect(() => {
    if (lastObjectUrlRef.current) {
      URL.revokeObjectURL(lastObjectUrlRef.current);
      lastObjectUrlRef.current = null;
    }
    setAvatarPreview(user.photoURL ?? null);
  }, [user.photoURL]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileDropdownOpen]);

  // Close mobile menu on route change
  const location = useLocation();
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user.uid) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCropImageSrc(reader.result);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setProfileDropdownOpen(true);
      }
    };
    reader.onerror = () => {
      alert("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = useCallback(
    (_: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleCancelCrop = () => {
    if (isUploading) return;
    setCropImageSrc(null);
    setCroppedAreaPixels(null);
  };

  const handleSaveCropped = async () => {
    if (!cropImageSrc || !croppedAreaPixels || !user.uid) return;
    setIsUploading(true);
    try {
      const blob = await getCroppedImage(cropImageSrc, croppedAreaPixels);
      const file = new File([blob], `avatar-cropped-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      const previousPreview = avatarPreview;
      if (lastObjectUrlRef.current) {
        URL.revokeObjectURL(lastObjectUrlRef.current);
        lastObjectUrlRef.current = null;
      }
      const localUrl = URL.createObjectURL(blob);
      lastObjectUrlRef.current = localUrl;
      setAvatarPreview(localUrl);

      setCropImageSrc(null);
      setCroppedAreaPixels(null);
      setProfileDropdownOpen(false);

      withTimeout(uploadProfilePhoto(user.uid, file), UPLOAD_TIMEOUT_MS)
        .then(() => {
          // When auth metadata updates photoURL, the avatarPreview will sync via useEffect.
        })
        .catch((err) => {
          alert(err instanceof Error ? err.message : "Failed to upload photo");
          if (lastObjectUrlRef.current) {
            URL.revokeObjectURL(lastObjectUrlRef.current);
            lastObjectUrlRef.current = null;
          }
          setAvatarPreview(previousPreview ?? null);
        })
        .finally(() => {
          setIsUploading(false);
        });
    } catch (err) {
      setIsUploading(false);
      alert(err instanceof Error ? err.message : "Failed to prepare photo");
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 flex font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] shrink-0 flex flex-col border-r border-slate-200 bg-background
          transform transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-slate-200">
           <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Paddltir</span>
           <button 
             onClick={() => setMobileMenuOpen(false)}
             className="p-1 -mr-2 text-slate-500 hover:text-slate-900 lg:hidden"
           >
             <X className="w-5 h-5" />
           </button>
        </div>
        <div className="flex-1 py-6 overflow-y-auto">
          <nav className="space-y-1">
            <NavLink to="/" icon={HomeIcon} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/roster" icon={RosterIcon} onClick={() => setMobileMenuOpen(false)}>Roster</NavLink>
            <NavLink to="/crewlists" icon={CrewlistIcon} onClick={() => setMobileMenuOpen(false)}>Crewlists</NavLink>
            <NavLink to="/configs" icon={ConfigIcon} onClick={() => setMobileMenuOpen(false)}>Configs</NavLink>
          </nav>
        </div>
        <div className="border-t border-slate-200 py-4 space-y-1 shrink-0">
          <button
            type="button"
            className="flex items-center gap-3 px-6 py-3 w-full text-left text-sm text-slate-500 hover:text-slate-900 hover:bg-white/50 border-l-2 border-transparent transition-colors"
          >
            <SettingsIcon />
            Settings
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 w-full text-left text-sm text-slate-500 hover:text-slate-900 hover:bg-white/50 border-l-2 border-transparent transition-colors"
          >
            <LogoutIcon />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <header className="h-14 shrink-0 flex items-center justify-between lg:justify-end px-4 lg:px-8 border-b border-slate-200 bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900">Paddltir</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-slate-400 hover:text-slate-900 transition-colors"
              aria-label="Notifications"
            >
              <BellIcon />
            </button>
            <div ref={profileDropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((o) => !o)}
                className="w-8 h-8 rounded-sm overflow-hidden bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0 border border-slate-200 hover:border-slate-400 transition-colors focus:outline-none"
                aria-label="Profile menu"
                aria-expanded={profileDropdownOpen}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-sm border border-slate-200 bg-white shadow-sm z-50 py-4 px-4">
                  <div className="flex flex-col items-center gap-3 pb-3 border-b border-slate-100">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      disabled={isUploading}
                      className="relative group w-12 h-12 rounded-sm overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 shrink-0 cursor-pointer focus:outline-none disabled:opacity-50"
                    >
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                      <span className="absolute inset-0 bg-slate-900/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-5 h-5 text-white" strokeWidth={1.5} />
                      </span>
                      {isUploading && (
                        <span className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                          <span className="text-white text-[10px] font-medium tracking-wide uppercase">Uploading...</span>
                        </span>
                      )}
                    </button>
                    <div className="text-center min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email ?? ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-10 overflow-auto">
          <Outlet />
        </main>
      </div>

      {cropImageSrc && (
        <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-xl p-4 sm:p-6 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-slate-900">Adjust profile photo</h2>
            <div className="relative w-full aspect-square bg-slate-900/90 rounded-sm overflow-hidden">
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelCrop}
                disabled={isUploading}
                className="px-4 py-2 text-sm rounded-sm border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCropped}
                disabled={isUploading || !croppedAreaPixels}
                className="px-4 py-2 text-sm rounded-sm bg-slate-900 text-white font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {isUploading ? "Saving..." : "Save photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

async function getCroppedImage(imageSrc: string, crop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });

  const maxSize = 768;
  const largestSide = Math.max(crop.width, crop.height);
  const scale = largestSide > maxSize ? maxSize / largestSide : 1;

  const canvas = document.createElement("canvas");
  canvas.width = crop.width * scale;
  canvas.height = crop.height * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create image blob"));
      },
      "image/jpeg",
      0.9
    );
  });
}
