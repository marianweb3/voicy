import { useQuery } from "@tanstack/react-query";
import { dashboardAPI } from "../services/api";

export const useDashboard = () => {
  // Get dashboard KPIs
  const {
    data: dashboardData,
    isLoading: isLoadingDashboard,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ["dashboard", "main"],
    queryFn: () => dashboardAPI.getMainKPIs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    // Data
    dashboardData,
    dashboardKPIs: dashboardData?.data,
    timeUpdate: dashboardData?.time_update,

    // Loading states
    isLoadingDashboard,

    // Error states
    dashboardError,

    // Actions
    refetchDashboard,
  };
};

export const useDashboardDynamics = (
  range: "week" | "month" | "year" = "year",
  type: "calls" | "ai_avg" = "ai_avg"
) => {
  const {
    data: dynamicsData,
    isLoading: isLoadingDynamics,
    error: dynamicsError,
    refetch: refetchDynamics,
  } = useQuery({
    queryKey: ["dashboard", "dynamics", range, type],
    queryFn: () => dashboardAPI.getDynamics(range, type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    // Data
    dynamicsData,
    dynamicsPoints: dynamicsData?.data,
    timeUpdate: dynamicsData?.time_update,
    currentRange: dynamicsData?.range,
    currentType: dynamicsData?.type,

    // Loading states
    isLoadingDynamics,

    // Error states
    dynamicsError,

    // Actions
    refetchDynamics,
  };
};

export const useDashboardRejects = (
  range: "all" | "year" | "month" | "week" | "day" = "day"
) => {
  const {
    data: rejectsData,
    isLoading: isLoadingRejects,
    error: rejectsError,
    refetch: refetchRejects,
  } = useQuery({
    queryKey: ["dashboard", "rejects", range],
    queryFn: () => dashboardAPI.getRejects(range),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    // Data
    rejectsData,
    rejectsBreakdown: rejectsData?.data?.breakdown,
    rejectsTotals: rejectsData?.data?.totals,
    rejectsInsight: rejectsData?.data?.text,
    timeUpdate: rejectsData?.time_update,
    currentRange: rejectsData?.data?.range,

    // Loading states
    isLoadingRejects,

    // Error states
    rejectsError,

    // Actions
    refetchRejects,
  };
};

export const useDashboardBest = (range: "week" | "month" | "year" = "week") => {
  const {
    data: bestData,
    isLoading: isLoadingBest,
    error: bestError,
    refetch: refetchBest,
  } = useQuery({
    queryKey: ["dashboard", "best", range],
    queryFn: () => dashboardAPI.getBest(range),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    // Data
    bestData,
    bestManagers: bestData?.data,

    // Loading states
    isLoadingBest,

    // Error states
    bestError,

    // Actions
    refetchBest,
  };
};

export const useDashboardWorst = (
  range: "week" | "month" | "year" = "year"
) => {
  const {
    data: worstData,
    isLoading: isLoadingWorst,
    error: worstError,
    refetch: refetchWorst,
  } = useQuery({
    queryKey: ["dashboard", "worst", range],
    queryFn: () => dashboardAPI.getWorst(range),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  return {
    // Data
    worstData,
    worstManagers: worstData?.data,

    // Loading states
    isLoadingWorst,

    // Error states
    worstError,

    // Actions
    refetchWorst,
  };
};
