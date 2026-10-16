"use client";

import { useEffect, useState } from "react";
import {
  paymentsService,
  SessionPassItem,
  SubscriptionPlanItem,
  PlanFeature,
} from "@/lib/api/services/paymentsService";
import { parseApiErrorMessage } from "@/lib/api/types";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
  FiLayers,
  FiRepeat,
} from "react-icons/fi";
import { MdCardMembership, MdOutlineWorkspacePremium } from "react-icons/md";
import { FaSpa } from "react-icons/fa";
import { GiSaltShaker } from "react-icons/gi";

export default function AdminSubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "subscriptions" | "passes">("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Data states
  const [sessionPasses, setSessionPasses] = useState<SessionPassItem[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlanItem[]>([]);

  // Modal states
  const [passModalOpen, setPassModalOpen] = useState<boolean>(false);
  const [editingPass, setEditingPass] = useState<SessionPassItem | null>(null);

  const [planModalOpen, setPlanModalOpen] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanItem | null>(null);

  // Delete confirm state
  const [deletingItem, setDeletingItem] = useState<{
    type: "pass" | "plan";
    id: number;
    name: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Forms
  const [passForm, setPassForm] = useState({
    name: "",
    price: "",
    entry_limit: 10,
    featuresText: "",
  });

  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    plan_type: "weekly",
    plan_category: "sauna",
    max_reservations: 10,
    duration_weeks: 4,
    featuresText: "",
  });

  // Fetch all plans and passes
  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await paymentsService.getPlansAndPasses();
      setSessionPasses(Array.isArray(data?.session_passes) ? data.session_passes : []);
      setSubscriptionPlans(Array.isArray(data?.subscription_plans) ? data.subscription_plans : []);
    } catch (err) {
      setError(parseApiErrorMessage(err));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Notification Helper
  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // ─────────────────────────────────────────────────────────────
  // Pass Modal Handlers
  // ─────────────────────────────────────────────────────────────
  const openNewPassModal = () => {
    setEditingPass(null);
    setPassForm({
      name: "",
      price: "",
      entry_limit: 10,
      featuresText: "Valid for 6 months\nAccess to sauna\nTowel included",
    });
    setPassModalOpen(true);
  };

  const openEditPassModal = (pass: SessionPassItem) => {
    setEditingPass(pass);
    const featStr = (pass.features || []).map((f) => f.feature || (f as any).name || "").join("\n");
    setPassForm({
      name: pass.name || "",
      price: String(pass.price || ""),
      entry_limit: pass.entry_limit || 10,
      featuresText: featStr,
    });
    setPassModalOpen(true);
  };

  const handleSavePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const feature_list = passForm.featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingPass) {
        await paymentsService.updateSessionPass(editingPass.id, {
          name: passForm.name,
          price: passForm.price,
          entry_limit: Number(passForm.entry_limit),
          feature_list,
        });
        showSuccess(`Session Pass "${passForm.name}" updated successfully.`);
      } else {
        await paymentsService.createSessionPass({
          name: passForm.name,
          price: passForm.price,
          entry_limit: Number(passForm.entry_limit),
          feature_list,
        });
        showSuccess(`New Session Pass "${passForm.name}" created successfully.`);
      }
      setPassModalOpen(false);
      loadData(true);
    } catch (err) {
      setError(parseApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Plan Modal Handlers
  // ─────────────────────────────────────────────────────────────
  const openNewPlanModal = () => {
    setEditingPlan(null);
    setPlanForm({
      name: "",
      price: "",
      plan_type: "weekly",
      plan_category: "sauna",
      max_reservations: 10,
      duration_weeks: 4,
      featuresText: "Once a week session\nMax active reservations: 10\nComplimentary towel",
    });
    setPlanModalOpen(true);
  };

  const openEditPlanModal = (plan: SubscriptionPlanItem) => {
    setEditingPlan(plan);
    const featStr = (plan.features || []).map((f) => f.feature || (f as any).name || "").join("\n");
    setPlanForm({
      name: plan.name || "",
      price: String(plan.price || ""),
      plan_type: plan.plan_type || "weekly",
      plan_category: plan.plan_category || "sauna",
      max_reservations: plan.max_reservations ?? 10,
      duration_weeks: plan.duration_weeks ?? 4,
      featuresText: featStr,
    });
    setPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const feature_list = planForm.featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      if (editingPlan) {
        await paymentsService.updateSubscriptionPlan(editingPlan.id, {
          name: planForm.name,
          price: planForm.price,
          plan_type: planForm.plan_type,
          plan_category: planForm.plan_category,
          max_reservations: Number(planForm.max_reservations),
          duration_weeks: Number(planForm.duration_weeks),
          feature_list,
        });
        showSuccess(`Subscription Plan "${planForm.name}" updated successfully.`);
      } else {
        await paymentsService.createSubscriptionPlan({
          name: planForm.name,
          price: planForm.price,
          plan_type: planForm.plan_type,
          plan_category: planForm.plan_category,
          max_reservations: Number(planForm.max_reservations),
          duration_weeks: Number(planForm.duration_weeks),
          feature_list,
        });
        showSuccess(`Subscription Plan "${planForm.name}" created successfully.`);
      }
      setPlanModalOpen(false);
      loadData(true);
    } catch (err) {
      setError(parseApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Delete Handler
  // ─────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deletingItem) return;
    setSubmitting(true);
    setError(null);

    try {
      if (deletingItem.type === "pass") {
        await paymentsService.deleteSessionPass(deletingItem.id);
        showSuccess(`Session pass "${deletingItem.name}" was removed.`);
      } else {
        await paymentsService.deleteSubscriptionPlan(deletingItem.id);
        showSuccess(`Subscription plan "${deletingItem.name}" was removed.`);
      }
      setDeletingItem(null);
      loadData(true);
    } catch (err) {
      setError(parseApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Bar ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2DC] p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B7355] animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B7355]">
                Membership &amp; Passes Configuration
              </span>
            </div>
            <h1 className="font-displayPlayFair text-2xl md:text-3xl font-bold text-[#1d1a17] mt-0.5">
              Subscriptions &amp; Session Passes
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Manage multi-session punch passes and recurring subscription memberships for sauna and saltroom.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => loadData(true)}
              disabled={loading || refreshing}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#E8E2DC] hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              <FiRefreshCw className={refreshing ? "animate-spin text-[#8B7355]" : ""} size={14} />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              type="button"
              onClick={openNewPassModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF7F2] hover:bg-[#F2ECE4] border border-[#E8E2DC] text-[#8B7355] text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <FiPlus size={14} />
              <span>+ Add Session Pass</span>
            </button>

            <button
              type="button"
              onClick={openNewPlanModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#CFB9A3] hover:bg-[#8B7355] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <FiPlus size={14} />
              <span>+ Add Subscription Plan</span>
            </button>
          </div>
        </div>

        {/* Global Toast Success / Error Alert */}
        {actionSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <FiCheckCircle className="text-emerald-600 flex-shrink-0" size={16} />
            <span className="font-semibold">{actionSuccess}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <FiAlertCircle className="text-rose-600 flex-shrink-0" size={16} />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Quick Tabs Bar */}
        <div className="mt-5 pt-4 border-t border-[#F5F0EB] flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-[#8B7355] text-white shadow-xs"
                : "bg-[#FDFBF9] text-gray-600 hover:text-black border border-[#E8E2DC]"
            }`}
          >
            All Products ({sessionPasses.length + subscriptionPlans.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("subscriptions")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "subscriptions"
                ? "bg-[#8B7355] text-white shadow-xs"
                : "bg-[#FDFBF9] text-gray-600 hover:text-black border border-[#E8E2DC]"
            }`}
          >
            Subscription Plans ({subscriptionPlans.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("passes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "passes"
                ? "bg-[#8B7355] text-white shadow-xs"
                : "bg-[#FDFBF9] text-gray-600 hover:text-black border border-[#E8E2DC]"
            }`}
          >
            Session Passes ({sessionPasses.length})
          </button>
        </div>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E8E2DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Active Subscriptions
            </span>
            <span className="text-3xl font-bold font-displayPlayFair text-[#1d1a17]">
              {subscriptionPlans.length}
            </span>
            <p className="text-[11px] text-gray-500 mt-1">Weekly &amp; Unlimited Plans</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center">
            <MdCardMembership size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E2DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Session Punch Passes
            </span>
            <span className="text-3xl font-bold font-displayPlayFair text-[#1d1a17]">
              {sessionPasses.length}
            </span>
            <p className="text-[11px] text-gray-500 mt-1">Multi-entry packages</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FiLayers size={22} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E8E2DC] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Supported Services
            </span>
            <span className="text-3xl font-bold font-displayPlayFair text-[#1d1a17]">2</span>
            <p className="text-[11px] text-gray-500 mt-1">Sauna &amp; Salt Room (Halotherapy)</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <MdOutlineWorkspacePremium size={24} />
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-12 border border-[#E8E2DC] text-center shadow-xs">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-[#8B7355] border-t-transparent mb-3"></div>
          <p className="text-sm font-semibold text-gray-700">Loading subscriptions and passes...</p>
        </div>
      )}

      {/* ── SECTION 1: SUBSCRIPTION PLANS ── */}
      {!loading && (activeTab === "all" || activeTab === "subscriptions") && (
        <div className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F5F0EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FCF2E9] text-[#8B7355] flex items-center justify-center flex-shrink-0">
                <MdCardMembership size={20} />
              </div>
              <div>
                <h3 className="font-displayPlayFair text-lg font-bold text-[#1d1a17]">
                  Subscription Plans
                </h3>
                <p className="text-xs text-gray-500">
                  Recurring memberships (e.g., Weekly 1 session or Unlimited monthly reservations)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openNewPlanModal}
              className="px-3.5 py-1.5 bg-[#8B7355] hover:bg-[#725e45] text-white text-xs font-bold rounded-xl transition-all shadow-xs self-start sm:self-center"
            >
              + Create Plan
            </button>
          </div>

          {subscriptionPlans.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF7F2] rounded-xl border border-[#E8E2DC] text-xs text-gray-500">
              No subscription plans found. Click &quot;+ Create Plan&quot; to configure your first membership.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscriptionPlans.map((plan) => {
                const isUnlimited = plan.plan_type === "unlimited";
                const isSauna = plan.plan_category === "sauna";

                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-2xl border border-[#E8E2DC] hover:border-[#8B7355] transition-all p-5 flex flex-col justify-between shadow-xs relative group"
                  >
                    <div>
                      {/* Top Category / Type Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            isSauna
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-purple-50 text-purple-800 border border-purple-200"
                          }`}
                        >
                          {isSauna ? <FaSpa size={11} /> : <GiSaltShaker size={12} />}
                          <span>{plan.plan_category || "Service"}</span>
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isUnlimited
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {plan.plan_type || "Standard"}
                        </span>
                      </div>

                      {/* Title & Price */}
                      <h4 className="font-displayPlayFair text-base font-bold text-[#1d1a17] mb-1">
                        {plan.name}
                      </h4>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-bold font-displayPlayFair text-[#8B7355]">
                          €{plan.price}
                        </span>
                        <span className="text-xs text-gray-400 font-sans">
                          / {plan.duration_weeks ? `${plan.duration_weeks} weeks` : "month"}
                        </span>
                      </div>

                      {/* Reservation limit */}
                      <div className="text-[11px] text-gray-600 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8E2DC] mb-3 space-y-1">
                        <div className="flex justify-between">
                          <span>Max Active Bookings:</span>
                          <span className="font-bold text-[#1d1a17]">{plan.max_reservations ?? 10}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Billing Duration:</span>
                          <span className="font-bold text-[#1d1a17]">{plan.duration_weeks || 4} Weeks</span>
                        </div>
                      </div>

                      {/* Features Bullet List */}
                      <div className="space-y-1.5 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                          Included Features
                        </span>
                        {plan.features && plan.features.length > 0 ? (
                          plan.features.map((f, i) => (
                            <div key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                              <FiCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={13} />
                              <span>{f.feature || (f as any).name}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-gray-400 italic">No features listed</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-[#F5F0EB] flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditPlanModal(plan)}
                        className="px-3 py-1.5 rounded-lg border border-[#E8E2DC] text-gray-700 hover:text-black hover:bg-gray-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <FiEdit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeletingItem({
                            type: "plan",
                            id: plan.id,
                            name: plan.name,
                          })
                        }
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs transition-colors"
                        title="Delete Plan"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 2: SESSION PASSES ── */}
      {!loading && (activeTab === "all" || activeTab === "passes") && (
        <div className="bg-white rounded-2xl border border-[#E8E2DC] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F5F0EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <FiLayers size={20} />
              </div>
              <div>
                <h3 className="font-displayPlayFair text-lg font-bold text-[#1d1a17]">
                  Session Passes (Punch Cards)
                </h3>
                <p className="text-xs text-gray-500">
                  Fixed multi-entry cards (e.g., 5 or 10 session passes with custom validities)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openNewPassModal}
              className="px-3.5 py-1.5 bg-[#8B7355] hover:bg-[#725e45] text-white text-xs font-bold rounded-xl transition-all shadow-xs self-start sm:self-center"
            >
              + Create Session Pass
            </button>
          </div>

          {sessionPasses.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF7F2] rounded-xl border border-[#E8E2DC] text-xs text-gray-500">
              No session passes found. Click &quot;+ Create Session Pass&quot; to add one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessionPasses.map((pass) => (
                <div
                  key={pass.id}
                  className="bg-white rounded-2xl border border-[#E8E2DC] hover:border-[#8B7355] transition-all p-5 flex flex-col justify-between shadow-xs relative"
                >
                  <div>
                    {/* Entry Limit Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                        {pass.entry_limit} Sessions Punch Pass
                      </span>
                    </div>

                    <h4 className="font-displayPlayFair text-base font-bold text-[#1d1a17] mb-1">
                      {pass.name}
                    </h4>

                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-2xl font-bold font-displayPlayFair text-[#8B7355]">
                        €{pass.price}
                      </span>
                      <span className="text-xs text-gray-400 font-sans">
                        / {pass.entry_limit} entries
                      </span>
                    </div>

                    {/* Features Bullet List */}
                    <div className="space-y-1.5 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Pass Privileges
                      </span>
                      {pass.features && pass.features.length > 0 ? (
                        pass.features.map((f, i) => (
                          <div key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <FiCheck className="text-emerald-600 flex-shrink-0 mt-0.5" size={13} />
                            <span>{f.feature || (f as any).name}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-gray-400 italic">No features specified</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#F5F0EB] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditPassModal(pass)}
                      className="px-3 py-1.5 rounded-lg border border-[#E8E2DC] text-gray-700 hover:text-black hover:bg-gray-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <FiEdit2 size={12} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeletingItem({
                          type: "pass",
                          id: pass.id,
                          name: pass.name,
                        })
                      }
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs transition-colors"
                      title="Delete Pass"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 1: ADD / EDIT SESSION PASS                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {passModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative border border-[#E8E2DC]">
            <button
              type="button"
              onClick={() => setPassModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <FiX size={18} />
            </button>

            <h3 className="font-displayPlayFair text-xl font-bold text-[#1d1a17] mb-1">
              {editingPass ? "Edit Session Pass" : "New Session Pass"}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Configure session pass entry limit, pricing, and features.
            </p>

            <form onSubmit={handleSavePass} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Pass Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10 Session Pass"
                  value={passForm.name}
                  onChange={(e) => setPassForm({ ...passForm, name: e.target.value })}
                  className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Price (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="180.00"
                    value={passForm.price}
                    onChange={(e) => setPassForm({ ...passForm, price: e.target.value })}
                    className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Entry Limit (Sessions)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={passForm.entry_limit}
                    onChange={(e) => setPassForm({ ...passForm, entry_limit: Number(e.target.value) })}
                    className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Features (one feature per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Valid for 6 months&#10;Access to private/shared sauna&#10;Towel included"
                  value={passForm.featuresText}
                  onChange={(e) => setPassForm({ ...passForm, featuresText: e.target.value })}
                  className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3] resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPassModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E2DC] text-gray-700 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#CFB9A3] hover:bg-[#8b7355] text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingPass ? "Update Pass" : "Create Pass"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 2: ADD / EDIT SUBSCRIPTION PLAN                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative border border-[#E8E2DC]">
            <button
              type="button"
              onClick={() => setPlanModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <FiX size={18} />
            </button>

            <h3 className="font-displayPlayFair text-xl font-bold text-[#1d1a17] mb-1">
              {editingPlan ? "Edit Subscription Plan" : "New Subscription Plan"}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Set plan type (weekly/unlimited), service category, limits, and pricing.
            </p>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Plan Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unlimited Saltroom Monthly"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Price (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="120.00"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3]"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Plan Type</label>
                  <select
                    value={planForm.plan_type}
                    onChange={(e) => setPlanForm({ ...planForm, plan_type: e.target.value })}
                    className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3] cursor-pointer"
                  >
                    <option value="weekly">weekly (1x/week)</option>
                    <option value="unlimited">unlimited</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Category</label>
                  <select
                    value={planForm.plan_category}
                    onChange={(e) => setPlanForm({ ...planForm, plan_category: e.target.value })}
                    className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3] cursor-pointer"
                  >
                    <option value="sauna">sauna</option>
                    <option value="saltroom">saltroom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Max Active Bookings
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={planForm.max_reservations}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, max_reservations: Number(e.target.value) })
                    }
                    className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3]"
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">Max simultaneous bookings allowed</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={planForm.duration_weeks}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, duration_weeks: Number(e.target.value) })
                    }
                    className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3]"
                  />
                  <p className="text-[10px] text-gray-500 mt-0.5">Default 4 weeks (1 month)</p>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Features (one feature per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Unlimited access&#10;Complimentary locker&#10;Member tea lounge"
                  value={planForm.featuresText}
                  onChange={(e) => setPlanForm({ ...planForm, featuresText: e.target.value })}
                  className="w-full border border-[#E8E2DC] rounded-xl p-2.5 bg-white text-[#1d1a17] placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-[#CFB9A3] resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8E2DC] text-gray-700 hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#CFB9A3] hover:bg-[#8b7355] text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL 3: DELETE CONFIRMATION                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative border border-[#E8E2DC] text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <FiTrash2 size={20} />
            </div>
            <h4 className="font-displayPlayFair text-lg font-bold text-[#1d1a17] mb-1">
              Delete {deletingItem.type === "pass" ? "Session Pass" : "Subscription Plan"}?
            </h4>
            <p className="text-xs text-gray-500 mb-5">
              Are you sure you want to remove &quot;{deletingItem.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="flex-1 py-2 rounded-xl border border-[#E8E2DC] text-gray-600 hover:bg-gray-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={confirmDelete}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {submitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
