"use client";

import { Activity, deleteActivity, getActivities, saveActivity } from "@/lib/activitiesStore";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { BiCalendar, BiPlus, BiTrash } from "react-icons/bi";
import { FaChalkboardTeacher, FaEdit, FaTimes } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filterType, setFilterType] = useState<"all" | "recurring" | "onetime">("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: "",
    category: "Yoga",
    description: "",
    date: "",
    startTime: "08:00",
    endTime: "09:30",
    price: 40,
    maxParticipants: 12,
    bookedParticipants: 0,
    teacherHost: "",
    additionalInfo: "",
    isRecurring: true,
    image: "/images/activities/weeklyschedule/img1.png",
  });

  const loadActivities = () => {
    setActivities(getActivities());
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: "Yoga",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "08:00",
      endTime: "09:30",
      price: 40,
      maxParticipants: 12,
      bookedParticipants: 0,
      teacherHost: "",
      additionalInfo: "Mats and props provided.",
      isRecurring: true,
      image: "/images/activities/weeklyschedule/img1.png",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (act: Activity) => {
    setEditingId(act.id);
    setFormData({ ...act });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      deleteActivity(id);
      loadActivities();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.teacherHost || !formData.date) {
      alert("Please fill in Name, Teacher/Host, and Date/Schedule.");
      return;
    }

    const activityToSave: Activity = {
      id: editingId || `act-${Date.now()}`,
      name: formData.name || "Untitled Activity",
      category: (formData.category as Activity["category"]) || "Yoga",
      description: formData.description || "",
      date: formData.date || "",
      startTime: formData.startTime || "08:00",
      endTime: formData.endTime || "09:00",
      price: Number(formData.price) || 0,
      maxParticipants: Number(formData.maxParticipants) || 10,
      bookedParticipants: Number(formData.bookedParticipants) || 0,
      teacherHost: formData.teacherHost || "",
      additionalInfo: formData.additionalInfo || "",
      isRecurring: Boolean(formData.isRecurring),
      image: formData.image || "/images/activities/weeklyschedule/img1.png",
    };

    saveActivity(activityToSave);
    loadActivities();
    setIsModalOpen(false);
  };

  const filtered = activities.filter((a) => {
    if (filterType === "recurring") return a.isRecurring;
    if (filterType === "onetime") return !a.isRecurring;
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-displayPlayFair text-3xl font-bold text-[#1d1a17]">
            Activities & Events Management
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Create and edit recurring classes (Yoga, Breathwork) and one-time special events.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-3 bg-[#8B7355] hover:bg-[#725E45] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <BiPlus size={18} />
          <span>+ Create New Activity</span>
        </button>
      </div>

      {/* Filter Tabs & Stats */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#E8E2DC] shadow-xs">
        <div className="flex gap-2">
          {(["all", "recurring", "onetime"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filterType === type
                  ? "bg-[#8B7355] text-white"
                  : "bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9]"
                }`}
            >
              {type === "all" ? "All Activities" : type === "recurring" ? "Recurring Classes" : "One-Time Events"}
            </button>
          ))}
        </div>

        <div className="text-xs font-medium text-[#64748B]">
          Showing <strong>{filtered.length}</strong> activities
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-[#FCF2E9] text-[#8B7355] font-bold text-[10px] rounded-full">
                  {act.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${act.isRecurring ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}
                >
                  {act.isRecurring ? "Recurring" : "One-Time"}
                </span>
              </div>

              <h3 className="font-displayPlayFair text-xl font-bold text-[#0F172A]">
                {act.name}
              </h3>

              <p className="text-xs text-[#64748B] line-clamp-2">{act.description}</p>

              <div className="space-y-1.5 pt-2 border-t border-[#F1F5F9] text-xs text-[#475569]">
                <div className="flex items-center gap-2">
                  <FaChalkboardTeacher className="text-[#8B7355]" />
                  <span>Host: <strong>{act.teacherHost}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <BiCalendar className="text-[#8B7355]" />
                  <span>{act.date} ({act.startTime} – {act.endTime})</span>
                </div>
                <div className="flex items-center gap-2">
                  <LuUsers className="text-[#8B7355]" />
                  <span>Max {act.maxParticipants} participants ({act.maxParticipants - act.bookedParticipants} remaining)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between">
              <span className="text-xl font-bold font-displayPlayFair text-[#8B7355]">
                €{act.price}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEditModal(act)}
                  className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#8B7355] hover:text-white hover:border-[#8B7355] text-[#475569] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
                >
                  <FaEdit size={12} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(act.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete Activity"
                >
                  <BiTrash size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-[#E8E2DC] space-y-6 my-8">
            <div className="flex justify-between items-center pb-4 border-b border-[#E8E2DC]">
              <h2 className="text-xl md:text-2xl font-bold font-displayPlayFair text-[#0F172A]">
                {editingId ? "Edit Activity / Class" : "Create New Activity / Event"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#64748B] hover:text-[#0F172A]"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs text-[#0F172A]">
              {/* Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Activity Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Morning Flow Yoga"
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={formData.category || "Yoga"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none"
                  >
                    <option value="Yoga">Yoga</option>
                    <option value="Breathwork">Breathwork</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Special classes">Special classes</option>
                    <option value="One-time activities">One-time activities</option>
                    <option value="Event evenings">Event evenings</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of practice or event..."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none"
                />
              </div>

              {/* Recurring vs One-time & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Schedule Type</label>
                  <select
                    value={formData.isRecurring ? "recurring" : "onetime"}
                    onChange={(e) =>
                      setFormData({ ...formData, isRecurring: e.target.value === "recurring" })
                    }
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none font-bold"
                  >
                    <option value="recurring">Recurring (Weekly Schedule)</option>
                    <option value="onetime">One-Time Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Date / Session Schedule *</label>
                  <input
                    type="text"
                    required
                    value={formData.date || ""}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. 2026-10-25 or Every Mon & Wed"
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none"
                  />
                </div>
              </div>

              {/* Times & Price */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold mb-1">Start Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.startTime || "08:00"}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="08:00"
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">End Time *</label>
                  <input
                    type="text"
                    required
                    value={formData.endTime || "09:30"}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="09:30"
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Price (€) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={0.01}
                    value={formData.price ?? 40}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none font-bold"
                  />
                </div>
              </div>

              {/* Max Capacity & Host */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Max Participants *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.maxParticipants ?? 12}
                    onChange={(e) =>
                      setFormData({ ...formData, maxParticipants: parseInt(e.target.value, 10) })
                    }
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Teacher / Host *</label>
                  <input
                    type="text"
                    required
                    value={formData.teacherHost || ""}
                    onChange={(e) => setFormData({ ...formData, teacherHost: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <label className="block font-bold mb-1">Any Additional Information</label>
                <textarea
                  rows={2}
                  value={formData.additionalInfo || ""}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  placeholder="Special instructions, mats provided, clothes requirement, etc."
                  className="w-full p-3 rounded-xl border border-[#E2E8F0] focus:border-[#8B7355] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E2DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-[#E2E8F0] text-[#64748B] font-bold hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-[#8B7355] hover:bg-[#725E45] text-white font-bold transition-all shadow-md"
                >
                  {editingId ? "Save Changes" : "Create Activity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
