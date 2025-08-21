import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  managersAPI,
  ManagerCreateRequest,
  ManagerEditRequest,
} from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";

export const useManagers = (
  page: number = 1,
  per_page: number = 10,
  search: string = ""
) => {
  const queryClient = useQueryClient();

  // Get managers list
  const {
    data: managersData,
    isLoading: isLoadingManagers,
    isFetching: isFetchingManagers,
    error: managersError,
    refetch: refetchManagers,
  } = useQuery({
    queryKey: ["managers", page, per_page, search],
    queryFn: () => managersAPI.getCatalog(page, per_page, search),
  });

  // Create manager mutation
  const createManagerMutation = useMutation({
    mutationFn: (managerData: ManagerCreateRequest) =>
      managersAPI.create(managerData),
    onSuccess: () => {
      // Invalidate and refetch managers list
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
    onError: (error) => {
      console.error("Create manager failed:", error);
    },
  });

  // Edit manager mutation
  const editManagerMutation = useMutation({
    mutationFn: ({
      id,
      managerData,
    }: {
      id: number;
      managerData: ManagerEditRequest;
    }) => managersAPI.edit(id, managerData),
    onSuccess: () => {
      // Invalidate and refetch managers list
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
    onError: (error) => {
      console.error("Edit manager failed:", error);
    },
  });

  // Delete manager photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: (id: number) => managersAPI.deletePhoto(id),
    onSuccess: () => {
      // Invalidate and refetch managers list
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
    onError: (error) => {
      console.error("Delete photo failed:", error);
    },
  });

  return {
    // Data
    managers: managersData?.data?.items || [],
    pagination: managersData?.data?.pagination,
    timeUpdate: managersData?.time_update,

    // Loading states
    isLoadingManagers,
    isFetchingManagers,
    isCreatingManager: createManagerMutation.isPending,
    isEditingManager: editManagerMutation.isPending,
    isDeletingPhoto: deletePhotoMutation.isPending,

    // Error states
    managersError,
    createManagerError: createManagerMutation.error,
    editManagerError: editManagerMutation.error,
    deletePhotoError: deletePhotoMutation.error,

    // Actions
    refetchManagers,
    createManager: createManagerMutation.mutate,
    createManagerAsync: createManagerMutation.mutateAsync,
    editManager: editManagerMutation.mutate,
    editManagerAsync: editManagerMutation.mutateAsync,
    deletePhoto: deletePhotoMutation.mutate,
    deletePhotoAsync: deletePhotoMutation.mutateAsync,
  };
};

export const useManagerView = (
  id: number,
  range: "all" | "year" | "month" | "week" | "day" = "all"
) => {
  const {
    data: managerViewData,
    isLoading: isLoadingManagerView,
    error: managerViewError,
    refetch: refetchManagerView,
  } = useQuery({
    queryKey: ["managers", "view", id, range],
    queryFn: () => managersAPI.getView(id, range),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run query if id is provided
  });

  return {
    // Data
    managerViewData,
    managerData: managerViewData?.data,
    timeUpdate: managerViewData?.time_update,

    // Loading states
    isLoadingManagerView,

    // Error states
    managerViewError,

    // Actions
    refetchManagerView,
  };
};

export const useManagerDynamics = (
  id: number,
  range: "week" | "month" | "year" = "year",
  type: "calls" | "ai_avg" = "calls"
) => {
  const {
    data: managerDynamicsData,
    isLoading: isLoadingManagerDynamics,
    error: managerDynamicsError,
    refetch: refetchManagerDynamics,
  } = useQuery({
    queryKey: ["managers", "dynamics", id, range, type],
    queryFn: () => managersAPI.getDynamics(id, range, type),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id, // Only run query if id is provided
  });

  console.log(managerDynamicsData, "managerDynamicsData");

  return {
    // Data
    managerDynamicsData,
    dynamicsPoints: managerDynamicsData?.data,
    //@ts-ignore
    timeUpdate: managerDynamicsData?.time_update,

    // Loading states
    isLoadingManagerDynamics,

    // Error states
    managerDynamicsError,

    // Actions
    refetchManagerDynamics,
  };
};

export const useManagerCalls = (
  id: number,
  page: number = 1,
  per_page: number = 10,
  search: string = ""
) => {
  const {
    data: managerCallsData,
    isLoading: isLoadingManagerCalls,
    error: managerCallsError,
    refetch: refetchManagerCalls,
  } = useQuery({
    queryKey: ["managers", "calls", id, page, per_page, search],
    queryFn: () => managersAPI.getCalls(id, page, per_page, search),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!id, // Only run query if id is provided
  });

  return {
    // Data
    managerCallsData,
    calls: managerCallsData?.data?.items || [],
    pagination: managerCallsData?.data?.pagination,
    timeUpdate: managerCallsData?.time_update,

    // Loading states
    isLoadingManagerCalls,

    // Error states
    managerCallsError,

    // Actions
    refetchManagerCalls,
  };
};

export const useAIAnalysis = ({ onFinish }: { onFinish: () => void }) => {
  const queryClient = useQueryClient();

  // AI Analysis mutation
  const aiAnalysisMutation = useMutation({
    mutationFn: (analysisData: {
      id_crm: string;
      manager_id: string;
      client_phone: string;
      file: File;
    }) => managersAPI.analyzeAI(analysisData),
    onSuccess: (response) => {
      showSuccessToast(response.message || "AI аналіз успішно запущено");
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      queryClient.invalidateQueries({ queryKey: ["calls"] });
      onFinish();
    },
    onError: (error: any) => {
      console.error("AI analysis failed:", error);
      const message =
        error?.response?.data?.message || "Помилка при запуску AI аналізу";
      showErrorToast(message);
    },
  });

  return {
    // Loading states
    isAnalyzing: aiAnalysisMutation.isPending,

    // Error states
    analysisError: aiAnalysisMutation.error,

    // Actions
    analyzeAI: aiAnalysisMutation.mutate,
    analyzeAIAsync: aiAnalysisMutation.mutateAsync,
  };
};
