import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  settingsAPI,
  SettingCreateRequest,
  SettingEditRequest,
  SettingResponse,
} from "../services/api";
import { showSuccessToast, showErrorToast } from "../utils/toast";

export const useSettings = (page: number = 1, per_page: number = 10) => {
  const queryClient = useQueryClient();

  // Get settings list
  const {
    data: settingsData,
    isLoading: isLoadingSettings,
    isFetching: isFetchingSettings,
    error: settingsError,
    refetch: refetchSettings,
  } = useQuery({
    queryKey: ["settings", page, per_page],
    queryFn: () => settingsAPI.getCatalog(page, per_page),
  });

  // Create setting mutation
  const createSettingMutation = useMutation({
    mutationFn: (settingData: SettingCreateRequest) =>
      settingsAPI.create(settingData),
    onSuccess: (response: SettingResponse) => {
      // Show success toast
      showSuccessToast(response.message);
      // Invalidate and refetch settings list
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: any) => {
      console.error("Create setting failed:", error);
      // Show error toast with message from response or default message
      const message =
        error?.response?.data?.message || "Помилка при створенні налаштування";
      showErrorToast(message);
    },
  });

  // Edit setting mutation
  const editSettingMutation = useMutation({
    mutationFn: ({
      id,
      settingData,
    }: {
      id: number;
      settingData: SettingEditRequest;
    }) => settingsAPI.edit(id, settingData),
    onSuccess: (response: SettingResponse) => {
      // Show success toast
      showSuccessToast(response.message);
      // Invalidate and refetch settings list
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: any) => {
      console.error("Edit setting failed:", error);
      // Show error toast with message from response or default message
      const message =
        error?.response?.data?.message ||
        "Помилка при редагуванні налаштування";
      showErrorToast(message);
    },
  });

  // Switch setting mutation (toggle active status)
  const switchSettingMutation = useMutation({
    mutationFn: (id: number) => settingsAPI.switch(id),
    onSuccess: (response: SettingResponse) => {
      // Show success toast
      showSuccessToast(response.message);
      // Invalidate and refetch settings list
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: any) => {
      console.error("Switch setting failed:", error);
      // Show error toast with message from response or default message
      const message =
        error?.response?.data?.message ||
        "Помилка при зміні статусу налаштування";
      showErrorToast(message);
    },
  });

  return {
    // Data
    settings: settingsData?.data?.items || [],
    pagination: settingsData?.data?.pagination,
    timeUpdate: settingsData?.time_update,

    // Loading states
    isLoadingSettings,
    isFetchingSettings,
    isCreatingSetting: createSettingMutation.isPending,
    isEditingSetting: editSettingMutation.isPending,
    isSwitchingSetting: switchSettingMutation.isPending,

    // Error states
    settingsError,
    createSettingError: createSettingMutation.error,
    editSettingError: editSettingMutation.error,
    switchSettingError: switchSettingMutation.error,

    // Actions
    refetchSettings,
    createSetting: createSettingMutation.mutateAsync,
    editSetting: editSettingMutation.mutateAsync,
    switchSetting: switchSettingMutation.mutate,
  };
};
