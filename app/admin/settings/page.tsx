"use client";

import { useState, useEffect } from "react";
import {
  othersService,
  ContactInfo,
  PrivacyPolicy,
  TermsAndConditions,
} from "@/lib/api/services/othersService";
import {
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCalendar,
  HiOutlineSave,
  HiOutlineRefresh,
  HiOutlineGlobeAlt,
  HiOutlineShare,
} from "react-icons/hi";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function SettingsPage() {
  // ── Business Information State ──
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [loadingContact, setLoadingContact] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [contactMsg, setContactMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Social Media Links State ──
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [loadingSocial, setLoadingSocial] = useState(true);
  const [savingSocial, setSavingSocial] = useState(false);
  const [socialMsg, setSocialMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Privacy Policy State ──
  const [privacyPolicy, setPrivacyPolicy] = useState<Partial<PrivacyPolicy>>({
    effective_date: "",
    info_we_collect: "",
    how_we_use_data: "",
    child_safety: "",
    user_rights: "",
    security: "",
  });
  const [loadingPrivacy, setLoadingPrivacy] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);
  const [privacyMsg, setPrivacyMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Terms & Conditions State ──
  const [terms, setTerms] = useState<Partial<TermsAndConditions>>({
    effective_date: "",
    acceptance_of_terms: "",
    user_responsibilities: "",
    ticket_purchase: "",
    refund_policy: "",
    limitation_of_liability: "",
    changes_to_terms: "",
  });
  const [loadingTerms, setLoadingTerms] = useState(true);
  const [savingTerms, setSavingTerms] = useState(false);
  const [termsMsg, setTermsMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch all settings data on mount
  useEffect(() => {
    fetchContactInfo();
    fetchSocialMediaLinks();
    fetchPrivacyPolicy();
    fetchTerms();
  }, []);

  // 1. Fetch Contact Info
  const fetchContactInfo = async () => {
    try {
      setLoadingContact(true);
      const res = await othersService.getContactInfo();
      if (res && res.data) {
        setContactEmail(res.data.email || "");
        setContactPhone(res.data.phone || "");
        setContactAddress(res.data.address || "");
      }
    } catch (err: any) {
      console.error("Failed to load contact info:", err);
    } finally {
      setLoadingContact(false);
    }
  };

  // 1b. Fetch Social Media Links
  const fetchSocialMediaLinks = async () => {
    try {
      setLoadingSocial(true);
      const res = await othersService.getSocialMediaLinks();
      if (res) {
        if (res.links) {
          setFacebookUrl(res.links.facebook || "");
          setInstagramUrl(res.links.instagram || "");
          setTwitterUrl(res.links.twitter || "");
        } else if (Array.isArray(res.data)) {
          res.data.forEach((item: any) => {
            if (item.media_type === "facebook") setFacebookUrl(item.url || "");
            if (item.media_type === "instagram") setInstagramUrl(item.url || "");
            if (item.media_type === "twitter") setTwitterUrl(item.url || "");
          });
        }
      }
    } catch (err: any) {
      console.error("Failed to load social media links:", err);
    } finally {
      setLoadingSocial(false);
    }
  };

  // Save Social Media Links
  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSocial(true);
      setSocialMsg(null);

      const res = await othersService.updateSocialMediaLinks({
        facebook: facebookUrl.trim(),
        instagram: instagramUrl.trim(),
        twitter: twitterUrl.trim(),
      });

      if (res && res.success !== false) {
        setSocialMsg({ type: "success", text: res.message || "Social media links updated successfully." });
        if (res.links) {
          setFacebookUrl(res.links.facebook || "");
          setInstagramUrl(res.links.instagram || "");
          setTwitterUrl(res.links.twitter || "");
        }
      } else {
        setSocialMsg({ type: "error", text: res?.message || "Failed to update social media links." });
      }
    } catch (err: any) {
      setSocialMsg({ type: "error", text: err?.message || "Failed to update social media links." });
    } finally {
      setSavingSocial(false);
    }
  };

  // 2. Fetch Privacy Policy
  const fetchPrivacyPolicy = async () => {
    try {
      setLoadingPrivacy(true);
      const res = await othersService.getPrivacyPolicy();
      if (res && res.data) {
        setPrivacyPolicy({
          effective_date: res.data.effective_date || "",
          info_we_collect: res.data.info_we_collect || "",
          how_we_use_data: res.data.how_we_use_data || "",
          child_safety: res.data.child_safety || "",
          user_rights: res.data.user_rights || "",
          security: res.data.security || "",
        });
      }
    } catch (err: any) {
      console.error("Failed to load privacy policy:", err);
    } finally {
      setLoadingPrivacy(false);
    }
  };

  // 3. Fetch Terms & Conditions
  const fetchTerms = async () => {
    try {
      setLoadingTerms(true);
      const res = await othersService.getTermsAndConditions();
      if (res && res.data) {
        setTerms({
          effective_date: res.data.effective_date || "",
          acceptance_of_terms: res.data.acceptance_of_terms || "",
          user_responsibilities: res.data.user_responsibilities || "",
          ticket_purchase: res.data.ticket_purchase || "",
          refund_policy: res.data.refund_policy || "",
          limitation_of_liability: res.data.limitation_of_liability || "",
          changes_to_terms: res.data.changes_to_terms || "",
        });
      }
    } catch (err: any) {
      console.error("Failed to load terms & conditions:", err);
    } finally {
      setLoadingTerms(false);
    }
  };

  // Save Contact Info
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingContact(true);
      setContactMsg(null);
      const res = await othersService.updateContactInfo({
        email: contactEmail.trim(),
        phone: contactPhone.trim(),
        address: contactAddress.trim(),
      });
      if (res && res.success) {
        setContactMsg({ type: "success", text: res.message || "Contact info updated successfully." });
      } else {
        setContactMsg({ type: "error", text: "Failed to update contact info." });
      }
    } catch (err: any) {
      setContactMsg({ type: "error", text: err?.message || "Failed to update contact info." });
    } finally {
      setSavingContact(false);
    }
  };

  // Save Privacy Policy
  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingPrivacy(true);
      setPrivacyMsg(null);
      const res = await othersService.updatePrivacyPolicy(privacyPolicy);
      if (res && res.success) {
        setPrivacyMsg({ type: "success", text: res.message || "Privacy policy updated successfully." });
      } else {
        setPrivacyMsg({ type: "error", text: "Failed to update privacy policy." });
      }
    } catch (err: any) {
      setPrivacyMsg({ type: "error", text: err?.message || "Failed to update privacy policy." });
    } finally {
      setSavingPrivacy(false);
    }
  };

  // Save Terms and Conditions
  const handleSaveTerms = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingTerms(true);
      setTermsMsg(null);
      const res = await othersService.updateTermsAndConditions(terms);
      if (res && res.success) {
        setTermsMsg({ type: "success", text: res.message || "Terms and conditions updated successfully." });
      } else {
        setTermsMsg({ type: "error", text: "Failed to update terms and conditions." });
      }
    } catch (err: any) {
      setTermsMsg({ type: "error", text: err?.message || "Failed to update terms and conditions." });
    } finally {
      setSavingTerms(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-8 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2DC]">
        <div>
          <h1 className="font-displayPlayFair text-2xl sm:text-3xl font-bold text-[#1d1a17]">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5 font-cambria">
            Manage business contact info, privacy policies, and terms & conditions.
          </p>
        </div>
        <button
          onClick={() => {
            fetchContactInfo();
            fetchSocialMediaLinks();
            fetchPrivacyPolicy();
            fetchTerms();
          }}
          className="px-3.5 py-2 bg-white hover:bg-[#FAF8F5] text-[#1d1a17] text-xs font-semibold rounded-xl border border-[#E8E2DC] transition-all shadow-2xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <HiOutlineRefresh className="w-4 h-4 text-[#8B7355]" />
          <span>Refresh All</span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 1: BUSINESS INFORMATION ──                               */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <form onSubmit={handleSaveContact} className="bg-white border border-[#E8E2DC] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#F1EDE8] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] flex items-center justify-center text-[#8B7355]">
              <HiOutlineMail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1d1a17] font-cambria">Business Contact Information</h2>
              <p className="text-xs text-[#64748B]">
                Active contact details displayed across the website and emails.
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={savingContact || loadingContact}
            className="px-4 py-2 bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {savingContact ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineSave className="w-4 h-4" />
            )}
            <span>Save Contact Info</span>
          </button>
        </div>

        {contactMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              contactMsg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            {contactMsg.type === "success" ? (
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <HiOutlineInformationCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{contactMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria flex items-center gap-1.5">
              <HiOutlineMail className="w-4 h-4 text-[#8B7355]" />
              Business Email <span className="text-rose-600">*</span>
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="e.g. hello@serene.com"
              className="w-full border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#8B7355] transition-colors bg-white font-medium"
            />
          </div>

          {/* Business Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria flex items-center gap-1.5">
              <HiOutlinePhone className="w-4 h-4 text-[#8B7355]" />
              Business Phone <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g. +31 20 123 4567"
              className="w-full border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#8B7355] transition-colors bg-white font-medium"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-[#475569] font-cambria flex items-center gap-1.5">
              <HiOutlineLocationMarker className="w-4 h-4 text-[#8B7355]" />
              Physical Address <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder="e.g. Singel 450, 1017 AW Amsterdam, Netherlands"
              className="w-full border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#8B7355] transition-colors bg-white font-medium"
            />
          </div>
        </div>
      </form>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: SOCIAL MEDIA LINKS ──                                 */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <form onSubmit={handleSaveSocial} className="bg-white border border-[#E8E2DC] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#F1EDE8] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] flex items-center justify-center text-[#8B7355]">
              <HiOutlineShare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1d1a17] font-cambria">Social Media Links</h2>
              <p className="text-xs text-[#64748B]">
                Configure public social media profile links (Facebook, Instagram, Twitter) shown across the website footer and branding.
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={savingSocial || loadingSocial}
            className="px-4 py-2 bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {savingSocial ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineSave className="w-4 h-4" />
            )}
            <span>Save Social Links</span>
          </button>
        </div>

        {socialMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              socialMsg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            {socialMsg.type === "success" ? (
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <HiOutlineInformationCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{socialMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Facebook */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria flex items-center gap-1.5">
              <FaFacebook className="w-4 h-4 text-[#1877F2]" />
              Facebook URL
            </label>
            <input
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/havenwellness"
              className="w-full border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#8B7355] transition-colors bg-white font-medium"
            />
          </div>

          {/* Instagram */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria flex items-center gap-1.5">
              <FaInstagram className="w-4 h-4 text-[#E4405F]" />
              Instagram URL
            </label>
            <input
              type="url"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/havenwellness"
              className="w-full border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#8B7355] transition-colors bg-white font-medium"
            />
          </div>

          {/* Twitter / X */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria flex items-center gap-1.5">
              <FaTwitter className="w-4 h-4 text-[#1DA1F2]" />
              Twitter URL
            </label>
            <input
              type="url"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              placeholder="https://twitter.com/havenwellness"
              className="w-full border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-[#8B7355] transition-colors bg-white font-medium"
            />
          </div>
        </div>
      </form>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 3: PRIVACY POLICY ──                                     */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <form onSubmit={handleSavePrivacy} className="bg-white border border-[#E8E2DC] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#F1EDE8] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] flex items-center justify-center text-[#8B7355]">
              <HiOutlineShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1d1a17] font-cambria">Privacy Policy</h2>
              <p className="text-xs text-[#64748B]">
                Public data privacy terms, GDPR compliance, and user rights policies.
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={savingPrivacy || loadingPrivacy}
            className="px-4 py-2 bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {savingPrivacy ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineSave className="w-4 h-4" />
            )}
            <span>Save Privacy Policy</span>
          </button>
        </div>

        {privacyMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              privacyMsg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            {privacyMsg.type === "success" ? (
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <HiOutlineInformationCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{privacyMsg.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Effective Date */}
          <div className="w-full sm:w-1/3 space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria flex items-center gap-1.5">
              <HiOutlineCalendar className="w-4 h-4 text-[#8B7355]" />
              Effective Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={privacyPolicy.effective_date || ""}
              onChange={(e) => setPrivacyPolicy({ ...privacyPolicy, effective_date: e.target.value })}
              className="w-full border border-[#CBD5E1] rounded-xl px-4 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* Info We Collect */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              1. Information We Collect
            </label>
            <textarea
              rows={3}
              value={privacyPolicy.info_we_collect || ""}
              onChange={(e) => setPrivacyPolicy({ ...privacyPolicy, info_we_collect: e.target.value })}
              placeholder="Describe personal info collected (name, email, phone, reservation details)..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* How We Use Data */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              2. How We Use Information
            </label>
            <textarea
              rows={3}
              value={privacyPolicy.how_we_use_data || ""}
              onChange={(e) => setPrivacyPolicy({ ...privacyPolicy, how_we_use_data: e.target.value })}
              placeholder="Describe data usage (booking confirmations, entry access codes, communications)..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* Child Safety */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              3. Child & Minor Privacy
            </label>
            <textarea
              rows={2}
              value={privacyPolicy.child_safety || ""}
              onChange={(e) => setPrivacyPolicy({ ...privacyPolicy, child_safety: e.target.value })}
              placeholder="State policy regarding minors (e.g. services intended for adults 18+)..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* User Rights */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              4. User Rights & Data Protection (GDPR)
            </label>
            <textarea
              rows={3}
              value={privacyPolicy.user_rights || ""}
              onChange={(e) => setPrivacyPolicy({ ...privacyPolicy, user_rights: e.target.value })}
              placeholder="Outline customer rights: access, rectification, portability, data deletion..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* Security */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              5. Data Security Measures
            </label>
            <textarea
              rows={2}
              value={privacyPolicy.security || ""}
              onChange={(e) => setPrivacyPolicy({ ...privacyPolicy, security: e.target.value })}
              placeholder="Explain industry-standard encryption, SSL, and payment security..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>
        </div>
      </form>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* ── SECTION 3: TERMS AND CONDITIONS ──                               */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <form onSubmit={handleSaveTerms} className="bg-white border border-[#E8E2DC] rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#F1EDE8] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2DC] flex items-center justify-center text-[#8B7355]">
              <HiOutlineDocumentText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1d1a17] font-cambria">Terms & Conditions</h2>
              <p className="text-xs text-[#64748B]">
                Operating rules, booking policies, cancellations, and terms of service.
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={savingTerms || loadingTerms}
            className="px-4 py-2 bg-[#8B7355] hover:bg-[#705b41] text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {savingTerms ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <HiOutlineSave className="w-4 h-4" />
            )}
            <span>Save Terms & Conditions</span>
          </button>
        </div>

        {termsMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              termsMsg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-700"
            }`}
          >
            {termsMsg.type === "success" ? (
              <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <HiOutlineInformationCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{termsMsg.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Effective Date */}
          <div className="w-full sm:w-1/3 space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria flex items-center gap-1.5">
              <HiOutlineCalendar className="w-4 h-4 text-[#8B7355]" />
              Effective Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={terms.effective_date || ""}
              onChange={(e) => setTerms({ ...terms, effective_date: e.target.value })}
              className="w-full border border-[#CBD5E1] rounded-xl px-4 py-2 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* Acceptance of Terms */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              1. Acceptance of Terms
            </label>
            <textarea
              rows={3}
              value={terms.acceptance_of_terms || ""}
              onChange={(e) => setTerms({ ...terms, acceptance_of_terms: e.target.value })}
              placeholder="State user agreement upon browsing, booking, or using facilities..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* User Responsibilities */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              2. Guest Responsibilities & Conduct
            </label>
            <textarea
              rows={3}
              value={terms.user_responsibilities || ""}
              onChange={(e) => setTerms({ ...terms, user_responsibilities: e.target.value })}
              placeholder="Health declarations, facility cleanliness, respecting silence, safety rules..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* Ticket Purchase */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              3. Bookings, Passes & Payments
            </label>
            <textarea
              rows={3}
              value={terms.ticket_purchase || ""}
              onChange={(e) => setTerms({ ...terms, ticket_purchase: e.target.value })}
              placeholder="Advance payment requirements, session pass usage limits, validity..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* Refund Policy */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              4. Cancellations & Refund Policy
            </label>
            <textarea
              rows={3}
              value={terms.refund_policy || ""}
              onChange={(e) => setTerms({ ...terms, refund_policy: e.target.value })}
              placeholder="State cancellation notice windows (e.g. 24h in advance), refund percentage, rescheduling..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* Limitation of Liability */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              5. Limitation of Liability
            </label>
            <textarea
              rows={2}
              value={terms.limitation_of_liability || ""}
              onChange={(e) => setTerms({ ...terms, limitation_of_liability: e.target.value })}
              placeholder="Facility disclaimers, personal belongings, health suitability..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>

          {/* Changes to Terms */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#475569] font-cambria block">
              6. Modifications to Terms
            </label>
            <textarea
              rows={2}
              value={terms.changes_to_terms || ""}
              onChange={(e) => setTerms({ ...terms, changes_to_terms: e.target.value })}
              placeholder="Right to amend terms and effective notice to guests..."
              className="w-full border border-[#CBD5E1] rounded-xl p-3 text-xs text-[#0f172a] focus:outline-none focus:border-[#8B7355] bg-white font-medium"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
