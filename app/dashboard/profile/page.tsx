"use client";

import { useEffect, useRef, useState } from "react";
import {
  HiOutlineCamera,
  HiOutlineCheck,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineKey,
  HiOutlineUser,
} from "react-icons/hi";
import { authService } from '@/lib/api';
import { formatImageUrl } from '@/lib/api/config';
import { useDashboard } from "../DashboardContext";
import Spinner from "@/components/shared/Spinner";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "nl", label: "Dutch (Nederlands)" },
  { code: "de", label: "German (Deutsch)" },
];

export default function ProfilePage() {
  const { dashboardData, loading, updateProfileState } = useDashboard();
  const profile = dashboardData?.profile;

  // Profile Edit State
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [draft, setDraft] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    language: "en",
  });

  // Password Change State
  const [savingPassword, setSavingPassword] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDraft({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        language: profile.language || "en",
      });
      setPreviewImage(profile.image || null);
    }
  }, [profile]);

  // Handle Image File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  // Save Profile Info (name, phone, bio, language, image)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrorMsg(null);
    setProfileSuccessMsg(null);

    try {
      setSavingProfile(true);

      let updatedUser;
      if (selectedFile) {
        // Multipart/form-data for image upload
        const formData = new FormData();
        formData.append("name", draft.name);
        formData.append("phone", draft.phone);
        formData.append("bio", draft.bio);
        formData.append("language", draft.language);
        formData.append("image", selectedFile);

        updatedUser = await authService.updateProfile(formData);
      } else {
        // Standard JSON PATCH
        updatedUser = await authService.updateProfile({
          name: draft.name,
          phone: draft.phone,
          bio: draft.bio,
          language: draft.language,
        });
      }

      // Update Context & LocalStorage
      updateProfileState({
        name: updatedUser.name || draft.name,
        phone: updatedUser.phone || draft.phone,
        bio: updatedUser.bio || draft.bio,
        language: updatedUser.language || draft.language,
        ...(updatedUser.image ? { image: updatedUser.image } : {}),
      });

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("user_info");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            localStorage.setItem(
              "user_info",
              JSON.stringify({ ...parsed, ...updatedUser })
            );
          } catch {}
        }
        const newLang = (updatedUser.language || draft.language || "").toLowerCase();
        if (newLang && ["en", "nl", "de"].includes(newLang)) {
          localStorage.setItem("haven_language", newLang);
          window.dispatchEvent(new Event("languageChange"));
          window.location.reload();
        }
      }

      setProfileSuccessMsg("Profile information updated successfully.");
      setEditing(false);
      setSelectedFile(null);
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setProfileErrorMsg(
        err?.message || "Failed to update profile. Please check your inputs."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelProfile = () => {
    if (profile) {
      setDraft({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        language: profile.language || "en",
      });
      setPreviewImage(profile.image || null);
    }
    setSelectedFile(null);
    setEditing(false);
    setProfileErrorMsg(null);
  };

  // Change Password Handler
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMsg(null);
    setPasswordSuccessMsg(null);

    if (!passwordFields.oldPassword) {
      setPasswordErrorMsg("Please enter your current password.");
      return;
    }
    if (!passwordFields.newPassword) {
      setPasswordErrorMsg("Please enter your new password.");
      return;
    }
    if (passwordFields.newPassword.length < 8) {
      setPasswordErrorMsg("New password must contain at least 8 characters.");
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordErrorMsg("New password and confirm password do not match.");
      return;
    }

    try {
      setSavingPassword(true);
      await authService.updateProfile({
        old_password: passwordFields.oldPassword,
        password: passwordFields.newPassword,
      });

      setPasswordSuccessMsg("Your password has been changed successfully.");
      setPasswordFields({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Failed to update password:", err);
      setPasswordErrorMsg(
        err?.message || "Password update failed. Please check your current password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <Spinner message="Loading your profile..." />;
  }

  const selectedLangObj = LANGUAGES.find((l) => l.code === (profile?.language || "en"));

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-displayPlayFair text-3xl font-bold text-[#1d1a17]">
          Account & Profile
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Manage your personal details, profile picture, and account security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── LEFT: Profile Information ── */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#F1EDE8] shadow-xs">
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#F1EDE8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center font-bold">
                <HiOutlineUser className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-displayPlayFair text-xl font-bold text-[#1d1a17]">
                  Personal Information
                </h2>
                <p className="text-xs text-[#64748B]">Update your public avatar and details</p>
              </div>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Success / Error Alerts */}
          {profileSuccessMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <HiOutlineCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}
          {profileErrorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-fadeIn">
              <span>{profileErrorMsg}</span>
              <button
                type="button"
                onClick={() => setProfileErrorMsg(null)}
                className="text-red-500 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Avatar Row */}
            <div className="flex items-center gap-5">
              <div className="relative">
                {previewImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewImage ? (previewImage.startsWith("blob:") || previewImage.startsWith("data:") ? previewImage : formatImageUrl(previewImage)) : ""}
                    alt={draft.name || "Avatar"}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#E8E2DC] shadow-xs"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#CFB9A3] flex items-center justify-center text-white text-3xl font-bold font-displayPlayFair shadow-xs">
                    {draft.name ? draft.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}

                {editing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-7 h-7 bg-[#8B7355] hover:bg-[#725e45] text-white rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
                      title="Upload photo"
                    >
                      <HiOutlineCamera className="w-4 h-4" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-base text-[#1d1a17]">
                  {profile?.name || "Member"}
                </h3>
                <span className="text-xs text-[#94A3B8] block">{profile?.email}</span>
                {editing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 text-xs font-semibold text-[#8B7355] hover:underline cursor-pointer"
                  >
                    Change photo (JPG, PNG)
                  </button>
                )}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  readOnly={!editing}
                  className={`w-full px-4 py-3 rounded-xl text-xs text-[#1d1a17] border transition-all ${
                    editing
                      ? "border-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 bg-white"
                      : "border-[#F1EDE8] bg-[#FAFAFA] cursor-default"
                  }`}
                  placeholder="Your Name"
                />
              </div>

              {/* Email Address (Read-Only) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wide">
                    Email Address
                  </label>
                  <span className="text-[10px] text-[#94A3B8] font-medium">Read-Only</span>
                </div>
                <input
                  type="email"
                  value={draft.email}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl text-xs text-[#64748B] border border-[#F1EDE8] bg-[#F8FAFC] cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                  readOnly={!editing}
                  className={`w-full px-4 py-3 rounded-xl text-xs text-[#1d1a17] border transition-all ${
                    editing
                      ? "border-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 bg-white"
                      : "border-[#F1EDE8] bg-[#FAFAFA] cursor-default"
                  }`}
                  placeholder="+31 6 12345678"
                />
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
                  Preferred Language
                </label>
                {editing ? (
                  <select
                    value={draft.language}
                    onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-xs text-[#1d1a17] border border-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 bg-white cursor-pointer"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={selectedLangObj?.label || draft.language || "English"}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl text-xs text-[#1d1a17] border border-[#F1EDE8] bg-[#FAFAFA] cursor-default"
                  />
                )}
              </div>

              {/* Bio / Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
                  Bio / Notes
                </label>
                <textarea
                  rows={3}
                  value={draft.bio}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  readOnly={!editing}
                  placeholder="A short note about yourself or your wellness routine..."
                  className={`w-full px-4 py-3 rounded-xl text-xs text-[#1d1a17] border transition-all resize-none ${
                    editing
                      ? "border-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 bg-white"
                      : "border-[#F1EDE8] bg-[#FAFAFA] cursor-default"
                  }`}
                />
              </div>
            </div>

            {/* Profile Action Buttons */}
            {editing && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1EDE8]">
                <button
                  type="button"
                  onClick={handleCancelProfile}
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-7 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingProfile ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* ── RIGHT: Security & Password Update ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F1EDE8] shadow-xs">
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[#F1EDE8]">
            <div className="w-10 h-10 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center font-bold">
              <HiOutlineKey className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-displayPlayFair text-xl font-bold text-[#1d1a17]">
                Change Password
              </h2>
              <p className="text-xs text-[#64748B]">Keep your account secure</p>
            </div>
          </div>

          {/* Password Success / Error Alerts */}
          {passwordSuccessMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <HiOutlineCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{passwordSuccessMsg}</span>
            </div>
          )}
          {passwordErrorMsg && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-fadeIn">
              <span>{passwordErrorMsg}</span>
              <button
                type="button"
                onClick={() => setPasswordErrorMsg(null)}
                className="text-red-500 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSavePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showOldPass ? "text" : "password"}
                  required
                  value={passwordFields.oldPassword}
                  onChange={(e) =>
                    setPasswordFields((p) => ({ ...p, oldPassword: e.target.value }))
                  }
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                >
                  {showOldPass ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  required
                  minLength={8}
                  value={passwordFields.newPassword}
                  onChange={(e) =>
                    setPasswordFields((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  placeholder="Minimum 8 characters"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                >
                  {showNewPass ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  required
                  value={passwordFields.confirmPassword}
                  onChange={(e) =>
                    setPasswordFields((p) => ({ ...p, confirmPassword: e.target.value }))
                  }
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-3 text-[#94A3B8] hover:text-[#475569] cursor-pointer"
                >
                  {showConfirmPass ? <HiOutlineEyeOff size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#94A3B8] pt-1 leading-relaxed">
              Password must be at least 8 characters long and cannot be entirely numeric.
            </p>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full mt-3 py-3 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingPassword ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
