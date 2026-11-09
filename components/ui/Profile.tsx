"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserProfile, updateUserProfilePhoto, updateUserProfile, toggleFollowUser } from "@/lib/actions/user.actions";
import {
  MapPin, Calendar, Link as LinkIcon, Edit3, Grid, Heart, MessageCircle, User as UserIcon,
  Bookmark, Check, Plus, Sparkles, Trophy, Code2, Globe2, X, Loader2
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
  { label: "Cyberpunk", url: "https://api.dicebear.com/7.x/bottts/svg?seed=SwitchCyber" }
];

interface ProfileProps {
  userId?: string;
}

export const Profile: React.FC<ProfileProps> = ({ userId }) => {
  const { data: session } = useSession();
  const loggedInUserId = (session?.user as any)?.id || "current-user";
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

  // Edit fields
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editWebsite, setEditWebsite] = useState("");

  useEffect(() => {
    if (fetchingUserId) {
      getUserProfile(fetchingUserId)
        .then((res) => {
          setUserData(res.user);
          setThoughts(res.thoughts || []);
          setFollowerCount(res.user.followers?.length || 0);
          setIsFollowing(res.user.followers?.includes(loggedInUserId) || false);

          setEditName(res.user.username || "");
          setEditBio(res.user.bio || "");
          setEditLocation(res.user.location || "");
          setEditWebsite(res.user.website || "");
        })
        .catch((err) => console.error("Profile fetch error:", err));
    }
  }, [fetchingUserId, loggedInUserId]);

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#506ffc]" />
        <p className="text-sm font-medium">Loading profile experience...</p>
      </div>
    );
  }

  const handleFollowToggle = async () => {
    try {
      const res = await toggleFollowUser(loggedInUserId, userData._id);
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
    try {
      await updateUserProfile(userData._id, {
        username: editName,
        bio: editBio,
        location: editLocation,
        website: editWebsite
      });
      setUserData((prev: any) => ({
        ...prev,
        username: editName,
        bio: editBio,
        location: editLocation,
        website: editWebsite
      }));
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarSelect = async (url: string) => {
    try {
      setUserData((prev: any) => ({ ...prev, photo: url }));
      setShowAvatarModal(false);
      await updateUserProfilePhoto(userData._id, url);
    } catch (err) {
      console.error(err);
    }
  };

  // Filter thoughts by active world tab
  const displayedThoughts = thoughts.filter((t) => {
    if (activeTab === "Posts") return true;
    if (activeTab === "Technology") return t.world?.toLowerCase() === "technology" || t.world?.toLowerCase() === "tech" || t.tech;
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
      {/* Profile Header Card */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Cover Banner */}
        <div className="relative h-40 sm:h-48 w-full bg-slate-900 border-b border-border overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          <div className="flex flex-wrap items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-4">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={userData.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=SwitchCreator"}
                alt={userData.username}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-card object-cover bg-card shadow-sm"
              />
              {isOwnProfile && (
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity cursor-pointer"
                >
                  Change
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <>
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="px-3.5 py-1.5 rounded-md text-xs font-medium border border-border bg-card hover:bg-secondary text-foreground transition-colors cursor-pointer"
                  >
                    Change Avatar
                  </button>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isFollowing
                      ? "bg-secondary text-foreground border border-border hover:bg-destructive/10 hover:text-destructive"
                      : "bg-primary hover:bg-primary/95 text-primary-foreground"
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* User Bio & Meta */}
          <div className="space-y-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {userData.username}
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                @{userData.username?.toLowerCase() || "switch_creator"} • Switch Member
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
                  <a href={userData.website} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
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
                <span className="font-bold text-foreground mr-1 text-sm">{userData.following?.length || 1}</span>
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
          <div className="p-8 text-center bg-card rounded-lg border border-border space-y-2">
            <p className="font-semibold text-sm text-foreground">
              No entries in {activeTab} yet
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Content created or saved in this specialized world will be archived here.
            </p>
          </div>
        ) : (
          displayedThoughts.map((t) => (
            <Card key={t._id} thought={t} />
          ))
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150">
          <div className="bg-card rounded-lg border border-border shadow-xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-base">Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-foreground mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-background border border-input rounded-md p-2 text-foreground outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-background border border-input rounded-md p-2 text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. San Francisco or Remote"
                  className="w-full bg-background border border-input rounded-md p-2 text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-foreground mb-1">Website</label>
                <input
                  type="url"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-background border border-input rounded-md p-2 text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3.5 py-1.5 rounded-md text-muted-foreground hover:bg-secondary font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-4 py-1.5 rounded-md bg-primary hover:bg-primary/95 text-primary-foreground font-semibold transition-colors cursor-pointer"
                >
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Presets Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150">
          <div className="bg-card rounded-lg border border-border shadow-xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-foreground text-base">Select Avatar Style</h3>
                <p className="text-xs text-muted-foreground">Pick an identity tuned for your profile</p>
              </div>
              <button onClick={() => setShowAvatarModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1">
              {AVATAR_PRESETS.map((p) => (
                <div
                  key={p.label}
                  onClick={() => handleAvatarSelect(p.url)}
                  className="p-3 rounded-md bg-secondary/50 border border-border hover:border-primary text-center cursor-pointer transition-colors group"
                >
                  <img
                    src={p.url}
                    alt={p.label}
                    className="w-14 h-14 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform"
                  />
                  <p className="text-xs font-medium text-foreground mt-2 truncate">
                    {p.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-xs text-muted-foreground hover:underline"
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
