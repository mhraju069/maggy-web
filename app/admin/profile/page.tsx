"use client";

import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@serene.com",
    phone: "+1234567890",
    role: "Administrator",
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  const handleEdit = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="font-displayPlayFair text-3xl font-bold text-[#1d1a17]">Profile</h1>
        <p className="text-sm text-gray-500 mt-1 font-cambria">Your admin account information</p>
      </div>

      <div className="bg-white border border-[#E8E2DC] rounded-2xl p-8 shadow-sm max-w-lg">
        {/* ── User Header Section ── */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#F1EDE8]">
          <div className="w-20 h-20 rounded-full bg-[#D4C3B3] flex items-center justify-center text-white text-3xl font-displayPlayFair shadow-md flex-shrink-0">
            {profile.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-[#1d1a17] font-cambria">{profile.name}</h2>
            <p className="text-sm text-gray-500 font-cambria">{"admin@heaven.com"}</p>
            <span className="inline-block bg-[#4A5568] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {profile.role}
            </span>
          </div>
        </div>

        {/* ── Info Form ── */}
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 font-cambria">
              {isEditing ? "Full Name" : "Name"}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={tempProfile.name}
                onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                className="w-full border border-[#E8E2DC] rounded-lg px-4 py-3 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors font-cambria"
              />
            ) : (
              <div className="w-full bg-[#F5F0EB] rounded-lg px-4 py-3 text-sm text-[#1d1a17] font-cambria">
                {profile.name}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 font-cambria">
              {isEditing ? "Email Address" : "Email"}
            </label>
            {isEditing ? (
              <input
                type="email"
                value={tempProfile.email}
                onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                className="w-full border border-[#E8E2DC] rounded-lg px-4 py-3 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors font-cambria"
              />
            ) : (
              <div className="w-full bg-[#F5F0EB] rounded-lg px-4 py-3 text-sm text-[#1d1a17] font-cambria">
                {profile.email}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 font-cambria">Phone</label>
            {isEditing ? (
              <input
                type="text"
                value={tempProfile.phone}
                onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                className="w-full border border-[#E8E2DC] rounded-lg px-4 py-3 text-sm text-[#1d1a17] focus:outline-none focus:border-[#CFB9A3] transition-colors font-cambria"
              />
            ) : (
              <div className="w-full bg-[#F5F0EB] rounded-lg px-4 py-3 text-sm text-[#1d1a17] font-cambria">
                {profile.phone}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 font-cambria">Role</label>
            {isEditing ? (
              <div className="relative">
                <select
                  value={tempProfile.role}
                  onChange={(e) => setTempProfile({ ...tempProfile, role: e.target.value })}
                  className="w-full border border-[#E8E2DC] rounded-lg px-4 py-3 text-sm text-[#1d1a17] focus:outline-none appearance-none transition-colors font-cambria cursor-pointer"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <MdKeyboardArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            ) : (
              <div className="w-full bg-[#F5F0EB] rounded-lg px-4 py-3 text-sm text-[#1d1a17] font-cambria">
                {profile.role}
              </div>
            )}
          </div>

          {/* ── Buttons ── */}
          <div className="pt-4 flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 border border-[#E8E2DC] rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors font-cambria"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-[#CFB9A3] hover:bg-[#BBA791] text-white rounded-2xl text-sm font-semibold shadow-sm transition-colors font-cambria"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="w-full py-3 bg-[#CFB9A3] hover:bg-[#BBA791] text-white rounded-2xl text-sm font-semibold shadow-md transition-colors font-cambria"
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
