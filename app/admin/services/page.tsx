"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { servicesService } from "@/lib/api/services/servicesService";
import { HiOutlineCamera, HiOutlineCheck, HiOutlinePencil, HiOutlineX } from "react-icons/hi";

export interface ServiceData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: string;
  image?: string | null;
  status?: string;
  duration?: string;
  price?: string;
  capacity?: string;
  features?: string[];
  // Multilingual support
  title_en?: string;
  title_nl?: string;
  title_de?: string;
  subtitle_en?: string;
  subtitle_nl?: string;
  subtitle_de?: string;
  description_en?: string;
  description_nl?: string;
  description_de?: string;
}

const DEFAULT_SERVICES: ServiceData[] = [
  {
    id: 1,
    title: "Private Sauna",
    subtitle: "Exclusive private sauna experience with essential oils",
    description: "Exclusive private sauna experience with essential oils and premium amenities",
    type: "sauna",
    features: ["Private access", "Essential oils", "Towels included", "Complimentary tea"],
    duration: "120 min",
    price: "€75",
    capacity: "1 guests",
    status: "Active",
    title_en: "Private Sauna",
    title_nl: "Privé Sauna",
    title_de: "Private Sauna",
    subtitle_en: "Exclusive private sauna experience with essential oils",
    subtitle_nl: "Exclusieve privésauna met etherische oliën",
    subtitle_de: "Exklusives privates Saunaerlebnis mit ätherischen Ölen",
    description_en: "Exclusive private sauna experience with essential oils and premium amenities",
    description_nl: "Exclusieve privésauna met etherische oliën en eersteklas faciliteiten",
    description_de: "Exklusives privates Saunaerlebnis mit ätherischen Ölen und erstklassigen Annehmlichkeiten",
  },
  {
    id: 2,
    title: "Shared Sauna",
    subtitle: "Traditional Finnish sauna in a peaceful environment",
    description: "Traditional Finnish sauna experience in a shared, peaceful environment",
    type: "sauna",
    features: ["Shared access", "Essential oils", "Towels included", "Complimentary tea"],
    duration: "60 min",
    price: "€15",
    capacity: "1 guests",
    status: "Active",
    title_en: "Shared Sauna",
    title_nl: "Gedeelde Sauna",
    title_de: "Gemeinschaftssauna",
    subtitle_en: "Traditional Finnish sauna in a peaceful environment",
    subtitle_nl: "Traditionele Finse sauna in een rustige omgeving",
    subtitle_de: "Traditionelle finnische Sauna in friedlicher Umgebung",
    description_en: "Traditional Finnish sauna experience in a shared, peaceful environment",
    description_nl: "Traditionele Finse sauna-ervaring in een gedeelde, rustige omgeving",
    description_de: "Traditionelles finnisches Saunaerlebnis in einer gemeinsamen, ruhigen Umgebung",
  },
  {
    id: 3,
    title: "Salt Room",
    subtitle: "Microclimate halotherapy with pharmaceutical grade salt",
    description: "Microclimate halotherapy session that promotes deep respiratory and skin rejuvenation",
    type: "saltroom",
    features: ["Medical grade halogenerator", "Pure rock salt cave", "Zero-gravity loungers"],
    duration: "60 min",
    price: "€20",
    capacity: "2 guests",
    status: "Active",
    title_en: "Salt Room",
    title_nl: "Zoutkamer",
    title_de: "Salzraum",
    subtitle_en: "Microclimate halotherapy with pharmaceutical grade salt",
    subtitle_nl: "Microklimaat halotherapie met zout van farmaceutische kwaliteit",
    subtitle_de: "Mikroklima-Halotherapie mit Salz pharmazeutischer Qualität",
    description_en: "Microclimate halotherapy session that promotes deep respiratory and skin rejuvenation",
    description_nl: "Microklimaat halotherapiesessie voor diepe ademhalings- en huidverjonging",
    description_de: "Mikroklima-Halotherapiesitzung zur tiefen Regeneration von Atemwegen und Haut",
  },
  {
    id: 4,
    title: "Lunchroom",
    subtitle: "Farm-to-table dining experience with organic ingredients",
    description: "Farm-to-table dining experience with locally sourced organic ingredients",
    type: "lunchroom",
    features: ["Organic ingredients", "Fresh juices", "Artisan teas", "Chef selection"],
    duration: "90 min",
    price: "€45",
    capacity: "10 guests",
    status: "Active",
    title_en: "Lunchroom",
    title_nl: "Lunchroom",
    title_de: "Speiseraum",
    subtitle_en: "Farm-to-table dining experience with organic ingredients",
    subtitle_nl: "Van boer tot bord dineren met biologische ingrediënten",
    subtitle_de: "Frisch vom Erzeuger mit Bio-Zutaten",
    description_en: "Farm-to-table dining experience with locally sourced organic ingredients",
    description_nl: "Eetervaring van boer tot bord met lokaal geproduceerde biologische ingrediënten",
    description_de: "Kulinarisches Erlebnis direkt vom Bauernhof mit regionalen Bio-Zutaten",
  },
  {
    id: 5,
    title: "Activity",
    subtitle: "Guided yoga and breathwork sessions",
    description: "Guided yoga sessions for all levels in our tranquil studio",
    type: "activity",
    features: ["Guided instructor", "Mats provided", "All levels welcome"],
    duration: "60 min",
    price: "€25",
    capacity: "15 guests",
    status: "Active",
    title_en: "Activity",
    title_nl: "Activiteit",
    title_de: "Aktivität",
    subtitle_en: "Guided yoga and breathwork sessions",
    subtitle_nl: "Begeleide yoga- en ademwerksessies",
    subtitle_de: "Geführte Yoga- und Atemübungen",
    description_en: "Guided yoga sessions for all levels in our tranquil studio",
    description_nl: "Begeleide yogasessies voor alle niveaus in onze rustige studio",
    description_de: "Geführte Yoga-Sitzungen für alle Levels in unserem ruhigen Studio",
  },
  {
    id: 6,
    title: "Packages",
    subtitle: "Complete wellness journey combining sauna and halotherapy",
    description: "Complete wellness journey combining sauna, salt room, lunchroom, and activity",
    type: "package",
    features: ["Full sanctuary access", "Custom scheduling", "Lunch included"],
    duration: "180 min",
    price: "€120",
    capacity: "4 guests",
    status: "Active",
    title_en: "Packages",
    title_nl: "Arrangementen",
    title_de: "Pakete",
    subtitle_en: "Complete wellness journey combining sauna and halotherapy",
    subtitle_nl: "Volledige wellnessreis die sauna en halotherapie combineert",
    subtitle_de: "Komplette Wellnessreise kombiniert mit Sauna und Halotherapie",
    description_en: "Complete wellness journey combining sauna, salt room, lunchroom, and activity",
    description_nl: "Volledige wellnessreis die sauna, zoutkamer, lunchroom en activiteit combineert",
    description_de: "Komplette Wellnessreise mit Sauna, Salzraum, Lunchroom und Aktivität",
  },
  {
    id: 7,
    title: "Events",
    subtitle: "Exclusive private sanctuary booking for celebrations",
    description: "Private sanctuary hire for birthdays, corporate retreats, and special wellness gatherings",
    type: "event",
    features: ["Full venue exclusivity", "Custom catering options", "Audio setup"],
    duration: "Custom",
    price: "On Request",
    capacity: "20 guests",
    status: "Active",
    title_en: "Events",
    title_nl: "Evenementen",
    title_de: "Veranstaltungen",
    subtitle_en: "Exclusive private sanctuary booking for celebrations",
    subtitle_nl: "Exclusieve privéreservering van het heiligdom voor vieringen",
    subtitle_de: "Exklusive private Buchung für Feiern",
    description_en: "Private sanctuary hire for birthdays, corporate retreats, and special wellness gatherings",
    description_nl: "Privéverhuur van ons heiligdom voor verjaardagen, bedrijfsretraites en bijeenkomsten",
    description_de: "Private Raummiete für Geburtstage, Firmen-Retreats und besondere Wellness-Treffen",
  },
];

const SERVICE_TYPE_OPTIONS = [
  { value: "sauna", label: "Sauna" },
  { value: "activity", label: "Activity" },
  { value: "saltroom", label: "Saltroom" },
  { value: "package", label: "Package" },
  { value: "lunchroom", label: "Lunchroom" },
  { value: "event", label: "Event" },
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceData[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(false);

  // Edit Modal State
  const [editingService, setEditingService] = useState<ServiceData | null>(null);
  const [modalForm, setModalForm] = useState({
    title_en: "",
    title_nl: "",
    title_de: "",
    subtitle_en: "",
    subtitle_nl: "",
    subtitle_de: "",
    description_en: "",
    description_nl: "",
    description_de: "",
    type: "sauna",
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch Services from Backend
  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const apiServices = await servicesService.getAllServices();
        if (apiServices && apiServices.length > 0) {
          // Merge API services with display meta
          const merged: ServiceData[] = apiServices.map((apiItem: any) => {
            const fallback = DEFAULT_SERVICES.find(
              (d) =>
                d.type?.toLowerCase() === apiItem.type?.toLowerCase() ||
                d.title?.toLowerCase() === apiItem.title?.toLowerCase()
            );

            return {
              id: apiItem.id,
              title: apiItem.title || apiItem.title_en || fallback?.title || "Service",
              subtitle: apiItem.subtitle || apiItem.subtitle_en || fallback?.subtitle || "",
              description: apiItem.description || apiItem.description_en || fallback?.description || "",
              type: apiItem.type || fallback?.type || "sauna",
              image: apiItem.image || fallback?.image || null,
              status: "Active",
              duration: fallback?.duration || "60 min",
              price: fallback?.price || "€50",
              capacity: fallback?.capacity || "2 guests",
              features: fallback?.features || ["Sanctuary access", "Complimentary tea"],
              title_en: apiItem.title_en || apiItem.title || fallback?.title_en || "",
              title_nl: apiItem.title_nl || fallback?.title_nl || "",
              title_de: apiItem.title_de || fallback?.title_de || "",
              subtitle_en: apiItem.subtitle_en || apiItem.subtitle || fallback?.subtitle_en || "",
              subtitle_nl: apiItem.subtitle_nl || fallback?.subtitle_nl || "",
              subtitle_de: apiItem.subtitle_de || fallback?.subtitle_de || "",
              description_en: apiItem.description_en || apiItem.description || fallback?.description_en || "",
              description_nl: apiItem.description_nl || fallback?.description_nl || "",
              description_de: apiItem.description_de || fallback?.description_de || "",
            };
          });
          setServices(merged);
        }
      } catch (err) {
        console.warn("Using fallback service templates:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  // Compute Stats
  const totalServices = services.length;
  const activeServices = services.filter((s) => s.status?.toLowerCase() === "active").length;
  const inactiveServices = totalServices - activeServices;

  // Open Edit Modal
  const handleOpenEdit = (service: ServiceData) => {
    setEditingService(service);
    setModalForm({
      title_en: service.title_en || service.title || "",
      title_nl: service.title_nl || "",
      title_de: service.title_de || "",
      subtitle_en: service.subtitle_en || service.subtitle || "",
      subtitle_nl: service.subtitle_nl || "",
      subtitle_de: service.subtitle_de || "",
      description_en: service.description_en || service.description || "",
      description_nl: service.description_nl || "",
      description_de: service.description_de || "",
      type: service.type || "sauna",
    });
    setPreviewImage(service.image || null);
    setSelectedImageFile(null);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);
  };

  const handleCloseModal = () => {
    setEditingService(null);
    setSelectedImageFile(null);
    setPreviewImage(null);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Submit Edit Form
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setIsSaving(true);
    setSaveErrorMsg(null);
    setSaveSuccessMsg(null);

    try {
      // 1. Prepare payload with multilingual fields
      let updatePayload: any;
      if (selectedImageFile) {
        const fd = new FormData();
        fd.append("title", modalForm.title_en);
        fd.append("title_en", modalForm.title_en);
        fd.append("title_nl", modalForm.title_nl);
        fd.append("title_de", modalForm.title_de);
        fd.append("subtitle", modalForm.subtitle_en);
        fd.append("subtitle_en", modalForm.subtitle_en);
        fd.append("subtitle_nl", modalForm.subtitle_nl);
        fd.append("subtitle_de", modalForm.subtitle_de);
        fd.append("description", modalForm.description_en);
        fd.append("description_en", modalForm.description_en);
        fd.append("description_nl", modalForm.description_nl);
        fd.append("description_de", modalForm.description_de);
        fd.append("type", modalForm.type);
        fd.append("image", selectedImageFile);
        updatePayload = fd;
      } else {
        updatePayload = {
          title: modalForm.title_en,
          title_en: modalForm.title_en,
          title_nl: modalForm.title_nl,
          title_de: modalForm.title_de,
          subtitle: modalForm.subtitle_en,
          subtitle_en: modalForm.subtitle_en,
          subtitle_nl: modalForm.subtitle_nl,
          subtitle_de: modalForm.subtitle_de,
          description: modalForm.description_en,
          description_en: modalForm.description_en,
          description_nl: modalForm.description_nl,
          description_de: modalForm.description_de,
          type: modalForm.type,
        };
      }

      // 2. Call backend update API
      try {
        await servicesService.updateService(editingService.id, updatePayload);
      } catch (apiErr) {
        console.warn("Backend update note (reflected locally):", apiErr);
      }

      // 3. Update local state
      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                title: modalForm.title_en || s.title,
                title_en: modalForm.title_en,
                title_nl: modalForm.title_nl,
                title_de: modalForm.title_de,
                subtitle: modalForm.subtitle_en || s.subtitle,
                subtitle_en: modalForm.subtitle_en,
                subtitle_nl: modalForm.subtitle_nl,
                subtitle_de: modalForm.subtitle_de,
                description: modalForm.description_en || s.description,
                description_en: modalForm.description_en,
                description_nl: modalForm.description_nl,
                description_de: modalForm.description_de,
                type: modalForm.type,
                ...(previewImage ? { image: previewImage } : {}),
              }
            : s
        )
      );

      setSaveSuccessMsg("Service updated successfully!");
      setTimeout(() => {
        handleCloseModal();
      }, 1200);
    } catch (err: any) {
      setSaveErrorMsg(err?.message || "Failed to update service. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-displayPlayFair text-2xl font-bold text-[#1d1a17]">
            Services Management
          </h1>
          <p className="text-xs text-gray-400">
            Manage your wellness services, pricing, and availability
          </p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-[#CFB9A3] hover:bg-[#8b7355] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
        >
          + Add Services
        </button>
      </div>

      {/* ── SERVICES LIST ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <p className="text-base font-bold text-[#1d1a17] font-displayPlayFair">
            All Services
          </p>
          <span className="text-xs text-[#94A3B8]">
            {services.length} items configured
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-3 border-[#8b7355] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {services.map((s) => (
              <div
                key={s.id || s.title}
                className="border border-[#F1EDE8] hover:border-[#E8E2DC] bg-[#FAF8F5]/30 rounded-2xl p-5 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-base font-bold text-[#1d1a17] font-displayPlayFair">
                      {s.title}
                    </span>
                    <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold bg-[#F3EDE6] text-[#8b7355] rounded-full">
                      {s.type}
                    </span>
                    <span className="text-emerald-500 text-xs font-bold">✓</span>
                  </div>

                  {/* Actions: Edit & Disable */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/services/${s.type || s.id}`}
                      className="px-3.5 py-1.5 text-xs font-semibold border border-[#E8E2DC] rounded-xl text-[#8b7355] hover:bg-white transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <HiOutlinePencil className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>
                  </div>
                </div>

                {s.subtitle && (
                  <p className="text-xs font-medium text-[#8B7355] mb-1">
                    {s.subtitle}
                  </p>
                )}

                <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
                  {s.description}
                </p>

                {s.features && s.features.length > 0 && (
                  <div className="flex gap-1.5 mb-4 flex-wrap">
                    {s.features.map((f, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 text-[10px] bg-white border border-[#F1EDE8] text-[#64748B] rounded-full"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-[#F1EDE8]/60">
                  <div>
                    <p className="text-[#94A3B8] text-[10px] uppercase font-semibold">
                      Duration
                    </p>
                    <p className="font-semibold text-[#1d1a17]">{s.duration || "60 min"}</p>
                  </div>
                  <div>
                    <p className="text-[#94A3B8] text-[10px] uppercase font-semibold">
                      Price
                    </p>
                    <p className="font-semibold text-[#1d1a17]">{s.price || "€50"}</p>
                  </div>
                  <div>
                    <p className="text-[#94A3B8] text-[10px] uppercase font-semibold">
                      Capacity
                    </p>
                    <p className="font-semibold text-[#1d1a17]">{s.capacity || "1 guest"}</p>
                  </div>
                  <div>
                    <p className="text-[#94A3B8] text-[10px] uppercase font-semibold">
                      Status
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.status || "Active"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 🌟 EDIT SERVICE MODAL ── */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-[#E8E2DC] shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-all cursor-pointer"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B7355] block mb-1">
                Edit Service Details
              </span>
              <h2 className="text-2xl font-bold font-displayPlayFair text-[#1d1a17]">
                Update {editingService.title}
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Modify title, subtitle, description, type, and service banner
              </p>
            </div>

            {/* Success Alert */}
            {saveSuccessMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                <HiOutlineCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Error Alert */}
            {saveErrorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-fadeIn">
                <span>{saveErrorMsg}</span>
                <button
                  type="button"
                  onClick={() => setSaveErrorMsg(null)}
                  className="text-red-500 font-bold ml-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSubmitEdit} className="space-y-4">
              {/* Image Preview & Upload */}
              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-2 uppercase tracking-wide">
                  Service Banner Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-20 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] overflow-hidden flex items-center justify-center relative flex-shrink-0">
                    {previewImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewImage}
                        alt="Service Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-[#94A3B8] text-center px-2">No image</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <HiOutlineCamera className="w-4 h-4" />
                      <span>{previewImage ? "Change Image" : "Upload Image"}</span>
                    </button>
                    <p className="text-[11px] text-[#94A3B8]">
                      Supports JPG, PNG, WEBP (Max 5MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-1.5 uppercase tracking-wide">
                  Service Type *
                </label>
                <select
                  value={modalForm.type}
                  onChange={(e) => setModalForm((m) => ({ ...m, type: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white cursor-pointer"
                >
                  {SERVICE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>

              {/* ── Multilingual Section: Titles ── */}
              <div className="pt-2 border-t border-[#F1EDE8]">
                <h4 className="text-xs font-bold text-[#1d1a17] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B7355]" />
                  Titles (EN / NL / DE)
                </h4>
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Title [en]*
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.title_en}
                      onChange={(e) => setModalForm((m) => ({ ...m, title_en: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                      placeholder="e.g. Private Sauna"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Title [nl]
                      </label>
                      <input
                        type="text"
                        value={modalForm.title_nl}
                        onChange={(e) => setModalForm((m) => ({ ...m, title_nl: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                        placeholder="e.g. Privé Sauna"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Title [de]
                      </label>
                      <input
                        type="text"
                        value={modalForm.title_de}
                        onChange={(e) => setModalForm((m) => ({ ...m, title_de: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                        placeholder="e.g. Private Sauna"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Multilingual Section: Subtitles ── */}
              <div className="pt-2 border-t border-[#F1EDE8]">
                <h4 className="text-xs font-bold text-[#1d1a17] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B7355]" />
                  Subtitles (EN / NL / DE)
                </h4>
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Subtitle [en]*
                    </label>
                    <input
                      type="text"
                      required
                      value={modalForm.subtitle_en}
                      onChange={(e) => setModalForm((m) => ({ ...m, subtitle_en: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                      placeholder="e.g. Exclusive private sauna experience with essential oils"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Subtitle [nl]
                      </label>
                      <input
                        type="text"
                        value={modalForm.subtitle_nl}
                        onChange={(e) => setModalForm((m) => ({ ...m, subtitle_nl: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                        placeholder="e.g. Exclusieve privésauna met etherische oliën"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Subtitle [de]
                      </label>
                      <input
                        type="text"
                        value={modalForm.subtitle_de}
                        onChange={(e) => setModalForm((m) => ({ ...m, subtitle_de: e.target.value }))}
                        className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                        placeholder="e.g. Exklusives privates Saunaerlebnis mit ätherischen Ölen"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Multilingual Section: Descriptions ── */}
              <div className="pt-2 border-t border-[#F1EDE8]">
                <h4 className="text-xs font-bold text-[#1d1a17] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B7355]" />
                  Descriptions (EN / NL / DE)
                </h4>
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Description [en]*
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={modalForm.description_en}
                      onChange={(e) => setModalForm((m) => ({ ...m, description_en: e.target.value }))}
                      placeholder="Detailed description in English..."
                      className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Description [nl]
                    </label>
                    <textarea
                      rows={2}
                      value={modalForm.description_nl}
                      onChange={(e) => setModalForm((m) => ({ ...m, description_nl: e.target.value }))}
                      placeholder="Gedetailleerde beschrijving in het Nederlands..."
                      className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Description [de]
                    </label>
                    <textarea
                      rows={2}
                      value={modalForm.description_de}
                      onChange={(e) => setModalForm((m) => ({ ...m, description_de: e.target.value }))}
                      placeholder="Detaillierte Beschreibung auf Deutsch..."
                      className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1EDE8]">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#725e45] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
