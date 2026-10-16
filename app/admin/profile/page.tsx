"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { authService } from "@/lib/api/services/authService";
import { getStoredUser, setStoredUser } from "@/lib/api/token";
import { formatImageUrl } from "@/lib/api/config";
import { parseApiErrorMessage } from "@/lib/api/types";
import { FiCheckCircle, FiAlertCircle, FiCamera, FiUploadCloud } from "react-icons/fi";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    image: string | null;
  }>({
    name: "Admin User",
    email: "admin@haven.com",
    phone: "",
    role: "Administrator",
    image: null,
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  // Load real profile from API & stored token
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setErrorMsg(null);

      // Fast initial fill from localStorage if present
      const cached = getStoredUser();
      if (cached) {
        const initial = {
          name: cached.name || cached.username || "Admin User",
          email: cached.email || "admin@haven.com",
          phone: cached.phone || "",
          role: cached.role === "admin" ? "Administrator" : cached.role || "Administrator",
          image: cached.image || null,
        };
        setProfile(initial);
        setTempProfile(initial);
      }

      try {
        const user = await authService.getProfile();
        if (user) {
          const loaded = {
            name: user.name || user.username || "Admin User",
            email: user.email || "admin@haven.com",
            phone: user.phone || "",
            role: user.role === "admin" ? "Administrator" : user.role || "Administrator",
            image: user.image || null,
          };
          setProfile(loaded);
          setTempProfile(loaded);
          setStoredUser(user);
        }
      } catch (err) {
        console.warn("Could not fetch profile from server:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setIsEditing(true);
    setSuccessMsg(null);
    setErrorMsg(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setErrorMsg(null);
  };

  // Handle local image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Selected image is too large (max 5MB allowed).");
        return;
      }
      setSelectedImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreviewUrl(preview);
      setErrorMsg(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      let updatedUser: any;

      if (selectedImageFile) {
        // Send as FormData to upload file
        const formData = new FormData();
        formData.append("name", tempProfile.name);
        formData.append("email", tempProfile.email);
        if (tempProfile.phone) formData.append("phone", tempProfile.phone);
        formData.append("image", selectedImageFile);

        updatedUser = await authService.updateProfile(formData);
      } else {
        // Send JSON payload
        const payload: Record<string, any> = {
          name: tempProfile.name,
          email: tempProfile.email,
          phone: tempProfile.phone,
        };
        updatedUser = await authService.updateProfile(payload);
      }

      const newProf = {
        name: updatedUser.name || tempProfile.name,
        email: updatedUser.email || tempProfile.email,
        phone: updatedUser.phone || tempProfile.phone,
        role: updatedUser.role === "admin" ? "Administrator" : updatedUser.role || profile.role,
        image: updatedUser.image || (imagePreviewUrl ? imagePreviewUrl : profile.image),
      };

      setProfile(newProf);
      setTempProfile(newProf);
      setStoredUser({ ...updatedUser, ...newProf });
      setIsEditing(false);
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      setSuccessMsg("Profile and avatar updated successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(parseApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const currentDisplayImage = imagePreviewUrl || (profile.image ? formatImageUrl(profile.image) : null);

  return (
    <div className="max-w-4xl">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="font-displayPlayFair text-3xl font-bold text-[#1d1a17]">Profile</h1>
        <p className="text-sm text-gray-500 mt-1 font-cambria">Your admin account information</p>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 max-w-lg">
          <FiCheckCircle className="text-emerald-600 flex-shrink-0" size={16} />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 max-w-lg">
          <FiAlertCircle className="text-rose-600 flex-shrink-0" size={16} />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      <div className="bg-white border border-[#E8E2DC] rounded-2xl p-8 shadow-sm max-w-lg relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs rounded-2xl flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#8B7355] border-t-transparent"></div>
          </div>
        )}

        {/* ── Hidden File Input for Image Upload ── */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* ── User Header Section ── */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#F1EDE8]">
          <div className="relative group flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-[#D4C3B3] flex items-center justify-center text-white text-3xl font-displayPlayFair shadow-md overflow-hidden border-2 border-white ring-2 ring-[#E8E2DC]">
              {currentDisplayImage ? (
                <img
                  src={currentDisplayImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(profile.name || "A").charAt(0).toUpperCase()}</span>
              )}
            </div>

            {/* Camera / Edit Image Overlay */}
            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/45 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-semibold opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                title="Change Avatar Photo"
              >
                <FiCamera size={18} />
                <span className="mt-0.5 text-[9px]">Upload</span>
              </button>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-[#1d1a17] font-cambria">{profile.name}</h2>
            </div>
            <p className="text-sm text-gray-500 font-cambria">{profile.email}</p>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="inline-block bg-[#8B7355] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {profile.role}
              </span>
              {isEditing && selectedImageFile && (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <FiUploadCloud size={11} /> New image selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Info Form ── */}
        <div className="space-y-5">
          {/* Avatar upload prompt button when editing */}
          {isEditing && (
            <div className="p-3 bg-[#FAF7F2] border border-[#E8E2DC] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <FiCamera className="text-[#8B7355]" size={16} />
                <span className="font-semibold">Profile Picture</span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 bg-white hover:bg-gray-50 border border-[#E8E2DC] text-gray-700 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                {selectedImageFile ? "Change Photo" : "Upload Photo"}
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 font-cambria">
              {isEditing ? "Full Name" : "Name"}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm bg-white text-[#1d1a17] focus:outline-none focus:ring-2 focus:ring-[#CFB9A3] transition-colors font-cambria font-medium"
              />
            ) : (
              <div className="w-full bg-[#F5F0EB] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] font-cambria font-medium">
                {profile.name}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 font-cambria">
              {isEditing ? "Email Address" : "Email"}
            </label>
            {isEditing ? (
              <input
                type="email"
                value={tempProfile.email}
                onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm bg-white text-[#1d1a17] focus:outline-none focus:ring-2 focus:ring-[#CFB9A3] transition-colors font-cambria font-medium"
              />
            ) : (
              <div className="w-full bg-[#F5F0EB] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] font-cambria font-medium">
                {profile.email}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 font-cambria">Phone</label>
            {isEditing ? (
              <input
                type="text"
                placeholder="+31 6 12345678"
                value={tempProfile.phone}
                onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                className="w-full border border-[#E8E2DC] rounded-xl px-4 py-2.5 text-sm bg-white text-[#1d1a17] focus:outline-none focus:ring-2 focus:ring-[#CFB9A3] transition-colors font-cambria font-medium"
              />
            ) : (
              <div className="w-full bg-[#F5F0EB] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] font-cambria font-medium">
                {profile.phone || "Not set"}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 font-cambria">Role</label>
            <div className="w-full bg-[#F5F0EB] rounded-xl px-4 py-2.5 text-sm text-[#1d1a17] font-cambria font-medium">
              {profile.role}
            </div>
          </div>

          {/* ── Buttons ── */}
          <div className="pt-4 flex gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleCancel}
                  className="flex-1 py-2.5 border border-[#E8E2DC] rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors font-cambria"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="flex-1 py-2.5 bg-[#CFB9A3] hover:bg-[#8B7355] text-white rounded-xl text-sm font-bold shadow-xs transition-colors font-cambria disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEdit}
                className="w-full py-2.5 bg-[#CFB9A3] hover:bg-[#8B7355] text-white rounded-xl text-sm font-bold shadow-xs transition-colors font-cambria"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
