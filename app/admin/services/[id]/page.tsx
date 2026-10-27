"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { servicesService } from "@/lib/api/services/servicesService";
import {
  HiOutlineArrowLeft,
  HiOutlineCamera,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineCog,
  HiOutlineInformationCircle,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineX,
  HiOutlineSparkles,
  HiOutlineCollection,
  HiOutlineCalendar,
  HiOutlineUser,
} from "react-icons/hi";

interface PageProps {
  params: Promise<{ id: string }>;
}

export interface OpeningHourItem {
  id?: number;
  week_days: string[];
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

const ALL_WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AdminEditServicePage({ params }: PageProps) {
  const unwrappedParams = use(params);
  const serviceIdOrType = unwrappedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Raw data from backend
  const [serviceData, setServiceData] = useState<any>(null);
  const [detailsData, setDetailsData] = useState<any>(null);

  // ═════════════════════════════════════════════════════════════════════
  // SECTION 1: Service Details form
  // ═════════════════════════════════════════════════════════════════════
  const [detailsForm, setDetailsForm] = useState({
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [detailsSuccessMsg, setDetailsSuccessMsg] = useState<string | null>(null);
  const [detailsErrorMsg, setDetailsErrorMsg] = useState<string | null>(null);
  const [deleteServiceDialogOpen, setDeleteServiceDialogOpen] = useState(false);
  const [isDeletingCurrentService, setIsDeletingCurrentService] = useState(false);

  // ═════════════════════════════════════════════════════════════════════
  // SECTION 2: Opening Hours (ServiceSettings)
  // ═════════════════════════════════════════════════════════════════════
  const [openingHoursList, setOpeningHoursList] = useState<OpeningHourItem[]>([]);
  const [isSavingHours, setIsSavingHours] = useState(false);
  const [hoursSuccessMsg, setHoursSuccessMsg] = useState<string | null>(null);
  const [hoursErrorMsg, setHoursErrorMsg] = useState<string | null>(null);

  // ═════════════════════════════════════════════════════════════════════
  // SECTION 3: Service Settings (Sauna & Saltroom inline)
  // ═════════════════════════════════════════════════════════════════════
  const [saunaSettings, setSaunaSettings] = useState({
    base_price_3hrs: "75.00",
    base_price_4hrs: "100.00",
    max_person: 6,
    extra_person_price: "15.00",
    is_available_private: true,
    price_per_person: "15.00",
    max_person_shared: 6,
    is_available_shared: true,
  });

  const [saltroomSettings, setSaltroomSettings] = useState({
    max_capacity: 2,
    price_per_person: "25.00",
    duration_minutes: 60,
    buffer_minutes: 10,
  });

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccessMsg, setSettingsSuccessMsg] = useState<string | null>(null);
  const [settingsErrorMsg, setSettingsErrorMsg] = useState<string | null>(null);

  // Dedicated states for VIP Sauna and Sauna
  const [isSavingPrivateSauna, setIsSavingPrivateSauna] = useState(false);
  const [privateSaunaSuccessMsg, setPrivateSaunaSuccessMsg] = useState<string | null>(null);
  const [privateSaunaErrorMsg, setPrivateSaunaErrorMsg] = useState<string | null>(null);

  const [isSavingSharedSauna, setIsSavingSharedSauna] = useState(false);
  const [sharedSaunaSuccessMsg, setSharedSaunaSuccessMsg] = useState<string | null>(null);
  const [sharedSaunaErrorMsg, setSharedSaunaErrorMsg] = useState<string | null>(null);

  // ═════════════════════════════════════════════════════════════════════
  // SERVICE FEATURES STATE: VIP Sauna, Sauna & Salt Room
  // ═════════════════════════════════════════════════════════════════════
  const [privateSaunaFeatures, setPrivateSaunaFeatures] = useState<any[]>([]);
  const [sharedSaunaFeatures, setSharedSaunaFeatures] = useState<any[]>([]);
  const [saltroomFeatures, setSaltroomFeatures] = useState<any[]>([]);

  // Feature Add / Edit Modal state
  interface FeatureModalTarget {
    service_type: "sauna" | "saltroom";
    sub_type?: "private" | "shared";
    sectionName: string;
  }
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [featureModalTarget, setFeatureModalTarget] = useState<FeatureModalTarget | null>(null);
  const [editingFeature, setEditingFeature] = useState<any | null>(null);
  const [featureForm, setFeatureForm] = useState({
    feature_en: "",
    feature_nl: "",
    feature_de: "",
    price: "0.00",
  });
  const [isSavingFeature, setIsSavingFeature] = useState(false);
  const [featureModalError, setFeatureModalError] = useState<string | null>(null);
  const [featureSuccessToast, setFeatureSuccessToast] = useState<string | null>(null);

  // Feature Delete Confirmation
  const [featureToDelete, setFeatureToDelete] = useState<{
    id: number;
    title: string;
    service_type: "sauna" | "saltroom";
    sub_type?: "private" | "shared";
  } | null>(null);
  const [isDeletingFeature, setIsDeletingFeature] = useState(false);

  // ═════════════════════════════════════════════════════════════════════
  // MULTI-ITEMS STATE: Activities & Packages
  // ═════════════════════════════════════════════════════════════════════
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const [packagesList, setPackagesList] = useState<any[]>([]);

  // Modal State: Activity
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedActivityImage, setSelectedActivityImage] = useState<File | null>(null);
  const [previewActivityImage, setPreviewActivityImage] = useState<string | null>(null);
  const activityFileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingActivityIndex, setEditingActivityIndex] = useState<number | null>(null); // null = create new
  const [isSavingActivityModal, setIsSavingActivityModal] = useState(false);
  const [activityModalError, setActivityModalError] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({
    activity_id: 0,
    capacity: 10,
    price: "15.00",
    host: "",
    open_time: "06:00",
    close_time: "12:00",
    date: "",
    is_available: true,
    title_en: "",
    title_nl: "",
    title_de: "",
    description_en: "",
    description_nl: "",
    description_de: "",
    additional_notes_en: "",
    additional_notes_nl: "",
    additional_notes_de: "",
  });
  const [activityFeatures, setActivityFeatures] = useState<
    { id?: number; feature: string; feature_en: string; feature_nl: string; feature_de: string }[]
  >([]);

  // Modal State: Package
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedPackageImage, setSelectedPackageImage] = useState<File | null>(null);
  const [previewPackageImage, setPreviewPackageImage] = useState<string | null>(null);
  const packageFileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingPackageIndex, setEditingPackageIndex] = useState<number | null>(null); // null = create new
  const [isSavingPackageModal, setIsSavingPackageModal] = useState(false);
  const [packageModalError, setPackageModalError] = useState<string | null>(null);
  const [packageForm, setPackageForm] = useState({
    package_id: 0,
    price: "180.00",
    included_packages: ["private_sauna", "lunchroom", "activity", "saltroom"],
    title_en: "",
    title_nl: "",
    title_de: "",
    description_en: "",
    description_nl: "",
    description_de: "",
  });
  const [packageFeatures, setPackageFeatures] = useState<
    { id?: number; feature: string; feature_en: string; feature_nl: string; feature_de: string }[]
  >([]);

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<{
    type: "activity" | "package";
    id: number;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ═════════════════════════════════════════════════════════════════════
  // DATA FETCHING & REFRESH
  // ═════════════════════════════════════════════════════════════════════
  const reloadData = async () => {
    try {
      const res = await servicesService.getAdminServiceDetail(serviceIdOrType);
      if (res && res.success && res.service) {
        const s = res.service;
        setServiceData(s);
        setDetailsData(res.details || {});

        const det = res.details || {};

        if (s.type === "sauna") {
          const priv = Array.isArray(det.private_sauna) ? det.private_sauna[0] : (det.private_sauna || {});
          const shared = Array.isArray(det.shared_sauna) ? det.shared_sauna[0] : (det.shared_sauna || {});
          setSaunaSettings({
            base_price_3hrs: priv.base_price_3hrs || "75.00",
            base_price_4hrs: priv.base_price_4hrs || "100.00",
            max_person: priv.max_person ?? 6,
            extra_person_price: priv.extra_person_price || "15.00",
            is_available_private: priv.is_available ?? true,
            price_per_person: shared.price_per_person || "15.00",
            max_person_shared: shared.max_person ?? 6,
            is_available_shared: shared.is_available ?? true,
          });
          setPrivateSaunaFeatures(Array.isArray(priv.features) ? priv.features : []);
          setSharedSaunaFeatures(Array.isArray(shared.features) ? shared.features : []);
        } else if (s.type === "saltroom") {
          const sr = Array.isArray(det.saltroom) ? det.saltroom[0] : (det.saltroom || {});
          setSaltroomSettings({
            max_capacity: sr.max_capacity ?? 2,
            price_per_person: sr.price_per_person || "25.00",
            duration_minutes: sr.duration_minutes ?? 60,
            buffer_minutes: sr.buffer_minutes ?? 10,
          });
          setSaltroomFeatures(Array.isArray(sr.features) ? sr.features : []);
        }

        if (Array.isArray(det.activities)) {
          setActivitiesList(det.activities);
        }
        if (Array.isArray(det.packages)) {
          setPackagesList(det.packages);
        }
      }
    } catch (err) {
      console.error("Failed to reload service details:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await servicesService.getAdminServiceDetail(serviceIdOrType);
        if (res && res.success && res.service) {
          const s = res.service;
          setServiceData(s);
          setDetailsData(res.details || {});

          // Populate Opening Hours
          if (res.settings && Array.isArray(res.settings) && res.settings.length > 0) {
            setOpeningHoursList(
              res.settings.map((it: any) => ({
                id: it.id,
                week_days: Array.isArray(it.week_days) ? it.week_days : [],
                open_time: it.open_time || "09:00",
                close_time: it.close_time || "21:00",
                is_closed: Boolean(it.is_closed),
              }))
            );
          } else {
            setOpeningHoursList([
              {
                week_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                open_time: "09:00",
                close_time: "21:00",
                is_closed: false,
              },
            ]);
          }

          setDetailsForm({
            title_en: s.title_en || s.title || "",
            title_nl: s.title_nl || "",
            title_de: s.title_de || "",
            subtitle_en: s.subtitle_en || s.subtitle || "",
            subtitle_nl: s.subtitle_nl || "",
            subtitle_de: s.subtitle_de || "",
            description_en: s.description_en || s.description || "",
            description_nl: s.description_nl || "",
            description_de: s.description_de || "",
            type: s.type || "sauna",
          });
          setPreviewImage(s.image || null);

          // Populate Service Settings & Features according to type
          const det = res.details || {};
          if (s.type === "sauna") {
            const priv = Array.isArray(det.private_sauna) ? det.private_sauna[0] : (det.private_sauna || {});
            const shared = Array.isArray(det.shared_sauna) ? det.shared_sauna[0] : (det.shared_sauna || {});
            setSaunaSettings({
              base_price_3hrs: priv.base_price_3hrs || "75.00",
              base_price_4hrs: priv.base_price_4hrs || "100.00",
              max_person: priv.max_person ?? 6,
              extra_person_price: priv.extra_person_price || "15.00",
              is_available_private: priv.is_available ?? true,
              price_per_person: shared.price_per_person || "15.00",
              max_person_shared: shared.max_person ?? 6,
              is_available_shared: shared.is_available ?? true,
            });
            setPrivateSaunaFeatures(Array.isArray(priv.features) ? priv.features : []);
            setSharedSaunaFeatures(Array.isArray(shared.features) ? shared.features : []);
          } else if (s.type === "saltroom") {
            const sr = Array.isArray(det.saltroom) ? det.saltroom[0] : (det.saltroom || {});
            setSaltroomSettings({
              max_capacity: sr.max_capacity ?? 2,
              price_per_person: sr.price_per_person || "25.00",
              duration_minutes: sr.duration_minutes ?? 60,
              buffer_minutes: sr.buffer_minutes ?? 10,
            });
            setSaltroomFeatures(Array.isArray(sr.features) ? sr.features : []);
          }

          // Populate Activity List
          if (Array.isArray(det.activities)) {
            setActivitiesList(det.activities);
          }

          // Populate Package List
          if (Array.isArray(det.packages)) {
            setPackagesList(det.packages);
          }
        } else {
          setError(res?.message || "Failed to load service details.");
        }
      } catch (err: any) {
        setError(err?.message || "Error connecting to the service endpoint.");
      } finally {
        setLoading(false);
      }
    }

    if (serviceIdOrType) {
      loadData();
    }
  }, [serviceIdOrType]);

  // ═════════════════════════════════════════════════════════════════════
  // SECTION 1 HANDLERS: Main Service Details
  // ═════════════════════════════════════════════════════════════════════
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDetails(true);
    setDetailsErrorMsg(null);
    setDetailsSuccessMsg(null);

    try {
      const payload = new FormData();
      payload.append("section", "service_details");
      payload.append("id", String(serviceData?.id || serviceIdOrType));
      payload.append("type", detailsForm.type);

      payload.append("title_en", detailsForm.title_en);
      payload.append("title_nl", detailsForm.title_nl);
      payload.append("title_de", detailsForm.title_de);
      payload.append("title", detailsForm.title_en || detailsForm.title_nl || detailsForm.title_de);

      payload.append("subtitle_en", detailsForm.subtitle_en);
      payload.append("subtitle_nl", detailsForm.subtitle_nl);
      payload.append("subtitle_de", detailsForm.subtitle_de);
      payload.append("subtitle", detailsForm.subtitle_en || detailsForm.subtitle_nl || detailsForm.subtitle_de);

      payload.append("description_en", detailsForm.description_en);
      payload.append("description_nl", detailsForm.description_nl);
      payload.append("description_de", detailsForm.description_de);
      payload.append("description", detailsForm.description_en || detailsForm.description_nl || detailsForm.description_de);

      if (selectedImageFile) {
        payload.append("image", selectedImageFile);
      }

      try {
        await servicesService.updateService(serviceData?.id || serviceIdOrType, payload);
      } catch {
        await servicesService.updateAdminService(detailsForm.type || serviceIdOrType, payload);
      }
      setDetailsSuccessMsg("Service Details saved successfully!");
      setDetailsModalOpen(false);
      setTimeout(() => setDetailsSuccessMsg(null), 3000);
      await reloadData();
    } catch (err: any) {
      setDetailsErrorMsg(err?.message || "Failed to update service details.");
    } finally {
      setIsSavingDetails(false);
    }
  };

  const handleConfirmDeleteCurrentService = async () => {
    setIsDeletingCurrentService(true);
    setDetailsErrorMsg(null);
    try {
      await servicesService.deleteService(serviceData?.id || serviceIdOrType);
      setDeleteServiceDialogOpen(false);
      setDetailsModalOpen(false);
      router.push("/admin/services");
    } catch (err: any) {
      setDetailsErrorMsg(err?.message || "Failed to delete service.");
      setDeleteServiceDialogOpen(false);
    } finally {
      setIsDeletingCurrentService(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // SECTION 2 HANDLERS: Opening Hours
  // ═════════════════════════════════════════════════════════════════════
  const getSelectedDaysInOtherRows = (currentRowIndex: number): Set<string> => {
    const selected = new Set<string>();
    openingHoursList.forEach((row, idx) => {
      if (idx !== currentRowIndex) {
        row.week_days.forEach((d) => selected.add(d));
      }
    });
    return selected;
  };

  const handleAddOpeningHours = () => {
    const allSelected = new Set<string>();
    openingHoursList.forEach((r) => r.week_days.forEach((d) => allSelected.add(d)));
    const remainingDays = ALL_WEEK_DAYS.filter((d) => !allSelected.has(d));

    setOpeningHoursList((prev) => [
      ...prev,
      {
        week_days: remainingDays.length > 0 ? [remainingDays[0]] : [],
        open_time: "09:00",
        close_time: "21:00",
        is_closed: false,
      },
    ]);
  };

  const handleRemoveOpeningHours = async (index: number) => {
    const item = openingHoursList[index];
    if (item && item.id) {
      try {
        await servicesService.deleteOperatingHours(item.id);
        setHoursSuccessMsg("Schedule block deleted.");
        setTimeout(() => setHoursSuccessMsg(null), 3000);
      } catch (delErr) {
        console.warn("Delete operating hours API note:", delErr);
      }
    }
    setOpeningHoursList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleDay = (rowIndex: number, day: string) => {
    setOpeningHoursList((prev) =>
      prev.map((row, idx) => {
        if (idx !== rowIndex) return row;
        const exists = row.week_days.includes(day);
        return {
          ...row,
          week_days: exists
            ? row.week_days.filter((d) => d !== day)
            : [...row.week_days, day],
        };
      })
    );
  };

  const handleUpdateRowField = (
    rowIndex: number,
    field: "open_time" | "close_time" | "is_closed",
    value: any
  ) => {
    setOpeningHoursList((prev) =>
      prev.map((row, idx) => (idx === rowIndex ? { ...row, [field]: value } : row))
    );
  };

  const handleSaveOpeningHours = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHours(true);
    setHoursErrorMsg(null);
    setHoursSuccessMsg(null);

    const s_type = serviceData?.type || detailsForm.type || serviceIdOrType;
    const s_id = serviceData?.id;

    try {
      // 1. Process each row using the new Opening Hours API
      const promises = openingHoursList.map(async (row) => {
        if (row.id) {
          // Update: PATCH /api/dashboard/admin/services/settings/<id>/
          return servicesService.updateOperatingHours(row.id, {
            week_days: row.week_days,
            open_time: row.open_time,
            close_time: row.close_time,
            is_closed: row.is_closed,
          });
        } else {
          // Create: POST /api/dashboard/admin/services/settings/
          return servicesService.createOperatingHours({
            service_type: s_type,
            ...(s_id ? { service_id: s_id } : {}),
            week_days: row.week_days,
            open_time: row.open_time,
            close_time: row.close_time,
            is_closed: row.is_closed,
          });
        }
      });

      try {
        await Promise.all(promises);
      } catch {
        // Fallback to batch updateAdminService
        await servicesService.updateAdminService(s_type, {
          section: "opening_hours",
          id: s_id || serviceIdOrType,
          type: s_type,
          settings: openingHoursList,
        });
      }

      setHoursSuccessMsg("Opening Hours saved successfully!");
      setTimeout(() => setHoursSuccessMsg(null), 3000);
      await reloadData();
    } catch (err: any) {
      setHoursErrorMsg(err?.message || "Failed to save opening hours.");
    } finally {
      setIsSavingHours(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // SECTION 3 HANDLERS: Sauna & Saltroom Inline Save (Separated APIs)
  // ═════════════════════════════════════════════════════════════════════

  // Dedicated Handler: VIP Sauna Configuration
  const handleSavePrivateSauna = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrivateSauna(true);
    setPrivateSaunaErrorMsg(null);
    setPrivateSaunaSuccessMsg(null);

    try {
      const payload = {
        base_price_3hrs: parseFloat(String(saunaSettings.base_price_3hrs)) || 75.0,
        base_price_4hrs: parseFloat(String(saunaSettings.base_price_4hrs)) || 100.0,
        max_person: Number(saunaSettings.max_person) || 2,
        max_person_private: Number(saunaSettings.max_person) || 2,
        extra_person_price: parseFloat(String(saunaSettings.extra_person_price)) || 15.0,
        is_available: saunaSettings.is_available_private,
        is_available_private: saunaSettings.is_available_private,
      };

      await servicesService.updatePrivateSauna(payload);
      setPrivateSaunaSuccessMsg("VIP Sauna configuration saved successfully!");
      setTimeout(() => setPrivateSaunaSuccessMsg(null), 3500);
      await reloadData();
    } catch (err: any) {
      setPrivateSaunaErrorMsg(err?.message || "Failed to update VIP Sauna settings.");
    } finally {
      setIsSavingPrivateSauna(false);
    }
  };

  // Dedicated Handler: Sauna Configuration
  const handleSaveSharedSauna = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSharedSauna(true);
    setSharedSaunaErrorMsg(null);
    setSharedSaunaSuccessMsg(null);

    try {
      const payload = {
        price_per_person: parseFloat(String(saunaSettings.price_per_person)) || 15.0,
        max_person: Number(saunaSettings.max_person_shared) || 6,
        max_person_shared: Number(saunaSettings.max_person_shared) || 6,
        max_capacity: Number(saunaSettings.max_person_shared) || 6,
        is_available: saunaSettings.is_available_shared,
        is_available_shared: saunaSettings.is_available_shared,
      };

      await servicesService.updateSharedSauna(payload);
      setSharedSaunaSuccessMsg("Sauna configuration saved successfully!");
      setTimeout(() => setSharedSaunaSuccessMsg(null), 3500);
      await reloadData();
    } catch (err: any) {
      setSharedSaunaErrorMsg(err?.message || "Failed to update Sauna settings.");
    } finally {
      setIsSavingSharedSauna(false);
    }
  };

  // Generic Handler: Saltroom and other services
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsErrorMsg(null);
    setSettingsSuccessMsg(null);

    try {
      const s_type = serviceData?.type || detailsForm.type;
      let payload: Record<string, any> = {
        section: "service_settings",
        id: serviceData?.id || serviceIdOrType,
        type: s_type,
      };

      if (s_type === "saltroom") {
        payload = {
          ...payload,
          max_capacity: Number(saltroomSettings.max_capacity) || 2,
          price_per_person: parseFloat(String(saltroomSettings.price_per_person)) || 25.0,
          duration_minutes: Number(saltroomSettings.duration_minutes) || 60,
          buffer_minutes: Number(saltroomSettings.buffer_minutes) || 10,
        };
      }

      await servicesService.updateAdminService(s_type || serviceIdOrType, payload);
      setSettingsSuccessMsg("Service Configuration saved successfully!");
      setTimeout(() => setSettingsSuccessMsg(null), 3000);
      await reloadData();
    } catch (err: any) {
      setSettingsErrorMsg(err?.message || "Failed to update service settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // SERVICE FEATURES HANDLERS (Modal & CRUD)
  // ═════════════════════════════════════════════════════════════════════
  const handleOpenAddFeature = (
    service_type: "sauna" | "saltroom",
    sub_type?: "private" | "shared",
    sectionName = ""
  ) => {
    setFeatureModalTarget({ service_type, sub_type, sectionName });
    setEditingFeature(null);
    setFeatureForm({
      feature_en: "",
      feature_nl: "",
      feature_de: "",
      price: "0.00",
    });
    setFeatureModalError(null);
    setFeatureModalOpen(true);
  };

  const handleOpenEditFeature = (
    feature: any,
    service_type: "sauna" | "saltroom",
    sub_type?: "private" | "shared",
    sectionName = ""
  ) => {
    setFeatureModalTarget({ service_type, sub_type, sectionName });
    setEditingFeature(feature);
    setFeatureForm({
      feature_en: feature.feature_en || feature.feature || "",
      feature_nl: feature.feature_nl || "",
      feature_de: feature.feature_de || "",
      price: feature.price !== undefined && feature.price !== null ? String(feature.price) : "0.00",
    });
    setFeatureModalError(null);
    setFeatureModalOpen(true);
  };

  const handleSaveFeatureModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureForm.feature_en.trim()) {
      setFeatureModalError("Feature name in English is required.");
      return;
    }

    setIsSavingFeature(true);
    setFeatureModalError(null);

    try {
      if (editingFeature && editingFeature.id) {
        // UPDATE existing feature
        await servicesService.updateFeature(editingFeature.id, {
          feature: featureForm.feature_en.trim(),
          feature_en: featureForm.feature_en.trim(),
          feature_nl: featureForm.feature_nl.trim() || featureForm.feature_en.trim(),
          feature_de: featureForm.feature_de.trim() || featureForm.feature_en.trim(),
          price: featureModalTarget?.service_type === "sauna" ? (featureForm.price || "0.00") : undefined,
        });
      } else if (featureModalTarget) {
        // CREATE new feature
        await servicesService.createFeature({
          service_type: featureModalTarget.service_type,
          sub_type: featureModalTarget.sub_type,
          feature: featureForm.feature_en.trim(),
          feature_en: featureForm.feature_en.trim(),
          feature_nl: featureForm.feature_nl.trim() || featureForm.feature_en.trim(),
          feature_de: featureForm.feature_de.trim() || featureForm.feature_en.trim(),
          price: featureModalTarget.service_type === "sauna" ? (featureForm.price || "0.00") : undefined,
        });
      }

      setFeatureModalOpen(false);
      setFeatureSuccessToast(
        editingFeature ? "Feature updated successfully!" : "Feature created successfully!"
      );
      setTimeout(() => setFeatureSuccessToast(null), 4000);
      await reloadData();
    } catch (err: any) {
      console.error("Save feature error:", err);
      setFeatureModalError(err?.message || "Failed to save feature.");
    } finally {
      setIsSavingFeature(false);
    }
  };

  const handleConfirmDeleteFeature = async () => {
    if (!featureToDelete) return;
    setIsDeletingFeature(true);
    try {
      await servicesService.deleteFeature(
        featureToDelete.id,
        featureToDelete.service_type,
        featureToDelete.sub_type
      );
      setFeatureToDelete(null);
      setFeatureSuccessToast("Feature deleted successfully!");
      setTimeout(() => setFeatureSuccessToast(null), 4000);
      await reloadData();
    } catch (err: any) {
      console.error("Delete feature error:", err);
      alert(err?.message || "Failed to delete feature.");
    } finally {
      setIsDeletingFeature(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // ACTIVITY MODAL HANDLERS (Create / Edit / Save)
  // ═════════════════════════════════════════════════════════════════════
  const handleActivityImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedActivityImage(file);
      setPreviewActivityImage(URL.createObjectURL(file));
    }
  };

  const handleOpenCreateActivity = () => {
    setEditingActivityIndex(null);
    setSelectedActivityImage(null);
    setPreviewActivityImage(null);
    setActivityForm({
      activity_id: 0,
      capacity: 10,
      price: "15.00",
      host: "",
      open_time: "06:00",
      close_time: "12:00",
      date: "",
      is_available: true,
      title_en: "",
      title_nl: "",
      title_de: "",
      description_en: "",
      description_nl: "",
      description_de: "",
      additional_notes_en: "",
      additional_notes_nl: "",
      additional_notes_de: "",
    });
    setActivityFeatures([]);
    setActivityModalError(null);
    setActivityModalOpen(true);
  };

  const handleOpenEditActivity = (index: number) => {
    const act = activitiesList[index];
    if (!act) return;
    setEditingActivityIndex(index);
    setSelectedActivityImage(null);
    setPreviewActivityImage(act.image || act.images || null);
    setActivityForm({
      activity_id: act.id || 0,
      capacity: act.capacity ?? 10,
      price: act.price ? String(act.price) : "15.00",
      host: act.host || "",
      open_time: act.open_time || "06:00",
      close_time: act.close_time || "12:00",
      date: act.date || "",
      is_available: act.is_available ?? true,
      title_en: act.title_en || act.title || "",
      title_nl: act.title_nl || "",
      title_de: act.title_de || "",
      description_en: act.description_en || act.description || "",
      description_nl: act.description_nl || "",
      description_de: act.description_de || "",
      additional_notes_en: act.additional_notes_en || act.additional_notes || "",
      additional_notes_nl: act.additional_notes_nl || "",
      additional_notes_de: act.additional_notes_de || "",
    });
    if (Array.isArray(act.features)) {
      setActivityFeatures(
        act.features.map((f: any) => ({
          id: f.id,
          feature: f.feature || f.feature_en || "",
          feature_en: f.feature_en || f.feature || "",
          feature_nl: f.feature_nl || "",
          feature_de: f.feature_de || "",
        }))
      );
    } else {
      setActivityFeatures([]);
    }
    setActivityModalError(null);
    setActivityModalOpen(true);
  };

  const handleSaveActivityModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingActivityModal(true);
    setActivityModalError(null);

    try {
      const payload = new FormData();
      payload.append("section", "service_settings");
      payload.append("id", String(serviceData?.id || serviceIdOrType));
      payload.append("type", "activity");
      payload.append("action", editingActivityIndex === null ? "create" : "update");
      payload.append("activity_id", String(activityForm.activity_id));
      payload.append("capacity", String(activityForm.capacity));
      payload.append("price", String(activityForm.price));
      payload.append("host", activityForm.host);
      payload.append("open_time", activityForm.open_time);
      payload.append("close_time", activityForm.close_time);
      payload.append("date", activityForm.date);
      payload.append("is_available", String(activityForm.is_available));
      payload.append("title", activityForm.title_en || activityForm.title_nl || activityForm.title_de);
      payload.append("title_en", activityForm.title_en);
      payload.append("title_nl", activityForm.title_nl);
      payload.append("title_de", activityForm.title_de);
      payload.append("description", activityForm.description_en || activityForm.description_nl || activityForm.description_de);
      payload.append("description_en", activityForm.description_en);
      payload.append("description_nl", activityForm.description_nl);
      payload.append("description_de", activityForm.description_de);
      payload.append("additional_notes", activityForm.additional_notes_en || activityForm.additional_notes_nl || activityForm.additional_notes_de);
      payload.append("additional_notes_en", activityForm.additional_notes_en);
      payload.append("additional_notes_nl", activityForm.additional_notes_nl);
      payload.append("additional_notes_de", activityForm.additional_notes_de);
      payload.append("features", JSON.stringify(activityFeatures));

      if (selectedActivityImage) {
        payload.append("image", selectedActivityImage);
      }

      await servicesService.updateAdminService(serviceData?.type || serviceIdOrType, payload);
      setActivityModalOpen(false);
      setSettingsSuccessMsg(
        editingActivityIndex === null
          ? "Activity session created successfully!"
          : "Activity session updated successfully!"
      );
      setTimeout(() => setSettingsSuccessMsg(null), 3000);
      await reloadData();
    } catch (err: any) {
      setActivityModalError(err?.message || "Failed to save activity.");
    } finally {
      setIsSavingActivityModal(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // PACKAGE MODAL HANDLERS (Create / Edit / Save)
  // ═════════════════════════════════════════════════════════════════════
  const handlePackageImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedPackageImage(file);
      setPreviewPackageImage(URL.createObjectURL(file));
    }
  };

  const handleOpenCreatePackage = () => {
    setEditingPackageIndex(null);
    setSelectedPackageImage(null);
    setPreviewPackageImage(null);
    setPackageForm({
      package_id: 0,
      price: "180.00",
      included_packages: ["private_sauna", "lunchroom"],
      title_en: "",
      title_nl: "",
      title_de: "",
      description_en: "",
      description_nl: "",
      description_de: "",
    });
    setPackageFeatures([]);
    setPackageModalError(null);
    setPackageModalOpen(true);
  };

  const handleOpenEditPackage = (index: number) => {
    const pkg = packagesList[index];
    if (!pkg) return;
    setEditingPackageIndex(index);
    setSelectedPackageImage(null);
    setPreviewPackageImage(pkg.image || pkg.images || null);
    setPackageForm({
      package_id: pkg.id || 0,
      price: pkg.price ? String(pkg.price) : "180.00",
      included_packages: Array.isArray(pkg.packages) ? pkg.packages : [],
      title_en: pkg.title_en || pkg.title || "",
      title_nl: pkg.title_nl || "",
      title_de: pkg.title_de || "",
      description_en: pkg.description_en || pkg.description || "",
      description_nl: pkg.description_nl || "",
      description_de: pkg.description_de || "",
    });
    if (Array.isArray(pkg.features)) {
      setPackageFeatures(
        pkg.features.map((f: any) => ({
          id: f.id,
          feature: f.feature || f.feature_en || "",
          feature_en: f.feature_en || f.feature || "",
          feature_nl: f.feature_nl || "",
          feature_de: f.feature_de || "",
        }))
      );
    } else {
      setPackageFeatures([]);
    }
    setPackageModalError(null);
    setPackageModalOpen(true);
  };

  const handleSavePackageModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPackageModal(true);
    setPackageModalError(null);

    try {
      const payload = new FormData();
      payload.append("section", "service_settings");
      payload.append("id", String(serviceData?.id || serviceIdOrType));
      payload.append("type", "package");
      payload.append("action", editingPackageIndex === null ? "create" : "update");
      payload.append("package_id", String(packageForm.package_id));
      payload.append("price", String(packageForm.price));
      payload.append("packages", JSON.stringify(packageForm.included_packages));
      payload.append("title", packageForm.title_en || packageForm.title_nl || packageForm.title_de);
      payload.append("title_en", packageForm.title_en);
      payload.append("title_nl", packageForm.title_nl);
      payload.append("title_de", packageForm.title_de);
      payload.append("description", packageForm.description_en || packageForm.description_nl || packageForm.description_de);
      payload.append("description_en", packageForm.description_en);
      payload.append("description_nl", packageForm.description_nl);
      payload.append("description_de", packageForm.description_de);
      payload.append("features", JSON.stringify(packageFeatures));

      if (selectedPackageImage) {
        payload.append("image", selectedPackageImage);
      }

      await servicesService.updateAdminService(serviceData?.type || serviceIdOrType, payload);
      setPackageModalOpen(false);
      setSettingsSuccessMsg(
        editingPackageIndex === null
          ? "Package created successfully!"
          : "Package updated successfully!"
      );
      setTimeout(() => setSettingsSuccessMsg(null), 3000);
      await reloadData();
    } catch (err: any) {
      setPackageModalError(err?.message || "Failed to save package.");
    } finally {
      setIsSavingPackageModal(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // DELETE HANDLERS (Activity or Package)
  // ═════════════════════════════════════════════════════════════════════
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const payload: Record<string, any> = {
        section: "service_settings",
        id: serviceData?.id || serviceIdOrType,
        type: itemToDelete.type,
        action: "delete",
      };

      if (itemToDelete.type === "activity") {
        payload.activity_id = itemToDelete.id;
      } else if (itemToDelete.type === "package") {
        payload.package_id = itemToDelete.id;
      }

      await servicesService.updateAdminService(serviceData?.type || serviceIdOrType, payload);
      setItemToDelete(null);
      setSettingsSuccessMsg(
        `${itemToDelete.type === "activity" ? "Activity session" : "Package"} deleted successfully!`
      );
      setTimeout(() => setSettingsSuccessMsg(null), 3000);
      await reloadData();
    } catch (err: any) {
      setSettingsErrorMsg(err?.message || "Failed to delete item.");
      setTimeout(() => setSettingsErrorMsg(null), 4000);
    } finally {
      setIsDeleting(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════
  // RENDER CONDITIONAL STATES
  // ═════════════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-[#8b7355] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-[#8b7355] font-semibold">Loading service configuration...</p>
      </div>
    );
  }

  if (error || !serviceData) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl max-w-xl">
          <h3 className="font-bold text-sm mb-1">Service Not Found</h3>
          <p className="text-xs mb-4">{error || "Could not retrieve service details."}</p>
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8b7355] text-white text-xs font-semibold rounded-xl"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Services List
          </Link>
        </div>
      </div>
    );
  }

  const s_type = serviceData.type;

  return (
    <div className="p-6 sm:p-8 max-w-5xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2DC]">
        <div>
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8B7355] hover:text-[#705b41] mb-2 cursor-pointer transition-colors"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-displayPlayFair text-2xl sm:text-3xl font-bold text-[#1d1a17]">
              Edit {serviceData.title}
            </h1>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#F3EDE6] text-[#8b7355]">
              {s_type}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Configure multi-language content, weekly operating hours, and service-specific settings.
          </p>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: SERVICE DETAILS (READ-ONLY CARD + EDIT MODAL)           */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F1EDE8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B7355]/10 flex items-center justify-center text-[#8B7355]">
              <HiOutlineInformationCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
              Service Details
              </h2>
              <p className="text-xs text-[#64748B]">
                Title, Subtitle, Description in English, Dutch & German, and Banner image
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDetailsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <HiOutlinePencil className="w-4 h-4" />
            <span>Edit Service Details</span>
          </button>
        </div>

        {detailsSuccessMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <HiOutlineCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{detailsSuccessMsg}</span>
          </div>
        )}

        {detailsErrorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {detailsErrorMsg}
          </div>
        )}

        {/* Read-Only Card Content */}
        <div className="bg-[#FAF8F5]/40 border border-[#E8E2DC] rounded-3xl p-6 space-y-6">
          {/* Banner Image Preview */}
          <div>
            <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
              Service Banner Image
            </span>
            <div className="flex items-center gap-4">
              <div className="w-36 h-28 rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden flex items-center justify-center shadow-xs">
                {previewImage || serviceData.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewImage || serviceData.image}
                    alt={serviceData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-[#94A3B8] italic">No banner image uploaded</span>
                )}
              </div>
              <p className="text-xs text-[#64748B]">
                Click <span className="font-semibold text-[#8B7355]">Edit Service Details</span> to change or replace the banner image.
              </p>
            </div>
          </div>

          {/* Titles */}
          <div>
            <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
              Title Translations
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">English (EN)</span>
                <p className="text-xs font-medium text-[#1d1a17] mt-1">{detailsForm.title_en || serviceData.title_en || serviceData.title || "—"}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Nederlands (NL)</span>
                <p className="text-xs font-medium text-[#1d1a17] mt-1">{detailsForm.title_nl || serviceData.title_nl || "—"}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Deutsch (DE)</span>
                <p className="text-xs font-medium text-[#1d1a17] mt-1">{detailsForm.title_de || serviceData.title_de || "—"}</p>
              </div>
            </div>
          </div>

          {/* Subtitles */}
          <div>
            <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
              Subtitle Translations
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">English (EN)</span>
                <p className="text-xs text-[#1d1a17] mt-1">{detailsForm.subtitle_en || serviceData.subtitle_en || serviceData.subtitle || "—"}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Nederlands (NL)</span>
                <p className="text-xs text-[#1d1a17] mt-1">{detailsForm.subtitle_nl || serviceData.subtitle_nl || "—"}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Deutsch (DE)</span>
                <p className="text-xs text-[#1d1a17] mt-1">{detailsForm.subtitle_de || serviceData.subtitle_de || "—"}</p>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
              Description Translations
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">English (EN)</span>
                <p className="text-xs text-[#334155] mt-1 whitespace-pre-wrap">{detailsForm.description_en || serviceData.description_en || serviceData.description || "—"}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Nederlands (NL)</span>
                <p className="text-xs text-[#334155] mt-1 whitespace-pre-wrap">{detailsForm.description_nl || serviceData.description_nl || "—"}</p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0]">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Deutsch (DE)</span>
                <p className="text-xs text-[#334155] mt-1 whitespace-pre-wrap">{detailsForm.description_de || serviceData.description_de || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: OPENING HOURS (ServiceSettings per service)             */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F1EDE8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B7355]/10 flex items-center justify-center text-[#8B7355]">
              <HiOutlineClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
              Opening Hours & Schedule
              </h2>
              <p className="text-xs text-[#64748B]">
                Define open/close times by week days. Days assigned to one row cannot be selected in another.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddOpeningHours}
            className="px-4 py-2 rounded-xl bg-[#8B7355]/10 hover:bg-[#8B7355]/20 text-[#8B7355] text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Add Schedule Block</span>
          </button>
        </div>

        {hoursSuccessMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <HiOutlineCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{hoursSuccessMsg}</span>
          </div>
        )}

        {hoursErrorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {hoursErrorMsg}
          </div>
        )}

        <form onSubmit={handleSaveOpeningHours} className="space-y-6">
          {openingHoursList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-center">
              <p className="text-xs text-[#94A3B8] mb-3">No opening hours configured for this service yet.</p>
              <button
                type="button"
                onClick={handleAddOpeningHours}
                className="px-4 py-2 rounded-xl bg-[#8B7355] text-white text-xs font-semibold cursor-pointer"
              >
                + Add Default Schedule
              </button>
            </div>
          ) : (
            openingHoursList.map((row, rowIndex) => {
              const selectedInOtherRows = getSelectedDaysInOtherRows(rowIndex);

              return (
                <div
                  key={rowIndex}
                  className="p-5 rounded-2xl bg-[#FAF8F5]/60 border border-[#F1EDE8] space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wider">
                      Schedule Block #{rowIndex + 1}
                    </span>
                    {openingHoursList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOpeningHours(rowIndex)}
                        className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        title="Delete this schedule block"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Week Day Pills */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-2">
                      Select Week Days (Multiple allowed; days assigned to other schedules are disabled):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_WEEK_DAYS.map((day) => {
                        const isSelectedInThisRow = row.week_days.includes(day);
                        const isSelectedElsewhere = selectedInOtherRows.has(day);

                        return (
                          <button
                            key={day}
                            type="button"
                            disabled={isSelectedElsewhere}
                            onClick={() => handleToggleDay(rowIndex, day)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelectedInThisRow
                                ? "bg-[#8B7355] text-white shadow-xs"
                                : isSelectedElsewhere
                                ? "bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed opacity-60"
                                : "bg-white border border-[#CBD5E1] text-[#64748B] hover:border-[#8B7355] hover:text-[#8B7355]"
                            }`}
                            title={
                              isSelectedElsewhere
                                ? `${day} is already assigned to another schedule`
                                : undefined
                            }
                          >
                            {isSelectedInThisRow && "✓ "}
                            {day}
                            {isSelectedElsewhere && " (In Use)"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Open & Close Times */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Start Time (Open)
                      </label>
                      <input
                        type="time"
                        required
                        disabled={row.is_closed}
                        value={row.open_time}
                        onChange={(e) =>
                          handleUpdateRowField(rowIndex, "open_time", e.target.value)
                        }
                        className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white disabled:bg-gray-100 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        End Time (Close)
                      </label>
                      <input
                        type="time"
                        required
                        disabled={row.is_closed}
                        value={row.close_time}
                        onChange={(e) =>
                          handleUpdateRowField(rowIndex, "close_time", e.target.value)
                        }
                        className="w-full px-3.5 py-2 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white disabled:bg-gray-100 disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id={`closed-${rowIndex}`}
                        checked={row.is_closed}
                        onChange={(e) =>
                          handleUpdateRowField(rowIndex, "is_closed", e.target.checked)
                        }
                        className="w-4 h-4 rounded text-[#8B7355] focus:ring-[#8B7355]"
                      />
                      <label
                        htmlFor={`closed-${rowIndex}`}
                        className="text-xs font-semibold text-[#1d1a17] cursor-pointer"
                      >
                        Service Closed on these days
                      </label>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Save Button for Section 2 */}
          <div className="flex justify-end pt-4 border-t border-[#F1EDE8]">
            <button
              type="submit"
              disabled={isSavingHours}
              className="px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSavingHours ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Opening Hours...</span>
                </>
              ) : (
                <span>Save Opening Hours</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: SERVICE SETTINGS                                         */}
      {/* (For Activity & Package: Read-Only Overview Cards + Edit Modals)   */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-[#E8E2DC] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F1EDE8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8B7355]/10 flex items-center justify-center text-[#8B7355]">
              <HiOutlineCog className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
              {s_type === "activity" ? "Activity Sessions" : s_type === "package" ? "Service Packages" : `Service Configuration (${serviceData.title})`}
              </h2>
              <p className="text-xs text-[#64748B]">
                {s_type === "activity"
                  ? "View and manage multiple activity sessions, translations, and features."
                  : s_type === "package"
                  ? "View and manage multiple wellness packages, translations, and included services."
                  : "Configure pricing, capacities, and operational rules for this service model."}
              </p>
            </div>
          </div>

          {/* Top Action Buttons for Activity / Package */}
          {s_type === "activity" && (
            <button
              type="button"
              onClick={handleOpenCreateActivity}
              className="px-4 py-2 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Add New Activity</span>
            </button>
          )}

          {s_type === "package" && (
            <button
              type="button"
              onClick={handleOpenCreatePackage}
              className="px-4 py-2 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Add New Package</span>
            </button>
          )}
        </div>

        {settingsSuccessMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <HiOutlineCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{settingsSuccessMsg}</span>
          </div>
        )}

        {settingsErrorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {settingsErrorMsg}
          </div>
        )}

        {/* ── SAUNA SETTINGS (TWO SEPARATE INDEPENDENT FORMS) ── */}
        {s_type === "sauna" && (
          <div className="space-y-8">
            {/* ── 1. PRIVATE SAUNA UPDATE FORM ── */}
            <form
              onSubmit={handleSavePrivateSauna}
              className="p-6 rounded-2xl bg-white border border-[#E8E2DC] shadow-sm space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1EDE8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] flex items-center justify-center text-xl shadow-xs">
                    🧖
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1d1a17]">VIP Sauna Configuration</h3>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Configure base pricing (3h / 4h), included guest count, add-on rates, and private amenities.
                    </p>
                  </div>
                </div>

                {/* Available for Booking Toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none bg-[#FAF8F5] px-3.5 py-2 rounded-xl border border-[#F1EDE8] hover:border-[#8B7355]/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(saunaSettings.is_available_private)}
                    onChange={(e) =>
                      setSaunaSettings((s) => ({ ...s, is_available_private: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-[#8B7355] focus:ring-[#8B7355] border-[#E2E8F0] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-[#1d1a17]">
                    {saunaSettings.is_available_private ? "Available for Booking" : "Offline / Unavailable"}
                  </span>
                </label>
              </div>

              {/* Success / Error Messages for VIP Sauna */}
              {privateSaunaSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                  <HiOutlineCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{privateSaunaSuccessMsg}</span>
                </div>
              )}
              {privateSaunaErrorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <HiOutlineX className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{privateSaunaErrorMsg}</span>
                </div>
              )}

              {/* VIP Sauna Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Base Price (3 Hours) €
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={saunaSettings.base_price_3hrs}
                    onChange={(e) =>
                      setSaunaSettings((s) => ({ ...s, base_price_3hrs: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#8B7355] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Base Price (4 Hours) €
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={saunaSettings.base_price_4hrs}
                    onChange={(e) =>
                      setSaunaSettings((s) => ({ ...s, base_price_4hrs: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#8B7355] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Max Guests Included
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={saunaSettings.max_person}
                    onChange={(e) =>
                      setSaunaSettings((s) => ({ ...s, max_person: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#8B7355] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Extra Person Price €
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={saunaSettings.extra_person_price}
                    onChange={(e) =>
                      setSaunaSettings((s) => ({ ...s, extra_person_price: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#8B7355] transition-all"
                  />
                </div>
              </div>

              {/* VIP Sauna Features & Amenities */}
              <div className="pt-4 border-t border-[#F1EDE8]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#1d1a17] flex items-center gap-1.5">
                      <HiOutlineSparkles className="w-4 h-4 text-[#8B7355]" />
                      VIP Sauna Features & Inclusions ({privateSaunaFeatures.length})
                    </h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Multilingual amenities (EN, NL, DE) and optional add-on prices
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenAddFeature("sauna", "private", "VIP Sauna")}
                    className="px-3 py-1.5 rounded-lg bg-[#8B7355] hover:bg-[#705b41] text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
                  >
                    <HiOutlinePlus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                {privateSaunaFeatures.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#FAF8F5]/50 border border-dashed border-[#E2E8F0] text-center">
                    <p className="text-xs text-[#94A3B8]">No features added yet to VIP Sauna.</p>
                    <button
                      type="button"
                      onClick={() => handleOpenAddFeature("sauna", "private", "VIP Sauna")}
                      className="mt-1.5 text-xs font-semibold text-[#8B7355] hover:underline cursor-pointer"
                    >
                      + Add first feature
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {privateSaunaFeatures.map((feat: any) => (
                      <div
                        key={feat.id || feat.feature}
                        className="p-3.5 rounded-xl bg-white border border-[#E8E2DC] hover:border-[#8B7355]/40 transition-all flex flex-col justify-between group shadow-xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#1d1a17] line-clamp-1">
                              {feat.feature_en || feat.feature}
                            </span>
                            {feat.price !== undefined && feat.price !== null && (
                              <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF8F5] text-[#8B7355] border border-[#E8E2DC]">
                                {Number(feat.price) > 0 ? `€${Number(feat.price).toFixed(2)}` : "Included"}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 bg-[#FAF8F5] p-2 rounded-lg border border-[#F1EDE8] text-[11px]">
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="px-1 py-0.2 rounded bg-white text-[9px] font-extrabold text-[#8B7355] border border-[#E8E2DC]">EN</span>
                              <span className="truncate">{feat.feature_en || feat.feature || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="px-1 py-0.2 rounded bg-white text-[9px] font-extrabold text-[#8B7355] border border-[#E8E2DC]">NL</span>
                              <span className="truncate">{feat.feature_nl || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="px-1 py-0.2 rounded bg-white text-[9px] font-extrabold text-[#8B7355] border border-[#E8E2DC]">DE</span>
                              <span className="truncate">{feat.feature_de || "—"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-[#F8F6F3]">
                          <button
                            type="button"
                            onClick={() => handleOpenEditFeature(feat, "sauna", "private", "VIP Sauna")}
                            className="p-1.5 rounded-lg hover:bg-[#F3EFEA] text-[#8B7355] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                            title="Edit feature"
                          >
                            <HiOutlinePencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFeatureToDelete({
                                id: feat.id,
                                title: feat.feature_en || feat.feature,
                                service_type: "sauna",
                                sub_type: "private",
                              })
                            }
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                            title="Delete feature"
                          >
                            <HiOutlineTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* VIP Sauna Dedicated Submit */}
              <div className="flex justify-end pt-4 border-t border-[#F1EDE8]">
                <button
                  type="submit"
                  disabled={isSavingPrivateSauna}
                  className="px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingPrivateSauna ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving VIP Sauna...</span>
                    </>
                  ) : (
                    <>
                      <HiOutlineCheck className="w-4 h-4" />
                      <span>Save VIP Sauna</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* ── 2. SHARED SAUNA UPDATE FORM ── */}
            <form
              onSubmit={handleSaveSharedSauna}
              className="p-6 rounded-2xl bg-white border border-[#E8E2DC] shadow-sm space-y-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F1EDE8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] flex items-center justify-center text-xl shadow-xs">
                    👥
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1d1a17]">Sauna Configuration</h3>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Configure public slots per-person rate, maximum slot capacity, and shared amenities.
                    </p>
                  </div>
                </div>

                {/* Available for Booking Toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none bg-[#FAF8F5] px-3.5 py-2 rounded-xl border border-[#F1EDE8] hover:border-[#8B7355]/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={Boolean(saunaSettings.is_available_shared)}
                    onChange={(e) =>
                      setSaunaSettings((s) => ({ ...s, is_available_shared: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-[#8B7355] focus:ring-[#8B7355] border-[#E2E8F0] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-[#1d1a17]">
                    {saunaSettings.is_available_shared ? "Available for Booking" : "Offline / Unavailable"}
                  </span>
                </label>
              </div>

              {/* Success / Error Messages for Sauna */}
              {sharedSaunaSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                  <HiOutlineCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sharedSaunaSuccessMsg}</span>
                </div>
              )}
              {sharedSaunaErrorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <HiOutlineX className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{sharedSaunaErrorMsg}</span>
                </div>
              )}

              {/* Sauna Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Price Per Person €
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={saunaSettings.price_per_person}
                    onChange={(e) =>
                      setSaunaSettings((s) => ({ ...s, price_per_person: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#8B7355] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Max Capacity (Guests per Slot)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={saunaSettings.max_person_shared}
                    onChange={(e) =>
                      setSaunaSettings((s) => ({ ...s, max_person_shared: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#8B7355] transition-all"
                  />
                  <p className="text-[10px] text-[#94A3B8] mt-1">
                    Controls total capacity per session block for public booking.
                  </p>
                </div>
              </div>

              {/* Sauna Features & Amenities */}
              <div className="pt-4 border-t border-[#F1EDE8]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#1d1a17] flex items-center gap-1.5">
                      <HiOutlineSparkles className="w-4 h-4 text-[#8B7355]" />
                      Sauna Features & Inclusions ({sharedSaunaFeatures.length})
                    </h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Multilingual amenities (EN, NL, DE) and optional add-on prices
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenAddFeature("sauna", "shared", "Sauna")}
                    className="px-3 py-1.5 rounded-lg bg-[#8B7355] hover:bg-[#705b41] text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
                  >
                    <HiOutlinePlus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                {sharedSaunaFeatures.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#FAF8F5]/50 border border-dashed border-[#E2E8F0] text-center">
                    <p className="text-xs text-[#94A3B8]">No features added yet to Sauna.</p>
                    <button
                      type="button"
                      onClick={() => handleOpenAddFeature("sauna", "shared", "Sauna")}
                      className="mt-1.5 text-xs font-semibold text-[#8B7355] hover:underline cursor-pointer"
                    >
                      + Add first feature
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sharedSaunaFeatures.map((feat: any) => (
                      <div
                        key={feat.id || feat.feature}
                        className="p-3.5 rounded-xl bg-white border border-[#E8E2DC] hover:border-[#8B7355]/40 transition-all flex flex-col justify-between group shadow-xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#1d1a17] line-clamp-1">
                              {feat.feature_en || feat.feature}
                            </span>
                            {feat.price !== undefined && feat.price !== null && (
                              <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF8F5] text-[#8B7355] border border-[#E8E2DC]">
                                {Number(feat.price) > 0 ? `€${Number(feat.price).toFixed(2)}` : "Included"}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 bg-[#FAF8F5] p-2 rounded-lg border border-[#F1EDE8] text-[11px]">
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="px-1 py-0.2 rounded bg-white text-[9px] font-extrabold text-[#8B7355] border border-[#E8E2DC]">EN</span>
                              <span className="truncate">{feat.feature_en || feat.feature || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="px-1 py-0.2 rounded bg-white text-[9px] font-extrabold text-[#8B7355] border border-[#E8E2DC]">NL</span>
                              <span className="truncate">{feat.feature_nl || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="px-1 py-0.2 rounded bg-white text-[9px] font-extrabold text-[#8B7355] border border-[#E8E2DC]">DE</span>
                              <span className="truncate">{feat.feature_de || "—"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-[#F8F6F3]">
                          <button
                            type="button"
                            onClick={() => handleOpenEditFeature(feat, "sauna", "shared", "Sauna")}
                            className="p-1.5 rounded-lg hover:bg-[#F3EFEA] text-[#8B7355] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                            title="Edit feature"
                          >
                            <HiOutlinePencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFeatureToDelete({
                                id: feat.id,
                                title: feat.feature_en || feat.feature,
                                service_type: "sauna",
                                sub_type: "shared",
                              })
                            }
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                            title="Delete feature"
                          >
                            <HiOutlineTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sauna Dedicated Submit */}
              <div className="flex justify-end pt-4 border-t border-[#F1EDE8]">
                <button
                  type="submit"
                  disabled={isSavingSharedSauna}
                  className="px-5 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingSharedSauna ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Sauna...</span>
                    </>
                  ) : (
                    <>
                      <HiOutlineCheck className="w-4 h-4" />
                      <span>Save Sauna</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── SALT ROOM SETTINGS (INLINE) ── */}
        {s_type === "saltroom" && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
              <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-2">
                <span>🧂</span> Salt Room Operational Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Price Per Person €
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={saltroomSettings.price_per_person}
                    onChange={(e) =>
                      setSaltroomSettings((s) => ({ ...s, price_per_person: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Max Capacity (Guests)
                  </label>
                  <input
                    type="number"
                    value={saltroomSettings.max_capacity}
                    onChange={(e) =>
                      setSaltroomSettings((s) => ({ ...s, max_capacity: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={saltroomSettings.duration_minutes}
                    onChange={(e) =>
                      setSaltroomSettings((s) => ({ ...s, duration_minutes: parseInt(e.target.value) || 60 }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                    Buffer Time (Minutes)
                  </label>
                  <input
                    type="number"
                    value={saltroomSettings.buffer_minutes}
                    onChange={(e) =>
                      setSaltroomSettings((s) => ({ ...s, buffer_minutes: parseInt(e.target.value) || 10 }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                  />
                </div>
              </div>

              {/* Salt Room Features & Amenities */}
              <div className="pt-4 border-t border-[#F1EDE8]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[#1d1a17] flex items-center gap-1.5">
                      <HiOutlineSparkles className="w-4 h-4 text-[#8B7355]" />
                      Salt Room Features & Amenities ({saltroomFeatures.length})
                    </h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Multilingual room amenities and features (EN, NL, DE)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenAddFeature("saltroom", undefined, "Salt Room")}
                    className="px-3 py-1.5 rounded-lg bg-[#8B7355] hover:bg-[#705b41] text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
                  >
                    <HiOutlinePlus className="w-3.5 h-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                {saltroomFeatures.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white border border-dashed border-[#E2E8F0] text-center">
                    <p className="text-xs text-[#94A3B8]">No features added yet to Salt Room.</p>
                    <button
                      type="button"
                      onClick={() => handleOpenAddFeature("saltroom", undefined, "Salt Room")}
                      className="mt-1.5 text-xs font-semibold text-[#8B7355] hover:underline cursor-pointer"
                    >
                      + Add first feature
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {saltroomFeatures.map((feat: any) => (
                      <div
                        key={feat.id || feat.feature}
                        className="p-3.5 rounded-xl bg-white border border-[#E8E2DC] hover:border-[#8B7355]/40 transition-all flex flex-col justify-between group shadow-xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-[#1d1a17] line-clamp-1">
                              {feat.feature_en || feat.feature}
                            </span>
                            {feat.price !== undefined && feat.price !== null && Number(feat.price) > 0 && (
                              <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FAF8F5] text-[#8B7355] border border-[#E8E2DC]">
                                €{Number(feat.price).toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1 bg-[#FAF8F5] p-2 rounded-lg border border-[#F1EDE8] text-[11px]">
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="px-1 py-0.2 rounded bg-white text-[9px] font-extrabold text-[#8B7355] border border-[#E8E2DC]">EN</span>
                              <span className="truncate">{feat.feature_en || feat.feature || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="px-1 py-0.2 rounded bg-white text-[9px] font-extrabold text-[#8B7355] border border-[#E8E2DC]">NL</span>
                              <span className="truncate">{feat.feature_nl || "—"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#475569]">
                              <span className="px-1 py-0.2 rounded bg-white text-[9px] font-extrabold text-[#8B7355] border border-[#E8E2DC]">DE</span>
                              <span className="truncate">{feat.feature_de || "—"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-[#F8F6F3]">
                          <button
                            type="button"
                            onClick={() => handleOpenEditFeature(feat, "saltroom", undefined, "Salt Room")}
                            className="p-1.5 rounded-lg hover:bg-[#F3EFEA] text-[#8B7355] transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                            title="Edit feature"
                          >
                            <HiOutlinePencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFeatureToDelete({
                                id: feat.id,
                                title: feat.feature_en || feat.feature,
                                service_type: "saltroom",
                              })
                            }
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                            title="Delete feature"
                          >
                            <HiOutlineTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#F1EDE8]">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSavingSettings ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <span>Save Service Settings</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── ACTIVITIES MULTIPLE CARDS (READ-ONLY) ── */}
        {s_type === "activity" && (
          <div className="space-y-6">
            {activitiesList.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#FAF8F5]/50 border-2 border-dashed border-[#E8E2DC] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#8B7355]/10 text-[#8B7355] flex items-center justify-center mx-auto text-xl">
                  🧘
                </div>
                <h3 className="text-sm font-bold text-[#1d1a17]">No Activity Sessions Found</h3>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Create and manage multiple activity sessions with custom schedules, translations, and features.
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreateActivity}
                  className="px-4 py-2 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  <span>Create First Activity</span>
                </button>
              </div>
            ) : (
              activitiesList.map((act, index) => (
                <div
                  key={act.id || index}
                  className="bg-[#FAF8F5]/40 hover:bg-[#FAF8F5]/80 border border-[#E8E2DC] hover:border-[#8B7355]/40 rounded-3xl p-6 transition-all shadow-xs space-y-5"
                >
                  {/* Card Header & Summary Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#F1EDE8]">
                    <div className="flex items-start gap-4">
                      {/* Image Thumbnail */}
                      <div className="w-24 h-24 sm:w-28 sm:h-24 rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                        {act.image || act.images ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={act.image || act.images}
                            alt={act.title_en || act.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-[#94A3B8] italic">No image</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#8B7355]/10 text-[#8B7355] text-xs font-bold">
                            🧘 Activity #{index + 1}
                          </span>
                          <h3 className="text-base font-bold text-[#1d1a17] font-displayPlayFair">
                            {act.title_en || act.title || "Untitled Session"}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              act.is_available
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}
                          >
                            {act.is_available ? "✓ Available" : "Unavailable"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#64748B]">
                          <span className="text-[#8B7355] font-bold">€{act.price || "0.00"}</span>
                          <span>•</span>
                          <span>{act.capacity || 1} guests</span>
                          {act.host && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <HiOutlineUser className="w-3.5 h-3.5 text-[#8B7355]" />
                                {act.host}
                              </span>
                            </>
                          )}
                          {(act.open_time || act.date) && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <HiOutlineCalendar className="w-3.5 h-3.5 text-[#8B7355]" />
                                {act.date || "Regular"} ({act.open_time || "--"} - {act.close_time || "--"})
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-start">
                      <button
                        type="button"
                        onClick={() => handleOpenEditActivity(index)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <HiOutlinePencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setItemToDelete({
                            type: "activity",
                            id: act.id,
                            title: act.title_en || act.title || `Activity #${index + 1}`,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Read-Only Titles (EN, NL, DE) */}
                  <div>
                    <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
                      Titles (Multi-language)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">English (EN)</span>
                        <p className="text-xs font-medium text-[#1d1a17] mt-0.5">{act.title_en || act.title || "—"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Nederlands (NL)</span>
                        <p className="text-xs font-medium text-[#1d1a17] mt-0.5">{act.title_nl || "—"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Deutsch (DE)</span>
                        <p className="text-xs font-medium text-[#1d1a17] mt-0.5">{act.title_de || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Read-Only Descriptions (EN, NL, DE) */}
                  <div>
                    <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
                      Descriptions (Multi-language)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">English (EN)</span>
                        <p className="text-xs text-[#334155] mt-0.5 whitespace-pre-wrap">{act.description_en || act.description || "—"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Nederlands (NL)</span>
                        <p className="text-xs text-[#334155] mt-0.5 whitespace-pre-wrap">{act.description_nl || "—"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Deutsch (DE)</span>
                        <p className="text-xs text-[#334155] mt-0.5 whitespace-pre-wrap">{act.description_de || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Read-Only Additional Notes (If any) */}
                  {(act.additional_notes_en || act.additional_notes_nl || act.additional_notes_de || act.additional_notes) && (
                    <div>
                      <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
                        Additional Notes (Multi-language)
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                          <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">English (EN)</span>
                          <p className="text-xs text-[#334155] mt-0.5 whitespace-pre-wrap">{act.additional_notes_en || act.additional_notes || "—"}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                          <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Nederlands (NL)</span>
                          <p className="text-xs text-[#334155] mt-0.5 whitespace-pre-wrap">{act.additional_notes_nl || "—"}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                          <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Deutsch (DE)</span>
                          <p className="text-xs text-[#334155] mt-0.5 whitespace-pre-wrap">{act.additional_notes_de || "—"}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Read-Only Features */}
                  <div>
                    <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
                      Features ({act.features?.length || 0})
                    </span>
                    {!act.features || act.features.length === 0 ? (
                      <p className="text-xs text-[#94A3B8] italic bg-white p-3 rounded-xl border border-[#E2E8F0]">
                        No features specified for this activity.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {act.features.map((feat: any, fi: number) => (
                          <div
                            key={feat.id || fi}
                            className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row md:items-center gap-3"
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#8B7355]/10 text-[#8B7355] text-xs font-bold flex items-center justify-center flex-shrink-0">
                              #{fi + 1}
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow text-xs">
                              <div>
                                <span className="text-[10px] font-semibold text-[#94A3B8] block">EN:</span>
                                <span className="text-[#1d1a17]">{feat.feature_en || feat.feature || "—"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-semibold text-[#94A3B8] block">NL:</span>
                                <span className="text-[#1d1a17]">{feat.feature_nl || "—"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-semibold text-[#94A3B8] block">DE:</span>
                                <span className="text-[#1d1a17]">{feat.feature_de || "—"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── PACKAGES MULTIPLE CARDS (READ-ONLY) ── */}
        {s_type === "package" && (
          <div className="space-y-6">
            {packagesList.length === 0 ? (
              <div className="p-10 rounded-2xl bg-[#FAF8F5]/50 border-2 border-dashed border-[#E8E2DC] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#8B7355]/10 text-[#8B7355] flex items-center justify-center mx-auto text-xl">
                  📦
                </div>
                <h3 className="text-sm font-bold text-[#1d1a17]">No Packages Found</h3>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Create and manage wellness packages with custom translations, pricing, included services, and features.
                </p>
                <button
                  type="button"
                  onClick={handleOpenCreatePackage}
                  className="px-4 py-2 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <HiOutlinePlus className="w-4 h-4" />
                  <span>Create First Package</span>
                </button>
              </div>
            ) : (
              packagesList.map((pkg, index) => (
                <div
                  key={pkg.id || index}
                  className="bg-[#FAF8F5]/40 hover:bg-[#FAF8F5]/80 border border-[#E8E2DC] hover:border-[#8B7355]/40 rounded-3xl p-6 transition-all shadow-xs space-y-5"
                >
                  {/* Card Header & Summary Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#F1EDE8]">
                    <div className="flex items-start gap-4">
                      {/* Image Thumbnail */}
                      <div className="w-24 h-24 sm:w-28 sm:h-24 rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xs">
                        {pkg.image || pkg.images ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={pkg.image || pkg.images}
                            alt={pkg.title_en || pkg.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-[#94A3B8] italic">No image</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#8B7355]/10 text-[#8B7355] text-xs font-bold">
                            📦 Package #{index + 1}
                          </span>
                          <h3 className="text-base font-bold text-[#1d1a17] font-displayPlayFair">
                            {pkg.title_en || pkg.title || "Untitled Package"}
                          </h3>
                        </div>
                        <div className="text-xs font-bold text-[#8B7355]">
                          Price: €{pkg.price || "0.00"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-start">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPackage(index)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <HiOutlinePencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setItemToDelete({
                            type: "package",
                            id: pkg.id,
                            title: pkg.title_en || pkg.title || `Package #${index + 1}`,
                          })
                        }
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Read-Only Titles (EN, NL, DE) */}
                  <div>
                    <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
                      Titles (Multi-language)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">English (EN)</span>
                        <p className="text-xs font-medium text-[#1d1a17] mt-0.5">{pkg.title_en || pkg.title || "—"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Nederlands (NL)</span>
                        <p className="text-xs font-medium text-[#1d1a17] mt-0.5">{pkg.title_nl || "—"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Deutsch (DE)</span>
                        <p className="text-xs font-medium text-[#1d1a17] mt-0.5">{pkg.title_de || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Read-Only Descriptions (EN, NL, DE) */}
                  <div>
                    <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
                      Descriptions (Multi-language)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">English (EN)</span>
                        <p className="text-xs text-[#334155] mt-0.5 whitespace-pre-wrap">{pkg.description_en || pkg.description || "—"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Nederlands (NL)</span>
                        <p className="text-xs text-[#334155] mt-0.5 whitespace-pre-wrap">{pkg.description_nl || "—"}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E2E8F0]">
                        <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Deutsch (DE)</span>
                        <p className="text-xs text-[#334155] mt-0.5 whitespace-pre-wrap">{pkg.description_de || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Read-Only Included Services */}
                  <div>
                    <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
                      Included Services (Read-Only)
                    </span>
                    <div className="flex flex-wrap gap-2 p-3 bg-white rounded-xl border border-[#E2E8F0]">
                      {Array.isArray(pkg.packages) && pkg.packages.length > 0 ? (
                        pkg.packages.map((svc: string) => (
                          <span
                            key={svc}
                            className="px-3 py-1 rounded-lg bg-[#8B7355]/10 text-[#8B7355] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                          >
                            <HiOutlineCheck className="w-3.5 h-3.5 text-[#8B7355]" />
                            {svc.replace(/_/g, " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[#94A3B8] italic">No specific service types included.</span>
                      )}
                    </div>
                  </div>

                  {/* 4. Read-Only Features */}
                  <div>
                    <span className="block text-[11px] font-bold text-[#8B7355] uppercase tracking-wider mb-2">
                      Features ({pkg.features?.length || 0})
                    </span>
                    {!pkg.features || pkg.features.length === 0 ? (
                      <p className="text-xs text-[#94A3B8] italic bg-white p-3 rounded-xl border border-[#E2E8F0]">
                        No features specified for this package.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {pkg.features.map((feat: any, fi: number) => (
                          <div
                            key={feat.id || fi}
                            className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex flex-col md:flex-row md:items-center gap-3"
                          >
                            <span className="w-6 h-6 rounded-lg bg-[#8B7355]/10 text-[#8B7355] text-xs font-bold flex items-center justify-center flex-shrink-0">
                              #{fi + 1}
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow text-xs">
                              <div>
                                <span className="text-[10px] font-semibold text-[#94A3B8] block">EN:</span>
                                <span className="text-[#1d1a17]">{feat.feature_en || feat.feature || "—"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-semibold text-[#94A3B8] block">NL:</span>
                                <span className="text-[#1d1a17]">{feat.feature_nl || "—"}</span>
                              </div>
                              <div>
                                <span className="text-[10px] font-semibold text-[#94A3B8] block">DE:</span>
                                <span className="text-[#1d1a17]">{feat.feature_de || "—"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── LUNCHROOM / EVENT SETTINGS ── */}
        {s_type === "lunchroom" && (
          <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8]">
            <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">
              🍽️ Lunchroom Operating Schedule
            </h3>
            <p className="text-xs text-[#64748B]">
              Operating hours and availability can be managed via Section 2 above or via the{" "}
              <Link href="/admin/availability" className="text-[#8B7355] font-bold hover:underline">
                Availability & Capacity
              </Link>{" "}
              tab.
            </p>
          </div>
        )}

        {s_type === "event" && (
          <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8]">
            <h3 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-2">
              🎉 Event Sanctuary Settings
            </h3>
            <p className="text-xs text-[#64748B]">
              Events are custom quoted upon user request. Pricing and private availability can be modified per reservation.
            </p>
          </div>
        )}
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT SERVICE DETAILS                                         */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-[#F1EDE8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B7355]/10 flex items-center justify-center text-[#8B7355]">
                  <HiOutlineInformationCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
                    Edit Service Details
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Update title, subtitle, and description across 3 languages, and banner image
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-colors"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSaveDetails} className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Banner Image */}
              <div>
                <label className="block text-xs font-bold text-[#64748B] mb-2 uppercase tracking-wide">
                  Service Banner Image
                </label>
                <div className="flex items-center gap-5">
                  <div className="w-28 h-24 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] overflow-hidden flex items-center justify-center relative flex-shrink-0">
                    {previewImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewImage}
                        alt="Banner preview"
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
                      className="px-4 py-2 rounded-xl border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <HiOutlineCamera className="w-4 h-4" />
                      <span>{previewImage ? "Change Banner" : "Upload Banner"}</span>
                    </button>
                    <p className="text-[11px] text-[#94A3B8]">Supports JPG, PNG, WEBP (Max 5MB)</p>
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

              {/* Titles (EN, NL, DE) */}
              <div className="pt-4 border-t border-[#F1EDE8]">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span>🌐</span> Title Translations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Title [en]*
                    </label>
                    <input
                      type="text"
                      required
                      value={detailsForm.title_en}
                      onChange={(e) => setDetailsForm((m) => ({ ...m, title_en: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                      placeholder="e.g. Packages"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Title [nl]
                    </label>
                    <input
                      type="text"
                      value={detailsForm.title_nl}
                      onChange={(e) => setDetailsForm((m) => ({ ...m, title_nl: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                      placeholder="e.g. Packages NL"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Title [de]
                    </label>
                    <input
                      type="text"
                      value={detailsForm.title_de}
                      onChange={(e) => setDetailsForm((m) => ({ ...m, title_de: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                      placeholder="e.g. Packages DE"
                    />
                  </div>
                </div>
              </div>

              {/* Subtitles (EN, NL, DE) */}
              <div className="pt-4 border-t border-[#F1EDE8]">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span>✨</span> Subtitle Translations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Subtitle [en]*
                    </label>
                    <input
                      type="text"
                      required
                      value={detailsForm.subtitle_en}
                      onChange={(e) => setDetailsForm((m) => ({ ...m, subtitle_en: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                      placeholder="e.g. Exclusive packages"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Subtitle [nl]
                    </label>
                    <input
                      type="text"
                      value={detailsForm.subtitle_nl}
                      onChange={(e) => setDetailsForm((m) => ({ ...m, subtitle_nl: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                      placeholder="e.g. Exclusieve arrangementen"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Subtitle [de]
                    </label>
                    <input
                      type="text"
                      value={detailsForm.subtitle_de}
                      onChange={(e) => setDetailsForm((m) => ({ ...m, subtitle_de: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all"
                      placeholder="e.g. Exklusive Pakete"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions (EN, NL, DE) */}
              <div className="pt-4 border-t border-[#F1EDE8]">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span>📝</span> Description Translations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Description [en]*
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={detailsForm.description_en}
                      onChange={(e) => setDetailsForm((m) => ({ ...m, description_en: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all resize-none"
                      placeholder="Detailed description in English..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Description [nl]
                    </label>
                    <textarea
                      rows={3}
                      value={detailsForm.description_nl}
                      onChange={(e) => setDetailsForm((m) => ({ ...m, description_nl: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all resize-none"
                      placeholder="Gedetailleerde beschrijving in het Nederlands..."
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                      Description [de]
                    </label>
                    <textarea
                      rows={3}
                      value={detailsForm.description_de}
                      onChange={(e) => setDetailsForm((m) => ({ ...m, description_de: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] bg-white transition-all resize-none"
                      placeholder="Ausführliche Beschreibung auf Deutsch..."
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#F1EDE8]">
                <button
                  type="button"
                  onClick={() => setDeleteServiceDialogOpen(true)}
                  disabled={isSavingDetails || isDeletingCurrentService}
                  className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Permanently delete this service"
                >
                  <HiOutlineTrash className="w-4 h-4" />
                  <span>Delete Service</span>
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDetailsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingDetails}
                    className="px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingDetails ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Service Details...</span>
                      </>
                    ) : (
                      <span>Save Service Details</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* DELETE ENTIRE SERVICE CONFIRMATION DIALOG                             */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {deleteServiceDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2DC] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <HiOutlineTrash className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1d1a17]">
                Delete Entire Service?
              </h3>
              <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="font-semibold text-gray-800">
                  &quot;{detailsForm.title_en || serviceData?.title || serviceIdOrType}&quot;
                </span>{" "}
                (type: <span className="font-semibold text-[#8B7355]">{detailsForm.type || serviceIdOrType}</span>)?
                All settings, schedules, and configurations for this service will be permanently deleted. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1EDE8]">
              <button
                type="button"
                disabled={isDeletingCurrentService}
                onClick={() => setDeleteServiceDialogOpen(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingCurrentService}
                onClick={handleConfirmDeleteCurrentService}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeletingCurrentService ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting Service...</span>
                  </>
                ) : (
                  <>
                    <HiOutlineTrash className="w-4 h-4" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: EDIT / CREATE ACTIVITY DIALOG                              */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-[#F1EDE8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B7355]/10 flex items-center justify-center text-[#8B7355]">
                  <HiOutlineCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
                    {editingActivityIndex === null ? "Create New Activity Session" : "Edit Activity Session"}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Configure pricing, session details, multi-language titles/descriptions, and features.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivityModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-colors"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Error */}
            {activityModalError && (
              <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {activityModalError}
              </div>
            )}

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSaveActivityModal} className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Activity Image Upload */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8]">
                <label className="block text-xs font-bold text-[#64748B] mb-2 uppercase tracking-wide">
                  Activity Session Image
                </label>
                <div className="flex items-center gap-5">
                  <div className="w-28 h-24 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] overflow-hidden flex items-center justify-center relative flex-shrink-0 shadow-xs">
                    {previewActivityImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewActivityImage}
                        alt="Activity preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-[#94A3B8] text-center px-2">No image</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => activityFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <HiOutlineCamera className="w-4 h-4" />
                      <span>{previewActivityImage ? "Change Image" : "Upload Image"}</span>
                    </button>
                    <p className="text-[11px] text-[#94A3B8]">Supports JPG, PNG, WEBP (Max 5MB)</p>
                    <input
                      ref={activityFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleActivityImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Operational Fields */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <HiOutlineClock className="w-4 h-4" />
                  <span>Session Specifications</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Price Per Ticket €</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={activityForm.price}
                      onChange={(e) => setActivityForm((s) => ({ ...s, price: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Max Capacity</label>
                    <input
                      type="number"
                      required
                      value={activityForm.capacity}
                      onChange={(e) => setActivityForm((s) => ({ ...s, capacity: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Teacher / Host</label>
                    <input
                      type="text"
                      value={activityForm.host}
                      onChange={(e) => setActivityForm((s) => ({ ...s, host: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                      placeholder="e.g. Elena Rostova"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Date (Optional)</label>
                    <input
                      type="date"
                      value={activityForm.date}
                      onChange={(e) => setActivityForm((s) => ({ ...s, date: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Start Time</label>
                    <input
                      type="time"
                      value={activityForm.open_time}
                      onChange={(e) => setActivityForm((s) => ({ ...s, open_time: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">End Time</label>
                    <input
                      type="time"
                      value={activityForm.close_time}
                      onChange={(e) => setActivityForm((s) => ({ ...s, close_time: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-4 sm:col-span-3">
                    <input
                      type="checkbox"
                      id="modal_act_avail"
                      checked={activityForm.is_available}
                      onChange={(e) => setActivityForm((s) => ({ ...s, is_available: e.target.checked }))}
                      className="w-4 h-4 rounded text-[#8B7355] focus:ring-[#8B7355]"
                    />
                    <label htmlFor="modal_act_avail" className="text-xs font-semibold text-[#1d1a17] cursor-pointer">
                      Session Available for User Bookings
                    </label>
                  </div>
                </div>
              </div>

              {/* Title Translations */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌐</span> Title Translations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {( ["en", "nl", "de"] as const).map((lang) => (
                    <div key={lang}>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Title [{lang.toUpperCase()}]{lang === "en" ? "*" : ""}
                      </label>
                      <input
                        type="text"
                        required={lang === "en"}
                        value={(activityForm as any)[`title_${lang}`]}
                        onChange={(e) => setActivityForm((s) => ({ ...s, [`title_${lang}`]: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] transition-all"
                        placeholder={`Activity title in ${lang.toUpperCase()}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Translations */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <span>📝</span> Description Translations
                </h4>
                <div className="space-y-3">
                  {( ["en", "nl", "de"] as const).map((lang) => (
                    <div key={lang}>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Description [{lang.toUpperCase()}]{lang === "en" ? "*" : ""}
                      </label>
                      <textarea
                        rows={2}
                        required={lang === "en"}
                        value={(activityForm as any)[`description_${lang}`]}
                        onChange={(e) => setActivityForm((s) => ({ ...s, [`description_${lang}`]: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] transition-all resize-none"
                        placeholder={`Description in ${lang.toUpperCase()}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes Translations */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <span>📋</span> Additional Notes Translations
                </h4>
                <div className="space-y-3">
                  {( ["en", "nl", "de"] as const).map((lang) => (
                    <div key={lang}>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Additional Notes [{lang.toUpperCase()}]
                      </label>
                      <textarea
                        rows={2}
                        value={(activityForm as any)[`additional_notes_${lang}`]}
                        onChange={(e) => setActivityForm((s) => ({ ...s, [`additional_notes_${lang}`]: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] transition-all resize-none"
                        placeholder={`Additional notes in ${lang.toUpperCase()}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Features CRUD */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                    <span>✨</span> Activity Features ({activityFeatures.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setActivityFeatures((prev) => [
                        ...prev,
                        { feature: "", feature_en: "", feature_nl: "", feature_de: "" },
                      ])
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#8B7355]/10 text-[#8B7355] hover:bg-[#8B7355]/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <HiOutlinePlus className="w-3.5 h-3.5" /> Add Feature
                  </button>
                </div>
                {activityFeatures.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic">No features added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {activityFeatures.map((feat, fi) => (
                      <div key={fi} className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => setActivityFeatures((prev) => prev.filter((_, i) => i !== fi))}
                          className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <HiOutlineTrash className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-[11px] font-bold text-[#8B7355] uppercase tracking-wide">
                          Feature #{fi + 1}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {( ["en", "nl", "de"] as const).map((lang) => (
                            <div key={lang}>
                              <label className="block text-[10px] font-semibold text-[#94A3B8] mb-1">
                                Feature [{lang.toUpperCase()}]
                              </label>
                              <input
                                type="text"
                                value={(feat as any)[`feature_${lang}`]}
                                onChange={(e) =>
                                  setActivityFeatures((prev) =>
                                    prev.map((f, i) =>
                                      i === fi
                                        ? {
                                            ...f,
                                            [`feature_${lang}`]: e.target.value,
                                            feature: lang === "en" ? e.target.value : f.feature,
                                          }
                                        : f
                                    )
                                  )
                                }
                                className="w-full px-3 py-2 rounded-lg text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:ring-1 focus:ring-[#8B7355]/30 focus:border-[#8B7355] transition-all"
                                placeholder={`Feature in ${lang.toUpperCase()}...`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1EDE8]">
                <button
                  type="button"
                  onClick={() => setActivityModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingActivityModal}
                  className="px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingActivityModal ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Activity...</span>
                    </>
                  ) : (
                    <span>Save Activity</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: EDIT / CREATE PACKAGE DIALOG                               */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {packageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 pb-4 border-b border-[#F1EDE8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8B7355]/10 flex items-center justify-center text-[#8B7355]">
                  <HiOutlineCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
                    {editingPackageIndex === null ? "Create New Package" : "Edit Package"}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Configure package pricing, included services, translations, and features.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPackageModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer transition-colors"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Error */}
            {packageModalError && (
              <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                {packageModalError}
              </div>
            )}

            {/* Modal Body / Scrollable Form */}
            <form onSubmit={handleSavePackageModal} className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Package Image Upload */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8]">
                <label className="block text-xs font-bold text-[#64748B] mb-2 uppercase tracking-wide">
                  Package Banner Image
                </label>
                <div className="flex items-center gap-5">
                  <div className="w-28 h-24 rounded-2xl bg-[#F8FAFC] border-2 border-dashed border-[#CBD5E1] overflow-hidden flex items-center justify-center relative flex-shrink-0 shadow-xs">
                    {previewPackageImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewPackageImage}
                        alt="Package preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-[#94A3B8] text-center px-2">No image</span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => packageFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl border border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355]/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <HiOutlineCamera className="w-4 h-4" />
                      <span>{previewPackageImage ? "Change Image" : "Upload Image"}</span>
                    </button>
                    <p className="text-[11px] text-[#94A3B8]">Supports JPG, PNG, WEBP (Max 5MB)</p>
                    <input
                      ref={packageFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePackageImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Included Services */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <span>📦</span> Pricing & Included Services
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Package Price €</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={packageForm.price}
                      onChange={(e) => setPackageForm((s) => ({ ...s, price: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] mb-2">Included Services</label>
                    <div className="flex flex-wrap gap-2">
                      {["private_sauna", "shared_sauna", "saltroom", "activity", "lunchroom"].map((svc) => {
                        const included = packageForm.included_packages.includes(svc);
                        return (
                          <button
                            key={svc}
                            type="button"
                            onClick={() =>
                              setPackageForm((p) => ({
                                ...p,
                                included_packages: included
                                  ? p.included_packages.filter((x) => x !== svc)
                                  : [...p.included_packages, svc],
                              }))
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              included
                                ? "bg-[#8B7355] text-white shadow-xs"
                                : "bg-white border border-[#CBD5E1] text-[#64748B] hover:bg-[#F8FAFC]"
                            }`}
                          >
                            {included ? "✓ " : "+ "}
                            {svc.replace(/_/g, " ")}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Title Translations */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌐</span> Title Translations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {( ["en", "nl", "de"] as const).map((lang) => (
                    <div key={lang}>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Title [{lang.toUpperCase()}]{lang === "en" ? "*" : ""}
                      </label>
                      <input
                        type="text"
                        required={lang === "en"}
                        value={(packageForm as any)[`title_${lang}`]}
                        onChange={(e) => setPackageForm((s) => ({ ...s, [`title_${lang}`]: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] transition-all"
                        placeholder={`Package title in ${lang.toUpperCase()}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Translations */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
                <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                  <span>📝</span> Description Translations
                </h4>
                <div className="space-y-3">
                  {( ["en", "nl", "de"] as const).map((lang) => (
                    <div key={lang}>
                      <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                        Description [{lang.toUpperCase()}]{lang === "en" ? "*" : ""}
                      </label>
                      <textarea
                        rows={2}
                        required={lang === "en"}
                        value={(packageForm as any)[`description_${lang}`]}
                        onChange={(e) => setPackageForm((s) => ({ ...s, [`description_${lang}`]: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:ring-2 focus:ring-[#8B7355]/20 focus:border-[#8B7355] transition-all resize-none"
                        placeholder={`Description in ${lang.toUpperCase()}...`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Features CRUD */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5]/50 border border-[#F1EDE8] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#8B7355] uppercase tracking-wider flex items-center gap-1.5">
                    <span>✨</span> Package Features ({packageFeatures.length})
                  </h4>
                  <button
                    type="button"
                    onClick={() =>
                      setPackageFeatures((prev) => [
                        ...prev,
                        { feature: "", feature_en: "", feature_nl: "", feature_de: "" },
                      ])
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#8B7355]/10 text-[#8B7355] hover:bg-[#8B7355]/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <HiOutlinePlus className="w-3.5 h-3.5" /> Add Feature
                  </button>
                </div>
                {packageFeatures.length === 0 ? (
                  <p className="text-xs text-[#94A3B8] italic">No features added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {packageFeatures.map((feat, fi) => (
                      <div key={fi} className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => setPackageFeatures((prev) => prev.filter((_, i) => i !== fi))}
                          className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <HiOutlineTrash className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-[11px] font-bold text-[#8B7355] uppercase tracking-wide">
                          Feature #{fi + 1}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {( ["en", "nl", "de"] as const).map((lang) => (
                            <div key={lang}>
                              <label className="block text-[10px] font-semibold text-[#94A3B8] mb-1">
                                Feature [{lang.toUpperCase()}]
                              </label>
                              <input
                                type="text"
                                value={(feat as any)[`feature_${lang}`]}
                                onChange={(e) =>
                                  setPackageFeatures((prev) =>
                                    prev.map((f, i) =>
                                      i === fi
                                        ? {
                                            ...f,
                                            [`feature_${lang}`]: e.target.value,
                                            feature: lang === "en" ? e.target.value : f.feature,
                                          }
                                        : f
                                    )
                                  )
                                }
                                className="w-full px-3 py-2 rounded-lg text-xs text-[#1d1a17] border border-[#E2E8F0] bg-white focus:ring-1 focus:ring-[#8B7355]/30 focus:border-[#8B7355] transition-all"
                                placeholder={`Feature in ${lang.toUpperCase()}...`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1EDE8]">
                <button
                  type="button"
                  onClick={() => setPackageModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPackageModal}
                  className="px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingPackageModal ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Package...</span>
                    </>
                  ) : (
                    <span>Save Package</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 3: DELETE CONFIRMATION DIALOG                                 */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2DC] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <HiOutlineTrash className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1d1a17]">
                Delete {itemToDelete.type === "activity" ? "Activity Session" : "Service Package"}?
              </h3>
              <p className="text-xs text-[#64748B] mt-1">
                Are you sure you want to permanently delete "{itemToDelete.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1EDE8]">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODAL: SERVICE FEATURE (ADD / EDIT)                                 */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {featureModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E8E2DC] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#F1EDE8]">
              <div>
                <h2 className="text-lg font-bold font-displayPlayFair text-[#1d1a17]">
                  {editingFeature ? "Edit Feature" : "Add New Feature"}
                  {featureModalTarget?.sectionName && (
                    <span className="text-[#8B7355] ml-2 text-xs font-sans font-bold uppercase tracking-wider">
                      • {featureModalTarget.sectionName}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Configure feature title in 3 languages (EN, NL, DE) and pricing
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFeatureModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Error banner */}
            {featureModalError && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs border border-red-100">
                {featureModalError}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSaveFeatureModal} className="flex-grow overflow-y-auto p-6 space-y-5">
              {/* Multilingual Titles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#8B7355] uppercase tracking-wider">
                    Feature Name Translations
                  </span>
                  <span className="text-[10px] text-gray-400">English is required</span>
                </div>

                {/* English */}
                <div>
                  <label className="block text-xs font-semibold text-[#1d1a17] mb-1.5 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F5] text-[#8B7355] border border-[#E8E2DC]">
                      EN
                    </span>
                    English Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heated Towels"
                    value={featureForm.feature_en}
                    onChange={(e) => setFeatureForm((f) => ({ ...f, feature_en: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:border-[#8B7355] focus:outline-hidden bg-white"
                  />
                </div>

                {/* Dutch */}
                <div>
                  <label className="block text-xs font-semibold text-[#1d1a17] mb-1.5 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F5] text-[#8B7355] border border-[#E8E2DC]">
                      NL
                    </span>
                    Dutch Title (Nederlands)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Verwarmde Handdoeken"
                    value={featureForm.feature_nl}
                    onChange={(e) => setFeatureForm((f) => ({ ...f, feature_nl: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:border-[#8B7355] focus:outline-hidden bg-white"
                  />
                </div>

                {/* German */}
                <div>
                  <label className="block text-xs font-semibold text-[#1d1a17] mb-1.5 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FAF8F5] text-[#8B7355] border border-[#E8E2DC]">
                      DE
                    </span>
                    German Title (Deutsch)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Beheizte Handtücher"
                    value={featureForm.feature_de}
                    onChange={(e) => setFeatureForm((f) => ({ ...f, feature_de: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:border-[#8B7355] focus:outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Price Field */}
              <div className="pt-3 border-t border-[#F1EDE8]">
                <label className="block text-xs font-semibold text-[#1d1a17] mb-1.5">
                  Price € (Optional / Add-on Price)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">€</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={featureForm.price}
                    onChange={(e) => setFeatureForm((f) => ({ ...f, price: e.target.value }))}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl text-xs text-[#1d1a17] border border-[#E2E8F0] focus:border-[#8B7355] focus:outline-hidden bg-white"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Enter 0.00 if this feature is included for free in the session.
                </p>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-[#F1EDE8]">
                {editingFeature ? (
                  <button
                    type="button"
                    onClick={() => {
                      const f = editingFeature;
                      setFeatureModalOpen(false);
                      setFeatureToDelete({
                        id: f.id,
                        title: f.feature_en || f.feature,
                        service_type: featureModalTarget?.service_type || "sauna",
                        sub_type: featureModalTarget?.sub_type,
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                    <span>Delete Feature</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSavingFeature}
                    onClick={() => setFeatureModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingFeature}
                    className="px-6 py-2.5 rounded-xl bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSavingFeature ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingFeature ? "Update Feature" : "Add Feature"}</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MODAL: FEATURE DELETE CONFIRMATION                                  */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {featureToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8E2DC] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <HiOutlineTrash className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1d1a17]">Delete Feature?</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Are you sure you want to permanently delete feature &ldquo;{featureToDelete.title}&rdquo;? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1EDE8]">
              <button
                type="button"
                disabled={isDeletingFeature}
                onClick={() => setFeatureToDelete(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingFeature}
                onClick={handleConfirmDeleteFeature}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeletingFeature ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {featureSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d1a17] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white/10 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HiOutlineCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium">{featureSuccessToast}</span>
        </div>
      )}
    </div>
  );
}
