"use client";

import { useState } from "react";
import { HiOutlineCamera } from "react-icons/hi";

const LANGUAGES = ["English", "Dutch", "French", "German", "Spanish"];

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Akash",
    email: "Akash@example.com",
    phone: "+1234567890",
    language: "English",
  });
  const [draft, setDraft] = useState({ ...profile });

  const handleSave = () => {
    setProfile({ ...draft });
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setEditing(false);
  };

  return (
    <div>
      <h1 className="font-displayPlayFair text-3xl font-bold text-[#1d1a17] mb-1">
        Profile
      </h1>
      <p className="text-sm text-[#64748B] mb-6">
        Manage your personal information
      </p>

      <div className="bg-white rounded-xl p-8 border border-[#F1EDE8] max-w-lg">

        {/* Avatar */}
        <div className="relative w-fit mb-8">
          <div className="w-20 h-20 rounded-full bg-[#D1BC9D] flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          {editing && (
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#CFB9A3] hover:bg-[#8b7355] rounded-full flex items-center justify-center transition-colors shadow">
              <HiOutlineCamera className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs text-[#64748B] mb-1.5">Full Name</label>
            <input
              type="text"
              value={editing ? draft.name : profile.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              readOnly={!editing}
              className={`w-full px-4 py-2.5 rounded-lg text-sm text-[#1d1a17] border transition-colors ${
                editing
                  ? "border-[#8b7355] focus:outline-none focus:border-[#8b7355] bg-white"
                  : "border-[#F1EDE8] bg-[#FAFAFA] cursor-default"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-[#64748B] mb-1.5">Email Address</label>
            <input
              type="email"
              value={editing ? draft.email : profile.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              readOnly={!editing}
              className={`w-full px-4 py-2.5 rounded-lg text-sm text-[#1d1a17] border transition-colors ${
                editing
                  ? "border-[#8b7355] focus:outline-none focus:border-[#8b7355] bg-white"
                  : "border-[#F1EDE8] bg-[#FAFAFA] cursor-default"
              }`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs text-[#64748B] mb-1.5">Phone</label>
            <input
              type="tel"
              value={editing ? draft.phone : profile.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              readOnly={!editing}
              className={`w-full px-4 py-2.5 rounded-lg text-sm text-[#1d1a17] border transition-colors ${
                editing
                  ? "border-[#8b7355] focus:outline-none focus:border-[#8b7355] bg-white"
                  : "border-[#F1EDE8] bg-[#FAFAFA] cursor-default"
              }`}
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-xs text-[#64748B] mb-1.5">Preferred Language</label>
            {editing ? (
              <select
                value={draft.language}
                onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-[#1d1a17] border border-[#8b7355] focus:outline-none bg-white appearance-auto"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={profile.language}
                readOnly
                className="w-full px-4 py-2.5 rounded-lg text-sm text-[#1d1a17] border border-[#F1EDE8] bg-[#FAFAFA] cursor-default"
              />
            )}
          </div>

          {/* Actions */}
          {editing ? (
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] text-sm text-[#64748B] hover:bg-[#F8F4F0] transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-lg bg-[#CFB9A3] hover:bg-[#8b7355] text-white text-sm font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="w-full py-2.5 rounded-lg bg-[#CFB9A3] hover:bg-[#8b7355] text-white text-sm font-semibold transition-colors mt-2"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
