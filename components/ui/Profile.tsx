"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserProfile, updateUserProfilePhoto, updateUserProfile, toggleFollowUser } from "@/lib/actions/user.actions";
import {
  MapPin, Calendar, Link as LinkIcon, Edit3, Grid, Heart, MessageCircle, User as UserIcon,
  Bookmark, Check, Plus, Utensils, Palette, Code2, Music2, Dumbbell, Globe2, X, Loader2
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
    if (activeTab === "Cookbooks") return t.world?.toLowerCase() === "cooking" || t.cooking;
    if (activeTab === "Art Gallery") return t.world?.toLowerCase() === "art" || t.art;
    if (activeTab === "Code Repos") return t.world?.toLowerCase() === "technology" || t.world?.toLowerCase() === "coding" || t.tech;
    if (activeTab === "Saved") return true;
    return true;
  });

  const joinDate = userData.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "January 2026";

  return (
    <div className="w-full space-y-6">
      {/* Profile Header Card */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        {/* Cover Image Banner */}
        <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
            alt="Cover"
            className="w-full h-full object-cover opacity-75 mix-blend-overlay"
          />
        </div>

        {/* Profile Info Row */}
        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          <div className="flex flex-wrap items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={userData.photo || "https://api.dicebear.com/7.x/adventurer/svg?seed=SwitchCreator"}
                alt={userData.username}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-900 shadow-xl object-cover bg-white dark:bg-gray-800"
              />
              {isOwnProfile && (
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity cursor-pointer"
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
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Change Avatar
                  </button>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#506ffc] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-[#506ffc]/25 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    isFollowing
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-500"
                      : "bg-[#506ffc] hover:bg-blue-600 text-white shadow-md shadow-[#506ffc]/25"
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
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
                {userData.username}
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                @{userData.username?.toLowerCase() || "switch_creator"} • Switch Multi-World Member
              </p>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed max-w-xl">
              {userData.bio || "Exploring specialized interest worlds on Switch."}
            </p>

            {/* Location, Website & Join Date */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400">
              {userData.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{userData.location}</span>
                </div>
              )}
              {userData.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
                  <a href={userData.website} target="_blank" rel="noreferrer" className="text-[#506ffc] hover:underline font-medium">
                    {userData.website.replace("https://", "")}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Joined {joinDate}</span>
              </div>
            </div>

            {/* Follow Stats */}
            <div className="flex items-center gap-6 pt-2 text-xs">
              <div>
                <span className="font-bold text-gray-900 dark:text-white mr-1 text-sm">{thoughts.length}</span>
                <span className="text-gray-500">Thoughts</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white mr-1 text-sm">{followerCount}</span>
                <span className="text-gray-500">Followers</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white mr-1 text-sm">{userData.following?.length || 1}</span>
                <span className="text-gray-500">Following</span>
              </div>
            </div>
          </div>
        </div>

        {/* World-Specific Profile Navigation Tabs */}
        <div className="flex border-t border-gray-100 dark:border-gray-800 px-4 overflow-x-auto no-scrollbar gap-2 text-xs font-semibold">
          {[
            { id: "Posts", label: "All Posts", icon: Grid },
            { id: "Cookbooks", label: "Cookbooks", icon: Utensils },
            { id: "Art Gallery", label: "Art Gallery", icon: Palette },
            { id: "Code Repos", label: "Code Repos", icon: Code2 },
            { id: "Saved", label: "Saved Items", icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "border-[#506ffc] text-[#506ffc]"
                    : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white"
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
          <div className="p-10 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-2">
            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">
              No entries in {activeTab} yet
            </p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:border-[#506ffc]"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:border-[#506ffc]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. Milan, Italy or Cyberspace"
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:border-[#506ffc]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Website</label>
                <input
                  type="url"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:border-[#506ffc]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2 rounded-lg bg-[#506ffc] hover:bg-blue-600 text-white font-bold transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Select Avatar Style</h3>
                <p className="text-xs text-gray-500">Pick an identity tuned for your favorite world</p>
              </div>
              <button onClick={() => setShowAvatarModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1">
              {AVATAR_PRESETS.map((p) => (
                <div
                  key={p.label}
                  onClick={() => handleAvatarSelect(p.url)}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/80 dark:border-gray-700/80 hover:border-[#506ffc] hover:bg-blue-50/40 dark:hover:bg-blue-950/20 text-center cursor-pointer transition-all group"
                >
                  <img
                    src={p.url}
                    alt={p.label}
                    className="w-16 h-16 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform"
                  />
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-2 truncate">
                    {p.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setShowAvatarModal(false)}
                className="text-xs text-gray-500 hover:underline"
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
