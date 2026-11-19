// ==============================================================================
// SWITCH SOCIAL PLATFORM - PROFILE COMPONENT
// File: components/ui/Profile.tsx
// Unified Profile with World Tabs, Edit Profile, Username & Avatar Upload
// ==============================================================================

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  getUserProfile,
  updateUserProfilePhoto,
  updateUserProfile,
  toggleFollowUser,
} from "@/lib/actions/user.actions";
import { ProfileService } from "@/lib/services/profile.service";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Edit3,
  Grid,
  Bookmark,
  Sparkles,
  Trophy,
  Code2,
  X,
  Loader2,
  Upload,
  Camera,
  AlertCircle,
  Shield,
  CheckCircle2,
} from "lucide-react";
import Card from "@/components/ui/Card";

const AVATAR_PRESETS = [
  { label: "Chef Baker", url: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&h=300&q=80" },
  { label: "Impressionist Painter", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80" },
  { label: "Systems Architect", url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80" },
  { label: "Synthesist", url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&h=300&q=80" },
  { label: "Strength Coach", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80" },
  { label: "Digital Designer", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80" },
  { label: "Adventurer", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=SwitchAdventurer" },
  { label: "Cyberpunk", url: "https://api.dicebear.com/7.x/bottts/svg?seed=SwitchCyber" },
];

interface ProfileProps {
  userId?: string;
}

export const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const { user: authUser, profile: authProfile, refreshProfile } = useAuth();
  const loggedInUserId = authUser?.id || "current-user";
  const fetchingUserId = userId || loggedInUserId;
  const isOwnProfile = !userId || userId === loggedInUserId;

  const [activeTab, setActiveTab] = useState("Posts");
  const [userData, setUserData] = useState<any>(null);
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState("");
  const [editModalError, setEditModalError] = useState("");
  const [editSuccessToast, setEditSuccessToast] = useState(false);

  // Edit fields
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editWebsite, setEditWebsite] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fetchingUserId) {
      getUserProfile(fetchingUserId)
        .then((res) => {
          setUserData(res.user);
          setThoughts(res.thoughts || []);
          setFollowerCount(res.user.followers?.length || 0);
          setIsFollowing(res.user.followers?.includes(loggedInUserId) || false);

          setEditDisplayName(res.user.name || res.user.username || "");
          setEditUsername(res.user.username || "");
          setEditBio(res.user.bio || "");
          setEditLocation(res.user.location || "");
          setEditWebsite(res.user.website || "");
        })
        .catch((err) => console.error("Profile fetch error:", err));
    }
  }, [fetchingUserId, loggedInUserId]);

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading Switch profile...</p>
      </div>
    );
  }

  const handleFollowToggle = async () => {
    try {
      const res = await toggleFollowUser(loggedInUserId, userData._id || userData.id);
      setIsFollowing(res.following);
      setFollowerCount(res.count);
    } catch (e) {
      console.error(e);
      setIsFollowing(!isFollowing);
      setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setEditModalError("");

    const targetId = userData._id || userData.id;

    try {
      // 1. Check username availability if changed
      const cleanUsername = editUsername.trim().toLowerCase().replace(/\s/g, "");
      if (cleanUsername !== userData.username?.toLowerCase()) {
        const available = await ProfileService.isUsernameAvailable(cleanUsername, targetId);
        if (!available) {
          setEditModalError(`The username "@${cleanUsername}" is already taken.`);
          setIsSavingProfile(false);
          return;
        }
      }

      await updateUserProfile(targetId, {
        username: cleanUsername,
        display_name: editDisplayName.trim(),
        bio: editBio.trim(),
        location: editLocation.trim(),
        website: editWebsite.trim(),
      });

      setUserData((prev: any) => ({
        ...prev,
        username: cleanUsername,
        name: editDisplayName.trim(),
        bio: editBio.trim(),
        location: editLocation.trim(),
        website: editWebsite.trim(),
      }));

      await refreshProfile();
      setShowEditModal(false);
      setEditSuccessToast(true);
      setTimeout(() => setEditSuccessToast(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save profile.";
      setEditModalError(message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Avatar preset selection
  const handleAvatarSelect = async (url: string) => {
    const targetId = userData._id || userData.id;
    try {
      setUserData((prev: any) => ({ ...prev, photo: url }));
      setShowAvatarModal(false);
      await updateUserProfilePhoto(targetId, url);
      await refreshProfile();
    } catch (err) {
      console.error(err);
    }
  };

  // Custom Avatar File Upload (Supabase Storage 'avatars' bucket)
  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setAvatarUploadError("");

    const targetId = userData._id || userData.id;
    const res = await ProfileService.uploadAvatar(targetId, file);

    if (res.success && res.url) {
      setUserData((prev: any) => ({ ...prev, photo: res.url }));
      await updateUserProfilePhoto(targetId, res.url);
      await refreshProfile();
      setShowAvatarModal(false);
    } else {
      setAvatarUploadError(res.error || "Failed to upload avatar image.");
    }
    setIsUploadingAvatar(false);
  };

  // Filter thoughts by active world tab
  const displayedThoughts = thoughts.filter((t) => {
    if (activeTab === "Posts") return true;
    if (activeTab === "Technology")
      return t.world?.toLowerCase() === "technology" || t.world?.toLowerCase() === "tech" || t.tech;
    if (activeTab === "Memes") return t.world?.toLowerCase() === "meme" || t.meme;
    if (activeTab === "Cricket") return t.world?.toLowerCase() === "cricket" || t.cricket;
    if (activeTab === "Saved") return true;
    return true;
  });

  const joinDate = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "January 2026";

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {editSuccessToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Profile updated successfully across all Switch worlds!</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="switch-card w-full">
        {/* Cover Banner */}
        <div className="relative h-40 sm:h-48 w-full bg-slate-900 border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-mono text-white border border-white/20">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Shared Social Graph</span>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          <div className="flex flex-wrap items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-4">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={userData.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=SwitchCreator"}
                alt={userData.username}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-card object-cover bg-card shadow-md"
              />
              {isOwnProfile && (
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-medium transition-opacity cursor-pointer gap-1"
                  title="Change Avatar"
                >
                  <Camera className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground text-xs font-semibold flex items-center gap-1.5 border border-border transition-colors cursor-pointer shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5 text-primary" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                    isFollowing
                      ? "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground"
                  }`}
                >
                  {isFollowing ? (
                    <span>Following</span>
                  ) : (
                    <>
                      <span>+ Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* User Bio & Meta */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {userData.name || userData.username}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                  Switch Verified
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                @{userData.username?.toLowerCase() || "switch_creator"} • One Account
              </p>
            </div>

            <p className="text-sm text-foreground/90 leading-relaxed max-w-xl">
              {userData.bio || "Exploring specialized interest worlds on Switch."}
            </p>

            {/* Location, Website & Join Date */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              {userData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{userData.location}</span>
                </div>
              )}
              {userData.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <a
                    href={userData.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    {userData.website.replace("https://", "")}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Joined {joinDate}</span>
              </div>
            </div>

            {/* Follow Stats */}
            <div className="flex items-center gap-6 pt-2 text-xs">
              <div>
                <span className="font-bold text-foreground mr-1 text-sm">{thoughts.length}</span>
                <span className="text-muted-foreground">Posts</span>
              </div>
              <div>
                <span className="font-bold text-foreground mr-1 text-sm">{followerCount}</span>
                <span className="text-muted-foreground">Followers</span>
              </div>
              <div>
                <span className="font-bold text-foreground mr-1 text-sm">
                  {userData.following?.length || 1}
                </span>
                <span className="text-muted-foreground">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* World-Specific Profile Navigation Tabs */}
        <div className="flex border-t border-border px-4 overflow-x-auto no-scrollbar gap-2 text-xs font-medium">
          {[
            { id: "Posts", label: "All Posts", icon: Grid },
            { id: "Technology", label: "Tech World", icon: Code2 },
            { id: "Memes", label: "Meme Studio", icon: Sparkles },
            { id: "Cricket", label: "Cricket Stadium", icon: Trophy },
            { id: "Saved", label: "Saved Items", icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Stream Feed */}
      <div className="space-y-6">
        {displayedThoughts.length === 0 ? (
          <div className="p-8 text-center switch-card space-y-2">
            <p className="font-semibold text-sm text-foreground">
              No entries in {activeTab} yet
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Content created or saved in this specialized world will be archived here.
            </p>
          </div>
        ) : (
          displayedThoughts.map((t) => <Card key={t._id} thought={t} />)
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150">
          <div className="switch-card p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-base">Edit Switch Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editModalError && (
              <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Display Name</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full bg-background border border-input rounded-xl p-2.5 text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">
                  Username (Unique handle across worlds)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                    @
                  </span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) =>
                      setEditUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                    }
                    className="w-full pl-7 pr-3 bg-background border border-input rounded-xl p-2.5 text-foreground outline-none focus:border-primary font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-input rounded-xl p-2.5 text-foreground outline-none focus:border-primary"
                  placeholder="Share what interests you across Technology, Cricket, and Memes..."
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. San Francisco or Remote"
                  className="w-full bg-background border border-input rounded-xl p-2.5 text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Website</label>
                <input
                  type="url"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-background border border-input rounded-xl p-2.5 text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3.5 py-2 rounded-xl text-muted-foreground hover:bg-secondary font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold transition-colors cursor-pointer"
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Selection & Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150">
          <div className="switch-card p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-foreground text-base">Profile Photo</h3>
                <p className="text-xs text-muted-foreground">
                  Upload an image to Supabase Storage or choose a preset style
                </p>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {avatarUploadError && (
              <div className="p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{avatarUploadError}</span>
              </div>
            )}

            {/* Custom Image Upload Box */}
            <div className="p-4 rounded-xl border border-dashed border-border bg-secondary/30 text-center space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileUpload}
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-foreground">
                <Upload className="w-4 h-4 text-primary" />
                <span>Upload Custom Picture</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                JPG, PNG, WebP or GIF (Max 5MB). Stored securely in Supabase Storage.
              </p>
              <button
                type="button"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                {isUploadingAvatar ? "Uploading to Supabase..." : "Select Image from Computer"}
              </button>
            </div>

            {/* Presets Grid */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">Or pick a curated preset:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                {AVATAR_PRESETS.map((p) => (
                  <div
                    key={p.label}
                    onClick={() => handleAvatarSelect(p.url)}
                    className="p-3 rounded-xl bg-secondary/50 border border-border hover:border-primary text-center cursor-pointer transition-colors group"
                  >
                    <img
                      src={p.url}
                      alt={p.label}
                      className="w-12 h-12 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform"
                    />
                    <p className="text-[11px] font-medium text-foreground mt-2 truncate">
                      {p.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-xs text-muted-foreground hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
