"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { dashboardService, UserDashboardResponse, DashboardSubscriptionPassItem } from "@/lib/api";

export interface UserSubscriptionItem {
  id: number | string;
  plan_name: string;
  plan_code?: string;
  service_type?: string;
  status: "active" | "canceled" | "expired" | string;
  billing_period?: string;
  price?: string | number;
  sessions_remaining?: number;
  total_sessions?: number;
  expires_at?: string | null;
  started_at?: string;
  category?: string;
  [key: string]: any;
}

interface DashboardContextType {
  dashboardData: UserDashboardResponse | null;
  subscriptions: UserSubscriptionItem[];
  loading: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
  updateProfileState: (updatedProfile: Partial<UserDashboardResponse["profile"]>) => void;
}

const DashboardContext = createContext<DashboardContextType>({
  dashboardData: null,
  subscriptions: [],
  loading: true,
  error: null,
  refreshDashboard: async () => {},
  updateProfileState: () => {},
});

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState<UserDashboardResponse | null>(null);
  const [subscriptions, setSubscriptions] = useState<UserSubscriptionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    if (!isRefresh && dashboardData) return;
    try {
      setLoading(true);
      setError(null);

      const data = await dashboardService.getUserDashboard();
      setDashboardData(data);

      // Map from data.home.subscriptions_and_passes if provided by unified API
      const apiSubs = data.home?.subscriptions_and_passes || [];
      const subs: UserSubscriptionItem[] = apiSubs.map((item: DashboardSubscriptionPassItem) => ({
        id: item.purchase_id,
        plan_name: item.name,
        plan_code: item.purchase_type,
        service_type: item.category,
        category: item.category,
        status: item.is_expired ? "expired" : (item.status === "confirmed" ? "active" : item.status),
        billing_period: item.purchase_type === "subscription" ? "Subscription" : "Session Pass",
        price: item.amount,
        sessions_remaining: item.remaining_sessions,
        total_sessions: item.total_sessions,
        expires_at: item.end_date,
        started_at: item.start_date,
      }));

      setSubscriptions(subs);
    } catch (err: any) {
      console.error("DashboardProvider error:", err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [dashboardData]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refreshDashboard = useCallback(async () => {
    await fetchDashboard(true);
  }, [fetchDashboard]);

  const updateProfileState = useCallback((updatedProfile: Partial<UserDashboardResponse["profile"]>) => {
    setDashboardData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        profile: {
          ...prev.profile,
          ...updatedProfile,
        },
      };
    });
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dashboardData,
        subscriptions,
        loading,
        error,
        refreshDashboard,
        updateProfileState,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
